"use client";

import { useToast } from "@/hooks/useToast";

export default function TestToast() {
  const { handleNotificationToast } = useToast();

  const handleClick = () => {
    handleNotificationToast("Reminder", "Log unplanned meals.");
  };

  return <button onClick={handleClick}>test toast</button>;
}