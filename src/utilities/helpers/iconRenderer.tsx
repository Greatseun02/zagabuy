"use client"
import React from "react";
import {IconConfig, IconRenderProps, IconType, SmartSVGProps} from "@/utilities/types/iconTypes";

/**
 * Default configuration for icon rendering
 */
const DEFAULT_ICON_CONFIG: IconConfig = {
    defaultSize: "1em",
    addDefaultClassName: true,
    defaultClassName: "app-icon",
    defaultProps: {},
};

/**
 * Utility class for consistent icon rendering across the library
 */
export class IconRenderer {
    private static config: IconConfig = DEFAULT_ICON_CONFIG;

    static configure(config: Partial<IconConfig>): void {
        IconRenderer.config = {...IconRenderer.config, ...config};
    }

    static getConfig(): IconConfig {
        return IconRenderer.config;
    }

    /**
     * Render an icon with consistent styling and props
     */
    static render(
        icon: IconType,
        props: IconRenderProps = {},
        localConfig: Partial<IconConfig> = {}
    ): React.ReactElement | null {
        if (!icon) return null;

        const config = {...IconRenderer.config, ...localConfig};
        const mergedProps = {...config.defaultProps, ...props};

        const size = mergedProps.size ?? config.defaultSize;
        const width = mergedProps.width ?? size;
        const height = mergedProps.height ?? size;

        const className = [
            config.addDefaultClassName ? config.defaultClassName : "",
            mergedProps.className || "",
        ]
            .filter(Boolean)
            .join(" ");

        const finalProps = {
            ...mergedProps,
            width,
            height,
            className: className || undefined,
        };

        const {alt, ...domProps} = finalProps;
        return IconRenderer.renderWithAdaptation(icon, domProps, alt);
    }

    /**
     * Render multiple icons with consistent spacing
     */
    static renderGroup(
        icons: Array<{ icon: IconType; props?: IconRenderProps; key?: string | number }>,
        groupProps: {
            spacing?: string;
            direction?: "row" | "column";
            className?: string;
            style?: React.CSSProperties;
        } = {}
    ): React.ReactElement | null {
        const validIcons = icons.filter((item) => item.icon);
        if (validIcons.length === 0) return null;
        if (validIcons.length === 1) return IconRenderer.render(validIcons[0].icon, validIcons[0].props);

        const {spacing = "0.5rem", direction = "row", className = "", style = {}} = groupProps;

        const groupStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: direction,
            gap: spacing,
            alignItems: "center",
            ...style,
        };

        return React.createElement(
            "div",
            {className: `app-icon-group ${className}`.trim(), style: groupStyle},
            validIcons.map((item, index) => (
                <React.Fragment key={item.key ?? index}>
                    {IconRenderer.render(item.icon, item.props)}
                </React.Fragment>
            ))
        );
    }

    /**
     * Type-adaptive rendering logic
     */
    private static renderWithAdaptation(
        icon: NonNullable<IconType>,
        props: Omit<IconRenderProps, "size" | "alt">,
        alt?: string
    ): React.ReactElement {
        // String icons (like image URLs)
        if (typeof icon === "string") {
            return React.createElement("img", {
                src: icon,
                alt: alt || "icon",
                style: {...props.style, width: props.width, height: props.height},
                className: props.className,
            });
        }

        // JSX elements
        if (React.isValidElement(icon)) {
            return IconRenderer.renderReactElement(
                icon as React.ReactElement<Record<string, unknown>>,
                props
            );
        }

        // Function components
        if (typeof icon === "function") {
            return IconRenderer.renderFunctionComponent(icon, props);
        }

        // Objects (React.forwardRef components, lucide-react icons, etc.)
        if (typeof icon === "object" && icon !== null) {
            const iconObj = icon as Record<string, unknown>;

            // Check for React internal type ($$typeof)
            if ("$$typeof" in iconObj) {
                return IconRenderer.renderFunctionComponent(icon as React.ComponentType<any>, props);
            }

            // Object with render method
            if ("render" in iconObj && typeof iconObj.render === "function") {
                return IconRenderer.renderFunctionComponent(iconObj.render as React.ComponentType<any>, props);
            }

            // Try to render as component (for lucide-react and similar)
            try {
                return IconRenderer.renderFunctionComponent(icon as React.ComponentType<any>, props);
            } catch {
                if (typeof window !== "undefined") {
                    console.warn("IconRenderer: Unsupported icon object", icon);
                }
                return React.createElement("span", {className: "app-icon-error"}, "?");
            }
        }

        if (typeof window !== "undefined") {
            console.warn("IconRenderer: Unsupported icon type", typeof icon);
        }
        return React.createElement("span", {className: "app-icon-error"}, "?");
    }

    /**
     * Safely render React elements with proper type checking
     */
    private static renderReactElement(
        element: React.ReactElement<Record<string, unknown>>,
        props: Omit<IconRenderProps, "size" | "alt">
    ): React.ReactElement {
        if (!React.isValidElement(element)) {
            console.warn("IconRenderer: invalid React element passed");
            return element;
        }

        const elementProps = element.props ?? {};

        const elementStyle: React.CSSProperties =
            typeof elementProps["style"] === "object"
                ? ((elementProps["style"] as React.CSSProperties) ?? {})
                : {};

        const elementClassName =
            typeof elementProps["className"] === "string"
                ? (elementProps["className"] as string)
                : "";

        const mergedProps = {
            ...elementProps,
            ...props,
            width: props.width,
            height: props.height,
            className: [elementClassName, props.className].filter(Boolean).join(" ") || undefined,
            style: {...elementStyle, ...props.style},
        };

        return React.cloneElement(element as React.ReactElement<Record<string, unknown>>, mergedProps);
    }


    /**
     * Safely render function components
     */
    private static renderFunctionComponent<P extends Record<string, unknown>>(
        IconComponent: React.ComponentType<P>,
        props: SmartSVGProps
    ): React.ReactElement {
        return React.createElement(IconComponent, props as P);
    }
}

/**
 * Hook for using icon renderer in components with full type safety
 */
export function useIconRenderer(localConfig?: Partial<IconConfig>) {
    return React.useMemo(
        () => ({
            render: (icon: IconType, props?: IconRenderProps) =>
                IconRenderer.render(icon, props, localConfig),
            renderGroup: (
                icons: Array<{ icon: IconType; props?: IconRenderProps; key?: string | number }>,
                groupProps?: Parameters<typeof IconRenderer.renderGroup>[1]
            ) => IconRenderer.renderGroup(icons, groupProps),
            config: IconRenderer.getConfig(),
        }),
        [localConfig]
    );
}

/** Simple render function for direct use */
export const renderIcon = IconRenderer.render.bind(IconRenderer);

export default IconRenderer;
