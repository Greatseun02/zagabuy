"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ClassNames,
  CustomComponents,
  DateRange,
  DayFlag,
  DayPicker,
  type DayPickerProps,
  MonthGrid,
  SelectionState,
  UI,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import AngleLeftIcon from "../icons/angleLeftIcon";
import AngleRightIcon from "../icons/angleRightIcon";

export type BaseCalendarProps = {
  showDateRangePicked?: boolean;
  calendarViewOnly?: boolean;
} & DayPickerProps;

export const useContainerWidth = () => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, width };
};

const BaseCalendar = ({
  className = "",
  classNames = {},
  showOutsideDays = true,
  components = {},
  calendarViewOnly = true,
  showDateRangePicked,
  ...props
}: BaseCalendarProps) => {
  // Tailwind classes - Institutional theme (sharp corners, FSDH Royal Blue)
  const mergedClassNames: Partial<ClassNames> = {
    months: "relative flex gap-4 flex-col md:flex-row",
    month: "w-[320px] flex flex-col items-center gap-3",
    [UI.MonthGrid]: "w-full border-collapse",
    [UI.MonthCaption]: "flex items-center justify-center h-10 text-foreground",
    nav: "contents",
    [UI.PreviousMonthButton]:
      "bg-transparent border-none text-foreground rounded cursor-pointer w-8 h-8 flex justify-center items-center transition-colors duration-200 absolute left-0 top-0 hover:bg-[#003399] hover:text-white",
    [UI.NextMonthButton]:
      "bg-transparent border-none text-foreground rounded cursor-pointer w-8 h-8 flex justify-center items-center transition-colors duration-200 absolute right-0 top-0 hover:bg-[#003399] hover:text-white",
    [UI.Dropdowns]: "relative inline-flex items-center gap-2",
    [UI.DropdownRoot]: "relative inline-flex items-center",
    [UI.Dropdown]:
      "absolute inset-0 z-[2] opacity-0 cursor-pointer w-full border-none",
    [UI.CaptionLabel]: "text-sm font-semibold text-foreground",
    [UI.Chevron]: "inline-block fill-[#003399]",
    day: "rounded bg-none border-none cursor-pointer text-sm text-foreground transition-colors duration-75 [&:not([data-selected]):hover]:bg-muted",
    [DayFlag.today]:
      "text-[#003399] font-semibold ring-1 ring-inset ring-[#003399] rounded",
    [SelectionState.selected]:
      "bg-[#003399] text-white font-semibold outline-none rounded hover:bg-[#003399] hover:text-white",
    [SelectionState.range_middle]: "bg-muted font-medium text-foreground",
    [SelectionState.range_start]:
      "bg-[#003399] text-white font-semibold outline-none rounded-l hover:bg-[#003399] hover:text-white",
    [SelectionState.range_end]:
      "bg-[#003399] text-white font-semibold outline-none rounded-r hover:bg-[#003399] hover:text-white",
    ...classNames,
  };

  // Helper function to safely get the selected value as DateRange
  const getSelectedAsDateRange = (): DateRange | undefined => {
    const selected = (props as { selected?: unknown }).selected;

    if (
      selected &&
      typeof selected === "object" &&
      ("from" in selected || "to" in selected)
    ) {
      return selected as DateRange;
    }

    return undefined;
  };

  const mergedComponents: Partial<CustomComponents> = {
    MonthGrid: (monthGridProps) => {
      if (showDateRangePicked) {
        const dateRange = getSelectedAsDateRange();
        return (
          <div style={{ width: "100%" }}>
            <aside className="flex items-center flex-1 justify-between mb-3 gap-4">
              <div className="border border-border px-2 py-1 rounded-md text-sm flex-1 text-center">
                {dateRange?.from?.toLocaleDateString() || "Start Date"}
              </div>
              <p>-</p>
              <div className="border border-border px-2 py-1 rounded-md text-sm flex-1 text-center">
                {dateRange?.to?.toLocaleDateString() || "End Date"}
              </div>
            </aside>
            <MonthGrid {...monthGridProps} />
          </div>
        );
      }
      return <MonthGrid {...monthGridProps} />;
    },
    PreviousMonthButton: (props) => (
      <button {...props}>
        <AngleLeftIcon />
      </button>
    ),
    NextMonthButton: (props) => (
      <button {...props}>
        <AngleRightIcon />
      </button>
    ),
    ...components,
  };

  return (
    <div className="inline-block w-auto max-w-max">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={`max-w-max p-4 ${calendarViewOnly ? "border border-border rounded bg-card" : ""} ${className}`}
        classNames={mergedClassNames}
        components={mergedComponents}
        numberOfMonths={1}
        captionLayout="dropdown"
        startMonth={new Date(new Date().getFullYear() - 100, 0)}
        endMonth={new Date(new Date().getFullYear() + 10, 11)}
        {...props}
      />
    </div>
  );
};

export default BaseCalendar;
