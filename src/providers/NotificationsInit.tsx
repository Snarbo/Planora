"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getUnplannedMeals, scheduleMealReminderAt10am } from "@/utils/mealPlansNotification";
import { useToast } from "@/hooks/useToast";

export const NotificationsInit = () => {
  const notificationMealReminder = usePreferencesStore((s) => s.notificationMealReminder);
  const { handleNotificationToast } = useToast();

  //meal reminder
  useEffect(() => {
    if (!notificationMealReminder) return;

    const cleanup = scheduleMealReminderAt10am(() => {
      const unplanned = getUnplannedMeals();

      if (unplanned === 0) return;
      
      handleNotificationToast("Meal Reminder", `You have ${unplanned} unplanned meal(s) this week.`);
    });

    return cleanup;
  }, [notificationMealReminder]);

  // 🔔 Shopping List Alert — coming next
  // 🔔 Weekly Summary — coming next
  // 🔔 Goal Milestones — coming next

  return null;
};