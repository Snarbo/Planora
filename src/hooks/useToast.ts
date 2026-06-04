"use client";

import { toast } from "sonner";
import { useNotificationsStore } from "@/store/useNotificationsStore";

export const useToast = () => {
    const { setNotifications, notifications } = useNotificationsStore(); 
    
    const handleToast = (type: string, message: string) => {
        toast(`${type}: ${message}`);
    };

    const handleNotification = (type: string, message: string) => {
        const id = crypto.randomUUID();

        setNotifications([...notifications, {
            id,
            type,
            content: message,
            date: new Date(),
            removeNotification: (removeId) =>
                setNotifications(notifications.filter((n) => n.id !== removeId)),
        }]);
    };

    const handleNotificationToast = (type: string, message: string) => { 
        handleToast(type, message);
        handleNotification(type, message);
    };

    return { handleToast, handleNotification, handleNotificationToast };
};