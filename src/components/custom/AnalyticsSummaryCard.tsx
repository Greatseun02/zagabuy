import { Card } from "../ui/card";
import Typography from "../ui/typography";

export type AnalyticsSummaryCardProps = {
  title: string;
  summary: { label: string; value: string }[];
};

export default function AnalyticsSummaryCard({
  title,
  summary,
}: AnalyticsSummaryCardProps) {
  return (
    <Card title={title} className="space-y-7" rounded={"lg"} size={"lg"}>
      <Typography size="md" weight="medium">
        {title}
      </Typography>
      <div className="space-y-4">
        {summary.map((item, index) => (
          <div key={index} className="flex justify-between">
            <Typography size="sm">{item.label}</Typography>
            <Typography size="md" weight="medium">
              {item.value}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  );
}
