"use client";

import { useMemo, useEffect, useRef } from "react";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useHistoryFilters } from "@/hooks/useHistoryFilters";
import type { Meal } from "@/types/meals";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { TopBar } from "@/components/TopBar/TopBar";
import { Stats } from "@/components/Stats/Stats";
import { HistoryFilter } from "@/components/Filters/HistoryFilter";
import { HistoryMealSlot } from "@/components/MealSlot/HistoryMealSlot";

import "./history.scss";

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();

  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getWeekKey = (dateStr: string) => {
  const start = getStartOfWeek(new Date(dateStr));
  return formatDate(start);
};

type MealWithDate = Meal & {
  date: string;
};

export default function History() {
  const { plans } = useMealPlans();
  const progressRefs = useRef<(HTMLProgressElement | null)[]>([]);

  const allMeals = useMemo<MealWithDate[]>(
    () =>
      plans.flatMap((day) =>
        Object.entries(day.meals || {}).map(([, meal]) => {
          return {
            ...(meal as any),
            date: day.date,
          } as MealWithDate;
        })
      ),
    [plans]
  );

  const {
    activeFilters,
    searchQuery,
    setSearchQuery,
    handleFilter,
    filteredMeals,
  } = useHistoryFilters(allMeals as MealWithDate[]);

  const isActive = (type: any) => activeFilters.length === 0 || activeFilters.includes(type);

  const currentWeekKey = getWeekKey(
    formatDate(new Date())
  );

  const weeklyPlans = useMemo(() => {
    const grouped: Record<string, MealWithDate[]> = {};

    (filteredMeals as MealWithDate[]).forEach((meal) => {
      const key = getWeekKey(meal.date);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(meal);
    });

    return Object.entries(grouped).sort(
      ([a], [b]) =>
        new Date(b).getTime() -
        new Date(a).getTime()
    );
  }, [filteredMeals]);

  const allDays = useMemo(() =>
    weeklyPlans.flatMap(([, meals]) =>
      Object.entries(
        meals.reduce((acc, meal) => {
          if (!acc[meal.date]) acc[meal.date] = [];
          acc[meal.date].push(meal);
          return acc;
        }, {} as Record<string, MealWithDate[]>)
      ).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    ),
    [weeklyPlans]
  );

  useEffect(() => {
    allDays.forEach(([, dayMeals], i) => {
      const bar = progressRefs.current[i];
      if (!bar) return;

      const target = dayMeals.reduce(
        (acc, meal) => acc + meal.nutrition.kcal,
        0
      );

      bar.value = 0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const start = performance.now();
            const duration = 600;

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              bar.value = eased * target;
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
          }, i * 75);
        });
      });
    });
  }, [allDays]);

  const formatWeekRange = (weekStart: string) => {
    const [year, month, day] = weekStart
      .split("-")
      .map(Number);

    const startOfWeek = new Date(
      year,
      month - 1,
      day
    );

    const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const monthName = endOfWeek.toLocaleDateString(
        "en-GB",
        {
          month: "short",
        }
      );

    return `${startDay} - ${endDay} ${monthName}`;
  };

  const targetCalories = usePreferencesStore((state) => state.nutritionCalories);

  let dayIndex = 0;

  return (
    <div className="standard-content history">
      <TopBar />
      <div className="standard-content__wrapper">
        <Stats stats={["mealsLoggedThisMonth", "avgCalories", "goalHitRate", "streak"]} />
        <HistoryFilter
          activeFilters={activeFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleFilter={handleFilter}
        />
        <div className="standard-content__layout">
          <div className="standard-content__view scrollable">
            <div className="weeks">
              {weeklyPlans.map(([weekStart, meals]) => (
                <div key={weekStart} className="week">
                  <div className="week__heading">
                    <p className="date">
                      {weekStart === currentWeekKey && (
                        <span>This week:</span>
                      )}{" "}
                      {formatWeekRange(weekStart)}
                    </p>
                    <hr />
                    <p className="kcal">
                      avg{" "}
                      <span>
                        {Math.round(
                          meals.reduce(
                            (acc, meal) =>
                              acc + meal.nutrition.kcal,
                            0
                          ) / meals.length
                        )}
                      </span>{" "}
                      kcal/day
                    </p>
                  </div>
                  <div className="week__days">
                    {Object.entries(
                      meals.reduce((acc, meal) => {
                        if (!acc[meal.date]) {
                          acc[meal.date] = [];
                        }

                        acc[meal.date].push(meal);

                        return acc;
                      }, {} as Record<string, MealWithDate[]>)
                    )
                      .sort(
                        ([a], [b]) =>
                          new Date(a).getTime() -
                          new Date(b).getTime()
                      )
                      .map(([date, dayMeals]) => {
                        const currentIndex = dayIndex++;

                        const mealMap = dayMeals.reduce(
                          (acc, meal) => {
                            acc[meal.mealType] = meal;

                            return acc;
                          },
                          {} as Record<string, MealWithDate>
                        );

                        const totalCalories =
                          dayMeals.reduce(
                            (acc, meal) =>
                              acc + meal.nutrition.kcal,
                            0
                          );

                        return (
                          <div
                            key={date}
                            className="week__day"
                          >
                            <div className="week__day-content">
                              <h3 className="day">
                                {new Date(
                                  date
                                ).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "long",
                                  }
                                )}
                              </h3>

                              <p className="date">
                                {new Date(
                                  date
                                ).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>

                              {date ===
                                formatDate(new Date()) && (
                                <span className="today">
                                  Today
                                </span>
                              )}

                              <div className="progress progress--kcal">
                                <progress
                                  className="progress-bar"
                                  max={targetCalories}
                                  value={0}
                                  ref={(el) => {
                                    progressRefs.current[currentIndex] = el;
                                  }}
                                />
                                <p>{totalCalories}</p>
                              </div>
                            </div>

                            <div className="week__day-meals">
                              {isActive("breakfast") && (
                                <HistoryMealSlot
                                  type="breakfast"
                                  meal={mealMap.breakfast}
                                />
                              )}

                              {isActive("lunch") && (
                                <HistoryMealSlot
                                  type="lunch"
                                  meal={mealMap.lunch}
                                />
                              )}

                              {isActive("dinner") && (
                                <HistoryMealSlot
                                  type="dinner"
                                  meal={mealMap.dinner}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}