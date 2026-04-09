/**
 * Zagabuy Platform - Price Range Filter Component
 *
 * Filter input for price range selection.
 */

"use client";

import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PriceRangeFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  className?: string;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  className,
}: PriceRangeFilterProps) {
  return (
    <div
      className={cn("space-y-2", className)}
      data-testid="price-range-filter"
    >
      <label className="text-sm font-medium">Price Range</label>
      <div className="flex items-center gap-2">
        <BaseInput
          type="number"
          placeholder="Min"
          value={minPrice ?? ""}
          onChange={(e) =>
            onMinChange(e.target.value ? Number(e.target.value) : null)
          }
          className="w-24"
          min={0}
          data-testid="input-min-price"
        />
        <span className="text-muted-foreground">—</span>
        <BaseInput
          type="number"
          placeholder="Max"
          value={maxPrice ?? ""}
          onChange={(e) =>
            onMaxChange(e.target.value ? Number(e.target.value) : null)
          }
          className="w-24"
          min={0}
          data-testid="input-max-price"
        />
      </div>
    </div>
  );
}
