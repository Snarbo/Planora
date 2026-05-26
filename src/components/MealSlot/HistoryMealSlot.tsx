
import type { MealSlotProps } from "@/types/meals";

import "./meal-slot.scss";

export const HistoryMealSlot = ({ 
    type, 
    meal
  }: MealSlotProps) => {
    const isEmpty = !meal;
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return <div className={`meal-slot ${isEmpty ? "meal-slot--empty" : "meal-slot--full"} meal-slot--${type}`}>
    <div className="meal-slot__content">
        <h3 className="meal-slot__name">
          {isEmpty ? `${capitalize(type)} not logged` : meal.name}
        </h3>

        {!isEmpty && (
          <p className="meal-slot__info">{capitalize(type)}</p>
        )}
      </div>
      {!isEmpty && <h2 className="meal-slot__kcal">
        {meal.nutrition.kcal} 
      </h2>}  
  </div>;
}