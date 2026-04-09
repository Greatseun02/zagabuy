import React from "react";
import { RotateCw } from "lucide-react";
import { Button as BaseButton } from "@/components/ui/button";

export default function TableToolbar({
  search,
  onSearch,
  onRefetch,
  loading,
  onToggleColumnVisibility,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  onRefetch?: () => void;
  loading?: boolean;
  onToggleColumnVisibility?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <input
          aria-label="Search"
          value={search ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search..."
          className="border rounded px-3 py-1 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <BaseButton
          type="button"
          onClick={onRefetch}
          disabled={loading}
          title="Refresh data"
          variant={"outline"}
        >
          <RotateCw size={18} className={loading ? "animate-spin" : ""} />
        </BaseButton>
      </div>
    </div>
  );
}
