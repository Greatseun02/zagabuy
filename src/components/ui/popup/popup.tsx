"use client";

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PopupProps {
  /** Trigger element */
  trigger:
    | React.ReactNode
    | ((props: { isOpen: boolean; toggle: () => void }) => React.ReactNode);
  /** Popup content */
  content: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Popup placement */
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end";
  /** Close on content click */
  closeOnClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Whether popup is open */
  open?: boolean;
  /** Controlled open state */
  onOpenChange?: (open: boolean) => void;
}

const placementStyles: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2",
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
};

export const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
  (
    {
      trigger,
      content,
      className,
      style,
      placement = "bottom",
      closeOnClick = true,
      closeOnEscape = true,
      open: controlledOpen,
      onOpenChange,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    };

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
      if (!closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [closeOnEscape]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    const triggerNode =
      typeof trigger === "function" ? trigger({ isOpen, toggle }) : trigger;

    return (
      <div ref={containerRef} className="relative inline-block">
        <div onClick={toggle}>{triggerNode}</div>

        {isOpen && (
          <div
            onClick={() => closeOnClick && setIsOpen(false)}
            className={cn(
              "absolute z-[var(--z-popover,1060)] min-w-max",
              placementStyles[placement],
              className,
            )}
            style={style}
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

Popup.displayName = "Popup";

export default Popup;
