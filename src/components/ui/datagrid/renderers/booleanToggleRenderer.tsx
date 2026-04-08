"use client";

import React, {useCallback, useState} from "react";
import type {ICellRendererParams} from "ag-grid-community";
import Typography from "@/components/ui/typography/typography";
import {cn} from "@/utilities/helpers/cn";
import {confirm} from "@/components/ui/modal/niceModal";

/**
 * Type-safe parameters for BooleanToggleRenderer
 */
export interface BooleanToggleRendererParams<TData = any>
    extends ICellRendererParams<TData, any, any> {
    /** Field containing the boolean value (defaults to value) */
    booleanField?: keyof TData;
    /** Callback when toggle is clicked */
    onToggle: (data: TData, newValue: boolean) => void | Promise<void>;
    /** Toggle size */
    size?: "sm" | "md";
    /** Disable the toggle */
    disabled?: boolean | ((data: TData) => boolean);
    /** Confirm before toggling - can be a string or function that returns a string */
    confirmMessage?: string | ((data: TData) => string);
    /** Confirm dialog title */
    confirmTitle?: string;
    /** Show "Yes"/"No" text instead of toggle */
    showText?: boolean;
    /** Custom labels for true/false */
    trueLabel?: string;
    falseLabel?: string;
    /** Confirm variant */
    confirmVariant?: "error" | "warning" | "success" | "default";
}

/**
 * BooleanToggleRenderer - Displays a toggle switch for boolean states
 *
 * Usage:
 * ```tsx
 * {
 *   field: 'isActive',
 *   cellRenderer: BooleanToggleRenderer,
 *   cellRendererParams: {
 *     booleanField: 'isActive',
 *     onToggle: async (app) => {
 *       await updateAppStatus(app.id, !app.isActive);
 *       refetch();
 *     },
 *     size: 'sm',
 *     confirmMessage: 'Are you sure you want to change this status?',
 *     confirmTitle: 'Change Status',
 *     confirmVariant: 'warning',
 *   } as BooleanToggleRendererParams<App>
 * }
 * ```
 */
export const BooleanToggleRenderer = <
    TData extends Record<string, any> = Record<string, any>
>(
    props: BooleanToggleRendererParams<TData>
) => {
    const {
        value,
        data,
        booleanField,
        onToggle,
        size = "sm",
        disabled = false,
        confirmMessage,
        confirmTitle,
        confirmVariant = "default",
        showText = false,
        trueLabel = "Active",
        falseLabel = "Inactive",
    } = props;

    const [isToggling, setIsToggling] = useState(false);

    if (!data) return null;

    // Get the boolean value
    const boolValue = booleanField
        ? Boolean(data[booleanField])
        : Boolean(value);

    // Check if disabled
    const isDisabled = typeof disabled === "function" ? disabled(data) : disabled;

    const handleToggle = useCallback(async () => {
        if (isDisabled || isToggling) return;

        const newValue = !boolValue;

        // Get the confirmation message (could be string or function)
        const message = typeof confirmMessage === "function"
            ? confirmMessage(data)
            : confirmMessage;

        // Show confirmation if message provided
        if (message) {
            const confirmed = await confirm({
                title: confirmTitle || "Confirm Action",
                message: message,
                confirmText: newValue ? trueLabel : falseLabel,
                cancelText: "Cancel",
                variant: confirmVariant,
                onConfirmAction: async () => {
                    await onToggle(data, newValue);
                },
            });
            return;
        }

        // No confirmation needed - toggle directly
        setIsToggling(true);
        try {
            await onToggle(data, newValue);
        } finally {
            setIsToggling(false);
        }
    }, [
        isDisabled,
        isToggling,
        boolValue,
        confirmMessage,
        confirmTitle,
        confirmVariant,
        trueLabel,
        falseLabel,
        onToggle,
        data,
    ]);

    // Text display mode
    if (showText) {
        return (
            <Typography
                size="sm"
                color={boolValue ? "success" : "secondary"}
                weight="medium"
            >
                {boolValue ? trueLabel : falseLabel}
            </Typography>
        );
    }

    // Toggle switch
    const sizeStyles = {
        sm: "w-8 h-4",
        md: "w-10 h-5",
    };

    const thumbSizeStyles = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
    };

    const thumbTranslate = {
        sm: boolValue ? "translate-x-4" : "translate-x-0.5",
        md: boolValue ? "translate-x-5" : "translate-x-0.5",
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isDisabled || isToggling}
            className={cn(
                // Base styles
                "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                // Size
                sizeStyles[size],
                // Colors
                boolValue ? "bg-primary" : "bg-muted-foreground/30",
                // Disabled
                (isDisabled || isToggling) && "opacity-50 cursor-not-allowed"
            )}
            aria-pressed={boolValue}
            aria-label={boolValue ? trueLabel : falseLabel}
        >
      <span
          className={cn(
              "pointer-events-none inline-block rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
              thumbSizeStyles[size],
              thumbTranslate[size]
          )}
      />
        </button>
    );
};

export default BooleanToggleRenderer;
