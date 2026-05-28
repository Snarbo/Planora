import { useEffect, useRef } from "react";
import type { Meal } from "@/types/meals";

import "./macro-chart.scss";

export type DayData = {
  date: string;
  meals: Record<string, Meal>;
};

export type MacroChartProps = {
  data: DayData[];
};

const MACROS = [
  { key: "carbs", label: "Carbs", color: "#86EFAC" },
  { key: "protein", label: "Protein", color: "#60A5FA" },
  { key: "fat", label: "Fat", color: "#0A0F1F" },
  { key: "fibre", label: "Fibre", color: "#6B7280" },
] as const;

type MacroKey = (typeof MACROS)[number]["key"];

const SIZE = 100;
const STROKE = 10;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MacroChart({ data }: MacroChartProps) {
  const segmentRefs = useRef<(SVGCircleElement | null)[]>([]);

  const totals = data.reduce(
    (acc, day) => {
      Object.values(day.meals).forEach((meal) => {
        const n = meal.nutrition;

        acc.carbs += n.carbs;
        acc.protein += n.protein;
        acc.fat += n.fat;
        acc.fibre += n.fibre;
      });

      return acc;
    },
    { carbs: 0, protein: 0, fat: 0, fibre: 0 }
  );

  const dayCount = data.length || 1;

  const avg: Record<MacroKey, number> = {
    carbs: Math.round(totals.carbs / dayCount),
    protein: Math.round(totals.protein / dayCount),
    fat: Math.round(totals.fat / dayCount),
    fibre: Math.round(totals.fibre / dayCount),
  };

  const total =
    avg.carbs + avg.protein + avg.fat + avg.fibre || 1;

  const segments = MACROS.map((macro) => {
    const value = avg[macro.key];

    return {
      ...macro,
      grams: value,
      pct: Math.round((value / total) * 100),
      dash: (value / total) * CIRCUMFERENCE,
    };
  });

  let offset = CIRCUMFERENCE * 0.25;

  const segmentData = segments.map((seg) => {
    const dashOffset = CIRCUMFERENCE - offset;
    offset += seg.dash;

    return {
      ...seg,
      dashOffset,
    };
  });

  useEffect(() => {
    let cumulativeDelay = 0;

    segmentRefs.current.forEach((el, i) => {
      if (!el) return;

      el.style.strokeDasharray = `0 ${CIRCUMFERENCE}`;

      const segmentDuration =
        (segmentData[i].dash / CIRCUMFERENCE) * 500;

      const delay = cumulativeDelay;
      cumulativeDelay += segmentDuration;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.transition = `stroke-dasharray ${segmentDuration}ms linear`;

            el.style.strokeDasharray = `${segmentData[i].dash} ${
              CIRCUMFERENCE - segmentData[i].dash
            }`;
          }, delay);
        });
      });
    });
  }, [data, segmentData]);

  return (
    <div className="macro-chart">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="macro-chart__donut">
        {segmentData.map((seg, i) => (
          <circle
            key={seg.key}
            ref={(el) => {
              segmentRefs.current[i] = el;
            }}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`0 ${CIRCUMFERENCE}`}
            strokeDashoffset={String(seg.dashOffset)}
          />
        ))}
      </svg>

      <ul className="macro-chart__legend">
        {segmentData.map((seg) => (
          <li key={seg.key} className="macro-chart__legend-item">
            <span
              className="macro-chart__legend-dot"
              style={{ backgroundColor: seg.color }}
            />

            <span className="macro-chart__legend-label">
              {seg.label}
            </span>

            <span className="macro-chart__legend-value">
              {seg.grams}g - {seg.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}