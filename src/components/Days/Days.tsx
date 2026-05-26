"use client";

import { useMemo } from "react";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useSelectedDayStore } from "@/store/useSelectedDayStore";

import "./days.scss";

export const Days = () => {
  const { isDesktop } = useBreakpoints();
  const { selectedDate, setSelectedDate } = useSelectedDayStore();

  const weekDays = useMemo(() => {

    const baseDate = selectedDate ?? new Date();
    const day = baseDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(baseDate);

    monday.setHours(0, 0, 0, 0);

    monday.setDate(baseDate.getDate() + diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + i);

      date.setHours(0, 0, 0, 0);

      return {
        label: date.toLocaleDateString("en-GB", {
          weekday: "short",
        }),

        shortLabel: date.toLocaleDateString(
          "en-GB",
          {
            weekday: "narrow",
          }
        ),

        date: date.getDate(),

        fullDate: date,

        isActive:
          date.toDateString() ===
          baseDate.toDateString(),
      };
    });
  }, [selectedDate]);

  const isSelectable = !isDesktop;

  const handleSelectDay = (date: Date) => {
    if (!isSelectable) return;

    setSelectedDate(new Date(date));
  };

  return (
    <div className="days">
      {weekDays.map((day, i) => (
        <div
          key={i}
          className={`days__day ${
            day.isActive
              ? "days__day--active"
              : ""
          }`}
          onClick={() =>
            handleSelectDay(day.fullDate)
          }
        >
          <p className="days__day-day">
            {isDesktop
              ? day.label
              : day.shortLabel}
          </p>

          {!isDesktop && (
            <p className="days__day-date">
              {day.date}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};