"use client";

/**
 * Zagabuy Platform - Marketplace Header
 *
 * Public site header with navigation and search.
 */

import { useState } from "react";
import Link from "next/link";
import { Button as BaseButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Store,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/configs/storeConfig";
import { authStore } from "@/stores/authStore";
import { RoleEnum } from "@/utilities/enums/roleEnum";
import ThemeSwitcher from "../custom/ThemeSwitcher";
import { usePathname } from "next/navigation";
import ZagabuyLogo from "../custom/ZagabuyLogo";

interface MarketplaceHeaderProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function Header({ onSearch, className }: MarketplaceHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathName = usePathname();

  const dispatch = useAppDispatch();
  const { userInfo, loading, token } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(authStore.action.logout());
  };

  const getDashboardRoute = () => {
    switch (userInfo?.userRoleId) {
      case RoleEnum.MERCHANT:
        return RouteConstant.merchant.dashboard.path;
      case RoleEnum.AFFILIATE:
        return RouteConstant.merchant.dashboard.path;
      case RoleEnum.ADMIN:
        return RouteConstant.admin.dashboard.path;
      default:
        return RouteConstant.app.path;
    }
  };

  const navItems = [
    { label: "Deals", href: RouteConstant.deals.path, icon: Tag },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className,
      )}
      data-testid="marketplace-header"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={RouteConstant.app.path}>
            <ZagabuyLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <BaseButton
                  variant={pathName === item.href ? "secondary" : "ghost"}
                  size="small"
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </BaseButton>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            {userInfo && token && !loading ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BaseButton
                    variant="transparent"
                    className="gap-2"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.userEmail}`}
                      />
                      <AvatarFallback className="text-xs">
                        {userInfo.userEmail.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">
                      {userInfo.userRoleId === RoleEnum.MERCHANT ||
                      userInfo.userRoleId === RoleEnum.AFFILIATE
                        ? userInfo.userDisplayName
                        : userInfo.userEmail.split("@")[0]}
                    </span>
                  </BaseButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <Typography size="sm" weight="medium">
                      {userInfo.userEmail}
                    </Typography>
                    <Typography
                      size="xs"
                      color="muted-foreground"
                      className="capitalize"
                    >
                      {userInfo.userRoleId === RoleEnum.MERCHANT ||
                      userInfo.userRoleId === RoleEnum.AFFILIATE
                        ? "Merchant"
                        : userInfo.userRoleId === RoleEnum.ADMIN
                          ? "Admin"
                          : "Customer"}
                    </Typography>
                  </div>
                  <DropdownMenuSeparator />

                  {userInfo.userRoleId && (
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardRoute()}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        <Typography size="sm">Dashboard</Typography>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {userInfo.userRoleId === RoleEnum.MERCHANT ||
                    (userInfo.userRoleId === RoleEnum.AFFILIATE && (
                      <DropdownMenuItem asChild>
                        <Link href={RouteConstant.merchant.profile.path}>
                          <User className="h-4 w-4 mr-2" />
                          <Typography size="sm">Profile</Typography>
                        </Link>
                      </DropdownMenuItem>
                    ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <Typography size="sm">Log out</Typography>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href={RouteConstant.auth.login.path}>
                  <BaseButton
                    variant="secondary"
                    size="large"
                    data-testid="button-login"
                  >
                    Login
                  </BaseButton>
                </Link>
                <Link href={RouteConstant.auth.signup.path}>
                  <BaseButton
                    variant="primary"
                    size="large"
                    data-testid="button-register"
                  >
                    Sign Up
                  </BaseButton>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <BaseButton
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </BaseButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-4 pt-7 px-4">
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <BaseButton
                          variant={
                            pathName === item.href ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </BaseButton>
                      </Link>
                    ))}
                  </nav>

                  {userInfo && token && !loading ? (
                    <>
                      <div className="border-t pt-4" />
                      <div className="flex flex-col gap-2">
                        <div className="px-2 py-2">
                          <Typography size="sm" weight="medium">
                            {userInfo.userEmail}
                          </Typography>
                          <Typography
                            size="xs"
                            color="muted-foreground"
                            className="capitalize"
                          >
                            {userInfo.userRoleId === RoleEnum.MERCHANT ||
                            userInfo.userRoleId === RoleEnum.AFFILIATE
                              ? "Merchant"
                              : userInfo.userRoleId === RoleEnum.ADMIN
                                ? "Admin"
                                : "Customer"}
                          </Typography>
                        </div>

                        {userInfo.userRoleId && (
                          <Link href={getDashboardRoute()}>
                            <BaseButton
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4 mr-2" />
                              Dashboard
                            </BaseButton>
                          </Link>
                        )}

                        {userInfo.userRoleId === RoleEnum.MERCHANT ||
                          (userInfo.userRoleId === RoleEnum.AFFILIATE && (
                            <Link href={RouteConstant.merchant.profile.path}>
                              <BaseButton
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <User className="h-4 w-4 mr-2" />
                                Profile
                              </BaseButton>
                            </Link>
                          ))}

                        <BaseButton
                          variant="ghost"
                          className="w-full justify-start text-destructive"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </BaseButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-t pt-4" />
                      <div className="flex flex-col gap-2">
                        <Link href={RouteConstant.auth.login.path}>
                          <BaseButton
                            variant="secondary"
                            className="w-full"
                            data-testid="button-login-mobile"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </BaseButton>
                        </Link>
                        <Link href={RouteConstant.auth.signup.path}>
                          <BaseButton
                            variant="primary"
                            className="w-full"
                            data-testid="button-register-mobile"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign Up
                          </BaseButton>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
