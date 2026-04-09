import React from "react";
import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Button as BaseButton } from "@/components/ui/button";

export default function ColumnActions({ actions }: { actions: any[] }) {
  const confirm = useAppModal(ConfirmationModal);

  return (
    <div className="flex items-center gap-2">
      {actions.map((a, i) => {
        const handleClick = () => {
          if (a.confirm) {
            confirm.show({
              title: a.confirm.title,
              description: a.confirm.description,
              confirmText: a.confirm.confirmText,
              cancelText: a.confirm.cancelText,
              variant: a.confirm.variant as any,
              onConfirm: async () => {
                await a.onClick();
              },
            });
            return;
          }
          a.onClick();
        };

        return (
          <button
            key={i}
            onClick={handleClick}
            title={a.tooltip}
            className={`px-2 py-1 rounded text-sm ${
              a.danger
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {a.icon ?? a.label}
          </button>
        );
      })}
    </div>
  );
}
