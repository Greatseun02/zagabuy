"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button as BaseButton } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { DealFilters } from "@/utilities/types";
import {
  useReadDealByStatusQuery,
  useReadDealQuery,
} from "@/services/dealService";
import { useReadcategoryQuery } from "@/services/categoryService";
import { CategoryList } from "./sections/CategoryNavSection";
import { PriceRangeFilter } from "@/components/custom/PriceRangeFilter";
import { SortSelect } from "@/components/custom/SortSelect";
import { DealGridSkeleton } from "@/components/custom/reusable-deals/DealGridSkeleton";
import NotFound from "@/components/ui/NotFound";
import { DealGrid } from "@/components/custom/reusable-deals/DealGrid";
import { NoDealsFound } from "@/components/custom/reusable-deals/NoDealsFound";
import { NoSearchResultsFound } from "@/components/custom/reusable-deals/NoSearchResultsFound";
import DealUtil from "@/utilities/dealUtil";

export default function DealsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<DealFilters>({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("category") || undefined,
    sortBy: (searchParams.get("sort") as DealFilters["sortBy"]) || "trending",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    data: dealsResponse,
    isLoading,
    isError,
    refetch,
  } = useReadDealQuery();
  const { data: categories } = useReadcategoryQuery();

  const allDeals = dealsResponse?.data || [];
  const categoriesList = categories?.data || [];
  const deals = DealUtil.filterAndSort(
    allDeals,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
  );

  const updateFilter = (updates: Partial<DealFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categoryId: undefined,
      sortBy: "trending",
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              {categoriesList && (
                <CategoryList
                  categories={categoriesList}
                  activeCategory={filters.categoryId}
                  onSelect={(id) => updateFilter({ categoryId: id })}
                />
              )}
            </div>

            <Separator />

            <PriceRangeFilter
              minPrice={filters.minPrice ?? null}
              maxPrice={filters.maxPrice ?? null}
              onMinChange={(val) =>
                updateFilter({ minPrice: val ?? undefined })
              }
              onMaxChange={(val) =>
                updateFilter({ maxPrice: val ?? undefined })
              }
            />

            {hasActiveFilters && (
              <>
                <Separator />
                <BaseButton
                  variant="outline"
                  className="w-full"
                  onClick={resetFilters}
                  data-testid="button-reset-filters"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </BaseButton>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold">
                {filters.search
                  ? `Results for "${filters.search}"`
                  : "All Deals"}
              </h1>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {deals.length || 0} deals found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SortSelect
                value={filters.sortBy || "trending"}
                onChange={(val) =>
                  updateFilter({ sortBy: val as DealFilters["sortBy"] })
                }
              />

              {/* Mobile Filters Trigger */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild className="lg:hidden">
                  <BaseButton variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </BaseButton>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* <div>
                      <h3 className="font-semibold mb-3">Categories</h3>
                      {categoriesList && (
                        <CategoryList
                          categories={categoriesList}
                          activeCategory={filters.categoryId}
                          onSelect={(id) => {
                            updateFilter({ categoryId: id });
                            setMobileFiltersOpen(false);
                          }}
                        />
                      )}
                    </div>

                    <Separator /> */}

                    <PriceRangeFilter
                      minPrice={filters.minPrice ?? null}
                      maxPrice={filters.maxPrice ?? null}
                      onMinChange={(val) =>
                        updateFilter({ minPrice: val ?? undefined })
                      }
                      onMaxChange={(val) =>
                        updateFilter({ maxPrice: val ?? undefined })
                      }
                    />

                    {hasActiveFilters && (
                      <BaseButton
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          resetFilters();
                          setMobileFiltersOpen(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reset Filters
                      </BaseButton>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Deals Grid */}
          {isLoading ? (
            <DealGridSkeleton count={12} />
          ) : isError ? (
            <NotFound
              actionButton={{
                text: "Retry",
                onClick: () => {
                  refetch();
                },
              }}
            />
          ) : deals.length > 0 ? (
            <DealGrid deals={deals} />
          ) : filters.search ? (
            <NoSearchResultsFound
              query={filters.search}
              onReset={() => updateFilter({ search: "" })}
            />
          ) : (
            <NoDealsFound onReset={resetFilters} />
          )}
        </main>
      </div>
    </div>
  );
}
