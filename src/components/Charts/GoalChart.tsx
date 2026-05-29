import { useEffect, useRef } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useShallow } from "zustand/react/shallow";
import type { Meal } from "@/types/meals";

import "./goal-chart.scss";

type Goal = {
  key: string;
  label: string;
  value: number;
  target: number;
  unit: string;
};

type Plan = {
  date: string;
  meals: Record<string, Meal>;
};

type GoalChartProps = {
  data: Plan[];
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function GoalChart({ data }: GoalChartProps) {
  const progressRefs = useRef<(HTMLProgressElement | null)[]>([]);

  const { nutritionCalories, nutritionProtein, nutritionCarbs, nutritionFat, nutritionFibre } = usePreferencesStore(
    useShallow((s) => ({
      nutritionCalories: s.nutritionCalories,
      nutritionProtein: s.nutritionProtein,
      nutritionCarbs: s.nutritionCarbs,
      nutritionFat: s.nutritionFat,
      nutritionFibre: s.nutritionFibre,
    }))
  );

  const todayPlan = data.find((p) => p.date === formatDate(new Date()));
  const todayMeals = todayPlan ? Object.values(todayPlan.meals) : [];

  const totals = todayMeals.reduce(
    (acc, meal) => ({
      kcal:    acc.kcal    + meal.nutrition.kcal,
      protein: acc.protein + meal.nutrition.protein,
      carbs:   acc.carbs   + meal.nutrition.carbs,
      fat:     acc.fat     + meal.nutrition.fat,
      fibre:   acc.fibre   + meal.nutrition.fibre,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
  );

  const goals: Goal[] = [
    { key: "calories", label: "Calories", value: totals.kcal,    target: nutritionCalories, unit: "kcal" },
    { key: "protein",  label: "Protein",  value: totals.protein, target: nutritionProtein,  unit: "g" },
    { key: "carbs",    label: "Carbs",    value: totals.carbs,   target: nutritionCarbs,    unit: "g" },
    { key: "fat",      label: "Fat",      value: totals.fat,     target: nutritionFat,      unit: "g" },
    { key: "fibre",    label: "Fibre",    value: totals.fibre,   target: nutritionFibre,    unit: "g" },
  ];

  useEffect(() => {
    goals.forEach(({ value, target }, i) => {
      const bar = progressRefs.current[i];
      if (!bar) return;

      bar.max = target;
      bar.value = 0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const start = performance.now();
            const duration = 600;

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              bar.value = eased * value;
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
          }, i * 75);
        });
      });
    });
  }, [totals.kcal, totals.protein, totals.carbs, totals.fat, totals.fibre]);

  const getMessage = ({ value, target, unit }: Goal) => {
    const diff = target - value;

    if (diff > 0) return { text: `${diff}${unit} under target`, cls: "goal__message--warning" };
    if (diff < 0) return { text: `${Math.abs(diff)}${unit} over target`, cls: "goal__message--danger" };

    return null;
  };

  const getProgressClass = ({ value, target }: Goal) => {
    const diff = target - value;

    if (diff > 0) return "progress-bar--warning";
    if (diff < 0) return "progress-bar--danger";

    return "";
  };

  return (
    <div className="goals-chart">
      {goals.map((goal, i) => {
        const { key, label, value, target, unit } = goal;
        const msg = getMessage(goal);
        const progressCls = getProgressClass(goal);

        return (
          <div key={key} className={`goal goal--${key}`}>
            <div className="goal__labels">
              <span className="goal__name">{label}</span>
              <span className="goal__value">{value}/{target}{unit}</span>
            </div>
            <progress
              className={`goal__progress progress-bar ${progressCls}`.trim()}
              max={target}
              value={0}
              ref={(el) => { progressRefs.current[i] = el; }}
            />
            {msg && (
              <p className={`goal__message ${msg.cls}`}>{msg.text}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}