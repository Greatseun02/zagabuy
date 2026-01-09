/**
 * Zagabuy Platform - Savings Display Component
 *
 * Display savings amount between old and new price.
 */

import { cn } from "@/lib/utils";
import { CalcUtil } from "@/utilities/calcUtil";
import { StringUtil } from "@/utilities/stringUtil";

interface SavingsDisplayProps {
  oldPrice: number;
  newPrice: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SavingsDisplay({
  oldPrice,
  newPrice,
  className,
  size = "md",
}: SavingsDisplayProps) {
  const savings = CalcUtil.savings(oldPrice, newPrice);

  if (savings <= 0) return null;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn("text-success font-medium", sizeClasses[size], className)}
      data-testid="text-savings"
    >
      You save {StringUtil.formatCurrency(String(savings))}
    </div>
  );
}
