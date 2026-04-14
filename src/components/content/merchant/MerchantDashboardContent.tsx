"use client";

import { useMemo } from "react";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ImpressionsVsClicksChart } from "@/components/ui/charts/ImpressionsVsClicksChart";
import { TopDealsChart } from "@/components/ui/charts/TopDealsChart";
import { TopDealsByImpressionsChart } from "@/components/ui/charts/TopDealsByImpressionsChart";
import AnalyticsSummaryCard, {
  AnalyticsSummaryCardProps,
} from "@/components/custom/AnalyticsSummaryCard";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import { useReadDealByUserQuery } from "@/services/dealService";
import { DealUtil } from "@/utilities/dealUtil";
import { StringUtil } from "@/utilities/stringUtil";
import {
  PlusIcon,
  ShoppingBag,
  MousePointerClick,
  Eye,
  TrendingUp,
} from "lucide-react";
import { CalcUtil } from "@/utilities/calcUtil";
import { useRouter } from "next/navigation";
import { RouteConstant } from "@/utilities/constants/routeConstant";

export default function MerchantDashboardContent() {
  const { data: response } = useReadDealByUserQuery();
  const router = useRouter();

  const deals = useMemo(() => response?.data || [], [response]);

  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] =
    useMemo(() => {
      const totalClicks = deals.reduce(
        (sum, deal) => sum + (deal.clickCount ?? 0),
        0,
      );
      const totalImpressions = deals.reduce(
        (sum, deal) => sum + (deal.dealViews ?? 0),
        0,
      );
      const activeDeals = deals.filter(
        (deal) =>
          deal.dealStatus?.toLowerCase() === "active" ||
          deal.dealStatus?.toLowerCase() === "approved",
      ).length;
      const pendingDeals = deals.filter(
        (deal) => deal.dealStatus?.toLowerCase() === "pending",
      ).length;

      return [
        {
          header: "Total Deals",
          text: StringUtil.compact(deals.length),
          Icon: ShoppingBag,
        },
        {
          header: "Active Deals",
          text: StringUtil.compact(activeDeals),
          footer: `${pendingDeals ?? 0} pending`,
          Icon: ShoppingBag,
        },
        {
          header: "Total Clicks",
          text: StringUtil.compact(totalClicks),
          Icon: MousePointerClick,
        },
        {
          header: "Impressions",
          text: StringUtil.compact(totalImpressions),
          Icon: Eye,
        },
        {
          header: "Avg. CTR",
          text: `${CalcUtil.ctr(totalClicks || 0, totalImpressions || 0)}%`,
          Icon: TrendingUp,
        },
      ];
    }, [deals]);

  const impressionsVsClicksData = useMemo(
    () =>
      deals.map((deal) => ({
        title: deal.dealTitle,
        impressions: deal.dealViews ?? 0,
        clicks: deal.clickCount ?? 0,
      })),
    [deals],
  );

  const topDealsChartData = useMemo(
    () =>
      DealUtil.getDealsByType(deals, "top", 5, true).map((deal) => ({
        title: deal.dealTitle,
        clicks: deal.clickCount,
      })),
    [deals],
  );

  const topDealsByImpressionsData = useMemo(
    () =>
      [...deals]
        .sort((a, b) => (b.dealViews ?? 0) - (a.dealViews ?? 0))
        .slice(0, 5)
        .map((deal) => ({
          title: deal.dealTitle,
          impressions: deal.dealViews ?? 0,
        })),
    [deals],
  );

  const dealAnalyticsSummary = useMemo<AnalyticsSummaryCardProps[]>(() => {
    const totalDeals = deals.length;
    const activeDeals = deals.filter(
      (d) => d.dealStatus?.toLowerCase() === "active",
    ).length;
    const pendingDeals = deals.filter(
      (d) => d.dealStatus?.toLowerCase() === "pending",
    ).length;
    const rejectedDeals = deals.filter(
      (d) =>
        d.dealStatus?.toLowerCase() === "rejected" ||
        d.dealStatus?.toLowerCase() === "deactivated",
    ).length;
    const publicDeals = deals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "public",
    ).length;
    const privateDeals = deals.filter(
      (d) => d.dealVisibility?.toLowerCase() === "private",
    ).length;

    return [
      {
        title: "Deal Status Summary",
        summary: [
          { label: "Total Deals", value: String(totalDeals) },
          { label: "Active", value: String(activeDeals) },
          { label: "Pending Review", value: String(pendingDeals) },
          { label: "Rejected", value: String(rejectedDeals) },
        ],
      },
      {
        title: "Visibility Summary",
        summary: [
          { label: "Public", value: String(publicDeals) },
          { label: "Private", value: String(privateDeals) },
        ],
      },
    ];
  }, [deals]);

  return (
    <DashboardPageLayout
      title="Merchant Dashboard"
      description="Welcome back! Here's your performance overview."
      actionConfigs={[
        {
          text: "Create Deal",
          startIcon: <PlusIcon />,
          onClick: () =>
            router.push(RouteConstant.merchant.deals.createDeal.path),
        },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  2xl:grid-cols-5 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards key={index} {...config} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        <ImpressionsVsClicksChart data={impressionsVsClicksData} />
        <div className="flex flex-col gap-4">
          {dealAnalyticsSummary.map((card, index) => (
            <AnalyticsSummaryCard key={index} {...card} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopDealsChart deals={topDealsChartData} />
        <TopDealsByImpressionsChart deals={topDealsByImpressionsData} />
      </div>
    </DashboardPageLayout>
  );
}
