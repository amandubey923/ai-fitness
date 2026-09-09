import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const SYSTEM_PROMPT = `You are FitPilot AI, an expert, friendly, and motivating fitness & nutrition assistant.
Your goal is to converse naturally with the user to collect their fitness information for their personalized workout and diet plan.

The required fields to collect are:
1. age (number)
2. height (e.g. "175 cm" or "5'9")
3. weight (e.g. "70 kg" or "154 lbs")
4. workout_days (number of days per week, between 1 and 7)
5. fitness_goal ("Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Strength", or "Flexibility")
6. fitness_level ("Beginner", "Intermediate", or "Advanced")
7. dietary_restrictions ("None", "Vegetarian", "Vegan", "Lactose Intolerant", "Gluten-Free", "Keto", "Halal", or custom)
8. injuries (optional, e.g. "knee pain", "lower back issues", or "none")

CONVERSATION GUIDELINES:
- Greet warmly and keep messages concise (2-3 sentences max).
- You can collect multiple details at once if the user provides them.
- Ask friendly follow-ups for any missing fields.
- When you have collected enough info, encourage them to review the values in their profile preview and click "Generate Plan".

OUTPUT FORMAT:
Always return a JSON object with this exact structure:
{
  "reply": "Your conversational response to the user here",
  "extracted": {
    "age": "25" or null,
    "height": "175 cm" or null,
    "weight": "70 kg" or null,
    "workout_days": "4" or null,
    "fitness_goal": "Muscle Gain" or null,
    "fitness_level": "Intermediate" or null,
    "dietary_restrictions": "None" or null,
    "injuries": "none" or null
  }
}
Only include fields in "extracted" that the user has explicitly mentioned or that can be confidently inferred. If a field is not yet known, set it to null.
Never wrap the output in markdown fences. Return pure JSON only.`;

const MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawKey = process.env.GROQ_API_KEY || "";
    const apiKey = rawKey.split(/[\r\n]+/)[0]?.trim().replace(/^["']|["']$/g, "");
    if (!apiKey) {
      console.error("[Groq Chat API] GROQ_API_KEY is missing or empty");
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in the environment." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    let lastError: string | null = null;

    // Try primary model (openai/gpt-oss-120b), fall back to secondary if needed
    for (const modelName of MODELS) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-10),
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content ?? "{}";

          let parsed: any;
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            parsed = {
              reply: rawContent.replace(/```json?/g, "").replace(/```/g, "").trim(),
              extracted: {},
            };
          }

          return NextResponse.json({
            reply: parsed.reply || "I got your info! Let me know if you want to adjust anything.",
            extracted: parsed.extracted || {},
          });
        }

        const errText = await response.text();
        console.error(`[Groq Chat API] Model ${modelName} returned status ${response.status}:`, errText);
        lastError = `Groq API status ${response.status}`;
      } catch (err: any) {
        console.error(`[Groq Chat API] Network/fetch error with ${modelName}:`, err?.message || err);
        lastError = err?.message || "Network error";
      }
    }

    return NextResponse.json(
      { error: "Failed to get response from Groq. Please check your Groq API configuration." },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("[Groq Chat API] Uncaught handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
