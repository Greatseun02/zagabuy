/**
 * Zagabuy Platform - Category List
 *
 * Vertical category list for the marketplace.
 */

import { cn } from "@/lib/utils";
import { CategoryEntity } from "@/models/responses/categoryResponse";
import {
  LayoutGrid,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";

const categoryIcons: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  Wrench,
};

interface CategoryListProps {
  categories: (CategoryEntity & { dealCount: number })[];
  activeCategory?: string;
  onSelect?: (categoryId: string) => void;
  className?: string;
}

export function CategoryList({
  categories,
  activeCategory,
  onSelect,
  className,
}: CategoryListProps) {
  return (
    <div className={cn("space-y-1", className)} data-testid="category-list">
      {categories?.map?.((category) => {
        const Icon = categoryIcons[category.categoryIcon || ""] || LayoutGrid;
        const isActive = activeCategory === category.categoryId.toString();

        return (
          <Button
            key={category.categoryId}
            onClick={() => onSelect?.(category.categoryId.toString())}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors hover-elevate",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
            data-testid={`button-category-list-${category.categorySlug}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm font-medium truncate">
              {category.categoryName}
            </span>
            <span
              className={cn(
                "text-xs tabular-nums",
                isActive
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {category.dealCount}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
