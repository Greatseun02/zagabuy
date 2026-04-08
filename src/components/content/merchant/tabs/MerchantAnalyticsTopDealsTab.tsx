import {
  TopDealsChart,
  TopDealsChartProps,
} from "@/components/ui/charts/TopDealsChart";
import { useReadDealByUserQuery } from "@/services/dealService";
import { DealUtil } from "@/utilities/dealUtil";

export default function MerchantAnalyticsTopDealsTab() {
  const { data } = useReadDealByUserQuery();

  // Filter and sort the top deals using DealUtil
  const topDeals = DealUtil.getDealsByType(data?.data || [], "top", 5, true);

  // Transform to match TopDealsChartProps format
  const topDealsChartData: TopDealsChartProps["deals"] = topDeals.map(
    (deal) => ({
      title: deal.dealTitle,
      clicks: deal.clickCount,
    }),
  );

  return <TopDealsChart deals={topDealsChartData} />;
}
