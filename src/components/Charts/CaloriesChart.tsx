import { useEffect, useRef } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

import "./calories-chart.scss";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

interface Meal {
  nutrition?: { kcal: number };
}

interface DayData {
  date: string;
  meals: Record<string, Meal>;
}

interface CaloriesChartProps {
  data: DayData[];
}

export function CaloriesChart({ data }: CaloriesChartProps) {
  const calorieGoal = usePreferencesStore((s) => s.nutritionCalories);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const totals: (number | null)[] = Array(7).fill(null);

    for (const day of data) {
      const date = new Date(day.date);
      const dayIndex = (date.getDay() + 6) % 7;
      totals[dayIndex] = Object.values(day.meals).reduce(
        (sum, meal) => sum + (meal.nutrition?.kcal ?? 0),
        0
      );
    }

    const maxKcal = Math.max(
      ...(totals.filter((v) => v !== null) as number[]),
      calorieGoal
    );

    barRefs.current.forEach((bar, i) => {
      if (!bar) return;

      const kcal = totals[i];

      bar.classList.remove("bar--on-target", "bar--over-target");
      bar.style.height = "0%";

      if (kcal === null) return;

      const pct = Math.min((kcal / maxKcal) * 100, 100);

      if (kcal > calorieGoal) {
        bar.classList.add("bar--over-target");
      } else if (kcal >= calorieGoal * 0.7) {
        bar.classList.add("bar--on-target");
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.height = `${pct}%`;
          }, i * 60);
        });
      });
    });
  }, [data, calorieGoal]);

  return (
    <div className="calories-chart">
      {DAY_LABELS.map((label, i) => (
        <div key={i} className={`day day--${DAY_KEYS[i]}`}>
          <div className="bar__wrapper">
            <div
              className="bar"
              ref={(el) => { barRefs.current[i] = el; }}
            />
          </div>
          <label>{label}</label>
        </div>
      ))}
    </div>
  );
}