"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { Button as BaseButton } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
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
  confirmButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
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
      confirmButtonProps,
      cancelButtonProps,
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
            <Typography as="h3" component="h3" weight="semibold" size="lg">
              {title}
            </Typography>
          </div>
        )}

        {description && (
          <Typography
            component="p"
            color="muted-foreground"
            size="sm"
            className="mt-3"
          >
            {description}
          </Typography>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <BaseButton
            variant="ghost"
            onClick={() => {
              onCancel?.();
              modal.hide();
            }}
            {...cancelButtonProps}
          >
            {cancelText ?? "Cancel"}
          </BaseButton>
          <BaseButton
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
            {...confirmButtonProps}
          >
            {confirmText ?? "Confirm"}
          </BaseButton>
        </div>
      </div>
    );
  }
);

ConfirmationModal.displayName = "ConfirmationModal";
