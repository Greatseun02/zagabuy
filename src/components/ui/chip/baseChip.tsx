import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type BaseChipProps = {
  text: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
};

const BaseChip: React.FC<BaseChipProps> = ({
  text,
  color = "var(--color-foreground)",
  backgroundColor = "var(--color-muted)",
  startIcon,
  endIcon,
  onClick,
  className,
  style,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full",
        "text-xs font-medium",
        "cursor-pointer border-none",
        "select-none",
        "transition-colors duration-200 ease",
        "whitespace-nowrap",
        "disabled:opacity-60 disabled:cursor-default",
        className,
      )}
      style={{ color, backgroundColor, ...style }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {startIcon && (
        <span className="inline-flex items-center justify-center">
          {startIcon}
        </span>
      )}
      <span className="inline-block leading-none">{text}</span>
      {endIcon && (
        <span className="inline-flex items-center justify-center">
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default BaseChip;
