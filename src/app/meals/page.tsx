"use client";

import { useMeals } from "@/hooks/useMeals";
import { useMealFilters } from "@/hooks/useMealFilters";
import { TopBar } from "@/components/TopBar/TopBar";
import { MealsFilter } from "@/components/Filters/MealsFilter";
import { MealCard } from "@/components/Meals/MealCard";

import "./meals.scss";

export default function Meals() {
  const { meals } = useMeals();

  const {
    activeFilters,
    searchQuery,
    setSearchQuery,
    handleFilter,
    filteredRecipes,
  } = useMealFilters(meals);

  return (
    <div className="standard-content meals">
      <TopBar />
      <div className="standard-content__wrapper">
        <MealsFilter
          activeFilters={activeFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFilter={handleFilter}
        />
        <div className="standard-content__layout">
          <div className="standard-content__view scrollable">
            <div className="meals">
              {filteredRecipes.map((meal) => (
                <MealCard key={meal.id} type={meal.mealType} meal={meal}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}