/**
 * Zagabuy Platform - Time Unit Component
 *
 * Displays a single time unit (days, hours, minutes, seconds) in detailed countdown format
 */

import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";

export interface TimeUnitProps {
  value: number;
  label: string;
}

export function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <Typography
        component="span"
        size="xl"
        weight="semibold"
        className=" tabular-nums leading-none"
      >
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography
        component="span"
        size="xs"
        color="muted-foreground"
        className="uppercase tracking-wide"
      >
        {label}
      </Typography>
    </div>
  );
}
