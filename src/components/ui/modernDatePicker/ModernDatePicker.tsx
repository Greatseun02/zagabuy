"use client";

import React, {
  CSSProperties,
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { FormikProps, FormikValues } from "formik";
import { Button } from "../button"; // Assuming this is your styled button component

interface BaseCalendarProps {
  mode?: "single" | "range";
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  disabledDays?: number[];
  fixedWeeks?: boolean;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  calendarViewOnly?: boolean;
}

interface DateFormatConfig<I, O> {
  input: I;
  output: O;
}

type DateFormatType = string;

const DateFormatPresets = {
  apiStandard: { input: "YYYY-MM-DD", output: "YYYY-MM-DD" },
  timestamp: { input: "timestamp", output: "timestamp" },
};

interface EnhancedLabelProps {
  label?: string;
  labelStyle?: CSSProperties;
  className?: string;
}

interface HelperTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  isLoading?: boolean;
}

export type ModernDatePickerProps<T extends FormikValues = FormikValues> = {
  selected?: unknown;
  onSelect?: (date: unknown) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  showPresetRanges?: boolean;
  showTimeSelector?: boolean;
  error?: string;
  name?: keyof T & string;
  labelStyle?: CSSProperties;
  labelProps?: EnhancedLabelProps;
  helperText?: string;
  helperTextProps?: HelperTextProps;
  formik?: FormikProps<T>;
  dateFormat?:
    | DateFormatConfig<DateFormatType, DateFormatType>
    | keyof typeof DateFormatPresets
    | DateFormatType;
  useTimestamp?: boolean;
  fullWidth?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
} & Omit<BaseCalendarProps, "selected" | "onSelect" | "mode">;

class EnhancedTimeUtil {
  static createFormatter(config: any) {
    return {
      parseInput: (value: any): Date | undefined => {
        if (!value) return undefined;
        if (value instanceof Date) return value;
        if (typeof value === "number") return new Date(value);
        if (typeof value === "string") {
          const date = new Date(value);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      formatOutput: (date: Date | undefined) => {
        if (!date) return undefined;
        return date.toISOString().split("T")[0];
      },
      formatForDisplay: (date: Date): string => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    };
  }
}

// Stub BaseCalendar component
const BaseCalendar: React.FC<BaseCalendarProps> = ({
  selected,
  onSelect,
  month = new Date(),
  onMonthChange,
}) => {
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth(month) });

