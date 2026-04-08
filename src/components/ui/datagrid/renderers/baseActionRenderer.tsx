"use client";

import React from "react";
import {StringUtil} from "@/utilities/stringUtil";
import {ColDef, ICellRendererParams} from "ag-grid-community";

/**
 * Note: ICellRendererParams<TData, TValue, TContext> declares `data` as required.
 * To remain compatible we keep a `data` property on our interface but allow `undefined`
 * by typing it `TData | undefined`. This satisfies the structural requirement while
 * preserving the optional semantics callers expect.
 */
export interface ClickableActionRendererProps<
    TData = unknown,
    TValue = string
> extends Omit<ICellRendererParams<TData, TValue, unknown>, "colDef" | "context"> {
    colDef?: ColDef<TData>;
    title: string;
    value: TValue;
    // Present (required) but may be undefined at runtime — compatible with ICellRendererParams
    data: TData | undefined;
    onClick?: (data: TData) => void;
    path?: string;
    isCurrency?: boolean;
    formatAmount?: boolean;
    isDate?: boolean;
    statusIndicator?: "fail" | "success" | "normal";

    // Optional for conditional styling (not from ag-grid)
    onCellClicked?: () => void;
}

export function BaseActionRenderer<TData = unknown, TValue = string>(
    props: ClickableActionRendererProps<TData, TValue>
) {
    const {value, data, onClick, colDef, isCurrency, formatAmount, onCellClicked} = props;

    const greenBadgeText = ["active", "approved"];
    const redBadgeText = ["inactive", "rejected", "closed"];
    const yellowBadgeText = ["pending"];

    const renderFormattedValue = (p: ClickableActionRendererProps<TData, TValue>): string => {
        const valStr = String(p.value ?? "");

        if (p.isCurrency) return StringUtil.formatCurrency(valStr);

        if (p.formatAmount) return StringUtil.formatAmount(valStr);

        if (p.colDef?.field && String(p.colDef.field).toLowerCase() === "drcr") {
            const amount = Number((p.data as { amount?: number })?.amount ?? 0);
            if (amount < 0) return "Reversed";
            return StringUtil.convertToSentenceCase(valStr);
        }

        if (valStr.toLowerCase() === "null") return "...";

        return StringUtil.convertToSentenceCase(valStr);
    };

    const formattedValue = renderFormattedValue(props);
    const lowerValue = String(value ?? "").toLowerCase();

    const handleClick = () => {
        if (onClick && data !== undefined) onClick(data);
    };

    return (
        <div
            className="flex w-full h-full items-center justify-start"
            style={{
                cursor: onClick ? "pointer" : "default",
            }}
            onClick={handleClick}
        >
            <div
                className={[
                    greenBadgeText.includes(lowerValue) ? "badge-active" : "",
                    redBadgeText.includes(lowerValue) ? "badge-inactive" : "",
                    yellowBadgeText.includes(lowerValue) ? "badge-pending" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {onClick || onCellClicked || props.path ? (
                    <a
                        className="table1_link"
                        style={{
                            textDecoration: onCellClicked ? "underline" : "none",
                        }}
                    >
                        {formattedValue}
                    </a>
                ) : (
                    <div>{formattedValue}</div>
                )}
            </div>
        </div>
    );
}

export default BaseActionRenderer;
