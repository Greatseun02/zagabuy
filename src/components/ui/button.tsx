"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconType, IconRenderProps } from "@/utilities/types/iconTypes";
import { renderIcon } from "@/utilities/helpers/iconRenderer";

// Loading spinner component (no external dependencies needed)
const LoadingSpinner = ({
  color = "#ffffff",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    className="animate-spin"
  >
    <circle cx="12" cy="12" r="10" opacity="0.3" />
    <path d="M12 2 A 10 10 0 0 1 22 12" strokeLinecap="round" />
  </svg>
);

// Base button variants using CVA for core styling
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 shadow-xs hover:shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 shadow-xs hover:shadow-sm",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-sm hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
        transparent:
          "hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/20",
      },
      size: {
        "x-small": "h-7 px-2 text-xs gap-1.5",
        small: "h-8 px-3 text-sm gap-1.5 has-[>svg]:px-2.5",
        medium: "h-9 px-4 text-sm gap-2 has-[>svg]:px-3",
        large: "h-10 px-6 text-base gap-2 has-[>svg]:px-4",
        icon: "size-9 px-2",
        "icon-sm": "size-8 px-2.5",
        "icon-lg": "size-10 px-4",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      width: "auto",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    /** Can be either an icon component or an object with shape { icon, className, style, ...svgProps } */
    startIcon?: IconType;
    startIconProps?: IconRenderProps;
    endIcon?: IconType;
    endIconProps?: IconRenderProps;
    loadingText?: string;
    loadingSpinnerColor?: string;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      width = "auto",
      asChild = false,
      isLoading = false,
      startIcon: StartIcon,
      startIconProps,
      endIcon: EndIcon,
      endIconProps,
      children,
      disabled,
      loadingText,
      loadingSpinnerColor,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Determine spinner color based on variant
    let spinnerColor = loadingSpinnerColor || "#ffffff";
    if (!loadingSpinnerColor) {
      if (variant === "primary" || variant === "destructive") {
        spinnerColor = "#ffffff";
      } else if (
        variant === "outline" ||
        variant === "ghost" ||
        variant === "transparent"
      ) {
        spinnerColor = "hsl(var(--primary))";
      } else if (variant === "secondary") {
        spinnerColor = "hsl(var(--secondary-foreground))";
      }
    }

    const content = isLoading ? (
      <>
        <LoadingSpinner color={spinnerColor} size={20} />
        {loadingText && <span>{loadingText}</span>}
      </>
    ) : (
      <>
        {StartIcon &&
          renderIcon(StartIcon, {
            ...startIconProps,
            className: cn("shrink-0", startIconProps?.className),
          })}
        {children}
        {EndIcon &&
          renderIcon(EndIcon, {
            ...endIconProps,
            className: cn("shrink-0", endIconProps?.className),
          })}
      </>
    );

    return (
      <Comp
        ref={ref}
        className={cn(
          "cursor-pointer",
          buttonVariants({ variant, size, width }),
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// Exporting for convenience
export { Button, buttonVariants };
