import { create } from "zustand";
import type { StoredMealPlan } from "@/hooks/useMealPlans";
import type { Meal } from "@/types/meals";
import { usePreferencesStore } from "@/store/usePreferencesStore";

const flattenMeals = (plans: StoredMealPlan[]) => {
  return plans.flatMap((p) =>
    Object.values(p.meals || {})
  ) as Meal[];
};

const getAverageNutrition = (
  plans: StoredMealPlan[],
  identifier: keyof NonNullable<Meal["nutrition"]>
) => {
  const meals = flattenMeals(plans);

  if (!meals.length) return 0;

  const total = meals.reduce(
    (sum, meal) => sum + (meal.nutrition?.[identifier] ?? 0),
    0
  );

  return Math.round(total / meals.length);
};

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

const getWeeklyPlans = (plans: StoredMealPlan[]) => {
  const { monday, sunday } = getWeekRange();
  return plans.filter((p) => {
    const date = new Date(p.date);
    return date >= monday && date <= sunday;
  });
};

const getWeeklyMeals = (plans: StoredMealPlan[]) => {
  return getWeeklyPlans(plans).flatMap((p) => Object.values(p.meals || {})) as Meal[];
};

type StatsState = {
  plans: StoredMealPlan[];
  setPlans: (plans: StoredMealPlan[]) => void;

  getPlannedAvgCalories: () => number;
  getPlannedMeals: () => number;
  getPlannedAvgProtein: () => number;
  getPlannedShoppingList: () => number;
  getMealsLoggedThisMonth: () => number;
  getAverageCalories: () => number;
  getGoalHitRate: () => number;
  getStreak: () => number;
  getAverageCarbs: () => number;
  getAverageFat: () => number;
};

export const useStatsStore = create<StatsState>((set, get) => ({
  plans: [],
  setPlans: (plans) => set({ plans }),

  getPlannedAvgCalories: () => {
    const meals = getWeeklyMeals(get().plans);
    if (!meals.length) return 0;
    const total = meals.reduce((sum, meal) => sum + (meal.nutrition?.kcal ?? 0), 0);
    return Math.round(total / meals.length);
  },

  getPlannedMeals: () => {
    return getWeeklyPlans(get().plans)
      .reduce((acc, p) => acc + Object.keys(p.meals || {}).length, 0);
  },

  getPlannedAvgProtein: () => {
    const meals = getWeeklyMeals(get().plans);
    if (!meals.length) return 0;
    const total = meals.reduce((sum, meal) => sum + (meal.nutrition?.protein ?? 0), 0);
    return Math.round(total / meals.length);
  },

  getPlannedShoppingList: () => {
    return getWeeklyMeals(get().plans)
      .reduce((total, meal) => total + (meal.ingredients?.length ?? 0), 0);
  },

  getMealsLoggedThisMonth: () => {
    const plans = get().plans;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return plans
      .filter((p) => { const date = new Date(p.date); return date >= startOfMonth && date <= endOfMonth; })
      .reduce((acc, p) => acc + Object.keys(p.meals || {}).length, 0);
  },

  getGoalHitRate: () => {
    const plans = get().plans;
    const targetCalories = usePreferencesStore.getState().nutritionCalories;
    const validDays = plans.filter((p) => Object.keys(p.meals || {}).length > 0);
    if (!validDays.length) return 0;
    const successfulDays = validDays.filter((plan) => {
      const total = Object.values(plan.meals || {}).reduce((sum, meal) => sum + (meal.nutrition?.kcal ?? 0), 0);
      return total >= targetCalories;
    });
    return Math.round((successfulDays.length / validDays.length) * 100);
  },

  getStreak: () => {
    const plans = get().plans;
    const mealDates = new Set(
      plans
        .filter((p) => Object.keys(p.meals || {}).length > 0)
        .map((p) => { const date = new Date(p.date); date.setHours(0, 0, 0, 0); return date.getTime(); })
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const currentDate = new Date(today);
    while (mealDates.has(currentDate.getTime())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  },

  getAverageCalories: () => getAverageNutrition(get().plans, "kcal"),
  getAverageCarbs: () => getAverageNutrition(get().plans, "carbs"),
  getAverageFat: () => getAverageNutrition(get().plans, "fat"),

}));