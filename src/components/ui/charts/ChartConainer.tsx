import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "../card";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartContainer({
  title,
  description,
  children,
  className,
}: ChartContainerProps) {
  return (
    <Card className={cn("space-y-6", className)} data-testid="chart-container">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children}
    </Card>
  );
}
