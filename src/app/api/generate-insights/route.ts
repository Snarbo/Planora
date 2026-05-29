import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
- Each insight must have a short "title" (3-6 words, bold-worthy) and a "message" (1-2 sentences, specific and actionable, reference actual meals or numbers where relevant)
- Base insights on the actual data — mention specific meals, days, or averages
- Cover a mix of macros (e.g. protein, fibre, calories) — don't repeat the same nutrient twice
- Be encouraging but honest

Return ONLY a valid JSON array, no explanation or markdown:
[
  { "type": "check", "title": "Protein on track", "message": "..." },
  { "type": "warning", "title": "Low fibre this week", "message": "..." },
  { "type": "danger", "title": "Calories exceeded", "message": "..." },
  { "type": "nutrition", "title": "Carb balance looks good", "message": "..." }
]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    const text = response.choices[0].message.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const insights: Insight[] = JSON.parse(clean);

    return Response.json({ insights });
  } catch (err) {
    console.error("Groq insights error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}