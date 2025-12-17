"use client";

/**
 * Zagabuy Platform - Admin Layout
 *
 * Dashboard layout wrapper for admin pages.
 */

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "../ui/sidebar/admin-sidebar";
import ThemeSwitcher from "../custom/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { useLocation } from "wouter";
import { usePathname } from "next/navigation";
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";

const breadcrumbMap: Record<string, string> = {
  [ROUTES.admin.dashboard.path]: "Dashboard",
  [ROUTES.admin.moderation.path]: "Moderation Queue",
  [ROUTES.admin.merchants.path]: "Merchants",
  [ROUTES.admin.affiliates.path]: "Affiliates",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = usePathname();

  const currentPage = breadcrumbMap[location] || "Dashboard";

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger
            className="-ml-1"
            data-testid="button-sidebar-trigger"
          />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={ROUTES.admin.dashboard.path}>
                  Admin Portal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
