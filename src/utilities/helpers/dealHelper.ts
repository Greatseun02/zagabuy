/**
 * Zagabuy Platform - Deal Helper Functions
 *
 * Helper functions to determine deal categories (hot, top, trending)
 */

import type { DealEntity } from "@/models/responses/dealResponse";

/**
 * Determines if a deal qualifies as a "Hot Deal"
 * Based on discount percentage - deals with significant discounts are hot
 *
 * @param deal - The deal entity to check
 * @param discountThreshold - Minimum discount percentage (default: 30%)
 * @returns true if deal is a hot deal
 */
export function isHotDealHelper(
  deal: DealEntity,
  discountThreshold: number = 30
): boolean {
  if (!deal.dealOldPrice || !deal.dealPrice) {
    return false;
  }

  const discountPercentage =
    ((deal.dealOldPrice - deal.dealPrice) / deal.dealOldPrice) * 100;

  return discountPercentage >= discountThreshold;
}

/**
 * Determines if a deal qualifies as a "Top Deal"
 * Based on engagement metrics - high clicks, views, and CTR
 *
 * @param deal - The deal entity to check
 * @param clickThreshold - Minimum click count (default: 50)
 * @param viewThreshold - Minimum view count (default: 300)
 * @param ctrThreshold - Minimum CTR percentage (default: 15%)
 * @returns true if deal is a top deal
 */
export function isTopDealHelper(
  deal: DealEntity,
  clickThreshold: number = 50,
  viewThreshold: number = 300,
  ctrThreshold: number = 15
): boolean {
  const clickCount = deal.clickCount || 0;
  const dealViews = deal.dealViews || 0;

  // Need sufficient engagement to be a top deal
  if (clickCount < clickThreshold || dealViews < viewThreshold) {
    return false;
  }

  // Calculate Click-Through Rate
  const ctr = dealViews > 0 ? (clickCount / dealViews) * 100 : 0;

  return ctr >= ctrThreshold;
}

/**
 * Determines if a deal qualifies as "Trending"
 * Based on recency and recent engagement
 *
 * @param deal - The deal entity to check
 * @param recentViews - Minimum recent views (default: 100)
 * @returns true if deal is trending
 */
export function isTrendingDealHelper(
  deal: DealEntity,
  recentViews: number = 100
): boolean {
  const dealViews = deal.dealViews || 0;

  // Simple trending metric: deals with steady engagement are trending
  return dealViews >= recentViews;
}

/**
 * Filters deals by price range
 *
 * @param deals - Array of deals to filter
 * @param minPrice - Minimum price (optional)
 * @param maxPrice - Maximum price (optional)
 * @returns Filtered array of deals within price range
 *
 * @example
 * const affordableDeals = filterDealsByPriceRange(deals, 0, 100);
 * const dealsUnder50 = filterDealsByPriceRange(deals, undefined, 50);
 */
export function filterDealsByPriceRange(
  deals: DealEntity[],
  minPrice?: number,
  maxPrice?: number
): DealEntity[] {
  return deals.filter((deal) => {
    const price = deal.dealPrice || 0;

    if (minPrice !== undefined && price < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && price > maxPrice) {
      return false;
    }

    return true;
  });
}
