/**
 * Zagabuy Platform - Constants
 *
 * Centralized constants for configuration, validation rules,
 * API endpoints, and UI text. Following DRY principles.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: "/api",
  VERSION: "v1",
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    ME: "/auth/me",
  },
  // Deals
  DEALS: {
    LIST: "/deals",
    DETAIL: (id: string) => `/deals/${id}`,
    CREATE: "/deals",
    UPDATE: (id: string) => `/deals/${id}`,
    DELETE: (id: string) => `/deals/${id}`,
    TRENDING: "/deals/trending",
    FEATURED: "/deals/featured",
    CLICK: (id: string) => `/deals/${id}/click`,
    UPVOTE: (id: string) => `/deals/${id}/upvote`,
    DOWNVOTE: (id: string) => `/deals/${id}/downvote`,
  },
  // Categories
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id: string) => `/categories/${id}`,
  },
  // Tags
  TAGS: {
    LIST: "/tags",
    SEARCH: "/tags/search",
  },
  // Merchant
  MERCHANT: {
    DASHBOARD: "/merchant/dashboard",
    DEALS: "/merchant/deals",
    ANALYTICS: "/merchant/analytics",
    WALLET: "/merchant/wallet",
    TRANSACTIONS: "/merchant/transactions",
    PROFILE: "/merchant/profile",
  },
  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    MODERATION_QUEUE: "/admin/moderation",
    APPROVE_DEAL: (id: string) => `/admin/deals/${id}/approve`,
    REJECT_DEAL: (id: string) => `/admin/deals/${id}/reject`,
    MERCHANTS: "/admin/merchants",
    AFFILIATES: "/admin/affiliates",
    CATEGORIES: "/admin/categories",
    STATS: "/admin/stats",
  },
  // Comments
  COMMENTS: {
    LIST: (dealId: string) => `/deals/${dealId}/comments`,
    CREATE: (dealId: string) => `/deals/${dealId}/comments`,
  },
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  DEAL: {
    TITLE_MIN: 10,
    TITLE_MAX: 120,
    DESCRIPTION_MIN: 50,
    DESCRIPTION_MAX: 2000,
    MAX_IMAGES: 5,
    MIN_PRICE: 0,
    MAX_PRICE: 1000000,
    URL_PATTERN: /^https?:\/\/.+/,
  },
  USER: {
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 128,
  },
  BUSINESS: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    DESCRIPTION_MAX: 500,
  },
  COMMENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
} as const;

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEALS_PER_PAGE: 24,
  COMMENTS_PER_PAGE: 10,
  TRANSACTIONS_PER_PAGE: 50,
} as const;

// ============================================================================
// BILLING & WALLET
// ============================================================================

export const BILLING = {
  DEFAULT_CPC: 0.1, // $0.10 per click
  MIN_CPC: 0.01,
  MAX_CPC: 10.0,
  LOW_BALANCE_THRESHOLD: 5.0,
  MIN_TOP_UP: 10.0,
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
} as const;

// ============================================================================
// UI TEXT CONSTANTS
// ============================================================================

export const UI_TEXT = {
  DEAL_STATUS: {
    draft: "Draft",
    pending: "Pending Review",
    approved: "Live",
    rejected: "Rejected",
    paused: "Paused",
    expired: "Expired",
  },
  ACCOUNT_STATUS: {
    pending: "Pending Approval",
    active: "Active",
    suspended: "Suspended",
    rejected: "Rejected",
  },
  SORT_OPTIONS: {
    newest: "Newest First",
    trending: "Trending",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    discount: "Biggest Discount",
    popular: "Most Popular",
  },
  EMPTY_STATES: {
    NO_DEALS: "No deals found",
    NO_DEALS_DESCRIPTION:
      "Try adjusting your filters or check back later for new deals.",
    NO_RESULTS: "No results for your search",
    NO_TRANSACTIONS: "No transactions yet",
    NO_NOTIFICATIONS: "All caught up!",
  },
  CTA: {
    VISIT_DEAL: "Visit Deal",
    CREATE_DEAL: "Create Deal",
    SAVE_DRAFT: "Save Draft",
    SUBMIT_REVIEW: "Submit for Review",
    APPROVE: "Approve",
    REJECT: "Reject",
    PAUSE: "Pause",
    RESUME: "Resume",
    DELETE: "Delete",
    COPY_CODE: "Copy Code",
    VIEW_ANALYTICS: "View Analytics",
    TOP_UP: "Top Up Wallet",
  },
  SUCCESS: {
    DEAL_CREATED: "Deal created successfully!",
    DEAL_UPDATED: "Deal updated successfully!",
    DEAL_DELETED: "Deal deleted successfully!",
    DEAL_PAUSED: "Deal paused",
    DEAL_RESUMED: "Deal is now live",
    CODE_COPIED: "Promo code copied!",
    PROFILE_UPDATED: "Profile updated successfully!",
  },
  ERRORS: {
    GENERIC: "Something went wrong. Please try again.",
    NETWORK: "Network error. Please check your connection.",
    UNAUTHORIZED: "Please log in to continue.",
    FORBIDDEN: "You don't have permission to do this.",
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION: "Please check your input and try again.",
  },
} as const;

// ============================================================================
// ROUTE PATHS
// ============================================================================

export const ROUTES = {
  // Public Marketplace
  HOME: "/",
  DEALS: "/deals",
  DEAL_DETAIL: (id: string) => `/deals/${id}`,
  CATEGORY: (slug: string) => `/category/${slug}`,
  SEARCH: "/search",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // Merchant Dashboard
  MERCHANT: {
    ROOT: "/merchant",
    DASHBOARD: "/merchant/dashboard",
    DEALS: "/merchant/deals",
    CREATE_DEAL: "/merchant/deals/new",
    EDIT_DEAL: (id: string) => `/merchant/deals/${id}/edit`,
    ANALYTICS: "/merchant/analytics",
    DEAL_ANALYTICS: (id: string) => `/merchant/analytics/${id}`,
    WALLET: "/merchant/wallet",
    PROFILE: "/merchant/profile",
    NOTIFICATIONS: "/merchant/notifications",
  },

  // Admin Portal
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    MODERATION: "/admin/moderation",
    MERCHANTS: "/admin/merchants",
    AFFILIATES: "/admin/affiliates",
    CATEGORIES: "/admin/categories",
    TAGS: "/admin/tags",
    ANALYTICS: "/admin/analytics",
    SETTINGS: "/admin/settings",
  },
} as const;

// ============================================================================
// THEME & STYLING CONSTANTS
// ============================================================================

export const THEME = {
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  SKELETON_COUNT: 6,
} as const;

// ============================================================================
// FEATURE FLAGS (for future remote configuration)
// ============================================================================

export const FEATURES = {
  ENABLE_COMMENTS: true,
  ENABLE_UPVOTES: true,
  ENABLE_SOCIAL_SHARE: true,
  ENABLE_BULK_UPLOAD: false, // Deferred
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
} as const;
