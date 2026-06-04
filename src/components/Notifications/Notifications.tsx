"use client";

import { useNotificationsStore } from "@/store/useNotificationsStore";

import {
  IconClose
} from "@/components/Icons";

export const Notifications = () => {
  const showNotifications = useNotificationsStore((s) => s.showNotifications);
  const setShowNotifications = useNotificationsStore((s) => s.setShowNotifications);
  const notifications = useNotificationsStore((s) => s.notifications);
  const removeNotification = useNotificationsStore((s) => s.removeNotification);
  const removeNotifications = useNotificationsStore((s) => s.removeNotifications);

  const handleHideNotifications = () => setShowNotifications(false);
  const handleRemoveNotification = (id: string) => removeNotification(id);

  const handleRemoveNotifications = () => {
    removeNotifications();
    handleHideNotifications();
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      month: "long",
      weekday: "short",
      day: "numeric",
    }) + " - " + date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {showNotifications && 
      <div className="notifications">
        <h3 className="notifications__title">Notifications</h3>
        <div className="notifications__wrapper">
          {notifications.length === 0 ? (
            <p className="notifications__empty">No notifications at the moment.</p>
          ) : (
            notifications.map((notification) => (
              <div className="notification" key={notification.id}>
                <div className="notification__content">
                  <p className="notification__type">{notification.type}:</p>
                  <div className="notification__text-date">
                    <p className="notification__text">{notification.content}</p>
                    <span className="notification__date">{formatDate(notification.date)}</span>
                  </div>
                </div>
                <button className="notification__remove" onClick={() => handleRemoveNotification(notification.id)}><IconClose color="ivory" /></button>
              </div>
            ))
          )}
        </div>
        {notifications.length > 1 && 
          <button className="notifications__remove button button--primary" onClick={() =>  handleRemoveNotifications()}>Remove all notifications</button>
        }      
      </div>
      }
    </>
    
  );
};