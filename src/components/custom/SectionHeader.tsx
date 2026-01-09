/**
 * Zagabuy Platform - Hero Section
 *
 * Landing page hero with featured deals showcase.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { ArrowRight, Zap, Shield, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const stats = [
    { icon: Zap, value: "10,000+", label: "Active Deals" },
    { icon: Users, value: "50,000+", label: "Happy Shoppers" },
    { icon: Shield, value: "500+", label: "Verified Merchants" },
    { icon: TrendingUp, value: "$2M+", label: "Saved by Users" },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-accent/10",
        className
      )}
      data-testid="hero-section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Community-Driven Deals Platform
              </Badge>

              <Typography
                component="h1"
                variant="display"
                size="2xl"
                weight="bold"
              >
                Discover
                <span className="text-primary"> Amazing Deals</span> Every Day
              </Typography>

              <Typography
                component="p"
                variant="text"
                size="lg"
                color="muted-foreground"
                className="max-w-lg"
              >
                Join thousands of smart shoppers finding the best deals from
                verified merchants and affiliate marketers. Save big on
                everything you love.
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={RouteConstant.deals.path}>
                <Button
                  size="large"
                  className="w-full sm:w-auto text-base px-8"
                  data-testid="button-browse-deals"
                >
                  Browse Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href={RouteConstant.merchant.dashboard.path}>
                <Button
                  size="large"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8"
                  data-testid="button-become-merchant"
                >
                  Become a Merchant
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <Typography
                      component="span"
                      variant="display"
                      size="xl"
                      weight="bold"
                    >
                      {stat.value}
                    </Typography>
                  </div>
                  <Typography
                    component="p"
                    variant="text"
                    size="sm"
                    color="muted-foreground"
                  >
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating Deal Cards */}
              <div className="absolute top-0 right-0 w-64 bg-card rounded-lg shadow-lg p-4 transform rotate-3 hover-elevate">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-md bg-linear-to-br from-primary/20 to-accent/20" />
                  <div className="flex-1">
                    <Badge variant="destructive" className="mb-1 text-xs">
                      -40%
                    </Badge>
                    <Typography
                      component="p"
                      variant="text"
                      size="sm"
                      weight="medium"
                      className="line-clamp-1"
                    >
                      Premium Headphones
                    </Typography>
                    <Typography
                      component="p"
                      variant="text"
                      size="lg"
                      weight="bold"
                      color="primary"
                    >
                      $89.99
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/4 left-0 w-56 bg-card rounded-lg shadow-lg p-4 transform -rotate-6 hover-elevate">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-md bg-linear-to-br from-accent/20 to-success/20" />
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-1 text-xs">
                      Featured
                    </Badge>
                    <Typography
                      component="p"
                      variant="text"
                      size="sm"
                      weight="medium"
                      className="line-clamp-1"
                    >
                      Smart Watch Pro
                    </Typography>
                    <Typography
                      component="p"
                      variant="text"
                      size="lg"
                      weight="bold"
                      color="primary"
                    >
                      $199.99
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 right-1/4 w-60 bg-card rounded-lg shadow-lg p-4 transform rotate-2 hover-elevate">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-md bg-linear-to-br from-warning/20 to-primary/20" />
                  <div className="flex-1">
                    <Badge variant="destructive" className="mb-1 text-xs">
                      -55%
                    </Badge>
                    <Typography
                      component="p"
                      variant="text"
                      size="sm"
                      weight="medium"
                      className="line-clamp-1"
                    >
                      Running Shoes
                    </Typography>
                    <Typography
                      component="p"
                      variant="text"
                      size="lg"
                      weight="bold"
                      color="primary"
                    >
                      $67.50
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Background Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-linear-to-br from-primary/10 to-accent/10 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div>
        <Typography component="h2" variant="display" size="lg" weight="bold">
          {title}
        </Typography>
        {description && (
          <Typography
            component="p"
            variant="text"
            size="sm"
            color="muted-foreground"
            className="mt-1"
          >
            {description}
          </Typography>
        )}
      </div>
      {action && (
        <Link href={action.href} className="no-underline">
          <Button
            variant="ghost"
            className="gap-2"
            data-testid="button-section-action"
          >
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
