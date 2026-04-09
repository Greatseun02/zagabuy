import React, { CSSProperties } from "react";
import BasePopup, { BasePopupProps } from "@/components/ui/popup/basePopup";
import { cn } from "@/lib/utils";

export type MenuOption<T = unknown> = {
  optionName: string;
  onClick: (data: T) => void;
  optionStyle?: CSSProperties;
  isLoading?: boolean;
  waitForCompletion?: boolean;
};

export type MenuOptionsPopupProps<T = unknown> = Omit<
  BasePopupProps,
  "children"
> & {
  menuOptions: MenuOption<T>[];
  data: T;
};

const MenuOptionsPopup: React.FC<MenuOptionsPopupProps> = ({
  menuOptions,
  data,
  ...props
}) => {
  return (
    <BasePopup {...props}>
      <div className="bg-card rounded-md flex flex-col shadow-lg min-w-[150px] border border-border">
        {menuOptions?.map((menuOption, index) => (
          <div
            className={cn(
              "px-2.5 py-2.5 text-sm cursor-pointer transition-colors",
              menuOption.isLoading
                ? "text-muted-foreground"
                : "text-foreground hover:bg-muted",
            )}
            key={index}
            onClick={() => {
              if (menuOption.isLoading) return;
              menuOption.onClick(data);
              props?.onClose?.();
            }}
            style={{
              ...menuOption?.optionStyle,
            }}
          >
            {menuOption.optionName}
          </div>
        ))}
      </div>
    </BasePopup>
  );
};

export default MenuOptionsPopup;
