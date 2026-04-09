"use client";

import React from "react";
import type {ICellRendererParams} from "ag-grid-community";
import {cn} from "@/lib/utils";
import Typography from "@/components/ui/typography";

/**
 * Type-safe parameters for AvatarNameRenderer
 */
export interface AvatarNameRendererParams<TData = any>
    extends ICellRendererParams<TData, any, any> {
    /** Field containing the primary name to display */
    nameField: keyof TData;
    /** Optional field for secondary info (email, role, etc.) */
    secondaryField?: keyof TData;
    /** Optional field for avatar initials */
    avatarField?: keyof TData;
    /** Avatar size */
    avatarSize?: "sm" | "md" | "lg";
    /** Optional URL field for avatar image */
    avatarUrlField?: keyof TData;
    /** Optional custom avatar component */
    avatarRenderer?: (data: TData) => React.ReactNode;
}

/**
 * Generate initials from a name
 */
const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Avatar component with initials or image
 */
interface AvatarProps {
    initials?: string;
    imageUrl?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
                                           initials,
                                           imageUrl,
                                           size = "md",
                                           className,
                                       }) => {
    const sizeStyles = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
    };

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt=""
                className={cn(
                    "rounded-full object-cover flex-shrink-0",
                    sizeStyles[size],
                    className
                )}
                loading="lazy"
            />
        );
    }

    return (
        <div
            className={cn(
                "rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium flex-shrink-0",
                sizeStyles[size],
                className
            )}
        >
            {initials || "?"}
        </div>
    );
};

/**
 * AvatarNameRenderer - Displays avatar + name + secondary info in grid cells
 *
 * Usage:
 * ```tsx
 * {
 *   field: 'user',
 *   cellRenderer: AvatarNameRenderer,
 *   cellRendererParams: {
 *     nameField: 'fullName',
 *     secondaryField: 'email',
 *     avatarField: 'firstName',
 *   } as AvatarNameRendererParams<User>
 * }
 * ```
 */
export const AvatarNameRenderer = <
    TData extends Record<string, any> = Record<string, any>
>(
    props: AvatarNameRendererParams<TData>
) => {
    const {
        data,
        nameField,
        secondaryField,
        avatarField,
        avatarSize = "md",
        avatarUrlField,
        avatarRenderer,
    } = props;

    if (!data) return null;

    // Extract values from row data
    const name = String(data[nameField] || "");
    const secondary = secondaryField ? String(data[secondaryField] || "") : null;
    const avatarValue = avatarField ? String(data[avatarField] || "") : null;
    const avatarUrl = avatarUrlField ? String(data[avatarUrlField] || "") : null;

    // Generate initials
    const initials = avatarValue
        ? getInitials(avatarValue)
        : getInitials(name);

    // Custom avatar renderer
    if (avatarRenderer) {
        const customAvatar = avatarRenderer(data);
        return (
            <div className="flex items-center gap-2">
                {customAvatar}
                <div className="flex flex-col min-w-0">
                    <Typography size="sm" weight="medium" className="truncate">
                        {name}
                    </Typography>
                    {secondary && (
                        <Typography size="xs" color="secondary" className="truncate">
                            {secondary}
                        </Typography>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Avatar
                initials={initials}
                imageUrl={avatarUrl ?? undefined}
                size={avatarSize}
            />
            <div className="flex flex-col min-w-0">
                <Typography
                    size="sm"
                    weight="medium"
                    className="truncate"
                >
                    {name}
                </Typography>
                {secondary && (
                    <Typography
                        size="xs"
                        color="secondary"
                        className="truncate"
                    >
                        {secondary}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default AvatarNameRenderer;
