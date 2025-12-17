"use client";

import { useState, useRef, useEffect } from "react";
import { FormUtil } from "@/utilities/formUtil";
import type { Formik } from "@/utilities/types";

interface UseInputFormattingOptions {
  decimalPlaces: number;
  maxNumberValue: number;
  minNumberValue: number;
  allowNegative: boolean;
}

interface UseInputFormattingResult {
  handleWholeNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatWholeNumberDisplay: (value: string | number) => string;
  formatDisplayValue: (value: string | number) => string;
}

/**
 * Hook for handling number input formatting with whole and decimal support
 * Integrates with Formik for form state management
 */
export const useInputFormatting = (
  formik: Formik<any> | undefined,
  fieldName: string | undefined,
  options: UseInputFormattingOptions
): UseInputFormattingResult => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { decimalPlaces, maxNumberValue, minNumberValue, allowNegative } = options;

  const handleWholeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    if (!allowNegative) {
      inputValue = inputValue.replace(/-/g, "");
    }

    inputValue = inputValue.replace(/,/g, "");
    const negativeSignAdded =
      inputValue.includes("-") &&
      !(fieldName && formik?.values[fieldName]).toString().includes("-");

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
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      }
    }

    if (fieldName) formik?.setFieldValue(fieldName, finalValue);
  };

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

    const currentHasNegative = fieldName ? formik?.values[fieldName].toString().includes("-") : false;
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
      if (fieldName) formik?.setFieldValue(fieldName, `0.${"0".repeat(decimalPlaces)}`);
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
      if (fieldName) formik?.setFieldValue(fieldName, `0.${"0".repeat(decimalPlaces)}`);
      return;
    }

    if (fieldName) formik?.setFieldValue(fieldName, `${integerPart}.${decimalPart}`);

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

  return {
    handleWholeNumberChange,
    handleNumberChange,
    formatWholeNumberDisplay,
    formatDisplayValue,
  };
};

/**
 * Hook for managing clipboard copy feedback state
 */
export const useCopyToClipboard = (duration = 3000) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [isCopied, duration]);

  const copyToClipboard = async (text: string) => {
    if (text) {
      setIsCopied(true);
      await navigator.clipboard.writeText(text);
    }
  };

  return { isCopied, copyToClipboard };
};

/**
 * Hook for managing password visibility toggle
 */
export const usePasswordVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible(!isVisible);

  return {
    isVisible,
    toggle,
    type: isVisible ? "text" : "password",
  };
};
