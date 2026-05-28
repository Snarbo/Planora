"use client";

import { useMealPlans } from "@/hooks/useMealPlans";
import { useMealFilters } from "@/hooks/useMealFilters";
import { TopBar } from "@/components/TopBar/TopBar";
import { Stats } from "@/components/Stats/Stats";
import { NutritionFilter } from "@/components/Filters/NutritionFilter";
import { CaloriesChart } from "@/components/Charts/CaloriesChart";
import { MacroChart } from "@/components/Charts/MacroChart";
import { GoalChart } from "@/components/Charts/GoalChart";
import { Insights } from "@/components/Insights/Insights";

import {
  IconAI
} from "@/components/Icons";

import "./nutrition.scss";

export default function Nutrition() {
  const { plans } = useMealPlans();

  return (
    <div className="standard-content nutrition">
      <TopBar />
      <div className="standard-content__wrapper">
        <Stats stats={["plannedAvgCalories", "plannedAvgProtein", "carbs", "fat"]} />
        {/* <NutritionFilter activeFilters={activeFilters} handleFilter={handleFilter} /> */}
        <div className="content__groups content__groups--calories-macro-goal">
          <div className="content__group content__group--calories">
            <h3 className="content__title">Calories this week</h3>
            <CaloriesChart data={plans} />
            <div className="text__wrapper">
              <p className="text">Green = on target - Red = over target</p>
            </div>
          </div>
          <div className="content__group content__group--macro">
            <h3 className="content__title">Macro split</h3>
            <MacroChart data={plans} />
          </div>
          <div className="content__group content__group--goal">
            <h3 className="content__title">Goal progress</h3>
            <GoalChart />
          </div>
        </div>
        <div className="content__groups content__groups--ai-insights">
          <div className="content__group content__group--ai-insights">
            <div className="content__title-wrapper">
              <div className="content__icon content__icon--ai">
                <IconAI />
              </div>
              <h3 className="content__title">AI Nutrition Insights</h3>
            </div>
            <Insights />
          </div>
        </div>   
      </div>
    </div>
  );
}