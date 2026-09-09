import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { exercise, day, goal, injuries } = await req.json();
    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are FitPilot AI, an expert personal trainer.
Suggest ONE alternative exercise to replace "${exercise}" for "${day || 'workout'}".
Fitness goal: ${goal || 'General Fitness'}.
Injuries/limitations: ${injuries || 'none'}.

Return a JSON object with this exact format:
{
  "name": "Alternative Exercise Name",
  "sets": 3,
  "reps": 10,
  "reason": "Short 1-sentence explanation why this is a great alternative targeting the same muscle group."
}
Return pure JSON only without markdown fences.`;

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
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.4,
            max_tokens: 200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content ?? "{}";
          let parsed: { name?: string; sets?: number; reps?: number; reason?: string };
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            parsed = {
              name: rawContent.replace(/```json?/g, "").replace(/```/g, "").trim(),
              sets: 3,
              reps: 10,
              reason: "Targeting the same primary muscle group.",
            };
          }

          return NextResponse.json({
            name: parsed.name || "Alternative Exercise",
            sets: typeof parsed.sets === 'number' ? parsed.sets : 3,
            reps: typeof parsed.reps === 'number' ? parsed.reps : 10,
            reason: parsed.reason || "Great alternative targeting similar muscle groups.",
          });
        }

        const errText = await response.text();
        console.error(`[Groq Swap API] Model ${modelName} returned status ${response.status}:`, errText);
      } catch (err: any) {
        console.error(`[Groq Swap API] Error with model ${modelName}:`, err?.message || err);
      }
    }

    return NextResponse.json(
      { error: "Failed to generate alternative exercise" },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("[Groq Swap API] Handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
