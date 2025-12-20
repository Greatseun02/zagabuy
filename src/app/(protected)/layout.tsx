"use client";

/**
 * Zagabuy Platform - Protected Routes Layout
 *
 * This layout wraps all protected routes (admin and merchant sections).
 * Uses AuthGuard to ensure users are authenticated before accessing protected pages.
 */

import { AuthGuard } from "@/components/custom/guards/AuthGuard";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
