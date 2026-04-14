import { cn } from "@/lib/utils";
import { Card, CardProps } from "./card";
import { Skeleton } from "./skeleton";
import Typography from "./typography";

export type BarChartItem = {
  label: string;
  value: number;
  /** Max value used to compute fill %. Defaults to the max in the items array */
  total?: number;
  color?: string;
};

export type DashboardBarChartProps = {
  title?: string;
  description?: string;
  items: BarChartItem[];
  isLoading?: boolean;
  variant?: CardProps["variant"];
  size?: CardProps["size"];
  rounded?: CardProps["rounded"];
  className?: string;
};

export default function DashboardBarChart({
  title,
  description,
  items,
  isLoading = false,
  variant,
  size = "lg",
  rounded = "lg",
  className,
}: DashboardBarChartProps) {
  const max = Math.max(...items.map((i) => i.total ?? i.value), 1);

  return (
    <Card
      variant={variant}
      size={size}
      rounded={rounded}
      className={cn("space-y-4", className)}
    >
      {(title || description) && (
        <div className="">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3.5 w-3/4 mt-1.5" />
            </>
          ) : (
            <>
              {title && (
                <Typography weight="semibold" size="md" variant="display">
                  {title}
                </Typography>
              )}
              {description && (
                <Typography size="sm" color="muted-foreground">
                  {description}
                </Typography>
              )}
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: items.length || 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))
          : items.map((item, i) => {
              const denominator = item.total ?? max;
              const pct =
                denominator > 0 ? (item.value / denominator) * 100 : 0;
              const fillColor = item.color ?? "hsl(var(--primary))";

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Typography
                      size="sm"
                      color="muted-foreground"
                      className="truncate"
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      size="sm"
                      weight="medium"
                      font="mono"
                      className="shrink-0"
                    >
                      {item.value.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: fillColor }}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
}
