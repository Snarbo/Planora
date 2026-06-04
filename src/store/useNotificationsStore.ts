import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { notifications } from "@/types/notification";

type NotificationState = {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  notifications: notifications;
  setNotifications: (notifications: notifications) => void;
  removeNotification: (id: string) => void;
  removeNotifications: () => void;
};

export const useNotificationsStore = create<NotificationState>()(
  persist(
    (set) => ({
      showNotifications: false,
      setShowNotifications: (show) => set({ showNotifications: show }),
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
      removeNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "notifications-storage",
    }
  )
);