"use client";

/**
 * Zagabuy Platform - Role-Based Access Guard
 *
 * Protects pages based on user role.
 * Prevents unauthorized role access and redirects to appropriate dashboard.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import { EnumUtil } from "@/utilities/enumUtil";
import Loader from "@/components/ui/loader";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: number[];
  redirectPath: string;
}

/**
 * RoleGuard component that checks if the user has the required role.
 * If not authorized, redirects to the specified path.
 *
 * @param children - Content to render if authorized
 * @param allowedRoles - Array of roles allowed to access this page (e.g., ["admin"])
 * @param redirectPath - Path to redirect if user doesn't have required role
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectPath,
}: RoleGuardProps) {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isLoading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    // if (isLoading) <Loader />;

    // Get the user's role name and normalize it to lowercase
    const userRole = userInfo?.userRoleId;

    // Check if user's role is in the allowed roles
    if (userRole && !allowedRoles.includes(userRole)) {
      router.replace(redirectPath);
    }
  }, [userInfo, allowedRoles, redirectPath, isLoading, router]);

  // Show nothing while checking authorization
  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
