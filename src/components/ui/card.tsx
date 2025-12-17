"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Card variants using CVA
const cardVariants = cva("relative transition-all duration-200", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground border border-card-border",
      primary: "bg-primary text-primary-foreground border border-primary/20",
      secondary: "bg-secondary text-secondary-foreground border border-input",
      gradient:
        "bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(170,60%,45%)] text-white border-0",
      muted: "bg-muted text-muted-foreground border border-muted/40",
      surface: "bg-background text-foreground border border-card-border",
    },
    size: {
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
    width: {
      auto: "w-auto",
      full: "w-full",
      fit: "w-fit",
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    withHover: {
      disabled: "",
      enabled: "hover:shadow-xl hover:-translate-y-0.5",
    },
  },
  defaultVariants: {
    variant: "surface",
    size: "md",
    width: "auto",
    shadow: "sm",
    rounded: "md",
    withHover: "disabled",
  },
});

export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean; // reserved for future slot usage
  };

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "surface",
      size = "md",
      width = "auto",
      shadow = "sm",
      rounded = "md",
      withHover = "disabled",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            size,
            width,
            shadow,
            rounded,
            withHover,
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };
