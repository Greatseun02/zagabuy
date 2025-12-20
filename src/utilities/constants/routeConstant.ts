import path from "path";

/**
 * Route configuration type with optional access control
 */
export type RouteConfig = {
  path: string;
  name: string;
  moduleName?: string;

  // Add access rules directly to route config
  // access?: AccessRules;

  // Helper flag for public routes (no auth required)
  isPublic?: boolean;
};

export const RouteConstant = {
  app: {
    path: "/",
    name: "App Screen",
    isPublic: true,
  } as RouteConfig,

  // ==================== Auth Routes (Public) ====================
  auth: {
    unAuthorised: {
      path: "/auth/unauthorized",
      name: "Unauthorized Error",
      moduleName: "authentication",
      isPublic: true,
    } as RouteConfig,
    login: {
      path: "/auth/login",
      name: "Login Screen",
      moduleName: "authentication",
      isPublic: true,
    } as RouteConfig,
    signup: {
      path: "/auth/signup",
      name: "New Signup Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    verifyOtp: {
      name: "Verify Otp",
      path: "/auth/verify-otp",
      moduleName: "authentication",
      isPublic: true,
    },
    forgotPassword: {
      name: "Forgot Password",
      path: "/auth/forgot-password",
      moduleName: "authentication",
      isPublic: true,
    },
  },

  // ==================== Dashboard ====================
  admin: {
    dashboard: {
      path: "/admin/dashboard",
      name: "Dashboard",
      moduleName: "admin",
    } as RouteConfig,
    moderation: {
      path: "/admin/moderation",
      name: "Moderation Queue",
      moduleName: "admin",
    } as RouteConfig,
    merchants: {
      path: "/admin/merchants",
      name: "Merchants",
      moduleName: "admin",
    } as RouteConfig,
    affiliates: {
      path: "/admin/affiliates",
      name: "Affiliates",
      moduleName: "admin",
    } as RouteConfig,
    categories: {
      path: "/admin/categories",
      name: "Categories",
      moduleName: "admin",
    } as RouteConfig,
    tags: {
      path: "/admin/tags",
      name: "Tags",
      moduleName: "admin",
    } as RouteConfig,
  },
  merchant: {
    dashboard: {
      path: "/merchant/dashboard",
      name: "Dashboard",
      moduleName: "merchant",
    } as RouteConfig,
    deals: {
      path: "/merchant/deals",
      name: "My Deals",
      moduleName: "merchant",
      createDeal: {
        path: "/merchant/deals/new",
        name: "Create Deal",
        moduleName: "merchant",
      } as RouteConfig,
    },

    analytics: {
      path: "/merchant/analytics",
      name: "Analytics",
      moduleName: "merchant",
    } as RouteConfig,
    profile: {
      path: "/merchant/profile",
      name: "Profile",
      moduleName: "merchant",
    } as RouteConfig,
  },

  deals: {
    path: "/deals",
    name: "Deals",
    moduleName: "deals",
  },

  // ==================== Sales Module ====================
};
