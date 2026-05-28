"use client";


import { useMemo } from "react";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useMealFilters } from "@/hooks/useMealFilters";
import type { Meal } from "@/types/meals";
import { TopBar } from "@/components/TopBar/TopBar";
import { Stats } from "@/components/Stats/Stats";
import { NutritionFilter } from "@/components/Filters/NutritionFilter";
import { CaloriesChart } from "@/components/Charts/CaloriesChart";

type MealWithDate = Meal & {
  date: string;
};

import "./nutrition.scss";

export default function Nutrition() {
  const { plans } = useMealPlans();

  const allMeals = useMemo<MealWithDate[]>(
    () =>
      plans.flatMap((day) =>
        Object.entries(day.meals || {}).map(([, meal]) => {
          return {
            ...(meal as any),
            date: day.date,
          } as MealWithDate;
        })
      ),
    [plans]
  );

  const {
    activeFilters,
    handleFilter,
    filteredMeals,
  } = useMealFilters(allMeals as MealWithDate[]);
  
  const isActive = (type: any) => activeFilters.length === 0 || activeFilters.includes(type);

  return (
    <div className="standard-content nutrition">
      <TopBar />
      <div className="standard-content__wrapper">
        <Stats stats={["plannedAvgCalories", "plannedAvgProtein", "carbs", "fat"]} />
        {/* <NutritionFilter activeFilters={activeFilters} handleFilter={handleFilter} /> */}
        <div className="content__groups">
          <div className="content__group content__group--calories">
            <h3 className="content__title">Calories this week</h3>
            <CaloriesChart data={plans} />
            <p>Green = on target - Red = over target</p>
          </div>
          <div className="content__group content__group--macro">
            <h3 className="content__title">Macro split - daily avg</h3>
          </div>
          <div className="content__group content__group--goal">
            <h3 className="content__title">Goal progress - today</h3>
          </div>
        </div>
      </div>
    </div>
  );
}