import {
  DealEntity,
  ReadDealResponseByDealId,
} from "@/models/responses/dealResponse";
import Typography from "../ui/typography";
import { Card } from "../ui/card";
import { StringUtil } from "@/utilities/stringUtil";
import { CalcUtil } from "@/utilities/calcUtil";
import { PriceDisplay } from "../custom/PriceDisplay";
import { SavingsDisplay } from "../custom/SavingsDisplay";
import { PromoCodeDisplay } from "../custom/PromoCodeDisplay";
import { ShareButton } from "../custom/ShareButton";
import { Clock, ExternalLink } from "lucide-react";
import { CountdownTimer } from "../custom/countdown/CountdownTimer";
import { TimeUtil } from "@/utilities/timeUtil";
import BaseAvatar from "../ui/BaseAvatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { UI_TEXT } from "@/utilities/constants";
import { ImageGallery } from "../custom/ImageGallery";
import { DiscountBadge } from "../custom/status-badge";
import { useCreateClickMutation } from "@/services/clickService";
import { useState } from "react";

export default function DealLayout({
  dealId,
  dealUserId,
  dealApprovedBy,
  dealTitle,
  dealDescription,
  dealPrice,
  dealOldPrice,
  dealExpiryDate,
  dealUrl,
  dealPromoCode,
  dealVisibility,
  dealStatus,
  dealCreatedAt,
  dealImages,
  dealViews,
  clickCount,
}: NonNullable<ReadDealResponseByDealId["data"]>) {
  const hasDiscount = dealOldPrice && dealOldPrice > dealPrice;
  const discountPercentage = hasDiscount
    ? CalcUtil.discountPercentage(dealOldPrice, dealPrice)
    : 0;

  const [createClick] = useCreateClickMutation();
  const [isLoadingVisitLink, setIsLoadingVisitLink] = useState(false);

  const redirectLinkHandler = async () => {
    setIsLoadingVisitLink(true);
    await createClick({
      clickEventDealId: Number(dealId),
    });
    setIsLoadingVisitLink(false);
    window.open(dealUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Images Section */}
      <div className="lg:col-span-3 space-y-4">
        <ImageGallery
          title="Deals Images"
          discountPercentage={discountPercentage}
          discountBadgeProps={{
            className: "px-4",
            size: "md",
          }}
          isFeatured={true}
          images={dealImages}
        />
        <Card className="space-y-5" size={"md"}>
          <Typography weight="semibold" size="lg">
            Description
          </Typography>
          <Typography size="md" color="muted-foreground">
            {dealDescription}
          </Typography>
        </Card>
      </div>

      {/* Details Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title & Category */}
        <Typography component="h1" size="2xl" weight={"bold"}>
          {dealTitle}
        </Typography>

        {/* Price */}
        <div className="space-y-2">
          <PriceDisplay price={dealPrice} oldPrice={dealOldPrice} size="xl" />
          {dealOldPrice && dealOldPrice > dealPrice && (
            <SavingsDisplay oldPrice={dealOldPrice} newPrice={dealPrice} />
          )}
        </div>

        {/* Promo Code */}
        {dealPromoCode && (
          <div>
            <Typography
              size="sm"
              weight="medium"
              color="muted-foreground"
              className="mb-2 block"
            >
              Promo Code
            </Typography>
            <PromoCodeDisplay code={dealPromoCode} />
          </div>
        )}

        {/* Expiry Timer */}
        {dealExpiryDate && (
          <div className="p-4 rounded-md bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>Deal expires in</span>
            </div>
            <CountdownTimer
              expiresAt={dealExpiryDate}
              variant="detailed"
              showIcon={false}
            />
          </div>
        )}

        {/* CTA Button */}
        <div className="grid grid-cols-[1fr_auto] gap-4">
          {/* <Link
            href={dealUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <Button
              size="large"
              className="w-full text-base"
              data-testid="button-visit-deal"
              startIcon={<ExternalLink />}
            >
              {UI_TEXT.CTA.VISIT_DEAL}
            </Button>
          </Link> */}
          <Button
            size="large"
            className="w-full text-base"
            data-testid="button-visit-deal"
            startIcon={<ExternalLink />}
            onClick={redirectLinkHandler}
            isLoading={isLoadingVisitLink}
          >
            {UI_TEXT.CTA.VISIT_DEAL}
          </Button>
          <ShareButton size={"large"} variant={"secondary"} />
        </div>

        {/* Engagement Stats */}
        {/* 
        
        <div className="flex items-center justify-between p-4 rounded-md bg-card border">
          <div className="flex items-center gap-4">
            <Button
              variant={hasVoted === "up" ? "default" : "ghost"}
              size="sm"
              onClick={handleUpvote}
              data-testid="button-upvote"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {deal.upvotes}
            </Button>
            <Button
              variant={hasVoted === "down" ? "secondary" : "ghost"}
              size="sm"
              onClick={handleDownvote}
              data-testid="button-downvote"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {deal.downvotes}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {deal.commentCount}
            </span>
            <ShareButton />
          </div>
        </div>
      */}

        {/* Merchant Info */}
        <Card className="flex items-center gap-3">
          <BaseAvatar text={`${"Merchant"}`} />
          <div>
            <Typography weight="medium">
              {/* {deal.ownerType === "merchant" ? "Merchant Store" : "Affiliate"} */}
              Merchant
            </Typography>
            <Typography size="xs" color="muted-foreground">
              Posted{" "}
              {TimeUtil.timeAgo(
                TimeUtil.parseDateTime(dealCreatedAt).toJSDate()
              )}
            </Typography>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-md bg-muted/50">
            <Typography size="2xl" weight="bold" className=" tabular-nums">
              {StringUtil.compact(clickCount)}
            </Typography>
            <Typography color="muted-foreground" size="xs">
              Clicks
            </Typography>
          </div>
          <div className="p-3 rounded-md bg-muted/50">
            <Typography size="2xl" weight="bold" className=" tabular-nums">
              {StringUtil.compact(dealViews)}
            </Typography>
            <Typography color="muted-foreground" size="xs">
              Views
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
