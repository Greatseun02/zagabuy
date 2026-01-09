import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DealClicksChart, {
  DealClicksChartProps,
} from "@/components/ui/charts/DealClicksChart";
import DealPerformanceComparisonChart, {
  DealPerformanceComparisonChartProps,
} from "@/components/ui/charts/DealPerformanceChart";
import { DashboardOverviewCardsProps } from "@/components/ui/dashboardOverviewCards";
import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

export default function MerchantDealAnalyticsContent() {
  const dashboardOverviewCardsConfig: DashboardOverviewCardsProps[] = [
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

  const DealPerformanceComparisonData: {
    clicksData: DealPerformanceComparisonChartProps["clicksData"];
    impressionsData: DealPerformanceComparisonChartProps["impressionsData"];
  } = {
    clicksData: [
      { date: "2023-01-01", value: 120 },
      { date: "2023-01-02", value: 150 },
      { date: "2023-01-03", value: 180 },
      { date: "2023-01-04", value: 95 },
      { date: "2023-01-05", value: 145 },
    ],
    impressionsData: [
      { date: "2023-01-01", value: 300 },
      { date: "2023-01-02", value: 400 },
      { date: "2023-01-03", value: 500 },
      { date: "2023-01-04", value: 200 },
      { date: "2023-01-05", value: 350 },
    ],
  };

  return (
    <DashboardPageLayout
      title=" Analytics"
      description="Track your deal performance"
    >
      <DealClicksChart className="flex-1" data={clicksChartData} />
      <DealPerformanceComparisonChart
        className="flex-1"
        clicksData={DealPerformanceComparisonData.clicksData}
        impressionsData={DealPerformanceComparisonData.impressionsData}
      />
    </DashboardPageLayout>
  );
}
