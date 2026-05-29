"use client";

import { useEffect, useState } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import {
  IconNutrition,
  IconWarning,
  IconCheck
} from "@/components/Icons";

import "./insights.scss";

type InsightType = "nutrition" | "warning" | "danger" | "check";

type Insight = {
  type: InsightType;
  title: string;
  message: string;
};

type Meal = {
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

type DayPlan = {
  date: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
};

type InsightsProps = {
  weekPlan: DayPlan[];
};

const ICON_MAP: Record<InsightType, { icon: React.ReactNode; modifier: string }> = {
  nutrition: {
    icon: <IconNutrition color="blue" />,
    modifier: "insight--nutrition",
  },
  warning: {
    icon: <IconWarning color="orange" />,
    modifier: "insight--warning",
  },
  danger: {
    icon: <IconWarning color="red" />,
    modifier: "insight--danger",
  },
  check: {
    icon: <IconCheck color="green" />,
    modifier: "insight--check",
  },
};

const ICON_COLOR_MAP: Record<InsightType, string> = {
  nutrition: "content__icon--nutrition",
  warning: "content__icon--warning",
  danger: "content__icon--danger",
  check: "content__icon--check",
};

export const Insights = ({ weekPlan }: InsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    nutritionCalories,
    nutritionProtein,
    nutritionCarbs,
    nutritionFat,
    nutritionFibre,
    dietaryDietType,
    dietaryAllergies,
  } = usePreferencesStore();

  useEffect(() => {
    if (!weekPlan || weekPlan.length === 0) return;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/generate-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weekPlan,
            preferences: {
              nutritionCalories,
              nutritionProtein,
              nutritionCarbs,
              nutritionFat,
              nutritionFibre,
              dietaryDietType,
              dietaryAllergies,
            },
          }),
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setInsights(data.insights);
      } catch (err) {
        console.error("Insights fetch error:", err);
        setError("Couldn't load insights right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [
    weekPlan,
    nutritionCalories,
    nutritionProtein,
    nutritionCarbs,
    nutritionFat,
    nutritionFibre,
    dietaryDietType,
    dietaryAllergies,
  ]);

  if (loading) {
    return (
      <div className="insights insights--loading">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="insight insight--skeleton" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights insights--error">
        <p className="insight__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="insights">
      {insights.map((insight, i) => {
        const { icon, modifier } = ICON_MAP[insight.type] ?? ICON_MAP.nutrition;
        const iconColor = ICON_COLOR_MAP[insight.type] ?? ICON_COLOR_MAP.nutrition;

        return (
          <div key={i} className={`insight ${modifier}`}>
            <div className={`content__icon ${iconColor}`}>
              {icon}
            </div>
            <p className="insight__content">
              <b>{insight.title}.</b> {insight.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};