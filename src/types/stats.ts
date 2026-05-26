export type StatKey =
  | "plannedAvgCalories"
  | "plannedAvgProtein"
  | "plannedMeals"
  | "plannedShoppingItems"
  | "mealsLoggedThisMonth"
  | "avgCalories"
  | "goalHitRate"
  | "streak"
  | "carbs"
  | "fat";

export type StatConfig = {
  label: string;
  expandedLabel?: string;
  suffix?: string;
};