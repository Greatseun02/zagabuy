import React from "react";
import StatusIndicator, {StatusMap} from "@/components/custom/statusIndicator";
import BaseChip from "@/components/ui/chip/baseChip";
import type {ICellRendererParams} from "ag-grid-community";

export type StatusRendererProps = {
    value?: any;
    data?: any;
    status?: string;
    showIndicator?: boolean;
    statusMap?: StatusMap;
    onClick?: (data: any) => void;
    className?: string;
    style?: React.CSSProperties;
} & Partial<ICellRendererParams>;

const baddishStatuses = {
    statuses: ["rejected", "closed", "deleted", "error", "failed", "inactive"],
    config: {
        color: "var(--color-error-700)",
        backgroundColor: "var(--color-error-50)",
    },
};
const pendingStatuses = {
    statuses: ["pending", "waiting", "processing"],
    config: {
        color: "var(--color-warning-700)",
        backgroundColor: "var(--color-warning-50)",
    },
};
const goodishStatuses = {
    statuses: ["active", "success"],
    config: {
        color: "var(--color-success-700)",
        backgroundColor: "var(--color-success-100)",
    },
};

// Helper to convert to sentence case
const convertToSentenceCase = (str: string): string => {
    return str
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
};

const getStatusDefaults = (
    statuses: string[],
    config: StatusMap[""]
): StatusMap => {
    const statusMap: StatusMap = {};
    statuses.forEach((status) => {
        statusMap[status] = {
            color: config?.color,
            backgroundColor: config?.backgroundColor,
            label: convertToSentenceCase(status),
        };
    });
    return statusMap;
};

const defaultStatusMap: StatusMap = {
    ...getStatusDefaults(goodishStatuses.statuses, goodishStatuses.config),
    ...getStatusDefaults(pendingStatuses.statuses, pendingStatuses.config),
    ...getStatusDefaults(baddishStatuses.statuses, baddishStatuses.config),
    // ... other statuses
    default: {
        color: "var(--color-gray-700)",
        backgroundColor: "var(--color-gray-100)",
        label: "Unknown",
    },
};

const StatusRenderer: React.FC<StatusRendererProps> = (props) => {
    const {
        value,
        data,
        showIndicator = true,
        statusMap = {},
        onClick,
        className,
        style,
    } = props;

    // Get the status value - check multiple possible sources
    const statusValue = String(value || data?.status || "")
        .toLowerCase()
        .trim();

    // Get the status configuration
    const statusConfig = statusMap[statusValue] ||
        defaultStatusMap[statusValue] || {
            ...defaultStatusMap.default,
            label: convertToSentenceCase(statusValue),
        };

    const handleClick = () => {
        if (onClick) {
            onClick(data);
        }
    };

    return (
        <BaseChip
            className={className}
            style={{fontSize: "inherit", ...style}}
            onClick={handleClick}
            color={statusConfig?.color ?? ""}
            backgroundColor={statusConfig?.backgroundColor ?? ""}
            startIcon={
                showIndicator ? (
                    <StatusIndicator status={statusValue} statusMap={statusMap}/>
                ) : undefined
            }
            text={
                statusConfig?.label || convertToSentenceCase(statusValue)
            }
        />
    );
};

export default StatusRenderer;
