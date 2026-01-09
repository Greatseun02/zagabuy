import {
  TopDealsChart,
  TopDealsChartProps,
} from "@/components/ui/charts/TopDealsChart";

export default function MerchantAnalyticsTopDealsTab() {
  const topDealsChartData: TopDealsChartProps["deals"] = [
    { title: "Summer Sale - 50% Off", clicks: 5000 },
    { title: "Buy One Get One Free", clicks: 3500 },
    { title: "Holiday Special Discounts", clicks: 2700 },
    { title: "Clearance Sale - Up to 70% Off", clicks: 2200 },
    { title: "New Arrivals - Shop Now", clicks: 1800 },
  ];
  return <TopDealsChart deals={topDealsChartData} />;
}
