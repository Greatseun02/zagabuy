"use client";

import React from "react";
import { Table } from "@tanstack/react-table";

export default function ColumnVisibilityPanel<TData extends object>({
  table,
  onClose,
}: {
  table: Table<TData>;
  onClose?: () => void;
}) {
  return (
    <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg z-10 p-3 min-w-48">
      <div className="text-sm font-medium mb-2">Show/Hide Columns</div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {table.getAllColumns().map((column) => {
          if (column.id === "_actions") return null; // Skip action columns
          return (
            <label key={column.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="w-4 h-4"
              />
              <span>{column.columnDef.header?.toString() || column.id}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
