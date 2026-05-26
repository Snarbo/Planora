import type { Meal } from "@/types/meals";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export async function meals(): Promise<Meal[]> {
  const res = await fetch(`${DB_URL}/meals.json`);
  const data = await res.json();

  return Object.values(data) as Meal[];
}

/* export async function addMeal(meal: Meal): Promise<void> {
  await fetch(`${DB_URL}/meals/${meal.id}.json`, {
    method: "PUT",
    body: JSON.stringify(meal),
  });
} */