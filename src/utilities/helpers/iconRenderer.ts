import React from "react";
import { IconType, IconRenderProps } from "@/utilities/types/iconTypes";
import { cn } from "@/lib/utils";

/**
 * Renders icons in multiple formats: components, ReactElements, strings (URLs), or functions
 * Handles both legacy and modern React icon formats
 * @param icon - The icon to render (component, element, string, or function)
 * @param props - Props to apply to the rendered icon
 * @returns Rendered JSX element or null
 */
export const renderIcon = (
  icon?: IconType,
  props?: IconRenderProps
): React.ReactNode => {
  if (!icon) return null;

  // Normalize size props
  const size = props?.size || props?.width || props?.height;
  const width = props?.width || size || "1em";
  const height = props?.height || size || "1em";

  const iconProps = {
    width,
    height,
    ...(props?.className && { className: props.className }),
    ...(props?.style && { style: props.style }),
    ...(props?.alt && { alt: props.alt }),
  };

  // Handle icon object spec: { icon: Component, className?: string, ... }
  if (
    icon &&
    typeof icon === "object" &&
    "icon" in icon &&
    !React.isValidElement(icon)
  ) {
    const {
      icon: IconComponent,
      className: iconClassName,
      style: iconStyle,
      ...rest
    } = icon as any;
    const cleanProps = Object.fromEntries(
      Object.entries(rest || {}).filter(
        ([key]) =>
          !["size", "width", "height", "className", "style", "alt"].includes(
            key
          )
      )
    );

    if (typeof IconComponent === "function") {
      return React.createElement(IconComponent, {
        width,
        height,
        className: cn(props?.className, iconClassName),
        ...(iconStyle && { style: { ...props?.style, ...iconStyle } }),
        ...cleanProps,
      });
    }
  }

  // Handle string-based icons (URLs or base64)
  if (typeof icon === "string") {
    return React.createElement("img", {
      src: icon,
      alt: props?.alt || "icon",
      width,
      height,
      className: props?.className,
      style: props?.style,
    });
  }

  // Handle React components (functions)
  if (typeof icon === "function") {
    const Component = icon as React.ComponentType<any>;
    const cleanProps = Object.fromEntries(
      Object.entries(props || {}).filter(
        ([key]) =>
          !["size", "width", "height", "className", "style", "alt"].includes(
            key
          )
      )
    );
    return React.createElement(Component, {
      width,
      height,
      ...(props?.className && { className: props.className }),
      ...(props?.style && { style: props.style }),
      ...cleanProps,
    });
  }

  // Handle ReactElements (pre-rendered)
  if (React.isValidElement(icon)) {
    const cleanProps = Object.fromEntries(
      Object.entries(props || {}).filter(
        ([key]) =>
          !["size", "width", "height", "className", "style", "alt"].includes(
            key
          )
      )
    );
    return React.cloneElement(icon as React.ReactElement<any>, {
      ...iconProps,
      ...cleanProps,
    });
  }

  return null;
};

/**
 * Utility hook for rendering icons with configuration
 * Can be used in components that need consistent icon rendering
 */
export const useIconRenderer = () => {
  return {
    render: renderIcon,
  };
};

/**
 * Compose multiple icon render props into a single className
 * Useful for applying consistent styles across icon positions
 */
export const getIconClassName = (base?: string, custom?: string): string => {
  return cn("shrink-0", base, custom);
};

/**
 * Merge icon props with defaults
 */
export const mergeIconProps = (
  defaults?: IconRenderProps,
  custom?: IconRenderProps
): IconRenderProps => {
  return {
    ...defaults,
    ...custom,
    className: cn(defaults?.className, custom?.className),
    style: {
      ...defaults?.style,
      ...custom?.style,
    },
  };
};
