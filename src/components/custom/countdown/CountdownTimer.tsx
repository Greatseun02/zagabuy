/**
 * Zagabuy Platform - Countdown Timer Component
 *
 * Display time remaining until deal expiry with multiple display variants.
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";
import { calculateTimeLeft, isCountdownUrgent } from "./countdownUtil";
import { TimeUnit } from "./TimeUnit";
import type { TimeLeft } from "./countdown.types";
import Typography from "@/components/ui/typography";

export interface CountdownTimerProps {
  expiresAt: string;
  variant?: "default" | "compact" | "detailed";
  showIcon?: boolean;
  className?: string;
}

export function CountdownTimer({
  expiresAt,
  variant = "default",
  showIcon = true,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(expiresAt)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (timeLeft.expired) {
    return (
      <div
        className={cn("flex items-center gap-1.5 text-destructive", className)}
        data-testid="countdown-expired"
      >
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Expired</span>
      </div>
    );
  }

  const isUrgent = isCountdownUrgent(timeLeft);

  if (variant === "compact") {
    let displayText = "";
    if (timeLeft.days > 0) {
      displayText = `${timeLeft.days}d left`;
    } else if (timeLeft.hours > 0) {
      displayText = `${timeLeft.hours}h left`;
    } else {
      displayText = `${timeLeft.minutes}m left`;
    }

    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm",
          isUrgent ? "text-destructive font-medium" : "text-muted-foreground",
          className
        )}
        data-testid="countdown-compact"
      >
        {showIcon && <Clock className="h-3.5 w-3.5" />}
        <span>{displayText}</span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "flex items-center gap-3",
          isUrgent && "text-destructive",
          className
        )}
        data-testid="countdown-detailed"
      >
        {showIcon && (
          <Clock
            className={cn(
              "h-5 w-5",
              isUrgent ? "text-destructive" : "text-muted-foreground"
            )}
          />
        )}

        <div className="flex items-center gap-2">
          {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="Days" />}
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          {timeLeft.days === 0 && (
            <TimeUnit value={timeLeft.seconds} label="Sec" />
          )}
        </div>
      </div>
    );
  }

  // Default variant
  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
  if (timeLeft.minutes > 0 || parts.length === 0)
    parts.push(`${timeLeft.minutes}m`);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        isUrgent ? "text-destructive font-medium" : "text-muted-foreground",
        className
      )}
      data-testid="countdown-default"
    >
      {showIcon && <Clock className="h-4 w-4" />}
      <Typography component="span" size="sm">
        {parts.join(" ")} left
      </Typography>
    </div>
  );
}
