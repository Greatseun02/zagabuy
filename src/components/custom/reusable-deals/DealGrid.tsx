import { cn } from "@/lib/utils";
import { DealCard } from "./DealCard";
import type { DealEntity } from "@/models/responses/dealResponse";
import { RouteConstant } from "@/utilities/constants/routeConstant";

export interface DealGridProps {
  deals: DealEntity[];
  variant?: "default" | "compact";
  className?: string;
}

export function DealGrid({
  deals,
  variant = "default",
  className,
}: DealGridProps) {
  if (deals.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        variant === "compact"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      data-testid="deal-grid"
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.dealId}
          deal={deal}
          variant={variant === "compact" ? "compact" : "default"}
          href={`${RouteConstant.deals.path}/${deal.dealId}`}
        />
      ))}
    </div>
  );
}
