import { Button as BaseButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Typography from "@/components/ui/typography";
import React, { useState } from "react";
import { RowOption } from "../BaseDataGrid.types";

export default function RowOptionsMenu({
  options = [],
  row,
  actions,
}: {
  options?: RowOption[];
  row: any;
  actions: any;
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="relative inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BaseButton variant={"transparent"} title="Row options">
            ⋮
          </BaseButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 divide-y ">
          {options.map((o, i) => (
            <DropdownMenuItem variant={o.danger ? "destructive" : "default"}>
              <Button
                {...(o.icon && { startIcon: <o.icon /> })}
                key={i}
                onClick={() => {
                  o.onClick(row, actions);
                }}
                variant={o.danger ? "destructive" : "ghost"}
                width={"fit"}
                size={"x-small"}
                className="gap-4 rounded-none px-1"
              >
                <Typography>{o.label}</Typography>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
