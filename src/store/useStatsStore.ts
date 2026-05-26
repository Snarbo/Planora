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
    const plans = get().plans;
    const now = new Date();

    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weeklyMeals = plans
      .filter((p) => {
        const date = new Date(p.date);
        return date >= monday && date <= sunday;
      })
      .flatMap((p) => Object.values(p.meals || {})) as Meal[];

    if (!weeklyMeals.length) return 0;

    const totalCalories = weeklyMeals.reduce(
      (sum, meal) => sum + (meal.nutrition?.kcal ?? 0),
      0
    );

    return Math.round(totalCalories / weeklyMeals.length);
  },

  getPlannedMeals: () => {
    const plans = get().plans;
    const now = new Date();
    const day = now.getDay(); 
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);

    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return plans
      .filter((p) => {
        const date = new Date(p.date);

        return date >= monday && date <= sunday;
      })
      .reduce((acc, p) => {
        return acc + Object.keys(p.meals || {}).length;
      }, 0);
  },

  getPlannedAvgProtein: () => {
    const plans = get().plans;
    const now = new Date();

    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weeklyMeals = plans
      .filter((p) => {
        const date = new Date(p.date);
        return date >= monday && date <= sunday;
      })
      .flatMap((p) => Object.values(p.meals || {})) as Meal[];

    if (!weeklyMeals.length) return 0;

    const totalProtein = weeklyMeals.reduce(
      (sum, meal) => sum + (meal.nutrition?.protein ?? 0),
      0
    );

    return Math.round(totalProtein / weeklyMeals.length);
  },

  getPlannedShoppingList: () => {
    const plans = get().plans;
    const now = new Date();

    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return plans
      .filter((p) => {
        const date = new Date(p.date);
        return date >= monday && date <= sunday;
      })
      .flatMap((p) => Object.values(p.meals || {}))
      .reduce((total, meal) => {
        return total + (meal.ingredients?.length ?? 0);
      }, 0);
  },

  getMealsLoggedThisMonth: () => {
    const plans = get().plans;
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return plans
      .filter((p) => {
        const date = new Date(p.date);
        return date >= startOfMonth && date <= endOfMonth;
      })
      .reduce((acc, p) => {
        return acc + Object.keys(p.meals || {}).length;
      }, 0);
  },

  getAverageCalories: () => getAverageNutrition(get().plans, "kcal"),

  getGoalHitRate: () => {
    const plans = get().plans;
    const targetCalories = usePreferencesStore.getState().nutritionCalories;

    const validDays = plans.filter(
      (p) => Object.keys(p.meals || {}).length > 0
    );

    if (!validDays.length) return 0;

    const successfulDays = validDays.filter((plan) => {
      const totalCalories = Object.values(plan.meals || {}).reduce(
        (sum, meal) => {
          return sum + (meal.nutrition?.kcal ?? 0);
        },
        0
      );

      return totalCalories >= targetCalories;
    });

    return Math.round(
      (successfulDays.length / validDays.length) * 100
    );
  },

  getStreak: () => {
    const plans = get().plans;

    const mealDates = new Set(
      plans
        .filter((p) => Object.keys(p.meals || {}).length > 0)
        .map((p) => {
          const date = new Date(p.date);
          date.setHours(0, 0, 0, 0);

          return date.getTime();
        })
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

  getAverageCarbs: () => getAverageNutrition(get().plans, "carbs"),

  getAverageFat: () => getAverageNutrition(get().plans, "fat"),

}));