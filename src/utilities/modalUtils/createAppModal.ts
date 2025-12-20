"use client";

import React from "react";
import NiceModal, { NiceModalHandler } from "@ebay/nice-modal-react";
import {
  BaseModalLayout,
  BaseModalLayoutProps,
} from "@/components/modals/BaseModalLayout";

/**
 * Helper to create app modals with flat props API and automatic layout handling
 *
 * @example
 * export const ProductModal = createAppModal<{ productId: string }>(
 *   ({ productId }, modal) => (
 *     <div>
 *       <p>Product: {productId}</p>
 *       <button onClick={modal.hide}>Close</button>
 *     </div>
 *   )
 * );
 *
 * // Usage - flat props API with layout props
 * const modal = useAppModal(ProductModal);
 * modal.show({
 *   productId: "123",
 *   title: "Product Details",
 *   maxWidth: "lg",
 * });
 */
export function createAppModal<P extends object = {}>(
  render: (props: P, modal: NiceModalHandler) => React.ReactNode
): React.ComponentType<P & Partial<BaseModalLayoutProps>> {
  // Create the modal component that will be registered with NiceModal
  const ModalComponent = (allProps: P & Partial<BaseModalLayoutProps>) => {
    // Get the modal handler from NiceModal context
    const modal = NiceModal.useModal();

    // Layout props from allProps (with defaults)
    const layoutProps: BaseModalLayoutProps = {
      isOpen: modal.visible,
      onClose: modal.hide,
      title: (allProps as any).title,
      description: (allProps as any).description,
      variant: (allProps as any).variant || "default",
      maxWidth: (allProps as any).maxWidth || "lg",
      rounded: (allProps as any).rounded || "lg",
      shadow: (allProps as any).shadow || "lg",
      showCloseIcon: (allProps as any).showCloseIcon ?? true,
      closeOnBackdropClick: (allProps as any).closeOnBackdropClick ?? true,
      backdropBlur: (allProps as any).backdropBlur ?? true,
      contentClassName: (allProps as any).contentClassName,
      headerClassName: (allProps as any).headerClassName,
      bodyClassName: (allProps as any).bodyClassName,
    };

    // Extract business props (everything except layout props)
    const layoutPropKeys = new Set([
      "title",
      "description",
      "variant",
      "maxWidth",
      "rounded",
      "shadow",
      "showCloseIcon",
      "closeOnBackdropClick",
      "backdropBlur",
      "contentClassName",
      "headerClassName",
      "bodyClassName",
    ]);

    const businessProps = Object.fromEntries(
      Object.entries(allProps).filter(([key]) => !layoutPropKeys.has(key))
    ) as P;

    return React.createElement(
      BaseModalLayout,
      layoutProps,
      render(businessProps, modal)
    );
  };

  // Register with NiceModal
  return NiceModal.create(ModalComponent) as React.ComponentType<
    P & Partial<BaseModalLayoutProps>
  >;
}
