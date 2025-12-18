"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RouteConstant,
  RouteConstant as ROUTES,
} from "@/utilities/constants/routeConstant";
import { useAppSelector } from "@/configs/storeConfig";
// import { useGetModerationQueueQuery } from "@/store/api";
import {
  LayoutDashboard,
  ClipboardCheck,
  Store,
  Users,
  Tag,
  Tags,
  BarChart3,
  Settings,
  Shield,
  ExternalLink,
  LogOut,
  Plus,
  Wallet,
} from "lucide-react";
import ZagabuyLogo from "@/components/custom/ZagabuyLogo";

import { adminSideBarData } from "@/utilities/data/admin-sidebarData";
import { Button } from "../button";
import { merchantSideBarData } from "@/utilities/data/merchant-sidebarData";
import { StringUtil } from "@/utilities/stringUtil";
import { Progress } from "../progress";

export function MerchantSidebar() {
  const location = usePathname();
  const { userInfo: user } = useAppSelector((state) => state.auth);
  //   const { data: wallet } = useGetWalletQuery();

  const merchantName =
    user?.userDisplayName ||
    `${user?.userFirstName} ${user?.userLastName.substring(0, 1)}` ||
    "Merchant";
  //   const walletBalance = wallet?.balance ?? 0;
  const walletBalance = 0;
  //   const lowBalanceThreshold =
  //     wallet?.lowBalanceThreshold ?? BILLING.LOW_BALANCE_THRESHOLD;
  const lowBalanceThreshold = 0;

  const balancePercentage = Math.min((walletBalance / 1000) * 100, 100);
  const isLowBalance = walletBalance < lowBalanceThreshold;

  return (
    <Sidebar data-testid="merchant-sidebar">
      <SidebarHeader className="border-b p-4">
        <Link href={ROUTES.app.path}>
          <ZagabuyLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href={RouteConstant.merchant.dashboard.path}>
              {/* work on */}
              <Button
                className="w-full justify-start gap-2"
                data-testid="button-create-deal"
              >
                <Plus className="h-4 w-4" />
                Create New Deal
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {merchantSideBarData.map((item) => {
                const isActive =
                  location === item.href ||
                  location.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`link-${item.label
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wallet Widget */}
        <SidebarGroup>
          <SidebarGroupLabel>Wallet Balance</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-3 rounded-md bg-sidebar-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    isLowBalance && "text-destructive"
                  )}
                  data-testid="text-sidebar-balance"
                >
                  {StringUtil.formatCurrency(String(walletBalance), "USD")}
                </span>
                {isLowBalance && (
                  <span className="text-xs text-destructive font-medium">
                    Low
                  </span>
                )}
              </div>
              <Progress
                value={balancePercentage}
                className={cn(
                  "h-1.5",
                  isLowBalance && "[&>div]:bg-destructive"
                )}
              />
              <Link href={RouteConstant.merchant.dashboard.path}>
                <Button
                  variant="outline"
                  size="small"
                  width={"full"}
                  className="mt-3"
                  data-testid="button-top-up"
                >
                  <Wallet className="h-3.5 w-3.5 mr-1.5" />
                  Top Up
                </Button>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href={RouteConstant.deals.path}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                View Marketplace
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${merchantName}`}
                />
                <AvatarFallback className="text-xs">
                  {merchantName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{merchantName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.userEmail || "merchant@example.com"}
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
