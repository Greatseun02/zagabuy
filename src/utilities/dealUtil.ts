/**
 * Zagabuy Platform - Deal Utility Functions
 *
 * Utility functions for sorting and filtering deals
 */

import type { DealEntity } from "@/models/responses/dealResponse";
import {
  isHotDealHelper,
  isTopDealHelper,
  isTrendingDealHelper,
  filterDealsByPriceRange,
} from "./helpers/dealHelper";

export type DealType = "trending" | "top" | "hot";

/**
 * Deal Utility - Static methods for deal operations
 */
export class DealUtil {
  /**
   * Get deals sorted by type
   *
   * @param deals - Array of deals to sort
   * @param dealType - Type of deals to return: "trending" | "top" | "hot"
   * @param length - Number of deals to return
   * @param fallback - If true, sort all deals without strict filtering. If false, only return deals matching the type (default: false)
   * @returns Array of deals filtered and sorted by the specified type
   *
   * @example
   * // Strict mode - only top deals
   * const topDeals = DealUtil.getDealsByType(deals, "top", 10);
   *
   * // Fallback mode - sort all deals by top criteria, return top 10
   * const topDeals = DealUtil.getDealsByType(deals, "top", 10, true);
   */
  static getDealsByType(
    deals: DealEntity[],
    dealType: DealType,
    length: number,
    fallback: boolean = false
  ): DealEntity[] {
    let filteredDeals: DealEntity[] = [];

    switch (dealType) {
      case "hot":
        if (!fallback) {
          filteredDeals = deals.filter((deal) => isHotDealHelper(deal));
        } else {
          filteredDeals = [...deals];
        }
        // Sort by discount percentage (highest first)
        filteredDeals.sort((a, b) => {
          const discountA =
            a.dealOldPrice && a.dealPrice
              ? ((a.dealOldPrice - a.dealPrice) / a.dealOldPrice) * 100
              : 0;
          const discountB =
            b.dealOldPrice && b.dealPrice
              ? ((b.dealOldPrice - b.dealPrice) / b.dealOldPrice) * 100
              : 0;
          return discountB - discountA;
        });
        break;

      case "top":
        if (!fallback) {
          filteredDeals = deals.filter((deal) => isTopDealHelper(deal));
        } else {
          filteredDeals = [...deals];
        }
        // Sort by CTR (Click-Through Rate) - highest first
        filteredDeals.sort((a, b) => {
          const ctrA =
            (a.dealViews || 0) > 0
              ? ((a.clickCount || 0) / (a.dealViews || 1)) * 100
              : 0;
          const ctrB =
            (b.dealViews || 0) > 0
              ? ((b.clickCount || 0) / (b.dealViews || 1)) * 100
              : 0;
          return ctrB - ctrA;
        });
        break;

      case "trending":
        if (!fallback) {
          filteredDeals = deals.filter((deal) => isTrendingDealHelper(deal));
        } else {
          filteredDeals = [...deals];
        }
        // Sort by total views (highest first)
        filteredDeals.sort((a, b) => {
          return (b.dealViews || 0) - (a.dealViews || 0);
        });
        break;

      default:
        filteredDeals = deals;
    }

    // Return only the requested number of deals
    return filteredDeals.slice(0, length);
  }

  /**
   * Check if a deal matches a specific type
   *
   * @param deal - The deal to check
   * @param dealType - Type to check against
   * @returns true if deal matches the specified type
   */
  static isDealType(deal: DealEntity, dealType: DealType): boolean {
    switch (dealType) {
      case "hot":
        return isHotDealHelper(deal);
      case "top":
        return isTopDealHelper(deal);
      case "trending":
        return isTrendingDealHelper(deal);
      default:
        return false;
    }
  }

