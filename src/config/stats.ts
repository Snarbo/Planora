import type { StatKey, StatConfig } from "@/types/stats";

export const statGroups: Record<StatKey, StatConfig> = {
  plannedAvgCalories: {
    label: "Avg Calories",
  },

  plannedMeals: {
    label: "Meals Planned",
    suffix: "/21",
  },

  plannedAvgProtein: {
    label: "Avg Protein",
    suffix: "g",
  },

  plannedShoppingItems: {
    label: "Shopping Items",
  },

  mealsLoggedThisMonth: {
    label: "Meals Logged",
    expandedLabel: "Meals Logged this Month",
  },

  avgCalories: {
    label: "Avg Calories",
  },

  goalHitRate: {
    label: "Goal Hit Rate",
    suffix: "%",
  },

  streak: {
    label: "Streak",
    suffix: " d",
  },

  carbs: {
    label: "Avg Carbs",
    suffix: "g",
  },

  fat: {
    label: "Avg Fat",
    suffix: "g",
  },
};