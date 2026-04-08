"use client";

import { useMemo } from "react";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { ImpressionsVsClicksChart } from "@/components/ui/charts/ImpressionsVsClicksChart";
import { TopDealsChart } from "@/components/ui/charts/TopDealsChart";
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
          footer: "View all",
          Icon: Eye,
        },
        {
          header: "Avg. CTR",
          text: `${CalcUtil.ctr(totalClicks || 0, totalImpressions || 0)}%`,
          footer: "View all",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards key={index} {...config} />
        ))}
      </div>
      <ImpressionsVsClicksChart data={impressionsVsClicksData} />
      <TopDealsChart deals={topDealsChartData} />
    </DashboardPageLayout>
  );
}
