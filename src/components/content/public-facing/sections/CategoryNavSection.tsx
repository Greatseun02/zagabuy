"use client";

import { useState } from "react";
import { useReadcategoryQuery } from "@/services/categoryService";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button as BaseButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import type { CategoryEntity } from "@/models/responses/categoryResponse";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import Link from "next/link";

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

interface CategoryNavProps {
  categories: CategoryEntity[];
  activeCategory?: string;
  onSelect?: (categoryId: string | null) => void;
  showCounts?: boolean;
  className?: string;
}

export function CategoryNav({
  categories,
  activeCategory,
  onSelect,
  showCounts = true,
  className,
}: CategoryNavProps) {
  const handleCategoryClick = (categoryId: string | null) => {
    if (onSelect) {
      onSelect(categoryId);
    }
  };

  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex items-center gap-2 pb-3" data-testid="category-nav">
        {/* All Deals Button */}
        <Link href={RouteConstant.deals.path}>
          <BaseButton
            variant={!activeCategory ? "primary" : "outline"}
            size="medium"
            onClick={() => handleCategoryClick(null)}
            className="shrink-0"
            data-testid="button-all-categories"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            All Deals
          </BaseButton>
        </Link>

        {/* Category Buttons */}
        {categories?.map?.((category) => {
          const Icon = categoryIcons[category.categoryName || ""] || LayoutGrid;
          const isActive = activeCategory === category.categoryId.toString();

          return (
            <Link
              href={`${RouteConstant.deals.path}?category=${category.categorySlug}`}
            >
              <BaseButton
                key={category.categoryId}
                variant={isActive ? "primary" : "outline"}
                size="medium"
                onClick={() =>
                  handleCategoryClick(category.categoryId.toString())
                }
                className="shrink-0 gap-2"
                data-testid={`button-category-${category.categorySlug}`}
              >
                <Icon className="h-4 w-4" />
                {category.categoryName}
              </BaseButton>
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

interface CategoryListProps {
  categories: CategoryEntity[];
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
        const Icon = categoryIcons[category.categoryName || ""] || LayoutGrid;
        const isActive = activeCategory === category.categoryId.toString();

        return (
          <button
            key={category.categoryId}
            onClick={() => onSelect?.(category.categoryId.toString())}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors hover-elevate",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
            data-testid={`button-category-list-${category.categorySlug}`}
          >
            <span className="flex-1 text-sm font-medium truncate">
              {category.categoryName}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function CategoryNavSection() {
  const { data: categoriesResponse, isLoading } = useReadcategoryQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const categories =
    categoriesResponse?.data && categoriesResponse.data.length > 0
      ? categoriesResponse.data
      : [];

  return (
    <section className="container mx-auto px-4 py-8">
      {!isLoading && categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategory={selectedCategory || undefined}
          onSelect={handleCategorySelect}
          showCounts={false}
        />
      )}
    </section>
  );
}
