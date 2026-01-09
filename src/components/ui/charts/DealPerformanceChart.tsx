"use client";

import { TimeUtil } from "@/utilities/timeUtil";
import { DateDataPoint } from "@/utilities/types";
import ChartContainer from "./ChartConainer";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StringUtil } from "@/utilities/stringUtil";

export interface DealPerformanceComparisonChartProps {
  clicksData: DateDataPoint[];
  impressionsData: DateDataPoint[];
  className?: string;
}

export default function DealPerformanceComparisonChart({
  clicksData,
  impressionsData,
  className,
}: DealPerformanceComparisonChartProps) {
  const mergedData = clicksData.map((click, i) => ({
    date: TimeUtil.format(click.date, "MMM d"),
    clicks: click.value,
    impressions: impressionsData[i]?.value || 0,
  }));

  return (
    <ChartContainer
      title="Clicks vs Impressions"
      description="Compare engagement metrics"
      className={className}
    >
      <div className="h-75" data-testid="performance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground"
              tickFormatter={(value) => StringUtil.compact(value)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-popover border rounded-md shadow-md p-3">
                    <p className="text-sm font-medium mb-2">{label}</p>
                    {payload.map((entry, i) => (
                      <p
                        key={i}
                        className="text-sm"
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
            <Line
              type="monotone"
              dataKey="impressions"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
              name="Impressions"
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Clicks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
