"use client";

import * as React from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardOverviewCards, {
  DashboardOverviewCardsProps,
} from "@/components/ui/dashboardOverviewCards";
import DashboardBarChart, {
  DashboardBarChartProps,
} from "@/components/ui/dashboardBarChart";

export type ActionConfig = {
  key?: string | number;
  text?: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof BaseButton>["variant"];
  size?: React.ComponentProps<typeof BaseButton>["size"];
  width?: React.ComponentProps<typeof BaseButton>["width"];
  startIcon?: any;
  endIcon?: any;
  isLoading?: boolean;
  asNode?: React.ReactNode; // If provided, will render this node instead of a Button
};

export interface DashboardPageLayoutProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Fully custom action area */
  actions?: React.ReactNode;
  /** Simple action configs to render buttons */
  actionConfigs?: ActionConfig[];
  /** Extra header content (left side) */
  headerLeft?: React.ReactNode;
  headerClassName?: string;
  containerClassName?: string;
  /** Auto-renders a responsive grid of stat cards above children */
  statsCards?: DashboardOverviewCardsProps[];
  statsCardsIsLoading?: boolean;
  /** Auto-renders a row of bar chart cards below stats */
  barCharts?: DashboardBarChartProps[];
}

export default function DashboardPageLayout({
  title,
  subtitle,
  description,
  children,
  actions,
  actionConfigs,
  headerLeft,
  headerClassName,
  containerClassName,
  statsCards,
  statsCardsIsLoading = false,
  barCharts,
}: DashboardPageLayoutProps) {
  return (
    <div className={cn("w-full", containerClassName)}>
      <div
        className={cn(
          "mb-6 flex items-start justify-between gap-4",
          headerClassName,
        )}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-3">
            {headerLeft && <div className="shrink-0">{headerLeft}</div>}
            <div className="min-w-0">
              {title && (
                <h1 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-300">
                  {subtitle}
                </p>
              )}
              {description && (
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  {description}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* If a fully custom actions area is passed, render it */}
          {actions}

          {/* Otherwise render actionConfigs as buttons */}
          {!actions &&
            actionConfigs?.map((cfg, idx) => {
              const key = cfg.key ?? idx;
              if (cfg.asNode)
                return <React.Fragment key={key}>{cfg.asNode}</React.Fragment>;

              return (
                <BaseButton
                  key={key}
                  onClick={cfg.onClick}
                  variant={cfg.variant ?? "primary"}
                  size={cfg.size ?? "medium"}
                  width={cfg.width ?? "auto"}
                  startIcon={cfg.startIcon}
                  endIcon={cfg.endIcon}
                  isLoading={cfg.isLoading}
                >
                  {cfg.text}
                </BaseButton>
              );
            })}
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Auto-rendered stat cards */}
        {statsCards && statsCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, i) => (
              <DashboardOverviewCards
                key={i}
                {...card}
                isLoading={statsCardsIsLoading}
              />
            ))}
          </div>
        )}

        {/* Auto-rendered bar charts */}
        {barCharts && barCharts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barCharts.map((chart, i) => (
              <DashboardBarChart key={i} {...chart} />
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
