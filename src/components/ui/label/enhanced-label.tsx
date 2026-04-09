"use client";

import React, {CSSProperties, SVGProps} from "react";
import {cn} from "@/utilities/helpers/cn";
import type {IconRenderProps, IconType} from "@/utilities/types/iconTypes";
import {useIconRenderer} from "@/utilities/helpers/iconRenderer";

// Default icon components
const RequiredIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M4 0L4.8 2.4H7.2L5.2 3.6L6 6L4 4.8L2 6L2.8 3.6L0.8 2.4H3.2L4 0Z"
            fill="currentColor"
        />
    </svg>
);

const InfoIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.1"/>
        <path
            d="M8 7V11M8 5H8.01M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const WarningIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M8.86603 3.5C8.48113 2.83333 7.51887 2.83333 7.13397 3.5L1.40192 13.25C1.01702 13.9167 1.49815 14.75 2.26795 14.75H13.732C14.5018 14.75 14.983 13.9167 14.5981 13.25L8.86603 3.5Z"
            fill="currentColor"
            opacity="0.1"
        />
        <path
            d="M8 6V9M8 12H8.01M8.86603 3.5C8.48113 2.83333 7.51887 2.83333 7.13397 3.5L1.40192 13.25C1.01702 13.9167 1.49815 14.75 2.26795 14.75H13.732C14.5018 14.75 14.983 13.9167 14.5981 13.25L8.86603 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export type DefaultIconType = "required" | "info" | "warning";

const DEFAULT_ICONS: Record<
    DefaultIconType,
    { component: React.FC<SVGProps<SVGSVGElement>>; defaultColor: string }
> = {
    required: {
        component: RequiredIcon,
        defaultColor: "var(--color-error-500)",
    },
    info: {
        component: InfoIcon,
        defaultColor: "#3b82f6",
    },
    warning: {
        component: WarningIcon,
        defaultColor: "#f59e0b",
    },
};

export interface EnhancedLabelProps {
    /** The label text */
    label?: string;

    /** Default icon type - convenient presets */
    defaultIcon?: DefaultIconType;
    /** Position for the default icon */
    defaultIconPosition?: "start" | "end";
    /** Override default icon size */
    defaultIconSize?: string;
    /** Override default icon color */
    defaultIconColor?: string;
    /** Additional props for default icon */
    defaultIconProps?: IconRenderProps;

    /** Custom icon to display alongside the label */
    icon?: IconType;
    /** Icon position relative to the label */
    iconPosition?: "start" | "end";
    /** Props for the custom icon */
    iconProps?: IconRenderProps;
    /** Custom icon size */
    iconSize?: string;

    /** Custom style for the label container */
    style?: CSSProperties;
    /** Custom style for the label text */
    labelStyle?: CSSProperties;
    /** Additional CSS classes */
    className?: string;

    /** Whether to show both default and custom icons */
    showBothIcons?: boolean;
    /** Gap between icons and text */
    iconGap?: string;

    // Legacy props for backward compatibility
    required?: boolean;
    requiredIcon?: IconType;
    requiredIconSize?: string;
    requiredIconProps?: IconRenderProps;
}

const EnhancedLabel: React.FC<EnhancedLabelProps> = ({
                                                         label,

                                                         // Default icon props
                                                         defaultIcon,
                                                         defaultIconPosition = "end",
                                                         defaultIconSize,
                                                         defaultIconColor,
                                                         defaultIconProps,

                                                         // Custom icon props
                                                         icon,
                                                         iconPosition = "start",
                                                         iconProps,
                                                         iconSize = "1em",

                                                         style,
                                                         labelStyle,
                                                         className,
                                                         showBothIcons = true,
                                                         iconGap = "0.25rem",

                                                         // Legacy props
                                                         required = false,
                                                         requiredIcon,
                                                         requiredIconSize,
                                                         requiredIconProps,
                                                     }) => {
    const {render: renderIcon} = useIconRenderer();

    if (!label) return null;

    const effectiveDefaultIcon = defaultIcon || (required ? "required" : undefined);

    const renderDefaultIcon = () => {
        if (!effectiveDefaultIcon) return null;

        const iconConfig = DEFAULT_ICONS[effectiveDefaultIcon];
        const iconComponent = requiredIcon || iconConfig.component;
        const size = defaultIconSize || requiredIconSize || "0.5em";
        const color = defaultIconColor || iconConfig.defaultColor;

        return renderIcon(iconComponent, {
            ...defaultIconProps,
            ...requiredIconProps,
            size,
            style: {color, ...defaultIconProps?.style, ...requiredIconProps?.style},
        });
    };

    const renderCustomIcon = () => {
        if (!icon) return null;

        return renderIcon(icon, {
            ...iconProps,
            size: iconSize,
        });
    };

    const shouldShowDefaultIcon = !!effectiveDefaultIcon;
    const shouldShowCustomIcon = !!icon;
    const shouldShowBoth = showBothIcons && shouldShowDefaultIcon && shouldShowCustomIcon;

    const startElements: React.ReactNode[] = [];
    const endElements: React.ReactNode[] = [];

    if (shouldShowDefaultIcon && defaultIconPosition === "start") {
        startElements.push(<React.Fragment key="default">{renderDefaultIcon()}</React.Fragment>);
    }
    if (shouldShowDefaultIcon && defaultIconPosition === "end") {
        endElements.push(<React.Fragment key="default">{renderDefaultIcon()}</React.Fragment>);
    }

    if (shouldShowCustomIcon && iconPosition === "start" && (shouldShowBoth || !shouldShowDefaultIcon)) {
        startElements.push(<React.Fragment key="custom">{renderCustomIcon()}</React.Fragment>);
    }
    if (shouldShowCustomIcon && iconPosition === "end" && (shouldShowBoth || !shouldShowDefaultIcon)) {
        endElements.push(<React.Fragment key="custom">{renderCustomIcon()}</React.Fragment>);
    }

    return (
        <div
            className={cn("inline-flex items-center", className)}
            style={{gap: iconGap, ...style}}
        >
            {startElements}
            <span className="text-sm font-medium" style={labelStyle}>
        {label}
      </span>
            {endElements}
        </div>
    );
};

export default EnhancedLabel;