  /**
   * Sort deals by various sort options
   *
   * @param deals - Array of deals to sort
   * @param sortBy - Sort type: "trending" | "top" | "hot" | "price-low-high" | "price-high-low" | "newest"
   * @returns Sorted array of deals
   *
   * @example
   * const trendingDeals = DealUtil.sortDeals(deals, "trending");
   * const cheapestFirst = DealUtil.sortDeals(deals, "price-low-high");
   */
  static sortDeals(
    deals: DealEntity[],
    sortBy: string = "trending"
  ): DealEntity[] {
    const sorted = [...deals];

    switch (sortBy) {
      case "trending":
        sorted.sort((a, b) => {
          return (b.dealViews || 0) - (a.dealViews || 0);
        });
        break;

      case "top":
        sorted.sort((a, b) => {
          const ctrA =
            (a.dealViews || 0) > 0
              ? ((a.clickCount || 0) / (a.dealViews || 1)) * 100
              : 0;
          const ctrB =
            (b.dealViews || 0) > 0
              ? ((b.clickCount || 0) / (b.dealViews || 1)) * 100
              : 0;
          return ctrB - ctrA;
        });
        break;

      case "hot":
        sorted.sort((a, b) => {
          const discountA =
            a.dealOldPrice && a.dealPrice
              ? ((a.dealOldPrice - a.dealPrice) / a.dealOldPrice) * 100
              : 0;
          const discountB =
            b.dealOldPrice && b.dealPrice
              ? ((b.dealOldPrice - b.dealPrice) / b.dealOldPrice) * 100
              : 0;
          return discountB - discountA;
        });
        break;

      case "price-low-high":
        sorted.sort((a, b) => {
          return (a.dealPrice || 0) - (b.dealPrice || 0);
        });
        break;

      case "price-high-low":
        sorted.sort((a, b) => {
          return (b.dealPrice || 0) - (a.dealPrice || 0);
        });
        break;

      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.dealCreatedAt
            ? new Date(a.dealCreatedAt).getTime()
            : 0;
          const dateB = b.dealCreatedAt
            ? new Date(b.dealCreatedAt).getTime()
            : 0;
          return dateB - dateA;
        });
        break;

      default:
        return sorted;
    }

    return sorted;
  }

  /**
   * Apply filters and sorting to deals (client-side)
   *
   * @param deals - Array of deals to filter and sort
   * @param minPrice - Minimum price filter (optional)
   * @param maxPrice - Maximum price filter (optional)
   * @param sortBy - Sort type (default: "trending")
   * @returns Filtered and sorted array of deals
   *
   * @example
   * const filtered = DealUtil.filterAndSort(deals, 10, 100, "price-low-high");
   */
  static filterAndSort(
    deals: DealEntity[],
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = "trending"
  ): DealEntity[] {
    // Apply price range filter
    let result = filterDealsByPriceRange(deals, minPrice, maxPrice);

    // Apply sorting
    result = this.sortDeals(result, sortBy);

    return result;
  }

  /**
   * Get multiple deal types in one call
   *
   * @param deals - Array of deals to process
   * @param config - Configuration object with dealType and length
   * @param fallback - If true, sort all deals without strict filtering (default: false)
   * @returns Object with deals grouped by type
   *
   * @example
   * // Strict mode
   * const dealGroups = DealUtil.getMultipleTypes(deals, {
   *   hot: 5,
   *   top: 10,
   *   trending: 8
   * });
   *
   * // Fallback mode - sort all deals by type criteria
   * const dealGroups = DealUtil.getMultipleTypes(deals, {
   *   hot: 5,
   *   top: 10,
   *   trending: 8
   * }, true);
   */
  static getMultipleTypes(
    deals: DealEntity[],
    config: Partial<Record<DealType, number>>,
    fallback: boolean = false
  ): Partial<Record<DealType, DealEntity[]>> {
    const result: Partial<Record<DealType, DealEntity[]>> = {};

    if (config.hot) {
      result.hot = this.getDealsByType(deals, "hot", config.hot, fallback);
    }
    if (config.top) {
      result.top = this.getDealsByType(deals, "top", config.top, fallback);
    }
    if (config.trending) {
      result.trending = this.getDealsByType(
        deals,
        "trending",
        config.trending,
        fallback
      );
    }

    return result;
  }
}

export default DealUtil;
