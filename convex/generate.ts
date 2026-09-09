import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { api } from "./_generated/api";

// ─── Validators ───────────────────────────────────────────────────────────────

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

  const schedule: string[] = plan.schedule.slice(0, expectedDays);
  const exercises = plan.exercises.slice(0, expectedDays);

  if (schedule.length !== exercises.length) {
    throw new Error(
      `Workout plan has ${schedule.length} schedule entries but ${exercises.length} exercise day entries`
    );
  }

  return {
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
            throw new Error(`Routine at index ${j} for day "${exercise.day}" is not a valid object`);
          }
          if (!routine.name || typeof routine.name !== "string") {
            throw new Error(`Routine at index ${j} for day "${exercise.day}" is missing a name`);
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
}

function validateDietplan(plan: any) {
  if (!plan || typeof plan !== "object") {
    throw new Error("Diet plan is not a valid object");
  }

  const dailyCalories =
    typeof plan.dailyCalories === "number"
      ? plan.dailyCalories
      : parseInt(String(plan.dailyCalories), 10);

  if (isNaN(dailyCalories) || dailyCalories <= 0) {
    throw new Error(`Diet plan has invalid 'dailyCalories' value: ${plan.dailyCalories}`);
  }

  if (!Array.isArray(plan.meals) || plan.meals.length === 0) {
    throw new Error("Diet plan is missing a valid 'meals' array");
  }

  return {
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
}

function estimateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  goal: string
): { tdee: number; target: number; label: string } {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
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

  return { tdee, target, label };
}

// ─── Main generation action ───────────────────────────────────────────────────

