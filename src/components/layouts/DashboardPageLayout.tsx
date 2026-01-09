"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ActionConfig = {
  key?: string | number;
  text?: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  width?: React.ComponentProps<typeof Button>["width"];
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
}: DashboardPageLayoutProps) {
  return (
    <div className={cn("w-full", containerClassName)}>
      <div
        className={cn(
          "mb-6 flex items-start justify-between gap-4",
          headerClassName
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
                <Button
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
                </Button>
              );
            })}
        </div>
      </div>

      <div className="w-full space-y-6">{children}</div>
    </div>
  );
}
