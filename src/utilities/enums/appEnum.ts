/**
 * Account status for merchants and affiliates.
 * Controls platform access and feature availability.
 */
export enum AccountStatusEnum {
  PENDING = "pending", // Awaiting admin approval
  ACTIVE = "active", // Full platform access
  SUSPENDED = "suspended", // Temporarily disabled
  REJECTED = "rejected", // Application denied
}

/**
 * Deal lifecycle status.
 * Determines visibility and actions available.
 */
export enum DealStatusEnum {
  DRAFT = "draft", // Not submitted for review
  PENDING = "pending", // Awaiting moderation
  APPROVED = "approved", // Live on platform
  REJECTED = "rejected", // Moderation failed
  PAUSED = "paused", // Temporarily hidden by owner
  EXPIRED = "expired", // Past expiry date
}

/**
 * Click event types for analytics tracking.
 * Differentiates between billable and non-billable events.
 */
export enum ClickEventTypeEnum {
  OUTBOUND = "outbound", // User clicked "Visit Deal" - billable
  IMPRESSION = "impression", // Deal was displayed - tracked only
  UPVOTE = "upvote", // Social engagement
  DOWNVOTE = "downvote", // Social engagement
  SHARE = "share", // User shared deal
}

/**
 * Billing transaction status.
 * Tracks payment and charge states.
 */
export enum BillingStatusEnum {
  PENDING = "pending", // Transaction initiated
  COMPLETED = "completed", // Successfully processed
  FAILED = "failed", // Processing error
  REFUNDED = "refunded", // Amount returned
}

/**
 * Sort options for deal listings.
 * Used in API queries and UI filters.
 */
export enum DealSortOptionEnum {
  NEWEST = "newest",
  TRENDING = "trending",
  PRICE_LOW = "price_low",
  PRICE_HIGH = "price_high",
  DISCOUNT = "discount",
  POPULAR = "popular",
}
