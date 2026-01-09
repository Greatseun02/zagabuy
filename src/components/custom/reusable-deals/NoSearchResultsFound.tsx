import NotFound from "@/components/ui/NotFound";
import { Search } from "lucide-react";

export function NoSearchResultsFound({
  query,
  onReset,
}: {
  query: string;
  onReset?: () => void;
}) {
  return (
    <NotFound
      icon={<Search className="size-10" />}
      title={`No results for "${query}"`}
      description="Try different keywords or browse our categories."
      actionButton={
        onReset ? { text: "Clear Search", onClick: onReset } : undefined
      }
    />
  );
}
