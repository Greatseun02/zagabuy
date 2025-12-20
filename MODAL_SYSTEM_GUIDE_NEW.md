# Modal System Documentation

A type-safe, global modal system using NiceModal and BaseModalLayout with a **flat props API**.

## Core Philosophy

✅ **Flat Props** - No nested objects, layout props + business props together  
✅ **Automatic Extraction** - Layout concerns handled by the framework  
✅ **Stable Identity** - Modals created once via `createAppModal`  
✅ **Type Safe** - Full TypeScript inference on all props  
✅ **Clean Logic** - Modal business logic stays clean and isolated

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

## Creating Modals

### Using `createAppModal` (Recommended)

Creates a stable modal component with automatic layout prop handling.

```tsx
// src/components/modals/ProductModal.tsx
import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 1. Define business props interface
export interface ProductModalProps {
  productId: string;
  productName: string;
  onConfirm?: (productId: string) => Promise<void>;
}

// 2. Create modal with createAppModal (business logic only)
export const ProductModal = createAppModal<ProductModalProps>(
  ({ productId, productName, onConfirm }, modal) => {
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
      <div className="py-4">
        <h3 className="font-semibold">{productName}</h3>
        <p className="text-sm text-slate-500 mt-2">Product ID: {productId}</p>

        <div className="flex gap-3 justify-end border-t pt-4 mt-4">
          <Button variant="ghost" onClick={modal.hide}>
            Cancel
          </Button>
          <Button isLoading={loading} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    );
  }
);

ProductModal.displayName = "ProductModal";
```

**Note:** The modal body focuses ONLY on business logic. Layout concerns (title, description, styling) are provided at the call site.

### Using the Modal (Flat Props API)

```tsx
// pages/admin/products/page.tsx
"use client";

import { useAppModal } from "@/hooks/useAppModal";
import { ProductModal } from "@/components/modals/ProductModal";

export default function ProductsPage() {
  const productModal = useAppModal(ProductModal);

  const handleOpenModal = async () => {
    // Flat props - business + layout props together! ✅
    await productModal.show({
      // Business props (ProductModalProps)
      productId: "123",
      productName: "Awesome Product",
      onConfirm: async (id) => console.log("Confirmed:", id),

      // Layout props (BaseModalLayoutProps) - inherited automatically!
      title: "Product Details",
      description: "Edit or view this product",
      maxWidth: "lg",
      rounded: "lg",
      shadow: "lg",
      backdropBlur: true,
      showCloseIcon: true,
    });
  };

  return <button onClick={handleOpenModal}>Open Product Modal</button>;
}
```

**Full type safety!** TypeScript autocomplete shows all valid props.

## Pre-built Modals

### ConfirmationModal

Quick confirmation dialog with customizable buttons and styling.

```tsx
"use client";

import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export default function MyPage() {
  const confirmModal = useAppModal(ConfirmationModal);

  const handleDelete = async () => {
    await confirmModal.show({
      // Layout props
      title: "Delete Item?",
      description: "This action cannot be undone.",
      maxWidth: "sm",

      // Business props
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "destructive",
      onConfirm: async () => {
        // API call
        console.log("Item deleted");
      },
    });
  };

  return <button onClick={handleDelete}>Delete Item</button>;
}
```

## API Reference

### `createAppModal<P>(render)`

Helper to register a modal with automatic layout prop extraction.

**Parameters:**

- `render` - Render function receiving `(businessProps, modal)` and returning React elements

**Returns:** A React component created via `NiceModal.create()`

**Features:**

- ✅ Automatically wraps content in `BaseModalLayout`
- ✅ Extracts layout props from flat props object
- ✅ Passes only business props to render function
- ✅ Modal identity is stable (created once)

### `useAppModal<T>(Modal)`

Hook to control a modal created with `createAppModal`.

**Parameters:**

- `Modal` - Component created via `createAppModal`

**Returns:**

```tsx
{
  show: (props: React.ComponentProps<T>) => Promise<any>;
  hide: () => void;
  remove: () => void;
  visible: boolean;
}
```

**Features:**

- ✅ Full TypeScript inference on all props
- ✅ Flat props API (business + layout)
- ✅ Can be called from anywhere in the app

## BaseModalLayout Props

All these props are automatically supported by `createAppModal` modals:

