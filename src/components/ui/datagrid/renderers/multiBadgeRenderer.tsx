"use client";

import React from "react";
import type { ICellRendererParams } from "ag-grid-community";
import BaseChip from "@/components/ui/chip/baseChip";
import Typography from "@/components/ui/typography";

/**
 * Badge item structure
 */
export interface BadgeItem {
  label: string;
  color?: string;
  backgroundColor?: string;
}

/**
 * Type-safe parameters for MultiBadgeRenderer
 */
export interface MultiBadgeRendererParams<
  TData = any,
> extends ICellRendererParams<TData, any, any> {
  /** Field containing the array of badges */
  badgeField: keyof TData;
  /** If badges are objects, which field has the label */
  labelField?: string;
  /** If badges are objects, which field has the color */
  colorField?: string;
  /** If badges are objects, which field has the background color */
  bgColorField?: string;
  /** Maximum badges to show before truncating */
  maxVisible?: number;
  /** Badge size (text size) */
  size?: "xs" | "sm" | "md";
  /** Custom renderer for each badge */
  badgeRenderer?: (badge: BadgeItem, index: number) => React.ReactNode;
  /** Truncate text in badges */
  truncateBadgeText?: boolean;
  /** Maximum characters per badge */
  maxBadgeChars?: number;
}

/**
 * MultiBadgeRenderer - Displays multiple badges/tags with truncation
 *
 * Usage:
 * ```tsx
 * {
 *   field: 'tags',
 *   cellRenderer: MultiBadgeRenderer,
 *   cellRendererParams: {
 *     badgeField: 'tags',
 *     labelField: 'name',
 *     colorField: 'color',
 *     maxVisible: 2,
 *     size: 'sm',
 *   } as MultiBadgeRendererParams<User>
 * }
 * ```
 */
export const MultiBadgeRenderer = <
  TData extends Record<string, any> = Record<string, any>,
>(
  props: MultiBadgeRendererParams<TData>,
) => {
  const {
    data,
    value,
    badgeField,
    labelField = "label",
    colorField = "color",
    bgColorField = "backgroundColor",
    maxVisible = 3,
    size = "sm",
    badgeRenderer,
    truncateBadgeText = true,
    maxBadgeChars = 15,
  } = props;

  if (!data) return null;

  // Get the badge array from row data
  const badgeValue = badgeField && data ? (data[badgeField] as any[]) : value;

  if (!badgeValue || !Array.isArray(badgeValue) || badgeValue.length === 0) {
    return <Typography size={size}>-</Typography>;
  }

  // Normalize badge data
  const badges: BadgeItem[] = badgeValue.map((badge, index) => {
    if (typeof badge === "string") {
      return { label: badge };
    }
    if (typeof badge === "object" && badge !== null) {
      return {
        label: String(badge[labelField as keyof typeof badge] || ""),
        color: badge[colorField as keyof typeof badge] as string | undefined,
        backgroundColor: badge[bgColorField as keyof typeof badge] as
          | string
          | undefined,
      };
    }
    return { label: String(badge) };
  });

  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
  }[size];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visibleBadges.map((badge, index) => {
        // Truncate badge text if needed
        let label = badge.label;
        if (truncateBadgeText && label.length > maxBadgeChars) {
          label = label.slice(0, maxBadgeChars) + "...";
        }

        // Use custom renderer if provided
        if (badgeRenderer) {
          return (
            <React.Fragment key={index}>
              {badgeRenderer(badge, index)}
            </React.Fragment>
          );
        }

        return (
          <BaseChip
            key={index}
            text={label}
            color={badge.color}
            backgroundColor={badge.backgroundColor}
            className={sizeClass}
          />
        );
      })}

      {remainingCount > 0 && (
        <Typography size={size} color="secondary" className="px-0.5">
          +{remainingCount}
        </Typography>
      )}
    </div>
  );
};

export default MultiBadgeRenderer;
