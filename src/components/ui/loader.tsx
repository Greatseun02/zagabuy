"use client";

import { Loader2 } from "lucide-react";
import Typography from "./typography";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-12 animate-spin text-primary" />
        <Typography size="sm" color="foreground">
          Loading...
        </Typography>
      </div>
    </div>
  );
}
