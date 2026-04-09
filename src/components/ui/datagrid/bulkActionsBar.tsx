"use client";

import { useState } from "react";
import { Button as BaseButton } from "../button";
import Typography from "../typography";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { IconType } from "@/utilities/types/iconTypes";

/**
 * Bulk action definition
 */
export interface BulkAction<TData = any> {
  /** Label for the action button */
  label: string;
  /** Callback when action is clicked */
  onClick: (selectedRows: TData[]) => void | Promise<void>;
  /** Button variant */
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  /** Optional icon for the action */
  icon?: IconType;
  /** Confirmation message before executing */
  confirmMessage?: string;
  /** Disable the action under certain conditions */
  disabled?: boolean | ((selectedRows: TData[]) => boolean);
}

/**
 * Props for BulkActionsBar
 */
export interface BulkActionsBarProps<TData = any> {
  /** Number of selected rows */
  selectedCount: number;
  /** Actions to display */
  actions: BulkAction<TData>[];
  /** Callback to clear selection */
  onClearSelection: () => void;
  /** Optional label for selected count */
  selectedLabel?: string | ((count: number) => string);
  /** Optional className */
  className?: string;
  /** Optional style */
  style?: React.CSSProperties;
  /** Optional loading state */
  isExecutingAction?: boolean;
  /** Selected row data (for conditional disabling) */
  selectedRows?: TData[];
}

/**
 * BulkActionsBar - Toolbar for multi-select operations in BaseDataGrid
 *
 * Usage:
 * ```tsx
 * <BulkActionsBar
 *   selectedCount={selectedRows.length}
 *   selectedRows={selectedRows}
 *   actions={[
 *     {
 *       label: 'Delete',
 *       variant: 'destructive',
 *       icon: <Trash2 className="w-4 h-4" />,
 *       confirmMessage: 'Are you sure you want to delete these items?',
 *       onClick: async (rows) => {
 *         await deleteItems(rows);
 *         refresh();
 *       },
 *     },
 *   ]}
 *   onClearSelection={() => gridRef.current?.api.deselectAll()}
 * />
 * ```
 */
export const BulkActionsBar = <
  TData extends Record<string, any> = Record<string, any>,
>({
  selectedCount,
  actions,
  onClearSelection,
  selectedLabel,
  className,
  style,
  isExecutingAction = false,
  selectedRows = [],
}: BulkActionsBarProps<TData>) => {
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  // Get display text for selected count
  const getSelectedLabel = () => {
    if (selectedLabel) {
      return typeof selectedLabel === "function"
        ? selectedLabel(selectedCount)
        : selectedLabel;
    }
    return `${selectedCount} selected`;
  };

  // Handle action click
  const handleActionClick = async (action: BulkAction<TData>) => {
    // Check if disabled
    const isDisabled =
      typeof action.disabled === "function"
        ? action.disabled(selectedRows)
        : action.disabled;

    if (isDisabled || isExecutingAction || executingAction !== null) {
      return;
    }

    // Show confirmation if provided
    if (action.confirmMessage && !confirm(action.confirmMessage)) {
      return;
    }

    // Execute action
    setExecutingAction(action.label);
    try {
      await action.onClick(selectedRows);
    } finally {
      setExecutingAction(null);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-3 bg-primary/5 border border-primary/20 rounded-lg",
        "animate-enter",
        className,
      )}
      style={style}
    >
      {/* Selected count */}
      <div className="flex items-center gap-3">
        <Typography size="sm" weight="medium" color="primary">
          {getSelectedLabel()}
        </Typography>
        <div className="h-4 w-px bg-border" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const isDisabled =
            typeof action.disabled === "function"
              ? action.disabled(selectedRows)
              : action.disabled;

          const isLoading =
            isExecutingAction || executingAction === action.label;

          return (
            <BaseButton
              key={index}
              text={action.label}
              variant={action.variant || "secondary"}
              size="small"
              startIcon={action.icon}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled || isLoading}
              isLoading={isLoading}
            />
          );
        })}
      </div>

      {/* Clear selection */}
      <BaseButton
        variant="ghost"
        size="x-small"
        type="button"
        onClick={onClearSelection}
        title="Clear selection"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </BaseButton>
    </div>
  );
};

export default BulkActionsBar;
