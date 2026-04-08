"use client";
import React, {CSSProperties, JSX, useCallback, useEffect, useMemo, useState,} from "react";
import CalendarIcon from "@/components/icon/calendarIcon";
import BaseCalendar, {BaseCalendarProps,} from "@/components/ui/calendar/baseCalendar";
import BaseButton from "@/components/ui/button/baseButton";
import Typography from "../typography/typography";
import {FormikProps, FormikValues} from "formik";
import EnhancedLabel, {EnhancedLabelProps,} from "@/components/ui/label/enhancedLabel";
import {DateFormatConfig, DateFormatPresets, DateFormatType, EnhancedTimeUtil,} from "@/utilities/enhancedTimeUtil";
import usePopup from "@/utilities/hooks/usePopup";

export interface HelperTextProps extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
> {
    isLoading?: boolean;
}

export type BaseDatePickerProps<T extends FormikValues = FormikValues> = {
    selected?: unknown;
    onSelect?: (date: unknown) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    showPresetRanges?: boolean;
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
} & Omit<BaseCalendarProps, "selected" | "onSelect" | "mode">;

type PresetName =
    | "Today"
    | "Yesterday"
    | "This week"
    | "Last week"
    | "This month"
    | "Last month"
    | "This year"
    | "Last year";

const BaseDatePicker = <T extends FormikValues = FormikValues>({
                                                                   selected,
                                                                   onSelect,
                                                                   placeholder = "Select date",
                                                                   className,
                                                                   showPresetRanges,
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
                                                                   ...baseCalendarProps
                                                               }: BaseDatePickerProps<T>): JSX.Element => {
    const {
        isOpen,
        setIsOpen,
        toggle,
        setReferenceElement,
        setPopperElement,
        styles: popperStyles,
        attributes,
        containerRef,
    } = usePopup({
        placement: "bottom-start",
        strategy: "fixed", // Position relative to viewport to escape overflow containers
        offset: [0, 8],
    });

    //     usePopup({
    //   placement: "bottom-start",
    //   offset: [0, 8],
    //   flipFallbackPlacements: ["top-start", "top", "bottom-start", "bottom"],
    // });

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
                    ? (preset() as DateFormatConfig<DateFormatType, DateFormatType>)
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

        return {input: "date-object", output: "date-object"};
    }, [dateFormat, useTimestamp]);

    const formatter = useMemo(
        () => EnhancedTimeUtil.createFormatter(resolvedFormat),
        [resolvedFormat],
    );

    const getInitialValue = useCallback((): Date | undefined => {
        if (formik && name && formik.values[name] !== undefined) {
            return formatter.parseInput(formik.values[name]);
        }
        return formatter.parseInput(selected);
    }, [formik, name, selected, formatter]);

    const [tempSelected, setTempSelected] = useState<Date | undefined>(
        getInitialValue(),
    );
    const [displayMonth, setDisplayMonth] = useState<Date>(() => {
        const initialValue = getInitialValue();
        return initialValue || new Date();
    });

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
            }
        }
    }, [getInitialValue, isOpen]);

    const handlePresetClick = useCallback((preset: PresetName): void => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1,
        );

        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);

        const presetMap: Record<PresetName, Date> = {
            Today: today,
            Yesterday: yesterday,
            "This week": thisWeekStart,
            "Last week": lastWeekStart,
            "This month": thisMonthStart,
            "Last month": lastMonthStart,
            "This year": thisYearStart,
            "Last year": lastYearStart,
        };

        const newSelection = presetMap[preset];
        if (newSelection) {
            setTempSelected(newSelection);
            setDisplayMonth(newSelection);
        }
    }, []);

    const applySelection = useCallback((): void => {
        if (formik && name) {
            const valueToStore = formatter.formatOutput(tempSelected);
            formik.setFieldValue(name, valueToStore);
        }

        if (onSelect) {
            onSelect(formatter.formatOutput(tempSelected));
        }

        setIsOpen(false);
    }, [formik, name, onSelect, tempSelected, formatter, setIsOpen]);

    const cancelSelection = useCallback((): void => {
        const initialValue = getInitialValue();
        setTempSelected(initialValue);
        setDisplayMonth(initialValue || new Date());
        setIsOpen(false);
    }, [getInitialValue, setIsOpen]);

    const DatePreset = (): JSX.Element => {
        const presets: PresetName[] = [
            "Today",
            "Yesterday",
            "This week",
            "Last week",
            "This month",
            "Last month",
            "This year",
            "Last year",
        ];

        return (
            <div className="border-r border-gray-200 px-4 py-3 min-w-[150px] bg-white flex flex-col gap-1">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        className="px-4 py-2.5 border-none bg-none text-left cursor-pointer rounded-md text-gray-700 text-sm transition-all duration-150 ease-in hover:bg-gray-50 hover:text-gray-700 focus:font-medium"
                        onClick={() => handlePresetClick(preset)}
                    >
                        {preset}
                    </button>
                ))}
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
        if (date) {
            setDisplayMonth(date);
        }
    }, []);

    const getErrorMessage = useCallback((): string | undefined => {
        if (error) return error;
        if (formik && name) {
            const fieldError = formik.errors[name];
            if (typeof fieldError === "string") {
                return fieldError;
            }
            if (fieldError && typeof fieldError === "object") {
                return String(fieldError);
            }
        }
        return undefined;
    }, [error, formik, name]);

    const SingleDatePicker = (): JSX.Element => {
        return (
            <>
                {showPresetRanges && <DatePreset/>}
                <div>
                    <BaseCalendar
                        mode="single"
                        selected={tempSelected}
                        onSelect={handleSelect}
                        fixedWeeks
                        month={displayMonth}
                        onMonthChange={setDisplayMonth}
                        {...baseCalendarProps}
                        calendarViewOnly={false}
                    />
                    <div
                        className="flex justify-between gap-4 items-center px-4 py-4 border-t border-gray-200 flex-wrap">
                        <BaseButton
                            size="small"
                            text="Cancel"
                            variant="secondary"
                            onClick={cancelSelection}
                        />
                        <BaseButton size="small" text="Apply" onClick={applySelection}/>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div
            className={`relative font-sans flex flex-col gap-1 max-h-max ${className || ""}`}
            ref={containerRef}
        >
            {label && (
                <EnhancedLabel
                    {...labelProps}
                    label={label}
                    labelStyle={{...labelProps?.labelStyle, ...labelStyle}}
                    className={`${labelProps?.className || ""}`}
                />
            )}
            <BaseButton
                type="button"
                variant="secondary"
                size="small"
                text={formatSelected()}
                startIcon={CalendarIcon}
                aria-haspopup="dialog"
                fitToContent={true}
                aria-expanded={isOpen}
                onClick={toggle}
                ref={setReferenceElement}
            />

            {isOpen && (
                <div
                    ref={setPopperElement}
                    style={popperStyles.popper}
                    {...attributes.popper}
                    className="absolute top-full left-0 z-[9999] bg-white rounded-2xl shadow-sm flex overflow-y-hidden max-w-max"
                >
                    <SingleDatePicker/>
                </div>
            )}

            {(helperText || isError) && (
                <Typography
                    {...helperTextProps}
                    weight="regular"
                    color={isError ? "error" : "secondary"}
                    className=""
                >
                    {getErrorMessage() || helperText}
                </Typography>
            )}
        </div>
    );
};

export default BaseDatePicker;
