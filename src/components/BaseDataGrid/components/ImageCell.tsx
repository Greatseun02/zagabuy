import React from "react";

export default function ImageCell({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <img
        src={value}
        alt="img"
        className="w-8 h-8 object-cover rounded"
        loading="lazy"
      />
    </div>
  );
}
