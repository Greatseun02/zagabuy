import React, { useState } from "react";

export default function RowOptionsMenu({
  options = [],
  row,
}: {
  options?: any[];
  row: any;
}) {
  const [open, setOpen] = useState(false);

  if (!options || options.length === 0) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 border rounded hover:bg-gray-100"
        title="Row options"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow-lg z-10">
          {options.map((o, i) => (
            <button
              key={i}
              onClick={() => {
                o.onClick(row);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                o.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
