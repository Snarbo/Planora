import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { avgCalories, avgProtein, goalHitRate } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a friendly nutrition coach. Given weekly stats, write a short encouraging recap in 1-2 sentences. 
        Be specific with the numbers. Respond only with valid JSON in this format: { "message": "your recap here" }`,
      },
      {
        role: "user",
        content: `My weekly stats: average calories per meal: ${avgCalories}kcal, average protein per meal: ${avgProtein}g, goal hit rate: ${goalHitRate}%.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  return NextResponse.json({ message: parsed.message ?? "Great week! Keep it up." });
}