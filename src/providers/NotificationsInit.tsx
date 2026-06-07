"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useStatsStore } from "@/store/useStatsStore";
import { useMealPlansStore } from "@/store/useMealPlansStore";
import { getUnplannedMeals, scheduleMealReminderAt10am, hasShoppingListFiredThisWeek, markShoppingListFiredThisWeek, hasWeeklySummaryFiredThisWeek, markWeeklySummaryFiredThisWeek  } from "@/utils/notifications";
import { useToast } from "@/hooks/useToast";

export const NotificationsInit = () => {
  const notificationMealReminder = usePreferencesStore((s) => s.notificationMealReminder);
  const notificationShoppingList = usePreferencesStore((s) => s.notificationShoppingList);
  const notificationGoalMilestones = usePreferencesStore((s) => s.notificationGoalMilestones);
  const notificationWeeklySummary = usePreferencesStore((s) => s.notificationWeeklySummary);

  const streak = useStatsStore((s) => s.getStreak());
  const avgCalories = useStatsStore((s) => s.getAverageCalories());
  const avgProtein = useStatsStore((s) => s.getPlannedAvgProtein());
  const goalHitRate = useStatsStore((s) => s.getGoalHitRate());

  const plans = useMealPlansStore((s) => s.plans);
  const { handleNotificationToast } = useToast();

  //meal Reminder
  useEffect(() => {
    if (!notificationMealReminder) return;

    const cleanup = scheduleMealReminderAt10am(() => {
      const unplanned = getUnplannedMeals(plans);
      if (unplanned === 0) return;
      handleNotificationToast("Meal Reminder", `You have ${unplanned} unplanned meal(s) this week.`);
    });

    return cleanup;
  }, [notificationMealReminder, plans]);

  //shopping list alert
  useEffect(() => {
    if (!notificationShoppingList) return;
    if (plans.length === 0) return;
    if (hasShoppingListFiredThisWeek()) return;

    const unplanned = getUnplannedMeals(plans);
    if (unplanned === 0) {
      handleNotificationToast("Shopping List", "All meals are planned for the week — your shopping list is ready!");
      markShoppingListFiredThisWeek();
    }
  }, [plans, notificationShoppingList]);

  //weekly summary 
  useEffect(() => {
    if (!notificationWeeklySummary) return;
    if (hasWeeklySummaryFiredThisWeek()) return;

    const today = new Date().getDay();

    if (today !== 1) return; // 1 = Monday

    const fire = async () => {
      try {
        const res = await fetch("/api/generate-weekly-recap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avgCalories, avgProtein, goalHitRate }),
        });

        const data = await res.json();
        handleNotificationToast("Weekly Recap", data.message);
        markWeeklySummaryFiredThisWeek();
      } catch (err) {
        console.error("Weekly recap failed:", err);
      }
    };

    fire();
  }, [notificationWeeklySummary, avgCalories, avgProtein, goalHitRate]);

  //milestones
  const streakMilestones = [
    { min: 100, message: (s: number) => `Legendary! ${s}-day streak.` },
    { min: 50, message: (s: number) => `Amazing! ${s}-day streak.` },
    { min: 10, message: (s: number) => `Incredible! ${s}-day streak. You're on fire!` },
    { min: 5, message: (s: number) => `Great job! ${s}-day streak. Keep it going.` },
    { min: 1, message: (s: number) => `${s}-day streak. Nice work.` },
  ];

  const getStreakMessage = (streak: number) => {
    const milestone = streakMilestones.find((m) => streak >= m.min);
    return milestone?.message(streak) ?? null;
  };

  useEffect(() => {
    if (!notificationGoalMilestones || streak <= 0) return;

    const lastNotified = Number(localStorage.getItem("last-notified-streak") ?? "0");
    if (streak <= lastNotified) return;

    const message = getStreakMessage(streak);
    if (!message) return;

    handleNotificationToast("Streak", message);
    localStorage.setItem("last-notified-streak", streak.toString());
  }, [streak, notificationGoalMilestones]);

  return null;
};