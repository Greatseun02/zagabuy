"use client";

/**
 * Zagabuy Platform - Merchant Layout
 *
 * Dashboard layout wrapper for merchant pages.
 */

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MerchantSidebar } from "../ui/sidebar/merchant-sidebar";
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
import { usePathname } from "next/navigation";
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";
import LogoutButton from "../custom/LogoutButton";

const breadcrumbMap: Record<string, string> = {
  [ROUTES.merchant.dashboard.path]: "Dashboard",
  [ROUTES.merchant.deals.path]: "My Deals",
  [ROUTES.merchant.deals.createDeal.path]: "Create Deal",
  [ROUTES.merchant.analytics.path]: "Analytics",
  //   [ROUTES.merchant.]: "Wallet & Billing",

  [ROUTES.merchant.profile.path]: "Profile",
};

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export function MerchantLayout({ children }: MerchantLayoutProps) {
  const location = usePathname();

  const currentPage =
    breadcrumbMap[location] || location.split("/").pop() || "Dashboard";

  return (
    <SidebarProvider>
      <MerchantSidebar />
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
                <BreadcrumbLink href={ROUTES.merchant.dashboard.path}>
                  Merchant Portal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center ">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
