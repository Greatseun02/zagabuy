"use client";

import { CSSProperties, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant = "display" | "text";
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyColor =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "success"
  | "white"
  | "muted"
  | "muted-foreground"
  | "foreground"
  | "accent";
export type TypographyFont = "sans" | "mono";
export type TypographyComponent =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div";

export type TypographyProps = {
  variant?: TypographyVariant;
  size?: TypographySize;
  weight?: TypographyWeight;
  color?: TypographyColor | (string & {});
  font?: TypographyFont;
  component?: TypographyComponent;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  asChild?: boolean;
  startButton?: ReactNode;
  endButton?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
} & Omit<React.HTMLProps<HTMLParagraphElement>, "size" | "color" | "ref">;

// Size mappings for display variant
const displaySizeMap: Record<TypographySize, string> = {
  xs: "text-lg leading-tight",
  sm: "text-xl leading-snug",
  md: "text-2xl leading-snug",
  lg: "text-3xl leading-snug",
  xl: "text-4xl leading-tight",
  "2xl": "text-5xl leading-tight",
};

// Size mappings for text variant
const textSizeMap: Record<TypographySize, string> = {
  xs: "text-xs leading-relaxed",
  sm: "text-sm leading-relaxed",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-relaxed",
  xl: "text-xl leading-relaxed",
  "2xl": "text-2xl leading-relaxed",
};

// Weight mappings
const weightMap: Record<TypographyWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

// Color mappings
const colorMap: Record<TypographyColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  error: "text-destructive",
  warning: "text-yellow-600 dark:text-yellow-400",
  success: "text-green-600 dark:text-green-400",
  white: "text-white",
  muted: "text-muted",
  "muted-foreground": "text-muted-foreground",
  foreground: "text-foreground",
  accent: "text-accent",
};

// Font mappings
const fontMap: Record<TypographyFont, string> = {
  sans: "font-sans",
  mono: "font-mono",
};

// Gap mappings for spacing between text and buttons/icons
const gapMap: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = "text",
      size = "sm",
      weight = "regular",
      color = "foreground",
      font = "sans",
      component = "p",
      children,
      className,
      style,
      asChild,
      startButton,
      endButton,
      startIcon,
      endIcon,
      gap = "sm",
      ...props
    },
    ref
  ) => {
    const Component = component as any;
    const sizeClass =
      variant === "display" ? displaySizeMap[size] : textSizeMap[size];

    // Handle custom color (if it's a hex or rgb value)
    const colorClass = colorMap[color as TypographyColor] || "";
    const textColorStyle =
      !colorMap[color as TypographyColor] && typeof color === "string"
        ? { color }
        : undefined;

    // Check if we need a flex wrapper for buttons/icons
    const hasStartContent = startButton || startIcon;
    const hasEndContent = endButton || endIcon;
    const hasButtonContent = hasStartContent || hasEndContent;

    const combinedClassName = cn(
      "transition-colors duration-200",
      sizeClass,
      weightMap[weight],
      colorClass || "text-foreground",
      fontMap[font],
      className
    );

    const content = (
      <Component
        ref={ref}
        className={combinedClassName}
        style={{ ...textColorStyle, ...style }}
        {...props}
      >
        {children}
      </Component>
    );

    // If there are buttons/icons, wrap in a flex container
    if (hasButtonContent) {
      const wrapperClass = cn(
        "inline-flex items-center",
        gapMap[gap],
        className
      );

      return (
        <div className={wrapperClass} style={style}>
          {hasStartContent && (
            <span className="inline-flex items-center">
              {startIcon && <span>{startIcon}</span>}
              {startButton && <span>{startButton}</span>}
            </span>
          )}
          <Component
            ref={ref}
            className={cn(
              "transition-colors duration-200",
              sizeClass,
              weightMap[weight],
              colorClass || "text-foreground",
              fontMap[font]
            )}
            style={textColorStyle}
            {...props}
          >
            {children}
          </Component>
          {hasEndContent && (
            <span className="inline-flex items-center">
              {endIcon && <span>{endIcon}</span>}
              {endButton && <span>{endButton}</span>}
            </span>
          )}
        </div>
      );
    }

    return content;
  }
);

Typography.displayName = "Typography";

export { Typography };
export default Typography;
