"use client";

import { StringUtil } from "@/utilities/stringUtil";
import ChartContainer from "./ChartConainer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TopDealsChartProps {
  deals: Array<{ title: string; clicks: number }>;
  className?: string;
}

export function TopDealsChart({ deals, className }: TopDealsChartProps) {
  const chartData = deals.slice(0, 5).map((d, i) => ({
    rowKey: i,
    name: StringUtil.shortenWord(d.title, "...", 20),
    fullName: d.title,
    clicks: d.clicks,
  }));

  return (
    <ChartContainer
      title="Top Performing Deals"
      description="Your best deals by click count"
      className={className}
    >
      <div className="h-75" data-testid="top-deals-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground"
              tickFormatter={(value) => StringUtil.compact(value)}
            />
            <YAxis
              type="category"
              dataKey="rowKey"
              tickFormatter={(value) => chartData[value]?.name ?? ""}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={150}
              className="fill-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border rounded-md shadow-md p-3 max-w-62.5">
                    <p className="text-sm font-medium line-clamp-2">
                      {data.fullName}
                    </p>
                    <p className="text-sm text-primary mt-1">
                      {data.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="clicks"
              fill="hsl(var(--chart-4))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
