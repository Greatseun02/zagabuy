import { LucideIcon } from "lucide-react";
import { Card, CardProps } from "./card";
import { Skeleton } from "./skeleton";
import Typography from "./typography";

export type DashboardOverviewCardsProps = {
  header: string | number;
  text?: string | number;
  footer?: string | number;
  Icon?: LucideIcon;
  isLoading?: boolean;
  variant?: CardProps["variant"];
  width?: CardProps["width"];
  withHover?: CardProps["withHover"];
  size?: CardProps["size"];
  rounded?: CardProps["rounded"];
};

export default function DashboardOverviewCards({
  header,
  text,
  footer,
  Icon,
  isLoading = false,
  variant,
  width,
  withHover = "enabled",
  size = "lg",
  rounded = "lg",
}: DashboardOverviewCardsProps) {
  return (
    <Card
      variant={variant}
      width={width}
      withHover={withHover}
      size={size}
      rounded={rounded}
      className="rounded-lg"
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-4 items-center">
            <Typography size="md" color="muted-foreground">
              {header}
            </Typography>
            {Icon && (
              <Typography variant="display" color="muted-foreground">
                <Icon className="size-4" />
              </Typography>
            )}
          </div>
          <Typography size="2xl" weight="semibold" font="mono">
            {text ?? ""}
          </Typography>

          {footer && (
            <Typography size="sm" color="muted-foreground">
              {footer ?? ""}
            </Typography>
          )}
        </>
      )}
    </Card>
  );
}
