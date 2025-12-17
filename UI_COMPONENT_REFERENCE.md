# 🎨 UI Component System - Complete Reference

## Overview

A modern, type-safe, and modular UI component system built with React 19, TypeScript, Tailwind CSS, and Formik integration.

## 📦 Core Components

### Input Component

**File**: `src/components/ui/input.tsx`

Advanced input component with built-in support for:

- Multiple input types (text, email, password, checkbox, radio, textarea, range)
- Number formatting (whole numbers and decimals)
- Icon support (start/end positions with customizable styling)
- Password visibility toggle
- Copy-to-clipboard functionality
- Formik and React state integration
- Full validation and error display
- Dark mode support

**Basic Usage**:

```tsx
<Input
  name="email"
  type="email"
  label="Email Address"
  placeholder="your@email.com"
  formik={formik}
/>
```

**With Formatting**:

```tsx
<Input
  name="amount"
  type="text"
  label="Amount (USD)"
  formatNumberWithCommas
  formatDecimalNumberWithCommas
  decimalPlaces={2}
  minNumberValue={0}
  maxNumberValue={999999}
  formik={formik}
/>
```

**With Icons**:

```tsx
<Input
  name="password"
  type="password"
  label="Password"
  startIcon={LockKeyhole}
  endIcon={{ icon: Eye, className: "text-blue-500" }}
  formik={formik}
/>
```

### Button Component

**File**: `src/components/ui/button.tsx`

Feature-rich button with CVA-based variants:

**Variants**:

- `primary` - Primary action (filled)
- `secondary` - Secondary action (muted)
- `outline` - Outlined style
- `ghost` - Minimal style
- `destructive` - Danger action
- `link` - Text link style
- `transparent` - Transparent background

**Sizes**:

- `x-small`, `small`, `medium`, `large` - Text buttons
- `icon`, `icon-sm`, `icon-lg` - Icon buttons

**Width Options**:

- `auto` - Natural width
- `full` - Full width
- `fit` - Fit content

**Usage with Icons**:

```tsx
// Component-based icon
<Button
  startIcon={Plus}
  variant="primary"
>
  Add Item
</Button>

// Icon object with custom styling
<Button
  startIcon={{
    icon: SunMoon,
    className: "size-6 text-yellow-500"
  }}
  variant="transparent"
  size="icon-lg"
/>
```

**With Loading State**:

```tsx
<Button isLoading loadingText="Saving..." loadingSpinnerColor="#ffffff">
  Save Changes
</Button>
```

## 🎯 Icon System

### Type Definitions

**File**: `src/utilities/types/iconTypes.ts`

Comprehensive icon type support:

```tsx
// Icon can be:
type IconType =
  | string                  // URL or base64
  | React.ReactElement      // <Icon />
  | React.FC<SVGProps>      // Icon component
  | (props) => ReactElement // Function
  | {                       // Icon spec object
      icon: IconComponent
      className?: string
      style?: CSSProperties
      [key: string]: any
    }
```

### Icon Renderer

**File**: `src/utilities/helpers/iconRenderer.ts`

Universal icon rendering with utilities:

```tsx
// Render any icon format
import { renderIcon } from "@/utilities/helpers/iconRenderer";

renderIcon(SunIcon, {
  size: "24px",
  className: "text-blue-500",
});

// Hook-based usage
import { useIconRenderer } from "@/utilities/helpers/iconRenderer";

const { render } = useIconRenderer();
render(MyIcon, props);
```

**Utility Functions**:

- `renderIcon(icon, props)` - Main rendering function
- `useIconRenderer()` - React hook wrapper
- `getIconClassName(base, custom)` - Class merging
- `mergeIconProps(defaults, custom)` - Props merging

## 🪝 Input Hooks

**File**: `src/utilities/hooks/useInput.ts`

Reusable hooks for input functionality:

### useInputFormatting

Handle number formatting with optional Formik integration:

```tsx
const {
  handleWholeNumberChange,
  handleNumberChange,
  formatWholeNumberDisplay,
  formatDisplayValue,
} = useInputFormatting(formik, "amount", {
  decimalPlaces: 2,
  maxNumberValue: 999999,
  minNumberValue: 0,
  allowNegative: false,
});
```

### useCopyToClipboard

Manage copy-to-clipboard state and feedback:

```tsx
const { isCopied, copyToClipboard } = useCopyToClipboard(3000);

const handleCopy = () => {
  copyToClipboard("text to copy");
};
```

### usePasswordVisibility

Toggle password visibility:

