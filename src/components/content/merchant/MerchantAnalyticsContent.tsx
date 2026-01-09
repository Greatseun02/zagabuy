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

export default function MerchantAnalyticsContent() {
  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
    {
      header: "Active Deals",
      text: "10",
      footer: "1 pending",
      Icon: ShoppingBag,
    },
    {
      header: "Total Clicks",
      text: "15.4K",
      Icon: MousePointerClick,
    },
    {
      header: "Impressions",
      text: "15K",
      footer: "View all",
      Icon: Eye,
    },
    {
      header: "Avg. CTR",
      text: "2.5%",
      footer: "View all",
      Icon: TrendingUp,
    },
  ];

  const dealAnalyticsSummary: AnalyticsSummaryCardProps[] = [
    {
      title: "Deal Status Summary",
      summary: [
        {
          label: "Active Deals",
          value: "10",
        },
        {
          label: "Pending Review",
          value: "2",
        },
      ],
    },
    {
      title: "Cost Efficiency",
      summary: [
        {
          label: "Total Spend",
          value: "$12,500",
        },
        {
          label: "Avg. Cost Per Click",
          value: "$0.85",
        },
      ],
    },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {dealAnalyticsSummary.map((card, index) => (
          <AnalyticsSummaryCard key={index} {...card} />
        ))}
      </div>
    </DashboardPageLayout>
  );
}
