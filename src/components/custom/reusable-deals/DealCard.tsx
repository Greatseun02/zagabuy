import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  EyeIcon,
  MousePointerClick,
  ThumbsUp,
} from "lucide-react";
import type { DealEntity } from "@/models/responses/dealResponse";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { DiscountBadge } from "../status-badge";
import Typography from "@/components/ui/typography";
import { PriceDisplay } from "../PriceDisplay";
import { Button } from "@/components/ui/button";
import { ExpiryDisplay } from "../countdown/ExpiryDisplay";

interface DealCardProps {
  deal: DealEntity;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
  href?: string;
}

export function DealCard({
  deal,
  variant = "default",
  className,
  href = RouteConstant.deals.path,
}: DealCardProps) {
  const discountPercentage =
    deal.dealOldPrice && deal.dealPrice
      ? Math.round(
          ((deal.dealOldPrice - deal.dealPrice) / deal.dealOldPrice) * 100
        )
      : 0;

  if (variant === "compact") {
    return (
      <Link href={href}>
        <Card
          className={cn(
            "overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all",
            className
          )}
          data-testid={`card-deal-compact-${deal.dealId}`}
        >
          <div className="flex gap-3 p-3">
            <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
              {deal.dealImages && deal.dealImages[0] ? (
                <img
                  src={deal.dealImages[0]}
                  alt={deal.dealTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ExternalLink className="h-6 w-6" />
                </div>
              )}
              {discountPercentage > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 right-1 text-xs px-1.5 py-0"
                >
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <Typography
                component="h3"
                size="sm"
                weight="medium"
                className="line-clamp-2 leading-tight"
              >
                {deal.dealTitle}
              </Typography>
              <PriceDisplay
                price={deal?.dealPrice}
                oldPrice={deal?.dealOldPrice}
                size="sm"
                showBadge={false}
              />
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href}>
        <Card
          className={cn(
            "overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all group",
            className
          )}
          data-testid={`card-deal-horizontal-${deal.dealId}`}
        >
          <div className="flex gap-4 p-4">
            <div className="relative w-32 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
              {deal.dealImages && deal.dealImages[0] ? (
                <img
                  src={deal.dealImages[0]}
                  alt={deal.dealTitle}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ExternalLink className="h-8 w-8" />
                </div>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute top-1 left-1">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <Typography
                  component="h3"
                  size="md"
                  weight="semibold"
                  className="line-clamp-1 mb-1 group-hover:text-primary transition-colors"
                >
                  {deal.dealTitle}
                </Typography>
                <Typography
                  component="p"
                  size="sm"
                  color="muted-foreground"
                  className="line-clamp-1"
                >
                  {deal.dealDescription}
                </Typography>
              </div>

              <div className="flex items-center justify-between gap-4">
                <PriceDisplay
                  price={deal?.dealPrice}
                  oldPrice={deal?.dealOldPrice}
                  size="sm"
                  showBadge={false}
                />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href}>
      <Card
        className={cn(
          "overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all group p-0 rounded-xl",
          className
        )}
        data-testid={`card-deal-${deal.dealId}`}
      >
        {/* Image Section */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          {deal.dealImages ? (
            <img
              src={deal.dealImages[0]}
              alt={deal.dealTitle}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ExternalLink className="h-12 w-12" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
            <div className="flex flex-col gap-1" />
            {discountPercentage > 0 && (
              <DiscountBadge percentage={discountPercentage} />
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="grid gap-3 grid-cols-[1fr_auto]">
            <Typography
              component="h3"
              size="lg"
              weight="semibold"
              className="line-clamp-2 leading-snug group-hover:text-primary transition-colors"
              data-testid="text-deal-title"
            >
              {deal.dealTitle}
            </Typography>
            <ExpiryDisplay expiresAt={deal?.dealExpiryDate} />
          </div>

          {/* Price */}
          <PriceDisplay
            price={deal?.dealPrice}
            oldPrice={deal?.dealOldPrice}
            size="md"
            showBadge={false}
          />

          {/* Footer: Merchant + Stats */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                    deal.userDisplayName ||
                    `${deal?.userFirstName} ${deal?.userLastName}`
                  }`}
                />
                <AvatarFallback className="text-xs">
                  {deal?.userDisplayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Typography
                size="xs"
                color="muted-foreground"
                className=" truncate"
              >
                Store
              </Typography>
            </div>

            <div className="flex items-center  ">
              <Button variant={"transparent"} startIcon={<MousePointerClick />}>
                {deal?.clickCount}
              </Button>
              <Button variant={"transparent"} startIcon={<EyeIcon />}>
                {deal?.dealViews}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
