# FormikSelect Component

A reusable, accessible `<select>` component with full Formik integration, built on Radix UI primitives.

## Features

✅ **Full Formik Integration** - Automatic field value sync, error display, touched state  
✅ **Accessible** - ARIA attributes, keyboard navigation (Radix UI)  
✅ **Tailwind Styled** - Consistent with your design system  
✅ **Grouped Options** - Support for option grouping  
✅ **TypeScript** - Fully typed with generic value support  
✅ **Flexible** - Controlled or Formik-driven

## Installation

The component is already created at:  
`src/components/ui/formik-select.tsx`

## Basic Usage

```tsx
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormikSelect } from "@/components/ui/formik-select";

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

export default function MyForm() {
  const formik = useFormik({
    initialValues: { country: "" },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormikSelect
        label="Country"
        name="country"
        formik={formik}
        options={countries}
        placeholder="Choose a country..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## With Grouped Options

```tsx
const options = [
  { value: "ny", label: "New York", group: "United States" },
  { value: "ca", label: "California", group: "United States" },
  { value: "on", label: "Ontario", group: "Canada" },
  { value: "qc", label: "Quebec", group: "Canada" },
];

<FormikSelect label="Region" name="region" formik={formik} options={options} />;
```

## Props

### FormikSelectProps<T, V>

| Prop                 | Type                                | Default              | Description                                                 |
| -------------------- | ----------------------------------- | -------------------- | ----------------------------------------------------------- |
| `label`              | `string`                            | -                    | Form label above select                                     |
| `name`               | `string`                            | `""`                 | Formik field name                                           |
| `formik`             | `Formik<T>`                         | -                    | Formik instance (optional if using `value`/`onValueChange`) |
| `options`            | `FormikSelectOption<V>[]`           | **required**         | Array of options to display                                 |
| `placeholder`        | `string`                            | `"Select an option"` | Placeholder text                                            |
| `value`              | `V`                                 | -                    | Controlled value (for non-Formik usage)                     |
| `onValueChange`      | `(value: V, prevValue?: V) => void` | -                    | Callback when value changes                                 |
| `error`              | `string`                            | -                    | Error message (shows in red)                                |
| `helperText`         | `string`                            | -                    | Helper text below select                                    |
| `disabled`           | `boolean`                           | `false`              | Whether select is disabled                                  |
| `size`               | `"sm" \| "default"`                 | `"default"`          | Select size                                                 |
| `containerClassName` | `string`                            | -                    | Custom container classes                                    |

### FormikSelectOption<V>

```tsx
type FormikSelectOption<V = string | number> = {
  value: V;
  label: string;
  group?: string; // Optional group name
  disabled?: boolean; // Disable individual option
};
```

## Advanced Usage

### With Custom Types

```tsx
type UserRole = "admin" | "editor" | "viewer";

const roleOptions: FormikSelectOption<UserRole>[] = [
  { value: "admin", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

<FormikSelect<YourFormType, UserRole>
  name="role"
  formik={formik}
  options={roleOptions}
/>;
```

### Without Formik (Controlled Component)

```tsx
const [value, setValue] = useState("");

<FormikSelect
  value={value}
  onValueChange={(newValue) => setValue(newValue)}
  options={countries}
/>;
```

### With Custom Validation

```tsx
const formik = useFormik({
  initialValues: { country: "" },
  validationSchema: Yup.object({
    country: Yup.string()
      .required("Country is required")
      .oneOf(
        countries.map((c) => c.value),
        "Invalid country selected"
      ),
  }),
  onSubmit: (values) => {
    // Handle submission
  },
});

<FormikSelect
  label="Country"
  name="country"
  formik={formik}
  options={countries}
  error={formik.errors.country} // Pass error explicitly if needed
/>;
```

## Component Integration Examples

### In a Modal Form

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormikSelect } from "@/components/ui/formik-select";

export function UserSettingsModal({ isOpen, onClose }) {
  const formik = useFormik({
    // ... config
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormikSelect
            label="Department"
            name="department"
            formik={formik}
            options={departments}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### In a Multi-Step Form

```tsx
export function StepTwo({ formik }) {
  return (
    <div className="space-y-4">
      <FormikSelect
        label="Account Type"
        name="accountType"
        formik={formik}
        options={[
          { value: "personal", label: "Personal Account" },
          { value: "business", label: "Business Account" },
        ]}
      />
      <FormikSelect
        label="Industry"
        name="industry"
        formik={formik}
        options={industries}
        helperText="Select your primary industry"
      />
    </div>
  );
}
```

## Styling Customization

### Override Default Styles

```tsx
<FormikSelect
  label="Country"
  name="country"
  formik={formik}
  options={countries}
  containerClassName="bg-primary/5 rounded-lg p-2"
/>
```

The component uses Tailwind CSS and respects your design tokens (colors, spacing, etc.) defined in `globals.css`.

## Accessibility

The component is built on **Radix UI Select** and includes:

- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation (arrow keys, Enter, Escape)
- ✅ Screen reader support
- ✅ Focus management
- ✅ Disabled state handling

## Error Handling

Error display hierarchy:

1. Explicit `error` prop (highest priority)
2. Formik field errors (`formik.errors[name]`)
3. Helper text fallback

```tsx
// Formik errors automatically display when field is touched
<FormikSelect
  name="country"
  formik={formik}
  options={countries}
  helperText="Choose your home country"
  // Error will show if validation fails after touch
/>
```

## Migration from ModernSelect

If migrating from the old `ModernSelect` component:

**Before:**

```tsx
<ModernSelect
  options={selectOptions}
  onOptionSelect={handleSelect}
  formik={formik}
  name="field"
/>
```

**After:**

```tsx
<FormikSelect
  options={selectOptions}
  onValueChange={(val) => console.log(val)}
  formik={formik}
  name="field"
/>
```

Key differences:

- Removed SCSS module styling (now Tailwind)
- Simplified props API
- Better TypeScript support
- Built-in grouped options support
- Consistent with other UI components

## Troubleshooting

### Select not updating Formik values

Ensure `name` prop matches your Formik `initialValues` key:

```tsx
const formik = useFormik({
  initialValues: { country: "" },  // ← key must match name prop
});

<FormikSelect name="country" formik={formik} /> ✅
```

### Option not showing as selected

Make sure option values match exactly (type and value):

```tsx
// ❌ Won't work - type mismatch
options={[{ value: 1, label: "One" }]}
formik.values.field // "" (string)

// ✅ Will work
options={[{ value: "", label: "Select..." }]}
formik.values.field // "" (string)
```

### Styled differently than other components

Pass `containerClassName` to adjust spacing/layout:

```tsx
<FormikSelect containerClassName="mb-6 gap-2" options={options} />
```
