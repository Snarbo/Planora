import { useState, useEffect, useMemo } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { meals } from "@/data/meals";
import type { Meal } from "@/types/meals";

export const useMeals = () => {
  const { dietaryDietType, dietaryAllergies } = usePreferencesStore();
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meals().then((data) => {
      setAllMeals(data);
      setLoading(false);
    });
  }, []);

  const filteredMeals = useMemo(() => {
    return allMeals.filter((meal) => {
      const dietMatch = dietaryDietType === "none" || meal.dietTypes === dietaryDietType;

      if (!dietMatch) return false;

      const hasConflict = meal.allergyTypes?.some((allergy) =>
        dietaryAllergies.includes(allergy)
      );

      if (hasConflict) return false;

      return true;
    });
  }, [allMeals, dietaryDietType, dietaryAllergies]);

  return {
    meals: filteredMeals,
    loading,
  };
};