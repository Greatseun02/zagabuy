import React from "react";
import { cn } from "@/lib/utils";

export type StatusMap = {
  [status: string]: {
    color: string;
    backgroundColor: string;
    label?: string;
    icon?: React.ReactNode;
  };
};

export type StatusIndicatorProps = {
  status: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  // Allow custom status maps
  statusMap?: StatusMap;
};

// Default color mapping — uses base CSS variable tokens for theme adaptability
const defaultStatusColorMap: Record<string, string> = {
  active: "var(--success)",
  success: "var(--success)",
  approved: "var(--success)",
  rejected: "var(--destructive)",
  error: "var(--destructive)",
  closed: "var(--destructive)",
  deleted: "var(--destructive)",
  failed: "var(--destructive)",
  suspended: "var(--destructive)",
  pending: "var(--warning)",
  pending_approval: "var(--warning)",
  waiting: "var(--warning)",
  processing: "var(--warning)",
  draft: "var(--muted-foreground)",
  inactive: "var(--muted-foreground)",
  cancelled: "var(--muted-foreground)",
  default: "var(--muted-foreground)",
  normal: "var(--muted-foreground)",
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 8,
  className,
  style,
  statusMap,
}) => {
  // Normalize status
  const normalizedStatus = status?.toLowerCase() || "default";

  // Determine color - check custom map first, then default map, then our defaults
  let backgroundColor;

  if (statusMap && statusMap[normalizedStatus]?.color) {
    backgroundColor = statusMap[normalizedStatus].color;
  } else {
    backgroundColor =
      defaultStatusColorMap[normalizedStatus] || defaultStatusColorMap.default;
  }

  return (
    <span
      role="img"
      aria-label={`${normalizedStatus} status indicator`}
      className={cn("status-indicator", className)}
      style={{
        backgroundColor,
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-block",
        boxShadow:
          "0 0 4px color-mix(in srgb, var(--foreground) 15%, transparent)",
        transition: "background-color 0.3s ease",
        ...style,
      }}
    />
  );
};

export default StatusIndicator;
export { StatusIndicator };
