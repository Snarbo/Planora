"use client";

import { useMeals } from "@/hooks/useMeals";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
import { TopBar } from "@/components/TopBar/TopBar";
import { RecipesFilter } from "@/components/Filters/RecipesFilter";
import {RecipeCard} from "@/components/Recipes/RecipeCard";

import "./recipes.scss";

export default function Recipes() {
  const { meals } = useMeals();

  const {
    activeFilters,
    searchQuery,
    setSearchQuery,
    handleFilter,
    filteredRecipes,
  } = useRecipeFilters(meals);

  return (
    <div className="standard-content recipes">
      <TopBar />
      <div className="standard-content__wrapper">
        <RecipesFilter
          activeFilters={activeFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFilter={handleFilter}
        />
        <div className="standard-content__layout">
          <div className="standard-content__view scrollable">
            <div className="recipes">
              {filteredRecipes.map((meal) => (
                <RecipeCard key={meal.id} type={meal.mealType} meal={meal}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}