"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { DateDataPoint } from "@/utilities/types";
import { TimeUtil } from "@/utilities/timeUtil";
import ChartContainer from "./ChartConainer";
import { StringUtil } from "@/utilities/stringUtil";

export interface DealClicksChartProps {
  data: DateDataPoint[];
  className?: string;
}

export default function DealClicksChart({
  data,
  className,
}: DealClicksChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    date: TimeUtil.format(d.date, "MMM d"),
  }));

  return (
    <ChartContainer
      title="Clicks Over Time"
      description="Daily click trends for your deals"
      className={className}
    >
      <div className="h-75" data-testid="clicks-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-primary">
                      {payload[0].value?.toLocaleString()} clicks
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#clicksGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
