"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarProps {
  /** Selected date */
  value?: Date;
  /** Change handler */
  onChange?: (date: Date) => void;
  /** Minimum date */
  minDate?: Date;
  /** Maximum date */
  maxDate?: Date;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Disable dates */
  disabledDates?: Date[];
  /** Highlight today */
  highlightToday?: boolean;
  /** First day of week (0-6, 0 = Sunday) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value = new Date(),
      onChange,
      minDate,
      maxDate,
      className,
      style,
      disabledDates = [],
      highlightToday = true,
      firstDayOfWeek = 0,
    },
    ref,
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date(value));

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days: Array<Date | null> = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < (startingDayOfWeek - firstDayOfWeek + 7) % 7; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }

      return days;
    };

    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return isSameDay(date, today);
    };

    const isSelected = (date: Date) => {
      return isSameDay(date, value);
    };

    const isDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some((d) => isSameDay(d, date));
    };

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
        return newDate;
      });
    };

    const days = getDaysInMonth(currentMonth);

    // Reorder week days based on firstDayOfWeek
    const orderedWeekDays = [
      ...weekDays.slice(firstDayOfWeek),
      ...weekDays.slice(0, firstDayOfWeek),
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm",
          className,
        )}
        style={style}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-sm font-semibold text-gray-900">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {orderedWeekDays.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} />;
            }

            const selected = isSelected(date);
            const today = isToday(date);
            const disabled = isDisabled(date);

            return (
              <button
                key={index}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onChange?.(date)}
                className={cn(
                  "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                  selected && "bg-primary-500 text-white hover:bg-primary-600",
                  !selected && !disabled && "hover:bg-gray-100 text-gray-900",
                  today &&
                    highlightToday &&
                    !selected &&
                    "border-2 border-primary-300",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Calendar.displayName = "Calendar";

export default Calendar;
