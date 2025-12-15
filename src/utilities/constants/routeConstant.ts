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
  dashboard: {
    home: {
      path: "/dashboard",
      name: "Dashboard Overview Screen",
      moduleName: "Dashboard",
      // No access rules = all authenticated users can access
    } as RouteConfig,
  },

  // ==================== Sales Module ====================
};
