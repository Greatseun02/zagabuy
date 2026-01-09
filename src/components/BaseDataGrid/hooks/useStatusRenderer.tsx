import React, { ReactNode } from "react";

export function useStatusRenderer() {
  function render(value: any, mapping: Record<string, string> = {}) {
    const v = String(value);
    const map = mapping[v] ?? v;
    const color =
      mapping && mapping[v]
        ? mapping[v]
        : v.match(/success|ok|done/i)
        ? "bg-green-100 text-green-800"
        : v.match(/error|fail/i)
        ? "bg-red-100 text-red-800"
        : v.match(/pending|inprogress/i)
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

    return <span className={`px-2 py-1 rounded text-xs ${color}`}>{map}</span>;
  }

  return { render };
}