```tsx
// Layout & Styling
title?: React.ReactNode;           // Header title
description?: React.ReactNode;     // Subtitle/description
variant?: "default" | "compact" | "fullscreen"; // default: "default"
maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";   // default: "lg"
rounded?: "sm" | "md" | "lg" | "xl";            // default: "lg"
shadow?: "sm" | "md" | "lg" | "xl";             // default: "lg"

// Behavior
showCloseIcon?: boolean;           // default: true
closeOnBackdropClick?: boolean;    // default: true
backdropBlur?: boolean;            // default: true

// Custom styling
contentClassName?: string;
headerClassName?: string;
bodyClassName?: string;
```

## Modal Variants

### Default

Standard modal with header border and padding.

```tsx
modal.show({
  title: "Title",
  variant: "default",
});
```

### Compact

Minimal spacing and padding.

```tsx
modal.show({
  title: "Quick Dialog",
  variant: "compact",
  maxWidth: "sm",
});
```

### Fullscreen

Takes full screen space.

```tsx
modal.show({
  title: "Full View",
  variant: "fullscreen",
});
```

## Advanced Examples

### Form Modal

```tsx
import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import BaseCreateOrUpdateForm from "@/components/forms/BaseCreateOrUpdateForm";
import { createCategoryAction } from "@/services/categoryService";
import { categorySchema } from "@/models/validations/CategoryValidation";

export interface CategoryFormModalProps {
  onSuccess?: () => void;
}

export const CategoryFormModal = createAppModal<CategoryFormModalProps>(
  ({ onSuccess }, modal) => (
    <BaseCreateOrUpdateForm
      initialValues={{ name: "", description: "" }}
      validationSchema={categorySchema}
      createAction={createCategoryAction}
      updateAction={async () => ({ responseCode: "OK", responseMessage: "" })}
      onSuccessfulSubmission={() => {
        modal.hide();
        onSuccess?.();
      }}
      renderFields={(formik) => (
        <div className="space-y-4">{/* Form fields */}</div>
      )}
    />
  )
);

// Usage
const modal = useAppModal(CategoryFormModal);
modal.show({
  title: "Create Category",
  maxWidth: "md",
  onSuccess: () => console.log("Category created"),
});
```

### Modal with Async Operations

```tsx
export interface DataModalProps {
  id: string;
  onDelete?: (id: string) => Promise<void>;
}

export const DataModal = createAppModal<DataModalProps>(
  ({ id, onDelete }, modal) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
      setDeleting(true);
      try {
        await onDelete?.(id);
        toast.success("Deleted");
        modal.hide();
      } catch (err) {
        toast.error("Failed to delete");
      } finally {
        setDeleting(false);
      }
    };

    return (
      <div>
        <p>Item ID: {id}</p>
        <button disabled={deleting} onClick={handleDelete}>
          Delete
        </button>
      </div>
    );
  }
);
```

## Best Practices

✅ **Do:**

- Use `createAppModal` for all modals
- Keep modal business logic focused and clean
- Provide layout props at call site (title, maxWidth, etc)
- Set `displayName` for debugging
- Use flat props API

❌ **Don't:**

- Call `NiceModal.create` directly
- Expose modal lifecycle in modal component
- Nest props objects
- Create modals inside hooks (breaks identity)
- Manually wire BaseModalLayout in modals

## Key Differences from Previous API

### Before (❌ Nested Props)

```tsx
const modal = useAppModal(ProductModal);
modal.show({
  businessProps: { productId: "123" },
  layoutProps: { title: "Product", maxWidth: "lg" },
});
```

### After (✅ Flat Props)

```tsx
const modal = useAppModal(ProductModal);
modal.show({
  productId: "123",
  title: "Product",
  maxWidth: "lg",
});
```

## TypeScript Tips

Modal props are fully typed. Your IDE will autocomplete all valid props:

```tsx
const modal = useAppModal(ProductModal);
modal.show({
  // Business props show up first
  productId: "123",
  productName: "Shoes",
  onConfirm: async (id) => console.log(id),

  // Layout props show up next
  title: "...",
  maxWidth: "...",
  variant: "...",
  // ... all BaseModalLayoutProps
});
```

---

**Summary:** This system provides a clean, type-safe, flat API for building and using modals while keeping business logic isolated and layout configuration at the call site.
