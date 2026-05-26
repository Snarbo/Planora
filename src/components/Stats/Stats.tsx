import { statGroups } from "@/config/stats";
import type { StatKey } from "@/types/stats";
import { useStatsStore } from "@/store/useStatsStore";

import { Stat } from "./Stat";

import "./stats.scss";

type StatsProps = {
  stats: [StatKey, StatKey, StatKey, StatKey];
};

export const Stats = ({ stats }: StatsProps) => {
  const {
    getPlannedAvgCalories,
    getPlannedMeals,
    getPlannedAvgProtein,
    getPlannedShoppingList,   
    getMealsLoggedThisMonth,
    getAverageCalories,
    getGoalHitRate,
    getStreak,
    getAverageCarbs,
    getAverageFat,
  } = useStatsStore();

  const statValues: Record<StatKey, number> = {
    plannedAvgCalories: getPlannedAvgCalories(),
    plannedMeals: getPlannedMeals(),
    plannedAvgProtein: getPlannedAvgProtein(),
    plannedShoppingItems: getPlannedShoppingList(),
    mealsLoggedThisMonth: getMealsLoggedThisMonth(),
    avgCalories: getAverageCalories(),
    goalHitRate: getGoalHitRate(),  
    streak: getStreak(),
    carbs: getAverageCarbs(),
    fat: getAverageFat(),
  };

  return (
    <section id="stats" className="stats">
      <div className="stats__wrapper">
        {stats.map((key) => (
          <Stat
            key={key}
            config={statGroups[key]}
            value={statValues[key]}
          />
        ))}
      </div>
    </section>
  );
};