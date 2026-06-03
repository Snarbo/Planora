"use client";

import { useEffect, useRef } from "react";
import { useMeals } from "@/hooks/useMeals";
import { useMealFilters } from "@/hooks/useMealFilters";
import { TopBar } from "@/components/TopBar/TopBar";
import { MealsFilter } from "@/components/Filters/MealsFilter";
import { MealCard } from "@/components/Meals/MealCard";
import gsap from "gsap";

import "./meals.scss";

const SKELETON_COUNT = 8;

export default function Meals() {
  const { meals, loading } = useMeals();
  const listRef = useRef<HTMLDivElement>(null);

  const {
    activeFilters,
    searchQuery,
    setSearchQuery,
    handleFilter,
    filteredRecipes,
  } = useMealFilters(meals);

  useEffect(() => {
    if (!loading && listRef.current) {
      const cards = listRef.current.querySelectorAll(".meal-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.07,
        }
      );
    }
  }, [loading, filteredRecipes]);

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
            <div className="meals" ref={listRef}>
              {loading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <div key={i} className="meal-card meal-card--skeleton">
                      <div className="meal-card__skeleton-image" />
                      <div className="meal-card__skeleton-lines">
                        <div className="meal-card__skeleton-line meal-card__skeleton-line--title" />
                        <div className="meal-card__skeleton-line meal-card__skeleton-line--short" />
                      </div>
                    </div>
                  ))
                : filteredRecipes.map((meal) => (
                    <MealCard key={meal.id} type={meal.mealType} meal={meal} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}