"use client";

import React from "react";
import { Button as BaseButton } from "../../button";
import Typography from "../../typography";
import IconWrapper from "@/components/custom/iconWrapper";
import PaddedWarningIcon from "../../icons/paddedWarningIcon";
import { FileX, RefreshCw } from "lucide-react";
// Helper for className merging
import { cn } from "@/lib/utils";

export type CustomTableEmptyStateProps = {
  error?: { message?: string; code?: string };
  totalRecords?: number;
  onRefresh?: () => void;
  /** Optional custom title for empty state */
  emptyTitle?: string;
  /** Optional custom description for empty state */
  emptyDescription?: string;
  /** Optional custom icon for empty state */
  emptyIcon?: React.ReactNode;
  /** Show action buttons in empty state */
  showActions?: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function CustomTableEmptyState({
  onRefresh,
  emptyTitle = "No Data Found",
  emptyDescription = "There are no records to display. Try adjusting your filters or check back later.",
  emptyIcon,
  showActions = true,
  ...props
}: CustomTableEmptyStateProps) {
  const handleRefreshPage = () => {
    onRefresh?.();
  };

  // Error state
  if (props?.error) {
    return (
      <div
        {...props}
        className={cn(
          "flex flex-col items-center justify-center p-12 gap-4 text-center",
          props?.className,
        )}
      >
        <IconWrapper
          icon={<PaddedWarningIcon />}
          iconColor="var(--color-warning-600)"
          backgroundColor="var(--color-warning-100)"
          outlineColor="var(--color-warning-50)"
        />
        <div className="flex flex-col gap-2">
          <Typography weight="semibold" size="lg" color="error">
            Something went wrong...
          </Typography>
          <Typography
            weight="regular"
            size="sm"
            color="secondary"
            className="max-w-md"
          >
            We had some trouble loading this page. Please refresh to try again
            or contact support if the problem persists.
            {props.error.message && (
              <span className="block mt-2 text-xs text-muted-foreground">
                Error: {props.error.message}
              </span>
            )}
          </Typography>
        </div>
        {showActions && (
          <div className="flex items-center gap-3">
            <BaseButton
              text="Refresh"
              startIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRefreshPage}
            />
          </div>
        )}
      </div>
    );
  }

  // Empty state (no data)
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-center justify-center p-12 gap-4 text-center",
        props?.className,
      )}
    >
      {emptyIcon || (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <FileX className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Typography weight="semibold" size="lg">
          {emptyTitle}
        </Typography>
        <Typography
          weight="regular"
          size="sm"
          color="secondary"
          className="max-w-md"
        >
          {emptyDescription}
        </Typography>
      </div>
      {showActions && onRefresh && (
        <BaseButton
          text="Refresh"
          startIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefreshPage}
          variant="secondary"
        />
      )}
    </div>
  );
}

export default CustomTableEmptyState;
