import { DietTypes, Allergies } from "./preferences";

export type MealType = "breakfast" | "lunch" | "dinner";
export type EnergyUnit = "kcal" | "kJ";

export type Nutrition = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
};

export type Meal = {
  id: string;
  name: string;
  mealType: MealType;
  dietTypes?: DietTypes;
  allergyTypes?: Allergies[];
  cookingTime?: number; // minutes
  nutrition: Nutrition;
  ingredients: { name: string; category: string }[];
};

export type MealSlotProps = {
  type: MealType;
  meal?: Meal | null;
};