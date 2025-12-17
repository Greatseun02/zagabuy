"use client";
import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { FormikValues } from "formik";
import { Eye, Copy, Mail, LockKeyhole, EyeOff } from "lucide-react";
import { FormUtil } from "@/utilities/formUtil";
import Typography from "./typography";
import { cn } from "@/lib/utils";
import { IconType, IconRenderProps } from "@/utilities/types/iconTypes";
import { renderIcon } from "@/utilities/helpers/iconRenderer";
import type { Formik } from "@/utilities/types/index";

export interface InputProps<T extends FormikValues = any>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  // Icon props
  startIcon?: IconType;
  endIcon?: IconType;
  startIconProps?: IconRenderProps;
  endIconProps?: IconRenderProps;

  // Label & helper props
  label?: string;
  radioLabel?: string;
  labelStyle?: CSSProperties;
  labelClassName?: string;
  helperText?: string;
  helperTextClassName?: string;
  error?: string;

  // Container props
  containerStyle?: CSSProperties;
  containerClassName?: string;
  inputContainerStyle?: CSSProperties;
  inputContainerClassName?: string;

  // Icon sizing
  endIconSize?: string | number;
  startIconSize?: string | number;

  // Field name & formik integration
  name?: keyof T;
  formik?: Formik<T>;

  // Number formatting
  formatNumberWithCommas?: boolean;
  formatDecimalNumberWithCommas?: boolean;
  decimalPlaces?: number;
  maxNumberValue?: number;
  minNumberValue?: number;
  allowNegative?: boolean;

  // Checkbox/Radio specific
  checkboxStyle?: CSSProperties;
  radioStyle?: CSSProperties;

  // Textarea
  multiline?: boolean;
  textAreaOptions?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  // Range input
  rangeType?: "percentage" | "number";

  // Copy to clipboard
  copyTextOnly?: boolean;

  // Non-formik state management
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps<any>>(
  (
    {
      // Icon props
      startIcon: StartIcon,
      endIcon: EndIcon,
      startIconProps,
      endIconProps,

      // Label & helper
      label,
      radioLabel,
      labelStyle,
      labelClassName,
      helperText,
      helperTextClassName,
      error,

      // Container
      containerStyle,
      containerClassName,
      inputContainerStyle,
      inputContainerClassName,

      // Sizing
      endIconSize = "1em",
      startIconSize = "1em",

      // Field & formik
      name = "",
      formik,

      // Number formatting
      formatNumberWithCommas = false,
      formatDecimalNumberWithCommas = false,
      decimalPlaces = 2,
      maxNumberValue = 999999999999999,
      minNumberValue = 0,
      allowNegative = false,

      // Checkbox/Radio
      checkboxStyle,
      radioStyle,

      // Textarea
      multiline = false,
      textAreaOptions,

      // Range
      rangeType = "number",

      // Copy
      copyTextOnly = false,

      // State
      value,
      onChange,
      onBlur,

      // Native input props
      className,
      placeholder = "Enter value...",
      type,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCopiedClicked, setIsCopiedClicked] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isError =
      error ||
      (name &&
        formik?.touched[name as string] &&
        formik?.errors[name as string]);

    // Auto-detect icons based on type
    const resolvedStartIcon =
      StartIcon ||
      (type === "password" ? (
        <LockKeyhole />
      ) : type === "email" ? (
        <Mail />
      ) : undefined);

    // Get display value based on formatting
    const getValue = () => {
      if (formik) return formik?.values[name] ?? "";
      return value ?? "";
    };

    // Handle whole number formatting
    const handleWholeNumberChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      let inputValue = e.target.value;
      const cursorPosition = e.target.selectionStart || 0;

      if (!allowNegative) {
        inputValue = inputValue.replace(/-/g, "");
      }

      inputValue = inputValue.replace(/,/g, "");
      const negativeSignAdded =
        inputValue.includes("-") &&
        !formik?.values[name].toString().includes("-");

      const regex = allowNegative ? /[^0-9-]/g : /[^0-9]/g;
      const cleanValue = inputValue.replace(regex, "");
      const negativeCount = (cleanValue.match(/-/g) || []).length;

      let finalValue = cleanValue;
      if (negativeCount > 0) {
        finalValue = "-" + cleanValue.replace(/-/g, "");
      }

      if (!finalValue || finalValue === "-") {
        finalValue = "0";
      }

      const numericValue = parseFloat(finalValue);
      if (numericValue > maxNumberValue || numericValue < minNumberValue) {
        return;
      }

      const numericPart = finalValue.replace("-", "").replace(/^0+/, "");
      finalValue =
        (finalValue.startsWith("-") ? "-" : "") + (numericPart || "0");

      const formattedValue =
        finalValue.replace("-", "").length > 0
          ? (finalValue.startsWith("-") ? "-" : "") +
            FormUtil.formatNumberWithCommas(finalValue.replace("-", ""))
          : "0";

      if (inputRef.current) {
        inputRef.current.value = formattedValue;
        if (negativeSignAdded) {
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(
                cursorPosition,
                cursorPosition
              );
            }
          });
        }
      }

      if (name) formik?.setFieldValue(name as string, finalValue);
    };

    // Handle decimal number formatting
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const oldValue = input.value;
      let inputValue = oldValue;

      if (!allowNegative) {
        inputValue = inputValue.replace(/-/g, "");
      }

      const cursorPosition = input.selectionStart || 0;
      const isBackspace =
        e.nativeEvent instanceof InputEvent &&
        e.nativeEvent.inputType === "deleteContentBackward";

      const currentHasNegative = formik?.values[name].toString().includes("-");
      const inputHasNegative = oldValue.includes("-");

      if (inputHasNegative && !currentHasNegative) {
        inputValue = "-" + inputValue.replace(/-/g, "");
      }

      const isNegative = inputValue.startsWith("-");
      if (isNegative) {
        inputValue = "-" + inputValue.substring(1).replace(/-/g, "");
      }

      const numericPart = inputValue.replace("-", "").replace(/[^0-9]/g, "");
      if (numericPart.length === 0) {
        if (name)
          formik?.setFieldValue(
            name as string,
            `0.${"0".repeat(decimalPlaces)}`
          );
        return;
      }

      const parsedValue = FormUtil.parseFormattedNumber(numericPart).toString();
      const paddedValue = parsedValue.padStart(decimalPlaces, "0");

      const integerPart =
        (isNegative ? "-" : "") + (paddedValue.slice(0, -decimalPlaces) || "0");
      const decimalPart = paddedValue.slice(-decimalPlaces);

      const fullNumericValue = parseFloat(`${integerPart}.${decimalPart}`);
      if (
        fullNumericValue > maxNumberValue ||
        fullNumericValue < minNumberValue
      ) {
        return;
      }

      const formattedIntegerPart = FormUtil.formatNumberWithCommas(
        integerPart.replace("-", "")
      );
      const formattedValue = `${
        isNegative ? "-" : ""
      }${formattedIntegerPart}.${decimalPart}`;

      if (formattedValue === "-0.00") {
        if (name)
          formik?.setFieldValue(
            name as string,
            `0.${"0".repeat(decimalPlaces)}`
          );
        return;
      }

      if (name)
        formik?.setFieldValue(name as string, `${integerPart}.${decimalPart}`);

      requestAnimationFrame(() => {
        if (!inputRef.current) return;

        const oldCommasBeforeCursor = (
          oldValue.slice(0, cursorPosition).match(/,/g) || []
        ).length;
        const newCommasBeforeCursor = (
          formattedValue.slice(0, cursorPosition).match(/,/g) || []
        ).length;

        let newPosition =
          cursorPosition + (newCommasBeforeCursor - oldCommasBeforeCursor);

        if (
          (isBackspace && formattedValue.startsWith("0.")) ||
          formattedValue.startsWith("-0.")
        ) {
          const decimalStartIndex = formattedValue.indexOf(".");
          const decimalDigitStart = decimalStartIndex + 1;
          const endOfDecimal = formattedValue.length;

          if (newPosition <= decimalStartIndex + 2) {
            newPosition = decimalDigitStart + 1;
          }

          newPosition = Math.max(
            decimalDigitStart,
            Math.min(newPosition + 1, endOfDecimal)
          );
        }

        newPosition = Math.max(0, Math.min(newPosition, formattedValue.length));

        inputRef.current.setSelectionRange(newPosition, newPosition);
      });
    };

    // Format display value for whole numbers
    const formatWholeNumberDisplay = (value: string | number) => {
      if (!value) return "0";

      const stringValue = value.toString();
      const isNegative = stringValue.startsWith("-");

      if (stringValue === "0" || stringValue === "-0") return "0";

      const numericValue = stringValue.replace(/[^0-9-]/g, "");
      return numericValue.replace("-", "").length > 0
        ? (isNegative ? "-" : "") +
            FormUtil.formatNumberWithCommas(numericValue.replace("-", ""))
        : "0";
    };

    // Format display value for decimal numbers
    const formatDisplayValue = (value: string | number) => {
      if (!value) return `0.${"0".repeat(decimalPlaces)}`;

      const stringValue = value.toString();
      const isNegative = stringValue.startsWith("-");

      const [integerPart = "0", decimalPart = ""] = stringValue.split(".");

      const formattedIntegerPart =
        integerPart.replace("-", "").length > 0
          ? (isNegative ? "-" : "") +
            FormUtil.formatNumberWithCommas(integerPart.replace("-", ""))
          : "0";

      const formattedDecimalPart = decimalPart
        .padEnd(decimalPlaces, "0")
        .slice(0, decimalPlaces);

      return `${formattedIntegerPart}.${formattedDecimalPart}`;
    };

    // Unified change handler
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (formik) {
        formik?.handleChange(name)(e);
      } else if (onChange) {
        onChange(e);
      }
    };

    // Unified blur handler
    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (formik) {
        name && formik?.handleBlur(name)?.(e);
      } else if (onBlur) {
        onBlur(e);
      }
    };

    // Clear "copied" message after 3 seconds
    useEffect(() => {
      if (isCopiedClicked) {
        const timeout = setTimeout(() => setIsCopiedClicked(false), 3000);
        return () => clearTimeout(timeout);
      }
    }, [isCopiedClicked]);

    // Show range label
    const showRangeLabel = () => {
      if (type === "range" && value !== null && value !== undefined) {
        return `${value}${rangeType === "percentage" ? "%" : ""}`;
      } else if (
        type === "range" &&
        formik?.values?.[name] !== null &&
        formik?.values?.[name] !== undefined
      ) {
        return `${formik?.values?.[name]}${
          rangeType === "percentage" ? "%" : ""
        }`;
      }
      return "";
    };

    // Base input classes
    const baseInputClasses = cn(
      "w-full px-3 py-2 text-sm border rounded-md transition-colors",
      "bg-background border-input text-foreground placeholder:text-muted-foreground",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
      "dark:aria-invalid:ring-destructive/40",
      {
        "pl-10": resolvedStartIcon,
        "pr-10": EndIcon || copyTextOnly || type === "password",
        "border-destructive": isError,
      }
    );

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          isError && "text-destructive",
          containerClassName
        )}
        style={containerStyle}
      >
        {/* Label */}
        {label && type !== "radio" && (
          <label
            className={cn(
              "text-sm font-medium",
              isError && "text-destructive",
              labelClassName
            )}
            style={labelStyle}
          >
            {label} {showRangeLabel()}
          </label>
        )}

        {/* Input Container */}
        <div
          className={cn("relative flex items-center", inputContainerClassName)}
          style={inputContainerStyle}
        >
          {/* Start Icons */}
          {resolvedStartIcon && (
            <div className="absolute left-3 flex items-center justify-center pointer-events-none">
              {renderIcon(resolvedStartIcon, {
                size: startIconSize,
                ...startIconProps,
              })}
            </div>
          )}

          {/* Input Field */}
          {multiline ? (
            <textarea
              className={cn(
                baseInputClasses,
                "min-h-96 resize-vertical font-mono"
              )}
              name={name as string}
              value={getValue()}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={placeholder}
              {...textAreaOptions}
            />
          ) : type === "checkbox" ? (
            <input
              ref={inputRef}
              name={name as string}
              type="checkbox"
              checked={!!formik?.values[name]}
              onChange={(e) =>
                name && formik?.setFieldValue(name as string, e.target.checked)
              }
              style={checkboxStyle}
              onBlur={handleBlur}
              className="w-4 h-4 cursor-pointer accent-primary"
              {...props}
            />
          ) : type === "radio" ? (
            <div className="flex items-center gap-2">
              <input
                id={`${String(name)}-${value}`}
                ref={inputRef}
                name={name as string}
                type="radio"
                value={value}
                checked={formik?.values[name] === value}
                onChange={(e) =>
                  name && formik?.setFieldValue(name as string, e.target.value)
                }
                onBlur={handleBlur}
                style={checkboxStyle}
                className="w-4 h-4 cursor-pointer accent-primary"
                {...props}
              />
              <label
                htmlFor={`${String(name)}-${value}`}
                className="text-sm cursor-pointer hover:text-primary transition-colors"
              >
                {radioLabel}
              </label>
            </div>
          ) : (
            <input
              ref={inputRef}
              name={name as string}
              value={
                formatDecimalNumberWithCommas
                  ? formatDisplayValue(getValue())
                  : formatNumberWithCommas
                  ? formatWholeNumberDisplay(getValue())
                  : getValue()
              }
              onBlur={handleBlur}
              onChange={
                formatDecimalNumberWithCommas
                  ? handleNumberChange
                  : formatNumberWithCommas
                  ? handleWholeNumberChange
                  : handleChange
              }
              {...props}
              className={cn(baseInputClasses, className)}
              type={
                type === "password"
                  ? isPasswordVisible
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
            />
          )}

          {/* End Icons */}
          <div className="absolute right-3 flex items-center justify-center gap-2">
            {copyTextOnly && (
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center p-1 rounded",
                  "hover:bg-accent transition-colors cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                onClick={async () => {
                  const valueToCopy = (getValue() as string).toString();
                  if (valueToCopy) {
                    setIsCopiedClicked(true);
                    await navigator.clipboard.writeText(valueToCopy);
                  }
                }}
              >
                {renderIcon(Copy, {
                  size: endIconSize,
                  ...endIconProps,
                })}
              </button>
            )}

            {type === "password" && (
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center p-1 rounded",
                  "hover:bg-accent transition-colors cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {renderIcon(isPasswordVisible ? <EyeOff /> : <Eye />, {
                  size: endIconSize,
                  ...endIconProps,
                })}
              </button>
            )}

            {EndIcon &&
              renderIcon(EndIcon, {
                size: endIconSize,
                ...endIconProps,
              })}

            {isCopiedClicked && (
              <Typography
                variant="text"
                size="xs"
                className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap animate-pulse"
              >
                Copied!
              </Typography>
            )}
          </div>
        </div>

        {/* Helper/Error Text */}
        {(helperText || isError) && (
          <p
            className={cn(
              "text-xs mt-1",
              isError && "text-destructive",
              helperTextClassName
            )}
          >
            {error ||
              (name && formik?.errors[name as string]?.toString()) ||
              helperText}
          </p>
        )}
      </div>
    );
  }
);

InputComponent.displayName = "Input";

export const Input = InputComponent;
