import { Meal, MealType } from "@/types/meals";

const MEAL_SLOTS: MealType[] = ["breakfast", "lunch", "dinner"];

export type DayMealPlan = {
  date: string;
  meals: Partial<Record<MealType, Meal>>;
};

export type UnplannedDay = {
  date: string;
  missing: MealType[];
};

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getUnplannedMeals = (): number => {
  const raw = localStorage.getItem("meal-plans");
  if (!raw) return 0;

  const mealPlan: DayMealPlan[] = JSON.parse(raw);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeftInWeek: string[] = [];
  const current = new Date(today);

  do {
    daysLeftInWeek.push(formatDate(current));
    if (current.getDay() === 0) break;
    current.setDate(current.getDate() + 1);
  } while (true);

  const totalPossible = daysLeftInWeek.length * 3;

  const totalPlanned = daysLeftInWeek.reduce((acc, date) => {
    const day = mealPlan.find((d) => d.date === date);
    if (!day) return acc;
    return acc + MEAL_SLOTS.filter((slot) => !!day.meals[slot]).length;
  }, 0);

  return totalPossible - totalPlanned;
};

export const scheduleMealReminderAt10am = (callback: () => void): () => void => {
  const getMsUntil10am = () => {
    const now = new Date();
    const next10am = new Date();
    next10am.setHours(10, 0, 0, 0);

    if (now >= next10am) {
      next10am.setDate(next10am.getDate() + 1);
    }

    return next10am.getTime() - now.getTime();
  };

  let intervalId: ReturnType<typeof setInterval>;

  const timeoutId = setTimeout(() => {
    callback();
    intervalId = setInterval(callback, 24 * 60 * 60 * 1000);
  }, getMsUntil10am());

  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
};