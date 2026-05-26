import { useState, useMemo } from "react";
import type { Meal } from "@/types/meals";
import type { RecipeFilters } from "@/types/recipes";

export const useRecipeFilters = (meals: Meal[]) => {
  const [activeFilters, setActiveFilters] = useState<RecipeFilters[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (filter: RecipeFilters | "all") => {
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
        updated.includes("vegan") &&
        updated.includes("30Mins") &&
        updated.includes("highProtein");

      return allSelected ? [] : updated;
    });
  };

  const filteredRecipes = useMemo(() => {
  let result = meals;

  if (activeFilters.length > 0) {
    result = result.filter((meal) => {
      const isVegan = activeFilters.includes("vegan")
        ? meal.dietTypes?.includes("vegan")
        : true;

      const is30Mins = activeFilters.includes("30Mins")
        ? (meal.cookingTime ?? Infinity) <= 30
        : true;

      const isHighProtein = activeFilters.includes("highProtein")
        ? meal.nutrition.protein >= 30
        : true;

      return isVegan && is30Mins && isHighProtein;
    });
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
    filteredRecipes,
  };
};