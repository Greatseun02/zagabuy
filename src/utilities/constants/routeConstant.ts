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

    getStarted: {
      path: "/auth/get-started",
      name: "Get Started Screen",
      moduleName: "authentication",
      isPublic: true,
    } as RouteConfig,

    completeSignup: {
      path: "/auth/complete-signup",
      name: "New Signup Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    newSignup: {
      path: "/auth/signup",
      name: "New Signup Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    completeResetPassword: {
      path: "/auth/complete-reset-password",
      name: "New Signup Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    verifyOtp: {
      name: "",
      path: "/auth/verify-otp",
    },
    newSignupOtp: {
      path: "/auth/new-sign-up/otp",
      name: "New Sign up OTP Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    resetPasswordOtp: {
      path: "/auth/reset-password/otp",
      name: "Reset Password OTP Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    resetPasswordRequest: {
      path: "/auth/reset-password",
      name: "Reset Password Request Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    resetPassword: {
      path: "/auth/reset-password",
      name: "Reset Password Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    resetPasswordSuccess: {
      path: "/auth/reset-password-success",
      name: "Reset Password Screen",
      moduleName: "authentication",
      isPublic: true,
    },
    signupSuccess: {
      path: "/auth/signup-success",
      name: "Signup Success Screen",
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
    } as RouteConfig,
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
