"use client";
import AnalyticsSummaryCard, {
  AnalyticsSummaryCardProps,
} from "@/components/custom/AnalyticsSummaryCard";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import BaseTab, { BaseTabProps } from "@/components/ui/BaseTab";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import { Eye, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react";
import MerchantAnalyticsClicksTab from "./tabs/MerchantAnalyticsClicksTab";
import MerchantAnalyticsTopDealsTab from "./tabs/MerchantAnalyticsTopDealsTab";
import { useReadDealByUserQuery } from "@/services/dealService";
import { useMemo } from "react";
import { CalcUtil } from "@/utilities/calcUtil";
import { StringUtil } from "@/utilities/stringUtil";

export default function MerchantAnalyticsContent() {
  const { data: dealsData } = useReadDealByUserQuery();

  const totalDeals = dealsData?.data?.length;

  const activeDeals = useMemo(
    () =>
      dealsData?.data?.filter((deal) => deal.dealStatus === "ACTIVE").length ||
      0,
    [dealsData?.data],
  );

  const pendingDeals = useMemo(
    () =>
      dealsData?.data?.filter((deal) => deal.dealStatus === "PENDING").length ||
      0,
    [dealsData?.data],
  );

  const totalClicks = useMemo(
    () =>
      dealsData?.data?.reduce(
        (sum, currentDeal) => sum + currentDeal.clickCount,
        0,
      ),
    [dealsData?.data],
  );
  const totalViews = useMemo(
    () =>
      dealsData?.data?.reduce(
        (sum, currentDeal) => sum + currentDeal.dealViews,
        0,
      ),
    [dealsData?.data],
  );

  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
    {
      header: "Active Deals",
      text: StringUtil.compact(activeDeals),
      footer: `${pendingDeals} pending`,
      Icon: ShoppingBag,
    },
    {
      header: "Total Clicks",
      text: StringUtil.compact(totalClicks || 0),
      Icon: MousePointerClick,
    },
    {
      header: "Impressions",
      text: StringUtil.compact(totalViews || 0),
      Icon: Eye,
    },
    {
      header: "Avg. CTR",
      text: `${CalcUtil.ctr(totalClicks || 0, totalViews || 0)}%`,
      Icon: TrendingUp,
    },
  ];

  const dealAnalyticsSummary: AnalyticsSummaryCardProps[] = [
    {
      title: "Deal Status Summary",
      summary: [
        {
          label: "Total Deals",
          value: String(totalDeals || 0),
        },
        {
          label: "Active Deals",
          value: String(activeDeals),
        },
        {
          label: "Pending Review",
          value: String(pendingDeals),
        },
      ],
    },
    // {
    //   title: "Cost Efficiency",
    //   summary: [
    //     {
    //       label: "Total Spend",
    //       value: "$12,500",
    //     },
    //     {
    //       label: "Avg. Cost Per Click",
    //       value: "$0.85",
    //     },
    //   ],
    // },
  ];

  const tabs: BaseTabProps["tabs"] = [
    { label: "Clicks", id: "clicks", content: <MerchantAnalyticsClicksTab /> },
    {
      label: "Top Deals",
      id: "topdeals",
      content: <MerchantAnalyticsTopDealsTab />,
    },
  ];

  return (
    <DashboardPageLayout
      title=" Analytics"
      description="Track your deal performance"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards key={index} {...config} />
        ))}
      </div>

      <BaseTab tabs={tabs} />

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8"> */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {dealAnalyticsSummary.map((card, index) => (
          <AnalyticsSummaryCard key={index} {...card} />
        ))}
      </div>
    </DashboardPageLayout>
  );
}
