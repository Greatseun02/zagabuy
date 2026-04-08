import { useMemo } from "react";
import DealClicksChart from "@/components/ui/charts/DealClicksChart";
import DealPerformanceComparisonChart from "@/components/ui/charts/DealPerformanceChart";
import { useReadDealByUserQuery } from "@/services/dealService";
import { DateDataPoint } from "@/utilities/types";
import {
  ImpressionsVsClicksChart,
  ImpressionsVsClicksChartProps,
} from "@/components/ui/charts/ImpressionsVsClicksChart";

export default function MerchantAnalyticsClicksTab() {
  const { data: response } = useReadDealByUserQuery();

  const impressionVsClickData: ImpressionsVsClicksChartProps["data"] = useMemo(
    () =>
      response?.data?.map((deal) => ({
        title: "Impressions Vs Clicks",
        impressions: deal.dealViews ?? 0,
        clicks: deal.clickCount ?? 0,
      })) || [],
    [response?.data],
  );

  return (
    // <div className="flex gap-6 flex-col lg:flex-row">
    <div>
      {/* <DealClicksChart className="flex-1" data={clicksChartData} />
      <DealPerformanceComparisonChart
        className="flex-1"
        clicksData={performanceData.clicksData}
        impressionsData={performanceData.impressionsData}
      />
    </div> */}
      <ImpressionsVsClicksChart data={impressionVsClickData} />
    </div>
  );
}
