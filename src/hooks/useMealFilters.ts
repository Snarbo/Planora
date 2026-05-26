import { useState, useMemo } from "react";
import type { Meal, MealType } from "@/types/meals";

export const useMealFilters = (meals: Meal[]) => {
  const [activeFilters, setActiveFilters] = useState<MealType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (filter: MealType | "all") => {
    if (filter === "all") {
      setActiveFilters([]);
      return;
    }

    setActiveFilters((prev) => {
      const isActive = prev.includes(filter);

      const updated = isActive
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];

      const allSelected =
        updated.includes("breakfast") &&
        updated.includes("lunch") &&
        updated.includes("dinner");

      return allSelected ? [] : updated;
    });
  };

  const filteredMeals = useMemo(() => {
    let result = meals;

    if (activeFilters.length > 0) {
      result = result.filter((meal) =>
        activeFilters.includes(meal.mealType)
      );
    }

    if (searchQuery.trim()) {
      result = result.filter((meal) =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [meals, activeFilters, searchQuery]);

  return {
    activeFilters,
    searchQuery,
    setSearchQuery,
    handleFilter,
    filteredMeals,
  };
};