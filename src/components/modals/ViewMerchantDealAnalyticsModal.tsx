"use client";

import { useMemo } from "react";
import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { DealEntity } from "@/models/responses/dealResponse";
import { CalcUtil } from "@/utilities/calcUtil";
import { StringUtil } from "@/utilities/stringUtil";
import DealClicksChart from "@/components/ui/charts/DealClicksChart";
import DealPerformanceComparisonChart from "@/components/ui/charts/DealPerformanceChart";
import { ImpressionsVsClicksChart } from "@/components/ui/charts/ImpressionsVsClicksChart";
import Typography from "@/components/ui/typography";
import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

export interface ViewMerchantDealAnalyticsModalProps {
  deal: DealEntity;
}

export const ViewMerchantDealAnalyticsModal =
  createAppModal<ViewMerchantDealAnalyticsModalProps>(({ deal }, modal) => {
    const ctr = CalcUtil.ctr(deal.clickCount || 0, deal.dealViews || 0);

    const summaryCards = [
      {
        label: "Total Clicks",
        value: StringUtil.compact(deal.clickCount || 0),
        icon: MousePointerClick,
      },
      {
        label: "Impressions",
        value: StringUtil.compact(deal.dealViews || 0),
        icon: Eye,
      },
      {
        label: "Avg. CTR",
        value: `${ctr}%`,
        icon: TrendingUp,
      },
    ];

    return (
      <div className="flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col items-center gap-1 p-4 rounded-md bg-muted/50"
            >
              <card.icon className="h-4 w-4 text-muted-foreground mb-1" />
              <Typography size="xl" weight="bold" className="tabular-nums">
                {card.value}
              </Typography>
              <Typography size="xs" color="muted-foreground">
                {card.label}
              </Typography>
            </div>
          ))}
        </div>

        {/* Single Deal Bar Comparison */}
        <ImpressionsVsClicksChart
          data={[
            {
              title: deal.dealTitle,
              impressions: deal.dealViews,
              clicks: deal.clickCount,
            },
          ]}
        />
      </div>
    );
  });

ViewMerchantDealAnalyticsModal.displayName = "ViewMerchantDealAnalyticsModal";
