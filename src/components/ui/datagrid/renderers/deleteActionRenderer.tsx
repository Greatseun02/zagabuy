"use client";

import React from "react";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export type DeleteActionRendererProps<T = Record<string, unknown>> = {
  title?: string;
  data?: T;
  onClick?: (value?: T) => Promise<void>;
};

export function DeleteActionRenderer({
  title,
  data,
  onClick,
}: DeleteActionRendererProps) {
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
        onClick && "cursor-pointer hover:text-red-400 dark:hover:text-red-400",
      )}
      onClick={handleClick}
      title={title}
    >
      <Trash className="w-5 h-5" />
    </div>
  );
}

export default DeleteActionRenderer;
