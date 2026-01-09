import Typography from "../ui/typography";

export interface RecentActivityItemProps {
  title: string;
  description: string;
  time: string;
  type:
    | "DEAL"
    | "MERCHANT"
    | "AUTHENTICATION"
    | "CLICK"
    | "CATEGORY"
    | "TAG"
    | string;
}

export default function RecentActivityItem({
  title,
  description,
  time,
  type,
}: RecentActivityItemProps) {
  const typeColors: Record<string, string> = {
    DEAL: "bg-warning/10 text-warning",
    MERCHANT: "bg-primary/10 text-primary",
    AUTHENTICATION: "bg-success/10 text-success",
    CLICK: "bg-chart-2/10 text-chart-2",
    CATEGORY: "bg-blue-500/10 text-blue-500",
    TAG: "bg-purple-500/10 text-purple-500",
  };

  const getTypeColor = (typeKey: string): string => {
    return typeColors[typeKey] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${
          getTypeColor(type).split(" ")[0]
        }`}
      />
      <div className="flex-1 min-w-0">
        <Typography size="sm" weight="medium">
          {title}
        </Typography>
        <Typography size="xs" color="muted-foreground" className="truncate">
          {description}
        </Typography>
      </div>
      <Typography
        size="xs"
        color="muted-foreground"
        className="whitespace-nowrap"
      >
        {time}
      </Typography>
    </div>
  );
}
