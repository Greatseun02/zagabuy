import { LucideIcon } from "lucide-react";
import { Card, CardProps } from "./card";
import Typography from "./typography";

export type DashboardOverviewCardsProps = {
  header: string | number;
  text?: string | number;
  footer?: string | number;
  Icon?: LucideIcon;
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
    </Card>
  );
}
