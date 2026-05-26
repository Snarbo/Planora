"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

export function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = usePreferencesStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return <>{children}</>;
}