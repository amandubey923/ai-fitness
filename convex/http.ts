import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const http = httpRouter();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── Clerk webhook ────────────────────────────────────────────────────────────

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates and normalises the workout plan returned by Gemini.
 * Throws a descriptive error if the structure is fundamentally wrong so the
 * caller can return a clean 500 instead of storing garbage.
 */
function validateWorkoutplan(plan: any, expectedDays: number) {
  if (!plan || typeof plan !== "object") {
    throw new Error("Workout plan is not a valid object");
  }
  if (!Array.isArray(plan.schedule) || plan.schedule.length === 0) {
    throw new Error("Workout plan is missing a valid 'schedule' array");
  }
  if (!Array.isArray(plan.exercises) || plan.exercises.length === 0) {
    throw new Error("Workout plan is missing a valid 'exercises' array");
  }

  // Trim to the requested number of days if Gemini accidentally over-generated
  const schedule: string[] = plan.schedule.slice(0, expectedDays);
  const exercises = plan.exercises.slice(0, expectedDays);

  // Ensure schedule and exercises counts match after trimming
  if (schedule.length !== exercises.length) {
    throw new Error(
      `Workout plan has ${schedule.length} schedule entries but ${exercises.length} exercise day entries`
    );
  }

  const validatedplan = {
    schedule,
    exercises: exercises.map((exercise: any, i: number) => {
      if (!exercise || typeof exercise !== "object") {
        throw new Error(`Exercise entry at index ${i} is not a valid object`);
      }
      if (!Array.isArray(exercise.routines) || exercise.routines.length === 0) {
        throw new Error(`Exercise day "${exercise.day}" has no routines`);
      }
      return {
        day: exercise.day ?? schedule[i],
        routines: exercise.routines.map((routine: any, j: number) => {
          if (!routine || typeof routine !== "object") {
            throw new Error(
              `Routine at index ${j} for day "${exercise.day}" is not a valid object`
            );
          }
          if (!routine.name || typeof routine.name !== "string") {
            throw new Error(
              `Routine at index ${j} for day "${exercise.day}" is missing a name`
            );
          }
          const sets =
            typeof routine.sets === "number"
              ? routine.sets
              : parseInt(String(routine.sets), 10);
          const reps =
            typeof routine.reps === "number"
              ? routine.reps
              : parseInt(String(routine.reps), 10);

          return {
            name: routine.name,
            sets: isNaN(sets) || sets < 1 ? 3 : sets,
            reps: isNaN(reps) || reps < 1 ? 10 : reps,
          };
        }),
      };
    }),
  };

  return validatedplan;
}

/**
 * Validates and normalises the diet plan returned by Gemini.
 * Throws a descriptive error if required fields are missing or invalid.
 */
function validateDietplan(plan: any) {
  if (!plan || typeof plan !== "object") {
    throw new Error("Diet plan is not a valid object");
  }

  const dailyCalories =
    typeof plan.dailyCalories === "number"
      ? plan.dailyCalories
      : parseInt(String(plan.dailyCalories), 10);

  if (isNaN(dailyCalories) || dailyCalories <= 0) {
    throw new Error(
      `Diet plan has invalid 'dailyCalories' value: ${plan.dailyCalories}`
    );
  }

  if (!Array.isArray(plan.meals) || plan.meals.length === 0) {
    throw new Error("Diet plan is missing a valid 'meals' array");
  }

  const validatedplan = {
    dailyCalories,
    meals: plan.meals.map((meal: any, i: number) => {
      if (!meal || typeof meal !== "object") {
        throw new Error(`Meal at index ${i} is not a valid object`);
      }
      if (!meal.name || typeof meal.name !== "string") {
        throw new Error(`Meal at index ${i} is missing a 'name'`);
      }
      if (!Array.isArray(meal.foods) || meal.foods.length === 0) {
        throw new Error(`Meal "${meal.name}" has no foods listed`);
      }
      return {
        name: meal.name,
        foods: meal.foods.map(String),
      };
    }),
  };

  return validatedplan;
}

