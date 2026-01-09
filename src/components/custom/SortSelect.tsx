/**
 * Zagabuy Platform - Sort Select Component
 *
 * Dropdown for sorting deals.
 */

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/utilities/constants";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("w-45", className)}
        data-testid="select-sort"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(UI_TEXT.SORT_OPTIONS).map(([key, label]) => (
          <SelectItem key={key} value={key} data-testid={`select-item-${key}`}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
