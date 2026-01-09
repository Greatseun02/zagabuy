import NotFound from "@/components/ui/NotFound";
import { Tags } from "lucide-react";

export function NoDealsFound({ onReset }: { onReset?: () => void }) {
  return (
    <NotFound
      icon={<Tags className="size-10" />}
      title="No deals found"
      description="Try adjusting your filters or check back later for new deals."
      actionButton={
        onReset ? { text: "Reset Filters", onClick: onReset } : undefined
      }
    />
  );
}
