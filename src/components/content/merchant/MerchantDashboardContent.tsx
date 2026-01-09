"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DealClicksChart, {
  DealClicksChartProps,
} from "@/components/ui/charts/DealClicksChart";
import {
  TopDealsChart,
  TopDealsChartProps,
} from "@/components/ui/charts/TopDealsChart";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import { StringUtil } from "@/utilities/stringUtil";
import {
  PlusIcon,
  ShoppingBag,
  MousePointerClick,
  Eye,
  TrendingUp,
} from "lucide-react";

export default function MerchantDashboardContent() {
  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
    {
      header: "Active Deals",
      text: StringUtil.compact(10),
      footer: "1 pending",
      Icon: ShoppingBag,
    },
    {
      header: "Total Clicks",
      text: StringUtil.compact(15400),
      Icon: MousePointerClick,
    },
    {
      header: "Impressions",
      text: StringUtil.compact(12345000),
      footer: "View all",
      Icon: Eye,
    },
    {
      header: "Avg. CTR",
      text: StringUtil.percentage(4.5),
      footer: "View all",
      Icon: TrendingUp,
    },
  ];

  const clicksChartData: DealClicksChartProps["data"] = [
    { date: "2023-01-01", value: 120 },
    { date: "2023-01-02", value: 150 },
    { date: "2023-01-03", value: 180 },
    { date: "2023-01-04", value: 95 },
    { date: "2023-01-05", value: 145 },
    { date: "2023-01-06", value: 175 },
    { date: "2023-01-07", value: 85 },
    { date: "2023-01-08", value: 110 },
    { date: "2023-01-09", value: 160 },
    { date: "2023-01-10", value: 200 },
    { date: "2023-01-11", value: 130 },
    { date: "2023-01-12", value: 170 },
    { date: "2024-01-01", value: 190 },
    { date: "2024-01-14", value: 100 },
  ];

  const topDealsChartData: TopDealsChartProps["deals"] = [
    { title: "Summer Sale - 50% Off", clicks: 5000 },
    { title: "Buy One Get One Free", clicks: 3500 },
    { title: "Holiday Special Discounts", clicks: 2700 },
    { title: "Clearance Sale - Up to 70% Off", clicks: 2200 },
    { title: "New Arrivals - Shop Now", clicks: 1800 },
  ];

  return (
    <DashboardPageLayout
      title="Merchant Dashboard"
      description="Welcome back! Here's your performance overview."
      actionConfigs={[
        {
          text: "Create Deal",
          startIcon: <PlusIcon />,
        },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardOverviewCardsConfig.map((config, index) => (
          <DashboardOverviewCards key={index} {...config} />
        ))}
      </div>
      <DealClicksChart data={clicksChartData} />
      <TopDealsChart deals={topDealsChartData} />
    </DashboardPageLayout>
  );
}
