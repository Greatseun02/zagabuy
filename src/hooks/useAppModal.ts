"use client";

import { useCallback } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

/**
 * Type-safe hook for using modals created with createAppModal
 *
 * Provides full TypeScript inference for all modal props (business + layout)
 * and exposes modal lifecycle methods (show, hide, remove)
 *
 * @example
 * // Define your modal with createAppModal
 * export const ProductModal = createAppModal<{ productId: string }>(
 *   ({ productId }, modal) => (
 *     <div>
 *       <p>Product: {productId}</p>
 *       <button onClick={modal.hide}>Close</button>
 *     </div>
 *   )
 * );
 *
 * // Use it anywhere with full type safety
 * const modal = useAppModal(ProductModal);
 *
 * // Flat props API - business props + layout props
 * modal.show({
 *   productId: "123",
 *   title: "Product Details",
 *   maxWidth: "lg",
 * });
 */
export function useAppModal<T extends React.ComponentType<any>>(
  ModalComponent: T
): {
  show: (props: React.ComponentProps<T>) => Promise<any>;
  hide: () => void;
  remove: () => void;
  visible: boolean;
} {
  const modal = useModal(ModalComponent as any);

  return {
    show: useCallback(
      (props: React.ComponentProps<T>) => modal.show(props),
      [modal]
    ),
    hide: useCallback(() => modal.hide(), [modal]),
    remove: useCallback(() => modal.remove(), [modal]),
    visible: modal.visible,
  };
}
