import type { Nutrition, EnergyUnit } from "@/types/meals";

const KCAL_TO_KJ = 4.184;

export function formatNutrition (
  nutrition: Nutrition,
  options: {
    energyUnit?: EnergyUnit;
  } = {}
) {
  const energyUnit = options.energyUnit ?? "kcal";

  return {
    ...nutrition,
    kcal:
      energyUnit === "kJ"
        ? Math.round(nutrition.kcal * KCAL_TO_KJ)
        : nutrition.kcal,
    kcalUnit: energyUnit, 
  };
}