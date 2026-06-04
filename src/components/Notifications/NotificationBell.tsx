"use client";

import { useNotificationsStore } from "@/store/useNotificationsStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useBreakpoints } from "@/hooks/useBreakpoints";

import {
  IconBellOutline, 
  IconBellFull
} from "@/components/Icons";

export const NotificationBell = () => {
  const notifications = useNotificationsStore((s) => s.notifications);
  const showNotifications = useNotificationsStore((s) => s.showNotifications);
  const setShowNotifications = useNotificationsStore((s) => s.setShowNotifications);
  const hasNotifications = notifications.length > 0;

  const { theme } = usePreferencesStore();

  const { isDesktop } = useBreakpoints();

  return (
    <button className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
      {hasNotifications ? <IconBellFull color={isDesktop && theme != "dark" ? "primary" : "ivory"} /> : <IconBellOutline color={isDesktop && theme != "dark" ? "primary" : "ivory"} />}
      {hasNotifications && (
        <span className="notification-bell__count">{notifications.length}</span>
      )}
    </button>  
  );
};