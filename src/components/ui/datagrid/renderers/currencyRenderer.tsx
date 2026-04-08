"use client";

import React from "react";
import type {ICellRendererParams} from "ag-grid-community";
import Typography from "@/components/ui/typography/typography";

/**
 * Supported currency codes
 */
export type CurrencyCode = "NGN" | "USD" | "EUR" | "GBP" | "JPY";

/**
 * Currency symbols map
 */
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
};

/**
 * Locale for each currency (for proper number formatting)
 */
const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
    NGN: "en-NG",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
};

/**
 * Type-safe parameters for CurrencyRenderer
 */
export interface CurrencyRendererParams<TData = any>
    extends ICellRendererParams<TData, any, any> {
    /** Currency code */
    currency: CurrencyCode;
    /** Field containing the amount (defaults to value) */
    amountField?: keyof TData;
    /** Tailwind color class for negative values */
    negativeColor?: string;
    /** Tailwind color class for positive values */
    positiveColor?: string;
    /** Show currency symbol */
    showSymbol?: boolean;
    /** Decimal places */
    decimals?: number;
    /** Optional custom format function */
    format?: (amount: number, currency: CurrencyCode) => string;
    /** Optional prefix/suffix instead of symbol */
    prefix?: string;
    suffix?: string;
}

/**
 * Format currency amount
 */
const formatCurrency = (
    amount: number,
    currency: CurrencyCode,
    decimals: number = 2
): string => {
    const locale = CURRENCY_LOCALES[currency];
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
};

/**
 * CurrencyRenderer - Displays formatted currency values with conditional colors
 *
 * Usage:
 * ```tsx
 * {
 *   field: 'amount',
 *   cellRenderer: CurrencyRenderer,
 *   cellRendererParams: {
 *     currency: 'NGN',
 *     negativeColor: 'text-destructive',
 *     positiveColor: 'text-success',
 *     showSymbol: true,
 *     decimals: 2,
 *   } as CurrencyRendererParams<Transaction>
 * }
 * ```
 */
export const CurrencyRenderer = <
    TData extends Record<string, any> = Record<string, any>
>(
    props: CurrencyRendererParams<TData>
) => {
    const {
        value,
        data,
        currency,
        amountField,
        negativeColor = "text-destructive",
        positiveColor = "text-success",
        showSymbol = false,
        decimals = 2,
        format,
        prefix,
        suffix,
    } = props;

    if (!data && !value) return null;

    // Get the amount value
    let amount: number;
    if (amountField && data) {
        amount = Number(data[amountField] || 0);
    } else {
        amount = Number(value || 0);
    }

    // Check if NaN
    if (isNaN(amount)) {
        return <Typography size="sm">-</Typography>;
    }

    // Determine color based on value
    const colorClass = amount < 0 ? negativeColor : positiveColor;

    // Format the amount
    let displayValue: string;
    if (format) {
        displayValue = format(amount, currency);
    } else if (showSymbol) {
        displayValue = formatCurrency(amount, currency, decimals);
    } else {
        // Format without currency symbol
        displayValue = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(Math.abs(amount));
    }

    // Add prefix/suffix if provided
    if (prefix) {
        displayValue = `${prefix}${displayValue}`;
    }
    if (suffix) {
        displayValue = `${displayValue}${suffix}`;
    }

    // Add symbol separately if showSymbol is true and we're not using format
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : "";
    const isNegative = amount < 0;

    return (
        <Typography
            size="sm"
            weight="medium"
            color={isNegative ? ("error" as const) : ("success" as const)}
            className={colorClass}
        >
            {isNegative && "-"}
            {symbol && `${symbol} `}
            {displayValue.replace(/^-/, "")}
        </Typography>
    );
};

export default CurrencyRenderer;
