import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center border w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40 dark:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-500/40 dark:bg-yellow-600",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs font-medium [&>svg]:size-3",
        sm: "px-2 py-1 text-xs font-medium [&>svg]:size-3.5",
        md: "px-3 py-1.5 text-sm font-medium [&>svg]:size-4",
        lg: "px-4 py-2 text-sm font-semibold [&>svg]:size-5",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xs",
      rounded: "full",
    },
  }
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size, rounded }), className)}
        {...props}
      >
        {startIcon && <span className="shrink-0">{startIcon}</span>}
        {children}
        {endIcon && <span className="shrink-0">{endIcon}</span>}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
