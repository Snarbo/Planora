import Groq from "groq-sdk";
import type { Meal, MealType } from "@/types/meals";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

export async function POST(req: Request) {
  try {
    const { meals, emptySlots, preferences }: RequestBody = await req.json();

    const slimMeals = meals.map(({ id, name, mealType, dietTypes, nutrition }) => ({
      id, name, mealType, dietTypes, nutrition
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

    return Response.json(result);
  } catch (err) {
    console.error("Groq error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}