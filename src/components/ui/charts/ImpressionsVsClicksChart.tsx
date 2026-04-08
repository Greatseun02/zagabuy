"use client";

import { StringUtil } from "@/utilities/stringUtil";
import ChartContainer from "./ChartConainer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ImpressionsVsClicksChartProps {
  data: Array<{
    title: string;
    impressions: number;
    clicks: number;
  }>;
  className?: string;
}

export function ImpressionsVsClicksChart({
  data,
  className,
}: ImpressionsVsClicksChartProps) {
  const chartData = data.slice(0, 5).map((d) => ({
    name: StringUtil.shortenWord(d.title, "...", 20),
    fullName: d.title,
    impressions: d.impressions,
    clicks: d.clicks,
  }));

  return (
    <ChartContainer
      title="Impressions vs Clicks"
      description="Compare engagement metrics across deals"
      className={className}
    >
      <div className="h-75" data-testid="impressions-vs-clicks-chart">
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
              dataKey="name"
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
                    {payload.map((entry, i) => (
                      <p
                        key={i}
                        className="text-sm mt-1"
                        style={{ color: entry.color }}
                      >
                        {entry.name}: {entry.value?.toLocaleString()}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend />
            <Bar
              dataKey="impressions"
              fill="hsl(var(--chart-3))"
              radius={[0, 4, 4, 0]}
              name="Impressions"
            />
            <Bar
              dataKey="clicks"
              fill="hsl(var(--chart-4))"
              radius={[0, 4, 4, 0]}
              name="Clicks"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