/**
 * Rough TDEE estimate (Harris-Benedict) used inside the prompt so Gemini has a
 * real anchor for calorie recommendations instead of guessing.
 * This is injected into the prompt text only – no sensitive data is exposed.
 */
function estimateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  goal: string
): { bmr: number; tdee: number; target: number; label: string } {
  // Use a neutral/male BMR formula as a reasonable baseline
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  // Moderate activity multiplier (1.55) as a reasonable middle ground
  const tdee = Math.round(bmr * 1.55);

  const g = goal.toLowerCase();
  let target: number;
  let label: string;

  if (g.includes("weight loss") || g.includes("fat loss") || g.includes("cut")) {
    target = Math.round(tdee - 400);
    label = "caloric deficit (~400 kcal below TDEE) for fat loss";
  } else if (
    g.includes("muscle") ||
    g.includes("bulk") ||
    g.includes("gain") ||
    g.includes("mass")
  ) {
    target = Math.round(tdee + 300);
    label = "caloric surplus (~300 kcal above TDEE) for muscle gain";
  } else {
    target = tdee;
    label = "maintenance calories for general fitness";
  }

  return { bmr: Math.round(bmr), tdee, target, label };
}

// ─── Vapi generate-program endpoint ──────────────────────────────────────────

http.route({
  path: "/vapi/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      const {
        user_id,
        age,
        height,
        weight,
        injuries,
        workout_days,
        fitness_goal,
        fitness_level,
        dietary_restrictions,
      } = payload;

      // ── Input validation ───────────────────────────────────────────────────
      const missing: string[] = [];
      if (!user_id) missing.push("user_id");
      if (!age) missing.push("age");
      if (!height) missing.push("height");
      if (!weight) missing.push("weight");
      if (!workout_days) missing.push("workout_days");
      if (!fitness_goal) missing.push("fitness_goal");
      if (!fitness_level) missing.push("fitness_level");

      if (missing.length > 0) {
        console.error(
          `[generate-program] Missing required fields: ${missing.join(", ")}. ` +
            `Received keys: ${Object.keys(payload).join(", ")}`
        );
        return new Response(
          JSON.stringify({
            success: false,
            error: `Missing required fields: ${missing.join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const numDays = parseInt(String(workout_days), 10);
      if (isNaN(numDays) || numDays < 1 || numDays > 7) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `workout_days must be a number between 1 and 7, received: ${workout_days}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(
        `[generate-program] Generating plan for user=${user_id} | goal=${fitness_goal} | level=${fitness_level} | days=${numDays} | injuries=${injuries || "none"} | diet=${dietary_restrictions || "none"}`
      );

      // ── Build day list ─────────────────────────────────────────────────────
      const ALL_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const selectedDays = ALL_DAYS.slice(0, numDays);
      const dayListStr = selectedDays.join(", ");

      // ── Fitness-level-specific guidance ────────────────────────────────────
      const levelGuidance: Record<string, string> = {
        beginner:
          "BEGINNER: Use compound movements with light-to-moderate weight. 2–3 sets per exercise, 10–15 reps. Focus on form. Avoid technical Olympic lifts. Keep total exercises per session to 4–5 max.",
        intermediate:
          "INTERMEDIATE: Mix compound and isolation movements. 3–4 sets per exercise, 8–12 reps. Can include barbell lifts with proper technique. 5–7 exercises per session.",
        advanced:
          "ADVANCED: Include heavy compound lifts with progressive overload. 4–5 sets per exercise, 4–12 reps depending on the movement. Can include Olympic lifts, heavy deadlifts, and specialised techniques. 6–8 exercises per session.",
      };
      const levelKey = fitness_level.toLowerCase().trim();
      const levelInstruction =
        levelGuidance[levelKey] ??
        `${fitness_level}: Design exercises appropriate for this fitness level with reasonable sets and reps.`;

      // ── Fitness-goal-specific guidance ─────────────────────────────────────
      const goalGuidance: Record<string, string> = {
        "weight loss":
          "WEIGHT LOSS goal: Prioritise metabolic conditioning. Include supersets, circuits, and compound movements. Keep rest periods short (30–60 seconds). Add at least one cardio session. Avoid heavy single-rep maxes.",
        "fat loss":
          "FAT LOSS goal: Same as weight loss — metabolic training, circuits, short rest periods, compound movements, cardio included.",
        "muscle gain":
          "MUSCLE GAIN goal: Prioritise hypertrophy. Use a body-part or push-pull-legs split. Emphasise progressive overload on compound lifts. Keep rest periods 60–90 seconds. Include isolation work. No pure cardio sessions — save cardio for light warm-ups only.",
        "muscle building":
          "MUSCLE BUILDING goal: Identical to muscle gain — hypertrophy focus, body-part splits, compound + isolation, progressive overload.",
        "general fitness":
          "GENERAL FITNESS goal: Balance strength, cardio, and mobility. Mix resistance training with conditioning. Moderate volume and intensity across all days.",
        endurance:
          "ENDURANCE goal: Emphasise cardiovascular training. Include long steady-state cardio, interval runs, and high-rep circuit work. Resistance training should be light with high reps (15–20) to build muscular endurance.",
        strength:
          "STRENGTH goal: Focus on low-rep, high-weight compound lifts (deadlift, squat, bench, overhead press, row). 4–6 sets, 3–6 reps. Long rest periods (2–3 minutes). Minimal cardio.",
        flexibility:
          "FLEXIBILITY/MOBILITY goal: Include yoga flows, dynamic stretching, foam rolling, and light resistance training. Emphasise full range-of-motion movements.",
      };
      const goalKey = fitness_goal.toLowerCase().trim();
      let goalInstruction = goalGuidance[goalKey];
      if (!goalInstruction) {
        // Fuzzy match
        const matchKey = Object.keys(goalGuidance).find((k) => goalKey.includes(k));
        goalInstruction =
          matchKey != null
            ? goalGuidance[matchKey]
            : `${fitness_goal} goal: Design exercises that directly support this fitness objective.`;
      }

      // ── Injury guidance ────────────────────────────────────────────────────
      const noInjury =
        !injuries ||
        injuries.trim() === "" ||
        injuries.toLowerCase() === "none" ||
        injuries.toLowerCase() === "no injuries" ||
        injuries.toLowerCase() === "n/a";

      const injuryInstruction = noInjury
        ? "No injuries or limitations — full exercise selection is available."
        : `INJURY/LIMITATION: "${injuries}". You MUST avoid exercises that aggravate this condition. ` +
          `Choose safe alternatives. For example: knee issues → avoid deep squats, replace with leg press or step-ups; ` +
          `lower back issues → avoid heavy deadlifts, replace with Romanian deadlifts or cable pull-throughs; ` +
          `shoulder issues → avoid overhead pressing, replace with lateral raises or cable work; ` +
          `wrist issues → avoid barbell wrist-load exercises, use dumbbells or machines instead.`;

      // ── TDEE estimate for diet prompt ──────────────────────────────────────
      // Parse weight to kg and height to cm as best-effort for the estimation
      let weightKg = 70;
      let heightCm = 170;
      let ageNum = 25;

      const weightMatch = String(weight).match(/([\d.]+)/);
      if (weightMatch) {
        const raw = parseFloat(weightMatch[1]);
        weightKg = String(weight).toLowerCase().includes("lb")
          ? Math.round(raw / 2.205)
          : raw;
      }
      const heightMatch = String(height).match(/([\d.]+)/);
      if (heightMatch) {
        const raw = parseFloat(heightMatch[1]);
        // If height looks like feet (< 9), convert to cm
        if (raw < 9) {
          heightCm = Math.round(raw * 30.48);
        } else if (raw < 100) {
          // Could be feet+inches shorthand like 5.8 → treat as feet
          heightCm = Math.round(raw * 30.48);
        } else {
          heightCm = raw; // already cm
        }
      }
      const ageMatch = String(age).match(/([\d]+)/);
      if (ageMatch) ageNum = parseInt(ageMatch[1], 10);

      const tdeeData = estimateTDEE(weightKg, heightCm, ageNum, fitness_goal);

      // ── Dietary restriction instruction ────────────────────────────────────
      const noDietRestriction =
        !dietary_restrictions ||
        dietary_restrictions.trim() === "" ||
        dietary_restrictions.toLowerCase() === "none" ||
        dietary_restrictions.toLowerCase() === "no restrictions";

      const dietRestrictionInstruction = noDietRestriction
        ? "No dietary restrictions — all foods are permitted."
        : `DIETARY RESTRICTIONS: "${dietary_restrictions}". ` +
          `You MUST strictly follow these restrictions. ` +
          `DO NOT include any foods that violate them. ` +
          `Examples: vegetarian → no meat, no fish, no seafood; ` +
          `vegan → no meat, fish, dairy, eggs, honey; ` +
          `lactose intolerant → no milk, cheese, yogurt, butter, cream; ` +
          `gluten-free → no wheat, barley, rye, bread, pasta made from wheat; ` +
          `nut allergy → no nuts or nut butters. ` +
          `Apply these rules to EVERY meal in the plan.`;

      // ── Model setup ────────────────────────────────────────────────────────
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          responseMimeType: "application/json",
        },
      });

      // ── Workout prompt ─────────────────────────────────────────────────────
      const workoutPrompt = `You are an expert certified personal trainer. Create a highly personalised weekly workout plan.

USER PROFILE:
- Age: ${age}
- Height: ${height}
- Weight: ${weight}
- Fitness goal: ${fitness_goal}
- Fitness level: ${fitness_level}
- Available workout days per week: ${numDays}
- Injuries or physical limitations: ${injuries || "none"}

STRICT RULES — READ CAREFULLY:

RULE 1 — DAY COUNT: The user has EXACTLY ${numDays} workout day(s) available. You MUST generate a plan with EXACTLY ${numDays} day(s). No more, no less.
Use EXACTLY these days in this exact order: ${dayListStr}.
The "schedule" array MUST contain EXACTLY these ${numDays} entries: ["${selectedDays.join('", "')}"].
The "exercises" array MUST contain EXACTLY ${numDays} objects — one for each day.

RULE 2 — FITNESS LEVEL:
${levelInstruction}

RULE 3 — FITNESS GOAL:
${goalInstruction}

RULE 4 — INJURIES:
${injuryInstruction}

RULE 5 — SPECIFICITY: Do NOT generate a generic plan. The exercises, sets, reps, and structure MUST be meaningfully different based on the goal and level. A beginner weight-loss plan must look nothing like an advanced muscle-gain plan.

RULE 6 — NUMBERS ONLY: "sets" and "reps" MUST ALWAYS be plain integers. Never use strings like "as many as possible" or "to failure". Use specific numbers (e.g. 3, 10, 15).

RULE 7 — OUTPUT FORMAT: Return ONLY valid JSON. No markdown, no extra text, no code fences.

Return this EXACT JSON structure:
{
  "schedule": ["${selectedDays.join('", "')}"],
  "exercises": [
    {
      "day": "${selectedDays[0]}",
      "routines": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 12
        }
      ]
    }
  ]
}`;

      // ── Diet prompt ────────────────────────────────────────────────────────
      const dietPrompt = `You are an expert registered dietitian. Create a highly personalised daily meal plan.

USER PROFILE:
- Age: ${age}
- Height: ${height}
- Weight: ${weight}
- Fitness goal: ${fitness_goal}
- Dietary restrictions: ${dietary_restrictions || "none"}

CALORIE GUIDANCE:
- Estimated TDEE (maintenance): ${tdeeData.tdee} kcal/day
- Recommended target: ${tdeeData.target} kcal/day (${tdeeData.label})
- Use ${tdeeData.target} kcal as your "dailyCalories" value (adjust ±100 if needed for practical meal planning, but stay within 150 kcal of this target).

STRICT RULES — READ CAREFULLY:

RULE 1 — DIETARY RESTRICTIONS:
${dietRestrictionInstruction}

RULE 2 — GOAL-SPECIFIC NUTRITION:
${
  goalInstruction.includes("WEIGHT LOSS") || goalInstruction.includes("FAT LOSS")
    ? "Fat loss: higher protein (30–35% of calories), moderate carbs, lower fat. Prioritise lean proteins and vegetables."
    : goalInstruction.includes("MUSCLE GAIN") || goalInstruction.includes("MUSCLE BUILDING")
      ? "Muscle gain: high protein (30–35% of calories), high carbs for energy and recovery, moderate fat. Include protein with every meal."
      : goalInstruction.includes("ENDURANCE")
        ? "Endurance: high carbs (55–60% of calories) for fuel, moderate protein, low fat. Focus on complex carbs and sustained energy."
        : "General fitness: balanced macros — protein 25–30%, carbs 45–50%, fat 25–30%."
}

RULE 3 — MEAL STRUCTURE: Include 4–5 meals (Breakfast, Mid-Morning Snack, Lunch, Afternoon Snack, Dinner). Each food item should be specific with approximate portion (e.g. "150g grilled chicken breast", "1 cup cooked brown rice", "1 medium apple").

RULE 4 — SPECIFICITY: The plan must be practical and genuinely personalised. Do NOT generate a generic meal plan.

RULE 5 — OUTPUT FORMAT: Return ONLY valid JSON. No markdown, no extra text, no code fences.

Return this EXACT JSON structure:
{
  "dailyCalories": ${tdeeData.target},
  "meals": [
    {
      "name": "Breakfast",
      "foods": ["Food item with portion", "Another food item"]
    }
  ]
}`;

      // ── Run both Gemini calls in parallel ──────────────────────────────────
      console.log(
        `[generate-program] Starting parallel Gemini calls (workout + diet) for user=${user_id}`
      );

      const [workoutResult, dietResult] = await Promise.all([
        model.generateContent(workoutPrompt),
        model.generateContent(dietPrompt),
      ]);

      // ── Parse and validate workout plan ────────────────────────────────────
      let workoutplan: any;
      try {
        const workoutText = workoutResult.response.text();
        workoutplan = JSON.parse(workoutText);
      } catch (parseErr) {
        console.error("[generate-program] Failed to parse workout plan JSON:", parseErr);
        throw new Error("Gemini returned invalid JSON for the workout plan");
      }

      try {
        workoutplan = validateWorkoutplan(workoutplan, numDays);
      } catch (validationErr) {
        console.error("[generate-program] Workout plan validation failed:", validationErr);
        throw new Error(
          `Workout plan validation failed: ${validationErr instanceof Error ? validationErr.message : String(validationErr)}`
        );
      }

      // ── Parse and validate diet plan ────────────────────────────────────────
      let dietplan: any;
      try {
        const dietText = dietResult.response.text();
        dietplan = JSON.parse(dietText);
      } catch (parseErr) {
        console.error("[generate-program] Failed to parse diet plan JSON:", parseErr);
        throw new Error("Gemini returned invalid JSON for the diet plan");
      }

      try {
        dietplan = validateDietplan(dietplan);
      } catch (validationErr) {
        console.error("[generate-program] Diet plan validation failed:", validationErr);
        throw new Error(
          `Diet plan validation failed: ${validationErr instanceof Error ? validationErr.message : String(validationErr)}`
        );
      }

      console.log(
        `[generate-program] Plans validated. Workout: ${workoutplan.schedule.length} days, Diet: ${dietplan.dailyCalories} kcal, ${dietplan.meals.length} meals`
      );

      // ── Save to Convex ─────────────────────────────────────────────────────
      const planId = await ctx.runMutation(api.plans.createplan, {
        userId: user_id,
        dietplan,
        isActive: true,
        workoutplan,
        name: `${fitness_goal} plan - ${new Date().toLocaleDateString()}`,
      });

      console.log(`[generate-program] Plan saved. planId=${planId} user=${user_id}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: { planId, workoutplan, dietplan },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("[generate-program] Fatal error:", error instanceof Error ? error.message : String(error));
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
