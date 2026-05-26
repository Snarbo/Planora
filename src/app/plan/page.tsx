"use client";

import { useState } from "react";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useMeals } from "@/hooks/useMeals";
import { useMealPlans } from "@/hooks/useMealPlans";
import type { MealType, Meal } from "@/types/meals";
import { useSelectedDayStore } from "@/store/useSelectedDayStore";

import { TopBar } from "@/components/TopBar/TopBar"; 
import { Stats } from "@/components/Stats/Stats";
import { Days } from "@/components/Days/Days";
import { PlanMealSlot } from "@/components/MealSlot/PlanMealSlot";
import { Modal } from "@/components/Modal/Modal";

import {
  IconClose,
  IconSearch
} from "@/components/Icons";

import "./plan.scss";

export default function Plan() {
  const [mealQuery, setMealQuery] = useState("");
  const [activeCell, setActiveCell] = useState<{type: MealType; date: string;} | null>(null);
  const { isDesktop } = useBreakpoints();
  const { meals } = useMeals();
  const { getMeals, setMeal, removeMeal, generateMealPlan } = useMealPlans();

  const selectedDate = useSelectedDayStore((state) => state.selectedDate);

  const day = selectedDate.toLocaleDateString(
    "en-GB",
    { weekday: "long" }
  );

  const date = selectedDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formatDate = (date: Date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

  const today = formatDate(new Date());

  const formattedDate = formatDate(selectedDate);

  const handleAddMeal = (type: MealType, date?: string) => {
    setActiveCell({
      type,
      date: date || formattedDate,
    });
  };

  const handleSelectMeal = (meal: Meal) => {
    if (!activeCell) return;

    setMeal(activeCell.date, meal);
    setActiveCell(null);
  };

  const handleRemoveMeal = (type: MealType, date?: string) => {
    removeMeal(date || formattedDate, type);
  };

  const filteredMeals = (meals as Meal[]).filter(
    (meal) => meal.mealType === activeCell?.type
  );

  const weekDays = (() => {
    const base = new Date(selectedDate);
    const day = base.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(base);
    
    monday.setDate(base.getDate() + diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  })();

  //AI meal generation
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await generateMealPlan(meals  as Meal[]);
    setIsGenerating(false);
  };
  
  return (
    <div className="standard-content plan">
      <TopBar onAIGenerate={handleAIGenerate} isGenerating={isGenerating} />
      <div className="standard-content__wrapper">
        <Stats stats={["plannedAvgCalories", "plannedMeals", "plannedAvgProtein", "plannedShoppingItems"]}/>
        <div className="standard-content__layout">
          <Days />
          <div className="standard-content__view plan__selection scrollable">
            {isDesktop ? (
              <>
                {(["breakfast", "lunch", "dinner"] as MealType[]).map(
                  (type) => (
                    <div className={`group group--${type}`} key={type}>
                      <div className="break">
                        <h3 className="break__heading">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </h3>
                        <hr />
                      </div>

                      <div className={`items items--${type}`}>
                        {weekDays.map((date, i) => {
                          const mealsForDay = getMeals(formatDate(date));

                          return (
                            <PlanMealSlot
                              disabled={formatDate(date) < today}
                              key={i}
                              type={type}
                              meal={mealsForDay[type]}
                              onAddMeal={() =>
                                handleAddMeal(type, formatDate(date))
                              }
                              onRemoveMeal={() =>
                                handleRemoveMeal(type, formatDate(date))
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <div className="date">
                  <p className="date__day">{day}</p>
                  <p className="date__date">{date}</p>
                </div>

                <div className="groups">
                  {(["breakfast", "lunch", "dinner"] as MealType[]).map(
                    (type) => (
                      <div key={type} className={`group group--${type}`}>
                        <div className="break">
                          <h3 className="break__heading">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </h3>
                          <hr />
                        </div>

                        <PlanMealSlot
                          disabled={formattedDate < today}
                          type={type}
                          meal={getMeals(formattedDate)[type]}
                          onAddMeal={() => handleAddMeal(type, formattedDate)}
                          onRemoveMeal={handleRemoveMeal}
                        />
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            <Modal
              isOpen={!!activeCell}
              onClose={() => setActiveCell(null)}
            >
              <div className="modal__header">
                <h2 className="modal__title">Select {activeCell?.type}</h2>
                <button className="modal__close" onClick={() => setActiveCell(null)}>
                  <IconClose color="tertiary" />
                </button>
              </div>

              <div className="modal__dropdown"> 
                <div className="input input--search">
                  <IconSearch />
                  <input
                    id="mealQuerySearch"
                    name="mealQuerySearch"
                    className="modal__search"
                    placeholder="Search meals..."
                    value={mealQuery}
                    onChange={(e) => setMealQuery(e.target.value)}
                  />
                </div> 
                <div className="modal__items">
                  {(filteredMeals as Meal[])
                    .filter((meal) =>
                      meal.name.toLowerCase().includes(mealQuery.toLowerCase())
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((meal) => (
                      <button
                        key={meal.id}
                        type="button"
                        className="modal__item"
                        onClick={() => handleSelectMeal(meal)}
                      >
                        <span className="modal__item-name">{meal.name}</span>
                        <span className="modal__item-meta">
                          ({meal.nutrition.kcal} kcal)
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </Modal>
          </div>    
        </div>
      </div>    
    </div>
  );
}
