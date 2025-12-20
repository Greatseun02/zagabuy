import React from "react";
import type { Table } from "@tanstack/react-table";

export default function TableHeader({ table }: { table: Table<any> }) {
  return (
    <thead className="bg-sidebar">
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          {hg.headers.map((h) => (
            <th
              key={h.id}
              className="px-4 py-2 text-left text-xs font-medium text-gray-500"
            >
              {h.isPlaceholder
                ? null
                : h.column.columnDef.header?.toString() ?? h.id}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