```tsx
const { isVisible, toggle, type } = usePasswordVisibility()

<input type={type} />
<button onClick={toggle}>
  {isVisible ? 'Hide' : 'Show'}
</button>
```

## 📋 Component Props

### InputProps Interface

```tsx
interface InputProps<T extends FormikValues = any> {
  // Basic
  name?: string;
  type?: HTMLInputElement["type"];
  placeholder?: string;
  className?: string;

  // Icons
  startIcon?: IconType;
  endIcon?: IconType;
  startIconProps?: IconRenderProps;
  endIconProps?: IconRenderProps;

  // Label & Help
  label?: string;
  helperText?: string;
  error?: string;

  // Formik
  formik?: Formik<T>;

  // Number Formatting
  formatNumberWithCommas?: boolean;
  formatDecimalNumberWithCommas?: boolean;
  decimalPlaces?: number;
  maxNumberValue?: number;
  minNumberValue?: number;
  allowNegative?: boolean;

  // Special Features
  copyTextOnly?: boolean; // Show copy button
  multiline?: boolean; // Textarea mode
  rangeType?: "percentage" | "number"; // Range label
}
```

### ButtonProps Interface

```tsx
interface ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link"
    | "transparent";
  size?:
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "icon"
    | "icon-sm"
    | "icon-lg";
  width?: "auto" | "full" | "fit";

  // Icons
  startIcon?: IconType;
  startIconProps?: IconRenderProps;
  endIcon?: IconType;
  endIconProps?: IconRenderProps;

  // State
  isLoading?: boolean;
  loadingText?: string;
  loadingSpinnerColor?: string;

  // Native
  asChild?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

## 🎨 Styling

All components use Tailwind CSS with no SCSS modules. Dark mode is automatically supported through Tailwind's dark mode utilities.

### Color System

Colors are defined in `src/app/globals.css` using CSS variables:

- `--primary` - Primary color
- `--secondary` - Secondary color
- `--destructive` - Error/danger color
- `--muted-foreground` - Muted text
- etc.

### Customization

Override any component via Tailwind classes:

```tsx
<Input
  className="border-2 border-red-500 focus:ring-red-500"
  label="Custom styled input"
/>

<Button
  className="bg-gradient-to-r from-purple-500 to-pink-500"
  variant="primary"
>
  Gradient Button
</Button>
```

## 🚀 Best Practices

### 1. Use TypeScript

Always import and use types for better IDE support:

```tsx
import { InputProps, ButtonProps } from "@/components/ui";
import type { IconType } from "@/utilities/types/iconTypes";
```

### 2. Icon Objects Over Strings

Prefer icon objects for better styling control:

```tsx
// ✅ Preferred
<Button startIcon={{ icon: Plus, className: "size-5" }} />

// ✅ Also works
<Button startIcon={Plus} />

// ❌ Avoid URL strings unless necessary
<Button startIcon="/icon.svg" />
```

### 3. Formik Integration

Always pass form instance for automatic validation:

```tsx
<Input
  name="email"
  formik={formik} // Automatic validation & error display
/>
```

### 4. Icon Sizing

Use consistent sizes across your app:

```tsx
// Standard sizes
startIconSize = "1em"; // Default
startIconSize = "1.25em"; // Slightly larger
startIconSize = "24px"; // Explicit pixel size
```

### 5. Number Formatting

Choose the right formatter for your data:

```tsx
// Whole numbers with commas
formatNumberWithCommas: true;
// 1,234,567

// Decimals with commas
formatDecimalNumberWithCommas: true;
decimalPlaces: 2;
// 1,234,567.89
```

## 🔄 Migration Guide

### From Old Input System

If you were using the old `BaseInput` component:

```tsx
// Old (no longer needed)
import BaseInput from "@/components/modified-ui/BaseInput";

// New (consolidated)
import { Input } from "@/components/ui/input";

// API is the same, just updated import!
```

### Icon Usage Update

New icon object format provides more flexibility:

```tsx
// Old style (still works)
<Button startIcon={MyIcon} />

// New style (preferred)
<Button
  startIcon={{
    icon: MyIcon,
    className: "text-blue-500"
  }}
/>
```

## 🧪 Testing

Example test cases:

```tsx
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Test" name="test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input label="Test" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
```

## 📚 Additional Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Formik**: https://formik.org
- **Lucide Icons**: https://lucide.dev
- **CVA**: https://cva.style

---

**Version**: 1.0.0
**Last Updated**: December 16, 2025
**Status**: ✅ Production Ready
