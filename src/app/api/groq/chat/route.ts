import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const SYSTEM_PROMPT = `You are AmanCode AI, an expert, friendly, and motivating fitness & nutrition assistant.
Your goal is to converse naturally with the user to collect their fitness information for their personalized workout and diet plan.

The required fields to collect are:
1. age (e.g. 20, 25, 34)
2. height (e.g. "175 cm", "180 cm", "5'10\"", "5'6\"")
3. weight (e.g. "60 kg", "75 kg", "165 lbs", "170 lbs")
4. workout_days (must be an integer between 1 and 7)
5. fitness_goal (must map to exactly one of: "Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Strength", "Flexibility")
6. fitness_level (must map to exactly one of: "Beginner", "Intermediate", "Advanced")
7. dietary_restrictions (must map to exactly one of: "None", "Vegetarian", "Vegan", "Lactose Intolerant", "Gluten-Free", "Keto", "Halal", "Other")

Optional field:
8. injuries (e.g. "knee pain", "lower back pain", "shoulder impingement", or "none")

INSTRUCTIONS:
- Be warm, encouraging, concise, and professional.
- Understand casual, conversational language (e.g. "I'm 22, 175 cm tall and weigh 60 kilos. I want to gain muscle. I'm a beginner and can work out 5 days a week. I'm vegetarian.").
- Parse numbers and units intelligently:
  * "five foot ten" -> "5'10\""
  * "around 70 kilos" -> "70 kg"
  * "around 150 pounds" -> "150 lbs"
  * "I don't eat meat" or "veggie" -> "Vegetarian"
  * "I don't have any injuries" -> "none"
  * "three days a week" -> "3"
- If any required fields are missing, acknowledge what you've gathered so far in a friendly, conversational way, and ask for the missing information in 1-2 concise questions.
- NEVER invent, hallucinate, or guess missing information. Only extract what the user explicitly stated or confirmed.
- If user input is ambiguous (e.g. "four or five days"), ask for clarification rather than guessing.
- Once all 7 required fields are present, provide an encouraging summary confirming that their form is now filled and ready for review.
- ALWAYS return valid JSON matching this schema:
{
  "reply": "Conversational response to the user...",
  "extracted": {
    "age": string or null,
    "height": string or null,
    "weight": string or null,
    "workout_days": string or null,
    "fitness_goal": string or null,
    "fitness_level": string or null,
    "dietary_restrictions": string or null,
    "injuries": string or null
  },
  "isComplete": boolean
}`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY?.split(/[\r\n]+/)[0]?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const { messages, currentForm } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const contextMessage = currentForm
      ? `Current known form values: ${JSON.stringify(currentForm)}`
      : "";

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(contextMessage ? [{ role: "system", content: contextMessage }] : []),
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: groqMessages,
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Groq Chat Error]:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to communicate with AI assistant." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from AI assistant");
    }

    const parsed = JSON.parse(rawContent);

    return NextResponse.json({
      reply: parsed.reply || "I got your details!",
      extracted: parsed.extracted || {},
      isComplete: Boolean(parsed.isComplete),
    });
  } catch (error: any) {
    console.error("[API /api/groq/chat Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

