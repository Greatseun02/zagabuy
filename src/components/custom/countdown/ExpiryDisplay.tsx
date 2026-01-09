/**
 * Zagabuy Platform - Expiry Display Component
 *
 * Smart display of deal expiry information with automatic format selection
 */

import { cn } from "@/lib/utils";
import { CountdownTimer } from "./CountdownTimer";
import { TimeUtil } from "@/utilities/timeUtil";

export interface ExpiryDisplayProps {
  expiresAt?: string;
  className?: string;
}

export function ExpiryDisplay({ expiresAt, className }: ExpiryDisplayProps) {
  if (!expiresAt) {
    return (
      <span
        className={cn("text-sm text-muted-foreground", className)}
        data-testid="no-expiry"
      >
        No expiration
      </span>
    );
  }

  // Calculate days remaining
  const daysRemaining = TimeUtil.differenceInDays(
    TimeUtil.localNow().toJSDate(),
    TimeUtil.parseDateTime(expiresAt).toJSDate()
  );

  // If more than 30 days away, show static date
  if (daysRemaining > 30) {
    return (
      <span
        className={cn("text-sm text-muted-foreground", className)}
        data-testid="expiry-date"
      >
        Expires {TimeUtil.format(expiresAt, "MMM d, yyyy")}
      </span>
    );
  }

  // Otherwise, show countdown timer
  return (
    <CountdownTimer
      expiresAt={expiresAt}
      variant="compact"
      className={className}
    />
  );
}
