import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DealCardSkeleton() {
  return (
    <Card
      className="overflow-hidden hover-elevate"
      data-testid="skeleton-deal-card"
    >
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
}
