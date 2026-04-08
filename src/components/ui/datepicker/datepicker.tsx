"use client";

import React, { CSSProperties, useRef, useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/utilities/helpers/cn";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface DatePickerProps {
  /** Selected date */
  value?: Date | null;
  /** Change handler */
  onChange?: (date: Date | null) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Minimum date */
  minDate?: Date;
  /** Maximum date */
  maxDate?: Date;
  /** Input size */
  size?: "sm" | "md" | "lg";
  /** Whether to show clear button */
  showClear?: boolean;
  /** Whether to open calendar on focus */
  openOnFocus?: boolean;
}

const sizeStyles = {
  sm: "h-9 px-3 py-1.5 text-sm",
  md: "h-10 px-3 py-2 text-sm",
  lg: "h-11 px-4 py-2.5 text-base",
};

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      className,
      style,
      minDate,
      maxDate,
      size = "md",
      showClear = true,
      openOnFocus = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (date: Date) => {
      onChange?.(date);
      setIsOpen(false);
    };

    const handleClear = () => {
      onChange?.(null);
    };

    const displayValue = value ? format(value, "MMM dd, yyyy") : "";

    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        style={style}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => openOnFocus && setIsOpen(true)}
          className={cn(
            "w-full flex items-center justify-between border border-border rounded-lg  text-left transition-colors focus:outline-none focus:ring-4 focus:ring-primary-300/50 focus:border-primary-300 disabled:bg-muted disabled:cursor-not-allowed placeholder:text-muted-foreground",
            sizeStyles[size],
            !displayValue && "text-muted-foreground",
          )}
        >
          <span className="truncate">{displayValue || placeholder}</span>
          <div className="flex items-center gap-1">
            {showClear && value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-0.5 rounded hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 top-full left-0">
            <Calendar
              value={value || new Date()}
              onChange={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
