"use client";

/**
 * Zagabuy Platform - Authentication Guard
 *
 * Protects pages that require authentication.
 * Redirects unauthenticated users to the deals page.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";
import Loader from "@/components/ui/loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    // If not loading and no token, redirect to deals page
    if (!isLoading && !token) {
      router.replace(ROUTES.deals.path);
    }
  }, [token, isLoading, router]);

  // Show loader while checking authentication or while redirecting
  if (isLoading) return <Loader />;

  if (!token) {
    return <Loader />;
  }

  return <>{children}</>;
}
