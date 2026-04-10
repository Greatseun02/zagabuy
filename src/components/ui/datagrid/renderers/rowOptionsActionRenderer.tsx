"use client";

import React, { useEffect, useRef, useState } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { MoreVertical } from "lucide-react";
import MenuOptionsPopup, {
  MenuOption,
} from "@/components/ui/popup/menuOptionsPopup";
import { BaseUtil } from "@/utilities/baseUtil";
import { cn } from "@/lib/utils";

export type RowOptionsActionRendererProps = ICellRendererParams & {
  rowOptions: MenuOption[] | ((data: any, actions?: any) => MenuOption[]);
};

const RowOptionsActionRenderer: React.FC<RowOptionsActionRendererProps> = (
  props,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (props.eGridCell && containerRef.current) {
      containerRef.current = props.eGridCell;
    } else if (props.eGridCell) {
      containerRef.current = props.eGridCell as HTMLElement;
    }
    return () => {
      containerRef.current = null;
    };
  }, [props.eGridCell]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setLoadingActions(new Set());
  };

  const getMenuOptions = (): MenuOption[] => {
    if (typeof props.rowOptions === "function") {
      return props.rowOptions(props.data, {
        setLoading: (actionName: string, loading: boolean) => {
          setLoadingActions((prev) => {
            const newSet = new Set(prev);
            if (loading) newSet.add(actionName);
            else newSet.delete(actionName);
            return newSet;
          });
        },
        close: handleClose,
      });
    }
    return props.rowOptions;
  };

  const wrapOnClick = (option: MenuOption) => {
    return async (data: any) => {
      const waitForCompletion = option.waitForCompletion ?? false;

      if (waitForCompletion) {
        setLoadingActions((prev) => new Set([...prev, option.optionName]));
        try {
          await option.onClick(data);
        } finally {
          setLoadingActions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(option.optionName);
            return newSet;
          });
          handleClose();
        }
      } else {
        handleClose();
        Promise.resolve(option.onClick(data)).catch((error) => {
          BaseUtil.logger("Row option error:", error);
        });
      }
    };
  };

  const menuOptions = getMenuOptions().map((option) => ({
    ...option,
    isLoading: loadingActions.has(option.optionName),
    onClick: wrapOnClick(option),
  }));

  const hasOptions = menuOptions.length > 0;

  useEffect(() => {
    if (props.api && props.column && hasOptions) {
      props.api.refreshCells({
        force: true,
        columns: [props.column],
        rowNodes: [props.node],
      });
      props.eGridCell.onclick = () => {
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      };
    }
    return () => {
      if (props.eGridCell) {
        props.eGridCell.onclick = null;
      }
    };
  }, [isOpen, loadingActions.size, hasOptions]);

  if (!hasOptions) {
    return null;
  }

  return (
    <button
      className={cn(
        "h-full flex items-center justify-center w-full bg-transparent border-0 p-0 cursor-pointer hover:bg-muted rounded text-muted-foreground transition-colors duration-150",
      )}
      onClick={handleOpen}
      aria-label="Row options"
      aria-expanded={isOpen}
      aria-haspopup="true"
      type="button"
    >
      <MoreVertical style={{ width: "1.5em", height: "1.5em" }} />
      <MenuOptionsPopup
        referenceElement={containerRef.current}
        isOpen={isOpen}
        onClose={handleClose}
        menuOptions={menuOptions}
        data={props.data}
      />
    </button>
  );
};

export default RowOptionsActionRenderer;
