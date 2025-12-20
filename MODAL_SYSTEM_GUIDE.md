# Modal System Documentation

A type-safe, developer-friendly global modal system built with nicemodal and shadcn/ui Dialog.

## Setup

1. **Wrap your app with ModalProvider:**

```tsx
// src/app/layout.tsx or src/components/custom/providers.tsx

import { ModalProvider } from "@/components/modals/ModalProvider";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
```

## Usage Patterns

### Pattern 1: Using `useAppModal` Hook (Recommended)

Create a typed modal component and call it anywhere with full type safety.

```tsx
// components/modals/ProductModal.tsx
import NiceModal from "@ebay/nice-modal-react";
import { BaseModalLayout } from "@/components/modals/BaseModalLayout";
import { useAppModal } from "@/hooks/useAppModal";
import { Button } from "@/components/ui/button";

export interface ProductModalProps {
  productId: string;
  productName: string;
  onConfirm?: (productId: string) => Promise<void>;
}

export const ProductModal = NiceModal.create(
  ({ productId, productName, onConfirm }: ProductModalProps) => {
    const modal = useAppModal(ProductModal);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
      setLoading(true);
      try {
        await onConfirm?.(productId);
        modal.hide();
      } finally {
        setLoading(false);
      }
    };

    return (
      <BaseModalLayout
        isOpen={modal.visible}
        onClose={modal.hide}
        title="Product Details"
        description={`ID: ${productId}`}
        maxWidth="lg"
        rounded="lg"
        shadow="lg"
      >
        <div className="py-4">
          <h3 className="font-semibold">{productName}</h3>
          <p className="text-sm text-slate-500 mt-2">Product ID: {productId}</p>
        </div>

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="ghost" onClick={modal.hide}>
            Cancel
          </Button>
          <Button isLoading={loading} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </BaseModalLayout>
    );
  }
);

ProductModal.displayName = "ProductModal";
```

**Using the modal:**

```tsx
// pages/admin/products/page.tsx
"use client";

import { useAppModal } from "@/hooks/useAppModal";
import { ProductModal } from "@/components/modals/ProductModal";

export default function ProductsPage() {
  const productModal = useAppModal(ProductModal);

  const handleOpenModal = async () => {
    // Full type safety! TypeScript knows ProductModalProps
    await productModal.show({
      productId: "123",
      productName: "Awesome Product",
      onConfirm: async (id) => {
        console.log("Confirmed:", id);
        // API call here
      },
    });
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Product Modal</button>
    </div>
  );
}
```

### Pattern 2: Using Pre-built `ConfirmationModal`

For quick confirmation dialogs:

```tsx
"use client";

import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export default function MyPage() {
  const confirmModal = useAppModal(ConfirmationModal);

  const handleDelete = async () => {
    await confirmModal.show({
      title: "Delete Item?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        // API call
        console.log("Item deleted");
      },
    });
  };

  return <button onClick={handleDelete}>Delete Item</button>;
}
```

## BaseModalLayout Props

```tsx
interface BaseModalLayoutProps {
  // State
  isOpen: boolean;
  onClose: () => void;

  // Content
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;

  // Styling & Variants
  variant?: "default" | "compact" | "fullscreen"; // default: "default"
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"; // default: "lg"
  rounded?: "sm" | "md" | "lg" | "xl"; // default: "lg"
  shadow?: "sm" | "md" | "lg" | "xl"; // default: "lg"

  // Behavior
  showCloseIcon?: boolean; // default: true
  closeOnBackdropClick?: boolean; // default: true
  backdropBlur?: boolean; // default: true

  // Custom classes
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}
```

## BaseModalLayout Variants

### Default

Clean, standard modal with borders and padding.

```tsx
<BaseModalLayout isOpen onClose={() => {}} title="Dialog" variant="default" />
```

### Compact

Reduced padding, minimal spacing.

```tsx
<BaseModalLayout isOpen onClose={() => {}} title="Quick" variant="compact" />
```

### Fullscreen

Takes full screen space.

```tsx
<BaseModalLayout isOpen onClose={() => {}} title="Full" variant="fullscreen" />
```

## Advanced Example: Form Modal

```tsx
import NiceModal from "@ebay/nice-modal-react";
import { BaseModalLayout } from "@/components/modals/BaseModalLayout";
import { useAppModal } from "@/hooks/useAppModal";
import BaseCreateOrUpdateForm from "@/components/forms/BaseCreateOrUpdateForm";
import { createCategoryAction } from "@/services/categoryService";

export interface CategoryFormModalProps {
  title?: string;
  onSuccess?: () => void;
}

export const CategoryFormModal = NiceModal.create(
  ({ title = "Create Category", onSuccess }: CategoryFormModalProps) => {
    const modal = useAppModal(CategoryFormModal);

    return (
      <BaseModalLayout
        isOpen={modal.visible}
        onClose={modal.hide}
        title={title}
        maxWidth="md"
      >
        <BaseCreateOrUpdateForm
          initialValues={{ name: "", description: "" }}
          validationSchema={categorySchema}
          createAction={createCategoryAction}
          updateAction={async () => ({
            responseCode: "OK",
            responseMessage: "",
          })}
          onSuccessfulSubmission={() => {
            modal.hide();
            onSuccess?.();
          }}
          renderFields={(formik) => (
            <div className="space-y-4">{/* Form fields here */}</div>
          )}
        />
      </BaseModalLayout>
    );
  }
);
```

## Key Features

✅ **Type Safe**: Full TypeScript support for modal props  
✅ **Extensible**: Create any modal component with BaseModalLayout  
✅ **Easy**: Simple hook-based API (`useAppModal`)  
✅ **Variants**: Multiple modal styles and sizes  
✅ **Developer Experience**: No need to interact with Dialog directly  
✅ **Global**: Access modals from anywhere in the app  
✅ **Customizable**: Backdrop blur, close icon, click-to-close, etc.

## Tips

- Always set `displayName` on your modal for debugging
- Use `BaseModalLayout` instead of `Dialog` directly
- `useAppModal` handles all the plumbing for you
- Modals auto-register with nicemodal via `NiceModal.create()`