  const handleDayClick = (day: number) => {
    const newDate = new Date(month.getFullYear(), month.getMonth(), day);
    onSelect?.(newDate);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const isSelected =
            selected && date.toDateString() === selected.toDateString();
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`
                h-9 w-9 p-0 text-sm rounded-md flex items-center justify-center transition-colors
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-transparent text-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ModernDatePicker = <T extends FormikValues = FormikValues>({
  selected,
  onSelect,
  placeholder = "Select date",
  className,
  showPresetRanges = true,
  showTimeSelector = false,
  label,
  labelStyle,
  labelProps,
  helperText,
  helperTextProps,
  formik,
  name,
  error,
  dateFormat = "apiStandard",
  useTimestamp = false,
  fullWidth = true,
  showTime = false,
  showSeconds = false,
}: ModernDatePickerProps<T>): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const resolvedFormat = useMemo((): DateFormatConfig<
    DateFormatType,
    DateFormatType
  > => {
    if (useTimestamp) {
      return DateFormatPresets.timestamp as DateFormatConfig<
        DateFormatType,
        DateFormatType
      >;
    }

    if (typeof dateFormat === "string") {
      if (dateFormat in DateFormatPresets) {
        const preset =
          DateFormatPresets[dateFormat as keyof typeof DateFormatPresets];
        return typeof preset === "function"
          ? (preset as DateFormatConfig<DateFormatType, DateFormatType>)
          : (preset as DateFormatConfig<DateFormatType, DateFormatType>);
      } else {
        return {
          input: dateFormat as DateFormatType,
          output: dateFormat as DateFormatType,
        };
      }
    }

    if (typeof dateFormat === "object") {
      return dateFormat;
    }

    return { input: "date-object", output: "date-object" };
  }, [dateFormat, useTimestamp]);

  const formatter = useMemo(
    () => EnhancedTimeUtil.createFormatter(resolvedFormat),
    [resolvedFormat]
  );

  const getInitialValue = useCallback((): Date | undefined => {
    if (formik && name && formik.values[name] !== undefined) {
      return formatter.parseInput(formik.values[name]);
    }
    return formatter.parseInput(selected);
  }, [formik, name, selected, formatter]);

  const [tempSelected, setTempSelected] = useState<Date | undefined>(
    getInitialValue()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    const initialValue = getInitialValue();
    return initialValue || new Date();
  });

  const [hours, setHours] = useState<number>(
    () => tempSelected?.getHours() || 0
  );
  const [minutes, setMinutes] = useState<number>(
    () => tempSelected?.getMinutes() || 0
  );
  const [seconds, setSeconds] = useState<number>(
    () => tempSelected?.getSeconds() || 0
  );

  const hasFieldError = useCallback((): boolean => {
    if (!formik || !name) return false;
    const touched = formik.touched[name] as boolean | undefined;
    const fieldError = formik.errors[name];
    return Boolean(touched && fieldError);
  }, [formik, name]);

  const isError = Boolean(error) || hasFieldError();

  useEffect(() => {
    if (!isOpen) {
      const newValue = getInitialValue();
      setTempSelected(newValue);
      if (newValue) {
        setDisplayMonth(newValue);
        setHours(newValue.getHours());
        setMinutes(newValue.getMinutes());
        setSeconds(newValue.getSeconds());
      }
    }
  }, [getInitialValue, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const applySelection = useCallback((): void => {
    if (tempSelected && showTime) {
      const dateWithTime = new Date(tempSelected);
      dateWithTime.setHours(hours, minutes, seconds);

      if (formik && name) {
        const valueToStore = formatter.formatOutput(dateWithTime);
        formik.setFieldValue(name, valueToStore);
      }

      if (onSelect) {
        onSelect(formatter.formatOutput(dateWithTime));
      }
    } else {
      if (formik && name) {
        const valueToStore = formatter.formatOutput(tempSelected);
        formik.setFieldValue(name, valueToStore);
      }

      if (onSelect) {
        onSelect(formatter.formatOutput(tempSelected));
      }
    }

    setIsOpen(false);
  }, [
    formik,
    name,
    onSelect,
    tempSelected,
    formatter,
    showTime,
    hours,
    minutes,
    seconds,
  ]);

  const cancelSelection = useCallback((): void => {
    const initialValue = getInitialValue();
    setTempSelected(initialValue);
    setDisplayMonth(initialValue || new Date());
    if (initialValue) {
      setHours(initialValue.getHours());
      setMinutes(initialValue.getMinutes());
      setSeconds(initialValue.getSeconds());
    }
    setIsOpen(false);
  }, [getInitialValue]);

  const TimeSelector = (): JSX.Element => (
    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Hours
        </label>
        <input
          type="number"
          min="0"
          max="23"
          value={String(hours).padStart(2, "0")}
          onChange={(e) =>
            setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))
          }
          className="px-2 py-2 bg-background border border-input rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Minutes
        </label>
        <input
          type="number"
          min="0"
          max="59"
          value={String(minutes).padStart(2, "0")}
          onChange={(e) =>
            setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
          }
          className="px-2 py-2 bg-background border border-input rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
        />
      </div>
      {showSeconds && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Seconds
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={String(seconds).padStart(2, "0")}
            onChange={(e) =>
              setSeconds(
                Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
              )
            }
            className="px-2 py-2 bg-background border border-input rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          />
        </div>
      )}
    </div>
  );

  const MonthYearSelector = (): JSX.Element => {
    const currentYear = displayMonth.getFullYear();
    const currentMonth = displayMonth.getMonth();
    const monthNames = [
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

    const handleYearChange = (newYear: number) => {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(newYear);
      setDisplayMonth(newDate);
      setTimeout(() => yearInputRef.current?.focus(), 0);
    };

    return (
      <div className="flex gap-3 mb-4 pb-4 border-b border-border">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Month
          </label>
          <select
            value={currentMonth}
            onChange={(e) => {
              const newDate = new Date(displayMonth);
              newDate.setMonth(parseInt(e.target.value));
              setDisplayMonth(newDate);
            }}
            className="px-2 py-2 bg-background border border-input rounded-md text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {monthNames.map((month, idx) => (
              <option key={month} value={idx}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Year
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleYearChange(currentYear - 1)}
              className="p-1.5 bg-muted/50 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center flex-shrink-0 text-muted-foreground"
            >
              <ChevronUp size={16} />
            </button>
            <input
              ref={yearInputRef}
              type="number"
              value={currentYear}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) handleYearChange(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  handleYearChange(currentYear + 1);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  handleYearChange(currentYear - 1);
                }
              }}
              className="flex-1 min-w-0 px-2 py-2 bg-background border border-input rounded-md text-sm text-center text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => handleYearChange(currentYear + 1)}
              className="p-1.5 bg-muted/50 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center flex-shrink-0 text-muted-foreground"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatSelected = useCallback((): string => {
    const displayValue = isOpen ? tempSelected : getInitialValue();
    if (!displayValue) return placeholder;
    return formatter.formatForDisplay(displayValue);
  }, [isOpen, tempSelected, getInitialValue, placeholder, formatter]);

  const handleSelect = useCallback((date: Date | undefined): void => {
    setTempSelected(date);
    if (date) setDisplayMonth(date);
  }, []);

  const getErrorMessage = useCallback((): string | undefined => {
    if (error) return error;
    if (formik && name) {
      const fieldError = formik.errors[name];
      if (typeof fieldError === "string") return fieldError;
      if (fieldError && typeof fieldError === "object")
        return String(fieldError);
    }
    return undefined;
  }, [error, formik, name]);

  const SingleDatePicker = (): JSX.Element => (
    <>
      <MonthYearSelector />
      <div className="mb-4 pb-4 border-b border-border">
        <BaseCalendar
          mode="single"
          selected={tempSelected}
          onSelect={handleSelect}
          fixedWeeks
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          calendarViewOnly={false}
        />
      </div>
      {showTime && <TimeSelector />}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={cancelSelection}
          className="px-3 py-2 border border-input rounded-md text-sm font-medium text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={applySelection}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Apply
        </button>
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-2 relative ${fullWidth ? "w-full" : ""} ${
        className || ""
      }`}
    >
      {label && (
        <label
          style={{ ...labelProps?.labelStyle, ...labelStyle }}
          className={`text-sm font-medium text-foreground mb-1 ${
            labelProps?.className || ""
          }`}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-3 py-2 
          border border-input rounded-md text-sm 
          bg-background hover:bg-muted/50 transition-colors 
          ${fullWidth ? "w-full" : ""} 
          ${isError ? "border-destructive text-destructive" : "text-foreground"}
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
        `}
      >
        <span
          className={
            formatSelected() === placeholder
              ? "text-muted-foreground"
              : "text-foreground"
          }
        >
          {formatSelected()}
        </span>
        <Calendar
          size={18}
          className={isError ? "text-destructive" : "text-muted-foreground"}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-popover border border-border rounded-lg shadow-lg p-4 z-50 min-w-[320px] text-popover-foreground animate-in fade-in-0 zoom-in-95">
          <SingleDatePicker />
        </div>
      )}

      {(helperText || isError) && (
        <p
          {...helperTextProps}
          className={`mt-1 text-xs ${
            isError ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {getErrorMessage() || helperText}
        </p>
      )}
    </div>
  );
};

export default ModernDatePicker;
