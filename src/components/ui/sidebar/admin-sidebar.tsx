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
import { RouteConstant as ROUTES } from "@/utilities/constants/routeConstant";
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
} from "lucide-react";
import ZagabuyLogo from "@/components/custom/ZagabuyLogo";

const navigationItems = [
  {
    label: "Dashboard",
    href: ROUTES.admin.dashboard.path,
    icon: LayoutDashboard,
  },
  {
    label: "Moderation Queue",
    href: ROUTES.admin.moderation.path,
    icon: ClipboardCheck,
    showBadge: true,
  },
  {
    label: "Merchants",
    href: ROUTES.admin.merchants.path,
    icon: Store,
  },
  {
    label: "Affiliates",
    href: ROUTES.admin.affiliates.path,
    icon: Users,
  },
];

export function AdminSidebar() {
  const location = usePathname();
  const { userInfo: user } = useAppSelector((state) => state.auth);
  //   const { data: moderationQueue } = useGetModerationQueueQuery();

  //   const pendingCount = moderationQueue?.length || 0;
  const pendingCount = 0;
  const adminName = user.userDisplayName || "Admin";

  return (
    <Sidebar data-testid="admin-sidebar">
      <SidebarHeader className="border-b p-4">
        <Link href={ROUTES.app.path}>
          <ZagabuyLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.includes(item.href);

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
                    {item.showBadge && pendingCount > 0 && (
                      <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                        {pendingCount}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {pendingCount > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Pending Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-3 rounded-md bg-warning/10 text-warning">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {pendingCount} item awaiting review
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Quick Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href={ROUTES.deals.path}>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                <ExternalLink className="h-4 w-4" />
                View Marketplace
              </button>
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
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`}
                />
                <AvatarFallback className="text-xs">
                  <Shield className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{adminName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.userEmail || "No Email"}
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
