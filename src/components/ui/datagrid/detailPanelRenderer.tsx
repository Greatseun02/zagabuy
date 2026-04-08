"use client";

import React, {useMemo} from "react";
import Typography from "@/components/ui/typography/typography";
import {TimeUtil} from "@/utilities/timeUtil";
import {StringUtil} from "@/utilities/stringUtil";
import BaseChip from "@/components/ui/chip/baseChip";
import StatusRenderer from "./renderers/statusRenderer";
// Helper for className merging
import {cn} from "@/utilities/helpers/cn";

/**
 * Detail panel field configuration
 */
export interface DetailPanelField<TData = any> {
    /** Label to display for this field */
    label: string;
    /** Field key in the data */
    field: keyof TData;
    /** Optional custom format function */
    format?: (value: any, data: TData) => string | React.ReactNode;
    /** Optional type hint for auto-formatting */
    type?: "text" | "date" | "currency" | "boolean" | "status" | "array";
}

/**
 * Props for DefaultDetailPanel
 */
export interface DefaultDetailPanelProps<TData = any> {
    /** The row data to display */
    data: TData;
    /** Fields to display (in order) */
    fields?: Array<DetailPanelField<TData>>;
    /** Number of columns in the grid layout */
    columns?: 1 | 2 | 3 | 4;
    /** Fields to exclude from automatic display */
    excludeFields?: (keyof TData | string)[];
    /** Optional custom header */
    header?: React.ReactNode;
    /** Optional custom footer */
    footer?: React.ReactNode;
    /** Custom className for the panel */
    className?: string;
}

/**
 * Auto-format a value based on type hints
 */
const autoFormatValue = <TData extends Record<string, any>>(
    value: any,
    data: TData,
    type?: string
): React.ReactNode => {
    // Handle null/undefined
    if (value === null || value === undefined) {
        return <Typography size="sm" color="secondary">-</Typography>;
    }

    // Empty arrays
    if (Array.isArray(value) && value.length === 0) {
        return <Typography size="sm" color="secondary">Empty</Typography>;
    }

    // Date type or auto-detected date
    if (type === "date" || (type === undefined && TimeUtil.isValidDate(String(value)))) {
        const dateStr = String(value);
        return (
            <Typography size="sm">
                {TimeUtil.formatDate(new Date(dateStr), "MMM dd, yyyy")}
            </Typography>
        );
    }

    // Boolean type
    if (type === "boolean" || typeof value === "boolean") {
        return (
            <Typography
                size="sm"
                weight="medium"
                color={value ? "success" : "secondary"}
            >
                {value ? "Yes" : "No"}
            </Typography>
        );
    }

    // Status type
    if (type === "status") {
        return <StatusRenderer value={String(value)} data={data}/>;
    }

    // Array type
    if (type === "array" || Array.isArray(value)) {
        const items = Array.isArray(value) ? value : [];
        return (
            <div className="flex flex-wrap gap-1">
                {items.length === 0 ? (
                    <Typography size="sm" color="secondary">Empty</Typography>
                ) : (
                    items.slice(0, 3).map((item, index) => (
                        <BaseChip
                            key={index}
                            text={typeof item === "object" ? JSON.stringify(item) : String(item)}
                            color="var(--foreground)"
                            backgroundColor="var(--muted)"
                            className="text-xs"
                        />
                    ))
                )}
                {items.length > 3 && (
                    <Typography size="xs" color="secondary">
                        +{items.length - 3} more
                    </Typography>
                )}
            </div>
        );
    }

    // Currency type (detect NGN, $, €, £, ¥ symbols or numbers)
    if (type === "currency" || (!isNaN(Number(value)) && String(value).match(/^[₦$€£¥]?\s?[\d,]+\.?\d*$/))) {
        const numValue = Number(value);
        const isNegative = numValue < 0;
        return (
            <Typography
                size="sm"
                weight="medium"
                color={isNegative ? "error" : "success"}
            >
                {StringUtil.formatAmount(String(value))}
            </Typography>
        );
    }

    // Default: text
    const strValue = String(value);
    if (strValue.length > 50) {
        return (
            <Typography size="sm" className="line-clamp-2">
                {strValue}
            </Typography>
        );
    }

    return <Typography size="sm">{strValue}</Typography>;
};

/**
 * DefaultDetailPanel - Displays row data as key-value pairs in a grid layout
 *
 * This component is used for expandable rows in BaseDataGrid.
 *
 * Usage:
 * ```tsx
 * <BaseDataGrid
 *   enableRowExpansion={true}
 *   detailPanelFields={[
 *     { label: 'Description', field: 'description' },
 *     { label: 'Status', field: 'status', type: 'status' },
 *     { label: 'Created', field: 'createdAt', type: 'date' },
 *   ]}
 * />
 * ```
 */
export const DefaultDetailPanel = <
    TData extends Record<string, any> = Record<string, any>
>({
      data,
      fields,
      columns = 2,
      excludeFields = [],
      header,
      footer,
      className,
  }: DefaultDetailPanelProps<TData>) => {
    // Auto-generate fields if not provided
    const displayFields = useMemo(() => {
        if (fields && fields.length > 0) {
            return fields;
        }

        // Auto-generate from data keys
        const dataKeys = Object.keys(data) as (keyof TData)[];
        return dataKeys
            .filter((key) => !excludeFields.includes(String(key)))
            .map((key) => ({
                label: StringUtil.convertToSentenceCase(String(key)),
                field: key,
            })) as DetailPanelField<TData>[];
    }, [data, fields, excludeFields]);

    // Grid layout classes based on column count
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
    }[columns];

    if (displayFields.length === 0) {
        return (
            <div className="p-4 bg-muted border-t border-border">
                <Typography size="sm" color="secondary">
                    No details available
                </Typography>
            </div>
        );
    }

    return (
        <div className={cn("p-4 bg-muted border-t border-border", className)}>
            {/* Optional header */}
            {header && <div className="mb-4">{header}</div>}

            {/* Key-value grid */}
            <div className={cn("grid gap-4", gridCols)}>
                {displayFields.map((fieldConfig, index) => {
                    const value = data[fieldConfig.field];

                    return (
                        <div key={index} className="space-y-1">
                            <Typography size="xs" weight="medium" color="secondary">
                                {fieldConfig.label}
                            </Typography>

                            {/* Use custom format if provided, otherwise auto-format */}
                            {fieldConfig.format ? (
                                <div>{fieldConfig.format(value, data)}</div>
                            ) : (
                                autoFormatValue(value, data, fieldConfig.type)
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Optional footer */}
            {footer && <div className="mt-4">{footer}</div>}
        </div>
    );
};

export default DefaultDetailPanel;
