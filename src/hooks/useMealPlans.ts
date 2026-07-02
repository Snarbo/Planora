import { useEffect, useState } from "react";

import type { Meal, MealType } from "@/types/meals";
import { useMealPlansStore } from "@/store/useMealPlansStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useStatsStore } from "@/store/useStatsStore";

const LOCAL_STORAGE_KEY = "meal-plans";

export type StoredMealPlan = {
  date: string;
  meals: Partial<Record<MealType, Meal>>;
};

export const useMealPlans = () => {
  const [plans, setPlans] = useState<StoredMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    setPlans(parsed);
    setLoading(false);
  }, []);

  useEffect(() => {
    useMealPlansStore.getState().setPlans(plans);
    useStatsStore.getState().setPlans(plans);
  }, [plans]);

  const savePlans = (newPlans: StoredMealPlan[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlans));
    setPlans(newPlans);
  };

  const getMeals = (date: string) => {
    return plans.find((p) => p.date === date)?.meals || {};
  };

  const setMeal = (date: string, meal: Meal) => {
    setPlans((prev) => {
      const copy = [...prev];

      const index = copy.findIndex((p) => p.date === date);

      if (index >= 0) {
        copy[index] = {
          ...copy[index],
          meals: {
            ...copy[index].meals,
            [meal.mealType]: meal,
          },
        };
      } else {
        copy.push({
          date,
          meals: {
            [meal.mealType]: meal,
          },
        });
      }

      savePlans(copy);
      return copy;
    });
  };

  const removeMeal = (date: string, type: MealType) => {
    setPlans((prev) => {
      const copy = [...prev];

      const index = copy.findIndex((p) => p.date === date);

      if (index === -1) return prev;

      const updatedMeals = { ...copy[index].meals };
      delete updatedMeals[type];

      if (Object.keys(updatedMeals).length === 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = {
          ...copy[index],
          meals: updatedMeals,
        };
      }

      savePlans(copy);
      return copy;
    });
  };

  const generateMealPlan = async (allMeals: Meal[]): Promise<"success" | "rate_limited" | "error"> => {
    const {
      dietaryDietType,
      dietaryAllergies,
      nutritionCalories,
      AICuisinePreferences,
    } = usePreferencesStore.getState();

    const formatDate = (date: Date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

    const today = formatDate(new Date());

    const weekDays = (() => {
      const base = new Date();
      const day = base.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(base);
      monday.setDate(base.getDate() + diff);
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return formatDate(d);
      });
    })();

    const emptySlots = weekDays
      .filter((date) => date >= today)
      .flatMap((date) => {
        const existingMeals = getMeals(date);
        return (["breakfast", "lunch", "dinner"] as MealType[])
          .filter((type) => !existingMeals[type])
          .map((type) => ({ date, type }));
      });

    if (emptySlots.length === 0) return "success";

    const res = await fetch("/api/generate-meal-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meals: allMeals,
        emptySlots,
        preferences: {
          dietType: dietaryDietType,
          allergies: dietaryAllergies,
          calorieTarget: nutritionCalories,
          cuisinePreferences: AICuisinePreferences,
        },
      }),
    });

    if (res.status === 429) {
      return "rate_limited";
    }

    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      console.error("Meal plan generation failed:", data);
      return "error";
    }

    const assignments: { date: string; type: MealType; meal: Meal }[] = data;

    setPlans((prev) => {
      const copy = [...prev];

      assignments.forEach(({ date, meal }) => {
        if (!meal) return;

        const index = copy.findIndex((p) => p.date === date);

        if (index >= 0) {
          copy[index] = {
            ...copy[index],
            meals: {
              ...copy[index].meals,
              [meal.mealType]: meal,
            },
          };
        } else {
          copy.push({
            date,
            meals: { [meal.mealType]: meal },
          });
        }
      });

      savePlans(copy);
      return copy;
    });

    return "success";
  };

  return {
    plans,
    setPlans,
    loading,
    getMeals,
    setMeal,
    removeMeal,
    generateMealPlan,
  };
};