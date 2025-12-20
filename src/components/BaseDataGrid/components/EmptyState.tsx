import React from "react";

export default function EmptyState({
  message = "No data available",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-sm text-gray-500">{message}</div>
    </div>
  );
}
