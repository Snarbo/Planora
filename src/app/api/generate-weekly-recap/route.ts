import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { getClientIp, toSafeKey, checkAndIncrementRateLimit } from "@/lib/rateLimit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const LIMIT_PER_WEEK = 1;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const safeIp = toSafeKey(ip);

    const { allowed, retryAfterMs } = await checkAndIncrementRateLimit(
      "rateLimits/weeklyRecap",
      safeIp,
      LIMIT_PER_WEEK,
      WEEK_MS
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Weekly recap already generated this week." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((retryAfterMs ?? WEEK_MS) / 1000)) } }
      );
    }

    const { avgCalories, avgProtein, goalHitRate } = await req.json();

    if (
      typeof avgCalories !== "number" ||
      typeof avgProtein !== "number" ||
      typeof goalHitRate !== "number"
    ) {
      return NextResponse.json({ error: "Invalid stats payload." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_tokens: 150,
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
  } catch (err) {
    console.error("Weekly recap error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}