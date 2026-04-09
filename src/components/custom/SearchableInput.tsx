/**
 * Zagabuy Platform - Search Bar Component
 *
 * Search input with suggestions and filters.
 */

"use client";

import { Input as BaseInput, InputProps } from "@/components/ui/input";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchableInputProps extends InputProps {
  setValue?: (value: string) => void;
}

export function SearchableInput({
  value,
  setValue,
  onChange,
  placeholder = "Search deals...",
  className,
}: SearchableInputProps) {
  const handleClear = () => {
    setValue?.("");
  };

  return (
    <BaseInput
      startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
      {...(value && {
        endIcon: (
          <BaseButton
            type="button"
            variant="secondary"
            size="icon"
            className="h-2 w-2"
            onClick={handleClear}
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </BaseButton>
        ),
      })}
      type="search"
      value={value}
      onChange={(e) => setValue?.(e.target.value)}
      placeholder={placeholder}
      className="pl-10 pr-10 h-11"
      data-testid="input-search"
    />
  );
}
