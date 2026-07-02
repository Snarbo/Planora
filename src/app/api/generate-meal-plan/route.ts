import Groq from "groq-sdk";
import type { Meal, MealType } from "@/types/meals";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type EmptySlot = {
  date: string;
  type: MealType;
};

type RequestBody = {
  meals: Meal[];
  emptySlots: EmptySlot[];
  preferences: {
    dietType: string;
    allergies: string[];
    calorieTarget: number;
    cuisinePreferences: string[];
  };
};

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const ip = req.headers.get("x-real-ip") || "unknown";
  return ip;
}

// RTDB keys can't contain . # $ / [ ]
function toSafeKey(ip: string): string {
  return ip.replace(/[.#$/[\]]/g, "_");
}

async function getLastRequestTime(safeIp: string): Promise<number | null> {
  const res = await fetch(`${DB_URL}/rateLimits/${safeIp}.json`);
  const data = await res.json();
  return data?.lastRequest ?? null;
}

async function setLastRequestTime(safeIp: string): Promise<void> {
  const res = await fetch(`${DB_URL}/rateLimits/${safeIp}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastRequest: Date.now() }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Failed to write rate limit:", res.status, body);
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const safeIp = toSafeKey(ip);

    const lastRequest = await getLastRequestTime(safeIp);

    if (lastRequest && Date.now() - lastRequest < ONE_DAY_MS) {
      const retryAfterMs = ONE_DAY_MS - (Date.now() - lastRequest);
      return Response.json(
        { error: "You've already generated a meal plan today. Try again tomorrow." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const { meals, emptySlots, preferences }: RequestBody = await req.json();

    const slimMeals = meals.map(({ id, name, mealType, dietTypes, nutrition, cuisine }) => ({
      id, name, mealType, dietTypes, nutrition, cuisine
    }));

    const prompt = `You are a meal planning assistant. Your job is to assign meals to empty slots in a weekly meal plan.

    Here are the available meals:
    ${JSON.stringify(slimMeals, null, 2)}

    Here are the empty slots that need filling:
    ${JSON.stringify(emptySlots, null, 2)}

    The user has these preferences:
    - Diet type: ${preferences.dietType}
    - Allergies/intolerances: ${preferences.allergies.length > 0 ? preferences.allergies.join(", ") : "none"}
    - Daily calorie target: ${preferences.calorieTarget} kcal
    - Cuisine preferences: ${preferences.cuisinePreferences.length > 0 ? preferences.cuisinePreferences.join(", ") : "no preference"}

    RULES:
    - Only use meals from the provided list, never invent new ones
    - Match the mealType exactly (breakfast slot must get a breakfast meal)
    - Respect the diet type (e.g. vegetarian users must only get vegetarian meals)
    - Try to vary meals across the week, avoid repeating the same meal
    - Try to keep daily calories close to the target across the 3 meals
    - If cuisine preferences are specified, strongly favour meals whose cuisine matches; only use non-matching cuisines if no suitable match exists for that slot

    Return ONLY a valid JSON array, no explanation or markdown:
    [
    { "date": "2024-01-01", "type": "breakfast", "mealId": "meal_1" },
    { "date": "2024-01-01", "type": "lunch", "mealId": "meal_5" }
    ]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const text = response.choices[0].message.content || "";
    console.log("Raw Groq response:", text);
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    const assignments: { date: string; type: MealType; mealId: string }[] = Array.isArray(parsed) 
      ? parsed 
      : parsed.assignments ?? parsed.meals ?? [];

    // Map mealIds back to full meal objects
    const result = assignments.map((assignment) => ({
      date: assignment.date,
      type: assignment.type,
      meal: meals.find((m) => m.id === assignment.mealId),
    }));

    // Only record the request as "used" once we know Groq succeeded
    await setLastRequestTime(safeIp);

    return Response.json(result);
  } catch (err) {
    console.error("Groq error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}