"use client";

import React from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditActionRendererProps<T = Record<string, unknown>> = {
  title?: string;
  data?: T;
  onClick?: (value?: T) => Promise<void>;
};

export function EditActionRenderer<T = Record<string, unknown>>({
  title,
  data,
  onClick,
}: EditActionRendererProps<T>) {
  const handleClick = () => {
    if (onClick) {
      void onClick(data);
    }
  };

  return (
    <div
      className={cn(
        "flex justify-center w-full text-muted-foreground",
        "transition-colors duration-150",
        onClick && "cursor-pointer hover:text-primary dark:hover:text-primary",
      )}
      onClick={handleClick}
      title={title}
    >
      <Edit className="w-5 h-5" />
    </div>
  );
}

export default EditActionRenderer;