export const generateFitnessPlan = action({
  args: {
    age: v.string(),
    height: v.string(),
    weight: v.string(),
    injuries: v.string(),
    workout_days: v.number(),
    fitness_goal: v.string(),
    fitness_level: v.string(),
    dietary_restrictions: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; planId: string }> => {
    // ── Auth: get the authenticated user's Clerk ID ────────────────────────
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated. Please sign in before generating a plan.");
    }
    // identity.subject is the Clerk user ID (e.g. "user_xxxx")
    const userId = identity.subject;

    const { age, height, weight, injuries, workout_days, fitness_goal, fitness_level, dietary_restrictions } = args;

    const numDays = workout_days;

    console.log(
      `[generateFitnessPlan] user=${userId} | goal=${fitness_goal} | level=${fitness_level} | days=${numDays} | injuries=${injuries} | diet=${dietary_restrictions}`
    );

    // ── Build ordered day list ──────────────────────────────────────────────
    const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const selectedDays = ALL_DAYS.slice(0, numDays);
    const dayListStr = selectedDays.join(", ");

    // ── Fitness level guidance ─────────────────────────────────────────────
    const levelGuidance: Record<string, string> = {
      beginner:
        "BEGINNER: Use compound movements with light-to-moderate weight. 2–3 sets per exercise, 10–15 reps. Focus on form. Avoid technical Olympic lifts. Keep total exercises per session to 4–5 max.",
      intermediate:
        "INTERMEDIATE: Mix compound and isolation movements. 3–4 sets per exercise, 8–12 reps. Can include barbell lifts. 5–7 exercises per session.",
      advanced:
        "ADVANCED: Include heavy compound lifts with progressive overload. 4–5 sets per exercise, 4–12 reps depending on the movement. Can include Olympic lifts. 6–8 exercises per session.",
    };
    const levelInstruction =
      levelGuidance[fitness_level.toLowerCase().trim()] ??
      `${fitness_level}: Design exercises appropriate for this fitness level with reasonable sets and reps.`;

    // ── Goal guidance ──────────────────────────────────────────────────────
    const goalGuidance: Record<string, string> = {
      "weight loss":
        "WEIGHT LOSS: Prioritise metabolic conditioning. Include supersets, circuits, compound movements. Short rest periods (30–60 seconds). Add cardio. Avoid heavy single-rep maxes.",
      "fat loss":
        "FAT LOSS: Metabolic training, circuits, short rest periods, compound movements, cardio included.",
      "muscle gain":
        "MUSCLE GAIN: Prioritise hypertrophy. Use body-part or push-pull-legs split. Emphasise progressive overload on compound lifts. Rest 60–90 seconds. Include isolation work. No pure cardio sessions.",
      "muscle building":
        "MUSCLE BUILDING: Hypertrophy focus, body-part splits, compound + isolation, progressive overload.",
      "general fitness":
        "GENERAL FITNESS: Balance strength, cardio, and mobility. Mix resistance training with conditioning.",
      endurance:
        "ENDURANCE: Cardiovascular training. Long steady-state cardio, interval runs, high-rep circuit work. Light weights with 15–20 reps.",
      strength:
        "STRENGTH: Low-rep, high-weight compound lifts (deadlift, squat, bench, overhead press, row). 4–6 sets, 3–6 reps. Long rest periods (2–3 min). Minimal cardio.",
      flexibility:
        "FLEXIBILITY: Yoga flows, dynamic stretching, foam rolling, and light resistance training. Full range-of-motion movements.",
    };
    const goalKey = fitness_goal.toLowerCase().trim();
    let goalInstruction = goalGuidance[goalKey];
    if (!goalInstruction) {
      const matchKey = Object.keys(goalGuidance).find((k) => goalKey.includes(k));
      goalInstruction = matchKey
        ? goalGuidance[matchKey]
        : `${fitness_goal}: Design exercises that directly support this fitness objective.`;
    }

    // ── Injury guidance ────────────────────────────────────────────────────
    const noInjury =
      !injuries ||
      injuries.trim() === "" ||
      ["none", "no injuries", "n/a", "nil", "-"].includes(injuries.toLowerCase().trim());

    const injuryInstruction = noInjury
      ? "No injuries or limitations — full exercise selection is available."
      : `INJURY/LIMITATION: "${injuries}". Avoid exercises that aggravate this condition and choose safe alternatives. ` +
        `Knee issues → avoid deep squats, use leg press or step-ups. ` +
        `Lower back → avoid heavy deadlifts, use Romanian deadlifts or cable pull-throughs. ` +
        `Shoulder → avoid overhead pressing, use lateral raises or cable work. ` +
        `Wrist → avoid barbell wrist-load exercises, prefer dumbbells or machines.`;

    // ── TDEE estimate for diet ─────────────────────────────────────────────
    let weightKg = 70, heightCm = 170, ageNum = 25;
    const weightMatch = String(weight).match(/([\d.]+)/);
    if (weightMatch) {
      const raw = parseFloat(weightMatch[1]);
      weightKg = String(weight).toLowerCase().includes("lb") ? Math.round(raw / 2.205) : raw;
    }
    const heightMatch = String(height).match(/([\d.]+)/);
    if (heightMatch) {
      const raw = parseFloat(heightMatch[1]);
      heightCm = raw < 9 ? Math.round(raw * 30.48) : raw < 100 ? Math.round(raw * 30.48) : raw;
    }
    const ageMatch = String(age).match(/(\d+)/);
    if (ageMatch) ageNum = parseInt(ageMatch[1], 10);

    const tdeeData = estimateTDEE(weightKg, heightCm, ageNum, fitness_goal);

    // ── Dietary restriction instruction ────────────────────────────────────
    const noDietRestriction =
      !dietary_restrictions ||
      ["none", "no restrictions", "n/a", "-"].includes(dietary_restrictions.toLowerCase().trim());

    const dietRestrictionInstruction = noDietRestriction
      ? "No dietary restrictions — all foods are permitted."
      : `DIETARY RESTRICTIONS: "${dietary_restrictions}". Strictly follow these. ` +
        `Vegetarian → no meat, no fish, no seafood. ` +
        `Vegan → no meat, fish, dairy, eggs, honey. ` +
        `Lactose intolerant → no milk, cheese, yogurt, butter, cream. ` +
        `Gluten-free → no wheat, barley, rye, regular bread or pasta. ` +
        `Apply to EVERY meal.`;

    // ── Gemini model ───────────────────────────────────────────────────────
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
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

STRICT RULES:

RULE 1 — DAY COUNT: The user has EXACTLY ${numDays} workout day(s). Generate a plan with EXACTLY ${numDays} day(s).
Use EXACTLY these days in order: ${dayListStr}.
The "schedule" array MUST contain EXACTLY: ["${selectedDays.join('", "')}"].
The "exercises" array MUST contain EXACTLY ${numDays} objects.

RULE 2 — FITNESS LEVEL:
${levelInstruction}

RULE 3 — FITNESS GOAL:
${goalInstruction}

RULE 4 — INJURIES:
${injuryInstruction}

RULE 5 — SPECIFICITY: Do NOT generate a generic plan. The exercises, sets, reps and structure MUST meaningfully reflect the goal and level. A beginner weight-loss plan must look nothing like an advanced muscle-gain plan.

RULE 6 — NUMBERS ONLY: "sets" and "reps" MUST be plain integers. Never use strings. Use specific numbers only.

RULE 7 — OUTPUT: Return ONLY valid JSON. No markdown, no extra text, no code fences.

Return this EXACT JSON structure:
{
  "schedule": ["${selectedDays.join('", "')}"],
  "exercises": [
    {
      "day": "${selectedDays[0]}",
      "routines": [
        { "name": "Exercise Name", "sets": 3, "reps": 12 }
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
- Use ${tdeeData.target} kcal as your "dailyCalories" value (±100 kcal allowed).

STRICT RULES:

RULE 1 — DIETARY RESTRICTIONS:
${dietRestrictionInstruction}

RULE 2 — GOAL-SPECIFIC NUTRITION:
${
  goalInstruction.includes("WEIGHT LOSS") || goalInstruction.includes("FAT LOSS")
    ? "Fat loss: high protein (30–35%), moderate carbs, lower fat. Lean proteins and vegetables."
    : goalInstruction.includes("MUSCLE GAIN") || goalInstruction.includes("MUSCLE BUILDING")
      ? "Muscle gain: high protein (30–35%), high carbs for energy/recovery, moderate fat. Protein with every meal."
      : goalInstruction.includes("ENDURANCE")
        ? "Endurance: high carbs (55–60%), moderate protein, low fat. Complex carbs for sustained energy."
        : "General fitness: balanced — protein 25–30%, carbs 45–50%, fat 25–30%."
}

RULE 3 — MEAL STRUCTURE: Include 4–5 meals (Breakfast, Mid-Morning Snack, Lunch, Afternoon Snack, Dinner). Each food item should include approximate portion (e.g. "150g grilled chicken breast").

RULE 4 — OUTPUT: Return ONLY valid JSON. No markdown, no extra text, no code fences.

Return this EXACT JSON structure:
{
  "dailyCalories": ${tdeeData.target},
  "meals": [
    {
      "name": "Breakfast",
      "foods": ["Food with portion", "Another food"]
    }
  ]
}`;

    // ── Parallel generation ────────────────────────────────────────────────
    console.log(`[generateFitnessPlan] Running parallel Gemini calls for user=${userId}`);

    const [workoutResult, dietResult] = await Promise.all([
      model.generateContent(workoutPrompt),
      model.generateContent(dietPrompt),
    ]);

    // ── Parse workout ──────────────────────────────────────────────────────
    let workoutplan: any;
    try {
      workoutplan = JSON.parse(workoutResult.response.text());
    } catch {
      throw new Error("Gemini returned invalid JSON for the workout plan");
    }
    try {
      workoutplan = validateWorkoutplan(workoutplan, numDays);
    } catch (e) {
      throw new Error(`Workout validation failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // ── Parse diet ────────────────────────────────────────────────────────
    let dietplan: any;
    try {
      dietplan = JSON.parse(dietResult.response.text());
    } catch {
      throw new Error("Gemini returned invalid JSON for the diet plan");
    }
    try {
      dietplan = validateDietplan(dietplan);
    } catch (e) {
      throw new Error(`Diet validation failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    console.log(
      `[generateFitnessPlan] Plans ready. Workout: ${workoutplan.schedule.length} days, Diet: ${dietplan.dailyCalories} kcal, ${dietplan.meals.length} meals`
    );

    // ── Save to Convex ─────────────────────────────────────────────────────
    const planId: string = await ctx.runMutation(api.plans.createplan, {
      userId,
      dietplan,
      isActive: true,
      workoutplan,
      name: `${fitness_goal} plan - ${new Date().toLocaleDateString()}`,
    });

    console.log(`[generateFitnessPlan] Saved. planId=${planId} user=${userId}`);

    return { success: true, planId };
  },
});
