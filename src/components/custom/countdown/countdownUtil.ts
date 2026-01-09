/**
 * Zagabuy Platform - Countdown Utilities
 *
 * Utility functions for calculating and managing countdown timers
 */

import { TimeUtil } from "@/utilities/timeUtil";
import type { TimeLeft } from "./countdown.types";

/**
 * Calculates the time remaining until a given expiry date
 * @param expiresAt - ISO string of the expiry date
 * @returns Object containing days, hours, minutes, seconds and expired status
 */

export function calculateTimeLeft(expiresAt: string): TimeLeft {
  const endDate = TimeUtil.parseDateTime(expiresAt);
  const now = TimeUtil.localNow();

  // Check if already expired
  if (endDate < now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  // Calculate total seconds remaining
  const totalSeconds = Math.floor(endDate.diff(now, "seconds").seconds);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired: false };
}

/**
 * Formats time remaining into a display string
 * @param timeLeft - TimeLeft object
 * @param format - Format type: 'compact' | 'full'
 * @returns Formatted string representation
 */
export function formatTimeLeft(
  timeLeft: TimeLeft,
  format: "compact" | "full" = "compact"
): string {
  if (timeLeft.expired) {
    return "Expired";
  }

  if (format === "compact") {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d left`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h left`;
    } else {
      return `${timeLeft.minutes}m left`;
    }
  }

  // Full format
  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
  if (timeLeft.minutes > 0 || parts.length === 0)
    parts.push(`${timeLeft.minutes}m`);

  return `${parts.join(" ")} left`;
}

/**
 * Determines if a countdown is in an urgent state (less than 24 hours remaining)
 * @param timeLeft - TimeLeft object
 * @returns Boolean indicating if urgent
 */
export function isCountdownUrgent(timeLeft: TimeLeft): boolean {
  return timeLeft.days === 0 && timeLeft.hours < 24 && !timeLeft.expired;
}
