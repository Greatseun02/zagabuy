"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { IconRenderProps, IconType } from "@/utilities/types/iconTypes";
import { useIconRenderer } from "@/utilities/helpers/iconRenderer";

export type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps {
  /** Chip content */
  children: React.ReactNode;
  /** Chip color variant */
  color?: ChipColor;
  /** Chip size */
  size?: ChipSize;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Start icon */
  startIcon?: IconType;
  /** End icon */
  endIcon?: IconType;
  /** Props for start icon */
  startIconProps?: IconRenderProps;
  /** Props for end icon */
  endIconProps?: IconRenderProps;
  /** Click handler */
  onClick?: () => void;
  /** Delete/clear handler */
  onDelete?: () => void;
  /** Whether chip is disabled */
  disabled?: boolean;
}

const sizeStyles = {
  sm: "h-6 px-2 text-xs gap-1",
  md: "h-7 px-2.5 text-sm gap-1.5",
  lg: "h-8 px-3 text-sm gap-2",
};

const iconSizes = {
  sm: "0.75rem",
  md: "0.875rem",
  lg: "1rem",
};

const colorStyles: Record<ChipColor, string> = {
  default: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-accent/10 text-accent border-accent/20",
};

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      color = "default",
      size = "md",
      className,
      style,
      startIcon,
      endIcon,
      startIconProps,
      endIconProps,
      onClick,
      onDelete,
      disabled = false,
    },
    ref,
  ) => {
    const { render: renderIcon } = useIconRenderer();

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center border rounded-full font-medium transition-colors",
          sizeStyles[size],
          colorStyles[color],
          onClick && !disabled && "cursor-pointer hover:opacity-80",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        style={style}
        onClick={disabled ? undefined : onClick}
      >
        {startIcon &&
          renderIcon(startIcon, {
            size: iconSizes[size],
            ...startIconProps,
          })}
        <span>{children}</span>
        {endIcon &&
          renderIcon(endIcon, {
            size: iconSizes[size],
            ...endIconProps,
          })}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              "rounded-full p-0.5 hover:bg-foreground/10 transition-colors",
              disabled && "pointer-events-none",
            )}
            disabled={disabled}
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";

// Helper component for X icon
function X({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default Chip;
