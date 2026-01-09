/**
 * Zagabuy Platform - Wallet Display Component
 *
 * Display wallet balance and related information.
 */

import { cn } from "@/lib/utils";
import { StringUtil } from "@/utilities/stringUtil";
import { Wallet as WalletIcon } from "lucide-react";

interface WalletDisplayProps {
  balance: number;
  currency?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WalletDisplay({
  balance,
  currency = "NGN",
  showIcon = true,
  size = "md",
  className,
}: WalletDisplayProps) {
  const sizeClasses = {
    sm: {
      icon: "h-4 w-4",
      text: "text-sm",
    },
    md: {
      icon: "h-5 w-5",
      text: "text-base",
    },
    lg: {
      icon: "h-6 w-6",
      text: "text-lg",
    },
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        sizeClasses[size].text,
        className
      )}
      data-testid="wallet-display"
    >
      {showIcon && (
        <WalletIcon
          className={cn("text-muted-foreground", sizeClasses[size].icon)}
        />
      )}
      <span className="font-semibold text-foreground">
        {StringUtil.formatCurrency(String(balance), currency)}
      </span>
    </div>
  );
}
