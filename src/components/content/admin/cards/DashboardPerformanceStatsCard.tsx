import { Card, CardProps } from "@/components/ui/card";
import Typography, { TypographyProps } from "@/components/ui/typography";
import clsx from "clsx";
import { ComponentProps } from "react";

export type DashboardPerformanceStatsCardProps = {
  cardProps?: CardProps;
  header: TypographyProps;
  childrenContainer?: ComponentProps<"div">;
  contents: {
    label: TypographyProps;
    text: TypographyProps;
  }[];
};

export default function DashboardPerformanceStatsCard({
  cardProps = {},
  header,
  childrenContainer = {},
  contents,
}: DashboardPerformanceStatsCardProps) {
  const { size = "lg", withHover = "enabled", rounded = "lg" } = cardProps;
  const { className } = childrenContainer;
  const { weight = "semibold", size: headerSize = "md" } = header;

  return (
    <Card
      size={size}
      withHover={withHover}
      rounded={rounded}
      {...(cardProps ?? {})}
      title="Performance Admin Card"
      className="space-y-5"
    >
      <Typography
        title="header"
        size={headerSize}
        weight={weight}
        {...header}
      />
      <div
        className={clsx("flex flex-wrap justify-between gap-5", className)}
        {...childrenContainer}
      >
        {contents.map((content) => (
          <div className="flex-1/3">
            <Typography
              size="sm"
              color="muted-foreground"
              className=""
              {...(content.label ?? "")}
            />
            <Typography
              size="2xl"
              weight="semibold"
              font="mono"
              {...(content.text ?? "")}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
