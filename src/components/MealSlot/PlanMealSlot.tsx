import { useBreakpoints } from "@/hooks/useBreakpoints";
import type { MealSlotProps, MealType } from "@/types/meals";

import {
  IconAdd,
  IconClose
} from "../Icons";

import "./meal-slot.scss";

export type MealPlanSlotProps = MealSlotProps & {
  disabled: boolean;
  onAddMeal: (type: MealType) => void;
  onRemoveMeal: (type: MealType) => void;
};

export const PlanMealSlot = ({ 
    type, 
    meal,
    disabled,
    onAddMeal,
    onRemoveMeal
  }: MealPlanSlotProps) => {
    const { isDesktop } = useBreakpoints();
    const isEmpty = !meal;

  return <div className={`meal-slot ${isEmpty ? "meal-slot--empty" : "meal-slot--full"} meal-slot--${type}`}>

    {!(isDesktop && isEmpty) && (
      <div className="meal-slot__content">
        <h3 className="meal-slot__name">
          {isEmpty ? `Add ${type}` : meal.name}
        </h3>

        {!isEmpty && (
          <div className="meal-slot__kcal-wrapper">
            <p className="meal-slot__kcal">
              {meal.nutrition.kcal} <span>kcal</span>
            </p>
          </div>
        )}
      </div>
    )}

    {isEmpty ? (
      !disabled && <button className="meal-slot__button meal-slot__button--add" onClick={() => onAddMeal(type)}><IconAdd color="tertiary" /></button>
    ) : (
      !disabled && <button className="meal-slot__button meal-slot__button--remove" onClick={() => onRemoveMeal(type)}><IconClose color="ivory" /></button>
    )}
  </div>;
};