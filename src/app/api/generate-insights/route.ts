import Groq from "groq-sdk";
import { getClientIp, toSafeKey, checkAndIncrementRateLimit } from "@/lib/rateLimit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const HOUR_MS = 60 * 60 * 1000;
const LIMIT_PER_HOUR = 15;

type MealNutrition = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
};

type Meal = {
  id: string;
  name: string;
  mealType: string;
  nutrition: MealNutrition;
};

type DayPlan = {
  date: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
};

type Preferences = {
  nutritionCalories: number;
  nutritionProtein: number;
  nutritionCarbs: number;
  nutritionFat: number;
  nutritionFibre: number;
  dietaryDietType: string;
  dietaryAllergies: string[];
};

type InsightType = "nutrition" | "warning" | "danger" | "check";

type Insight = {
  type: InsightType;
  title: string;
  message: string;
};

type RequestBody = {
  weekPlan: DayPlan[];
  preferences: Preferences;
};

function computeDailyTotals(weekPlan: DayPlan[]) {
  return weekPlan.map((day) => {
    const meals = Object.values(day.meals).filter(Boolean) as Meal[];
    const totals = meals.reduce(
      (acc, meal) => ({
        kcal: acc.kcal + meal.nutrition.kcal,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fibre: acc.fibre + meal.nutrition.fibre,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
    );
    return { date: day.date, totals, mealNames: meals.map((m) => m.name) };
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const safeIp = toSafeKey(ip);

    const { allowed, retryAfterMs } = await checkAndIncrementRateLimit(
      "rateLimits/insights",
      safeIp,
      LIMIT_PER_HOUR,
      HOUR_MS
    );

    if (!allowed) {
      return Response.json(
        { error: "Too many insight requests. Try again shortly." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((retryAfterMs ?? HOUR_MS) / 1000)) } }
      );
    }

    const { weekPlan, preferences }: RequestBody = await req.json();

    const dailyTotals = computeDailyTotals(weekPlan);

    const prompt = `You are a nutrition coach analysing a user's weekly meal plan. Generate exactly 4 concise, personalised insights.

User's nutrition goals:
- Calories: ${preferences.nutritionCalories} kcal/day
- Protein: ${preferences.nutritionProtein}g/day
- Carbs: ${preferences.nutritionCarbs}g/day
- Fat: ${preferences.nutritionFat}g/day
- Fibre: ${preferences.nutritionFibre}g/day
- Diet type: ${preferences.dietaryDietType || "none"}
- Allergies: ${preferences.dietaryAllergies.length > 0 ? preferences.dietaryAllergies.join(", ") : "none"}

Daily nutrition totals this week:
${JSON.stringify(dailyTotals, null, 2)}

RULES:
- Generate exactly 4 insights
- Each insight must have a "type": one of "nutrition" (informational/neutral), "warning" (mild concern), "danger" (exceeded goal or significant issue), "check" (positive achievement)
- Each insight must have a short "title" (3-6 words) and a "message" (1-2 sentences, specific and actionable, reference actual meals or numbers where relevant)
- Base insights on the actual data — mention specific meals, days, or averages
- Cover a mix of macros (e.g. protein, fibre, calories) — don't repeat the same nutrient twice
- Be encouraging but honest
- Do NOT use markdown, asterisks, or bold formatting anywhere

Return a JSON object with an "insights" array:
{ "insights": [
  { "type": "check", "title": "Protein on track", "message": "..." },
  { "type": "warning", "title": "Low fibre this week", "message": "..." },
  { "type": "danger", "title": "Calories exceeded", "message": "..." },
  { "type": "nutrition", "title": "Carb balance looks good", "message": "..." }
]}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a nutrition coach. You always respond with valid JSON only — no markdown, no bold, no explanation. Every string value must be wrapped in double quotes.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0].message.content || "";
    
    let parsed: { insights: Insight[] };
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON.parse failed. Raw text was:", rawText);
      throw new Error(`JSON parse error: ${parseErr}`);
    }

    const insights = parsed.insights;

    if (!Array.isArray(insights) || insights.length === 0) {
      throw new Error(`Parsed value is not a non-empty array: ${JSON.stringify(parsed)}`);
    }

    return Response.json({ insights });
  } catch (err) {
    console.error("Groq insights error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}