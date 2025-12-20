"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ModalVariant = "default" | "compact" | "fullscreen";

export interface BaseModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  variant?: ModalVariant;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseIcon?: boolean;
  closeOnBackdropClick?: boolean;
  backdropBlur?: boolean;
  rounded?: "sm" | "md" | "lg" | "xl";
  shadow?: "sm" | "md" | "lg" | "xl";
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const maxWidthClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

const roundedClasses: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

const shadowClasses: Record<string, string> = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const variantClasses: Record<ModalVariant, string> = {
  default: "bg-white dark:bg-slate-800",
  compact: "bg-white dark:bg-slate-800 p-4",
  fullscreen: "bg-white dark:bg-slate-800 h-screen w-screen rounded-none",
};

export function BaseModalLayout({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "default",
  maxWidth = "lg",
  showCloseIcon = true,
  closeOnBackdropClick = true,
  backdropBlur = true,
  rounded = "lg",
  shadow = "lg",
  contentClassName,
  headerClassName,
  bodyClassName,
}: BaseModalLayoutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0",
          variantClasses[variant],
          maxWidthClasses[maxWidth],
          roundedClasses[rounded],
          shadowClasses[shadow],
          backdropBlur && "backdrop-blur-sm",
          contentClassName
        )}
        onInteractOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
      >
        {/* Header */}
        {(title || description || showCloseIcon) && (
          <DialogHeader
            className={cn(
              "border-b border-slate-200 px-6 py-4 dark:border-slate-700",
              headerClassName
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                {title && (
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-300">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {showCloseIcon && (
                <button
                  onClick={onClose}
                  className="mt-1 shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </DialogHeader>
        )}

        {/* Body */}
        <div
          className={cn(
            "px-6 py-4",
            variant === "compact" && "p-0",
            bodyClassName
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
