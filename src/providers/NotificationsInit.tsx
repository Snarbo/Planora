"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getUnplannedMeals, scheduleMealReminderAt10am, hasShoppingListFiredThisWeek, markShoppingListFiredThisWeek } from "@/utils/mealPlansNotification";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useToast } from "@/hooks/useToast";

export const NotificationsInit = () => {
  const { plans } = useMealPlans();
  const notificationMealReminder = usePreferencesStore((s) => s.notificationMealReminder);
  const notificationShoppingList = usePreferencesStore((s) => s.notificationShoppingList);
  const { handleNotificationToast } = useToast();

  //meal reminder
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
      handleNotificationToast("Shopping List", "All meals are planned — your shopping list is ready!");
      markShoppingListFiredThisWeek();
    }
  }, [plans, notificationShoppingList]);

  // 🔔 Weekly Summary — coming next
  // 🔔 Goal Milestones — coming next

  return null;
};