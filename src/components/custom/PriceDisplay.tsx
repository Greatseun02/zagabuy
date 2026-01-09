/**
 * Zagabuy Platform - Price Display Component
 *
 * Consistent price formatting with discount display.
 */

import { cn } from "@/lib/utils";
import { CalcUtil } from "@/utilities/calcUtil";
import { DiscountBadge } from "./status-badge";
import { StringUtil } from "@/utilities/stringUtil";

interface PriceDisplayProps {
  price: number;
  oldPrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  oldPrice,
  size = "md",
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercentage = hasDiscount
    ? CalcUtil.discountPercentage(oldPrice, price)
    : 0;

  const sizeClasses = {
    sm: {
      price: "text-base font-semibold",
      oldPrice: "text-xs",
    },
    md: {
      price: "text-xl font-bold",
      oldPrice: "text-sm",
    },
    lg: {
      price: "text-2xl font-bold",
      oldPrice: "text-base",
    },
    xl: {
      price: "text-3xl font-bold",
      oldPrice: "text-lg",
    },
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span
        className={cn(sizeClasses[size].price, "tabular-nums text-foreground")}
        data-testid="text-price"
      >
        {StringUtil.formatCurrency(String(price))}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              sizeClasses[size].oldPrice,
              "line-through text-muted-foreground tabular-nums"
            )}
            data-testid="text-old-price"
          >
            {StringUtil.formatCurrency(String(oldPrice))}
          </span>

          {showBadge && discountPercentage > 0 && (
            <DiscountBadge percentage={discountPercentage} />
          )}
        </>
      )}
    </div>
  );
}
