"use client";

import React from "react";
import StatusIndicator from "@/components/custom/statusIndicator";
import {StringUtil} from "@/utilities/stringUtil";
import BaseChip from "@/components/ui/chip/baseChip";
import type {ICellRendererParams} from "ag-grid-community";

export interface StatusConfig {
    color: string;
    backgroundColor: string;
    label?: string;
    icon?: React.ReactNode;
}

/**
 * Mapping of status names (e.g., "active", "pending") to display configuration.
 */
export type StatusMap = Record<string, StatusConfig>;

export interface StatusRendererProps<TData = Record<string, unknown>>
    extends Partial<ICellRendererParams<TData>> {
    /** The raw status string or value */
    value?: string;

    /** The full row data (for AG Grid, etc.) */
    data?: TData;

    /** Optional explicit status value (overrides data.status) */
    status?: string;

    /** Whether to show the colored dot indicator */
    showIndicator?: boolean;

    /** Optional custom map of statuses to display config */
    statusMap?: StatusMap;

    /** Called when the chip is clicked */
    onClick?: (data: TData) => void;

    /** Optional class name for the chip */
    className?: string;

    /** Optional inline styles for the chip */
    style?: React.CSSProperties;
}

// -----------------------------------------------------------------------------
// Default Status Maps — all use CSS variable tokens for theme adaptability
// -----------------------------------------------------------------------------
const createStatusMap = (
    statuses: string[],
    config: Omit<StatusConfig, "label">
): StatusMap =>
    statuses.reduce<StatusMap>((map, status) => {
        map[status] = {
            ...config,
            label: StringUtil.convertToSentenceCase(status),
        };
        return map;
    }, {});

const dangerStatuses = createStatusMap(
    ["rejected", "error", "failed"],
    {
        color: "var(--destructive)",
        backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)",
    }
);

const neutralStatuses = createStatusMap(
    ["inactive", "closed", "deleted", "suspended", "cancelled"],
    {
        color: "var(--muted-foreground)",
        backgroundColor: "color-mix(in srgb, var(--muted-foreground) 10%, transparent)",
    }
);

const pendingStatuses = createStatusMap(
    ["pending", "pending_approval", "waiting", "processing", "draft"],
    {
        color: "var(--warning)",
        backgroundColor: "color-mix(in srgb, var(--warning) 10%, transparent)",
    }
);

const goodStatuses = createStatusMap(
    ["active", "success", "approved", "settled", "matched", "validated"],
    {
        color: "var(--success)",
        backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)",
    }
);

const defaultStatusMap: StatusMap = {
    ...goodStatuses,
    ...pendingStatuses,
    ...dangerStatuses,
    ...neutralStatuses,
    default: {
        color: "var(--muted-foreground)",
        backgroundColor: "color-mix(in srgb, var(--muted-foreground) 10%, transparent)",
        label: "Unknown",
    },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const StatusRenderer = <
    TData extends Record<string, unknown> = Record<string, unknown>
>({
      value,
      data,
      status,
      showIndicator = false,
      statusMap = {},
      onClick,
      className,
      style,
  }: StatusRendererProps<TData>) => {
    // Determine the status string
    const rawStatus =
        status ??
        value ??
        (typeof data === "object" && data && "status" in data
            ? String((data as Record<string, unknown>).status)
            : "");

    const statusValue = String(rawStatus)?.toLowerCase?.().trim?.();
    // Look up configuration
    const statusConfig = statusMap[statusValue] ??
        defaultStatusMap[statusValue] ?? {
            ...defaultStatusMap.default,
            label: StringUtil.convertToSentenceCase(statusValue || "unknown"),
        };

    const handleClick = () => {
        if (onClick && data) onClick(data);
    };

    return (
        <BaseChip
            className={className}
            style={{fontSize: "inherit", ...style}}
            onClick={handleClick}
            color={statusConfig.color}
            backgroundColor={statusConfig.backgroundColor}
            startIcon={
                showIndicator ? (
                    <StatusIndicator status={statusValue} statusMap={statusMap}/>
                ) : undefined
            }
            text={statusConfig.label}
        />
    );
};

export default StatusRenderer;
