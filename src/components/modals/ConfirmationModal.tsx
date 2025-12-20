"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { Button } from "@/components/ui/button";
import { useAppModal } from "@/hooks/useAppModal";
import { Info, AlertTriangle, Trash2, CheckCircle } from "lucide-react";

/**
 * Confirmation Modal - Pre-built for quick confirmation dialogs
 *
 * Usage (flat props API):
 * const modal = useAppModal(ConfirmationModal);
 * modal.show({
 *   title: "Delete Item?",
 *   description: "This action cannot be undone.",
 *   confirmText: "Delete",
 *   cancelText: "Cancel",
 *   variant: "destructive", // layout prop
 *   maxWidth: "sm", // layout prop
 *   onConfirm: async () => console.log("Confirmed"),
 * });
 */
export interface ConfirmationModalProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** new preferred prop */
  variant?: "default" | "destructive" | "warning" | "info" | "success";
  /** legacy prop name kept for compatibility */
  confirmVariant?: "default" | "destructive" | "warning" | "info" | "success";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  maxWidth?: "sm" | "md" | "lg";
}

const IconForVariant = ({
  variant,
}: {
  variant?: ConfirmationModalProps["variant"];
}) => {
  const cls = "w-5 h-5 mr-2";
  switch (variant) {
    case "destructive":
      return <Trash2 className={cls} />;
    case "warning":
      return <AlertTriangle className={cls} />;
    case "info":
      return <Info className={cls} />;
    case "success":
      return <CheckCircle className={cls} />;
    default:
      return null;
  }
};

export const ConfirmationModal = createAppModal<ConfirmationModalProps>(
  (
    {
      title,
      description,
      confirmText,
      cancelText,
      variant,
      confirmVariant,
      onConfirm,
      onCancel,
      maxWidth,
    },
    modal
  ) => {
    const widthClass =
      maxWidth === "sm"
        ? "max-w-sm"
        : maxWidth === "lg"
        ? "max-w-lg"
        : "max-w-md";
    const resolvedVariant = variant ?? confirmVariant ?? "default";

    return (
      <div className={`p-4 ${widthClass}`}>
        {title && (
          <div className="flex items-start gap-3">
            <IconForVariant variant={resolvedVariant} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}

        {description && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            onClick={() => {
              onCancel?.();
              modal.hide();
            }}
          >
            {cancelText ?? "Cancel"}
          </Button>
          <Button
            variant={
              resolvedVariant === "destructive"
                ? "destructive"
                : resolvedVariant === "warning"
                ? "secondary"
                : resolvedVariant === "info"
                ? "outline"
                : resolvedVariant === "success"
                ? "primary"
                : "primary"
            }
            onClick={async () => {
              await onConfirm?.();
              modal.hide();
            }}
          >
            {confirmText ?? "Confirm"}
          </Button>
        </div>
      </div>
    );
  }
);

ConfirmationModal.displayName = "ConfirmationModal";
