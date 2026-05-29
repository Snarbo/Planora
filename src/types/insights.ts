export type InsightType = "nutrition" | "warning" | "danger" | "check";

export type Insight = {
  type: InsightType;
  title: string;
  message: string;
};

export type Meal = {
  id: string;
  name: string;
  mealType: string;
  nutrition: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fibre: number;
  };
};

export type DayPlan = {
  date: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
};

export type InsightsProps = {
  weekPlan: DayPlan[];
};