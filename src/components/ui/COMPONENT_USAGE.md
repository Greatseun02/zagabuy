# Typography & Button Components - Usage Guide

## Typography Component

A flexible, modern typography component built with Tailwind CSS.

### Basic Usage

```tsx
import Typography from "@/components/ui/typography";

// Text component (default)
<Typography>Hello World</Typography>

// Display heading
<Typography variant="display" size="xl">
  Large Title
</Typography>

// Custom component element
<Typography component="h1" variant="display" size="2xl">
  Page Title
</Typography>
```

### Props

| Prop        | Type                                                             | Default        | Description                 |
| ----------- | ---------------------------------------------------------------- | -------------- | --------------------------- |
| `variant`   | `"display"` \| `"text"`                                          | `"text"`       | Visual style variant        |
| `size`      | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"2xl"`        | `"sm"`         | Font size                   |
| `weight`    | `"regular"` \| `"medium"` \| `"semibold"` \| `"bold"`            | `"regular"`    | Font weight                 |
| `color`     | `"primary"` \| `"secondary"` \| `"error"` \| `"warning"` \| etc. | `"foreground"` | Text color                  |
| `font`      | `"sans"` \| `"mono"`                                             | `"sans"`       | Font family                 |
| `component` | `"p"` \| `"span"` \| `"h1"` - `"h6"` \| `"div"`                  | `"p"`          | HTML element to render      |
| `className` | `string`                                                         | -              | Additional Tailwind classes |
| `style`     | `CSSProperties`                                                  | -              | Inline styles               |

### Examples

```tsx
// Semantic heading with custom color
<Typography component="h1" variant="display" size="2xl" weight="bold" color="primary">
  Welcome
</Typography>

// Muted text
<Typography size="sm" color="muted-foreground">
  This is secondary text
</Typography>

// Accent color with monospace font
<Typography font="mono" color="accent" weight="semibold">
  const message = "Code"
</Typography>

// Custom color using hex
<Typography color="#FF5733">Custom colored text</Typography>

// Interactive text with hover
<Typography
  className="cursor-pointer hover:text-primary transition-colors"
  color="foreground"
>
  Click me
</Typography>
```

---

## Button Component

A powerful button component with multiple variants, sizes, and features.

### Basic Usage

```tsx
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

// Primary button
<Button>Click me</Button>

// With loading state
<Button isLoading>Processing...</Button>

// With icons
<Button startIcon={Heart}>
  Like
</Button>

<Button endIcon={Share2}>
  Share
</Button>

// Full width
<Button width="full">Submit Form</Button>
```

### Props

| Prop                  | Type                                                                                                       | Default     | Description                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `variant`             | `"primary"` \| `"secondary"` \| `"outline"` \| `"ghost"` \| `"destructive"` \| `"link"` \| `"transparent"` | `"primary"` | Button style variant           |
| `size`                | `"x-small"` \| `"small"` \| `"medium"` \| `"large"` \| `"icon"` \| `"icon-sm"` \| `"icon-lg"`              | `"medium"`  | Button size                    |
| `width`               | `"auto"` \| `"full"` \| `"fit"`                                                                            | `"auto"`    | Button width                   |
| `isLoading`           | `boolean`                                                                                                  | `false`     | Show loading spinner           |
| `loadingText`         | `string`                                                                                                   | -           | Text to show while loading     |
| `loadingSpinnerColor` | `string`                                                                                                   | -           | Custom spinner color (hex/rgb) |
| `startIcon`           | `React.ComponentType<React.SVGProps<SVGSVGElement>>`                                                       | -           | Icon component before text     |
| `endIcon`             | `React.ComponentType<React.SVGProps<SVGSVGElement>>`                                                       | -           | Icon component after text      |
| `disabled`            | `boolean`                                                                                                  | `false`     | Disable button                 |
| `asChild`             | `boolean`                                                                                                  | `false`     | Render as child (for Slot)     |
| `className`           | `string`                                                                                                   | -           | Additional Tailwind classes    |

### Variant Details

#### Primary

- **Usage**: Main call-to-action buttons
- **Style**: Solid background with white text
- **Hover**: Slightly darker background

```tsx
<Button variant="primary">Save Changes</Button>
```

#### Secondary

- **Usage**: Secondary actions
- **Style**: Subtle background
- **Hover**: Darker background

```tsx
<Button variant="secondary">Cancel</Button>
```

#### Outline

- **Usage**: Alternative actions
- **Style**: Border only, transparent background
- **Hover**: Accent background

```tsx
<Button variant="outline">Learn More</Button>
```

#### Ghost

- **Usage**: Tertiary actions, less emphasis
- **Style**: No background or border
- **Hover**: Subtle background

```tsx
<Button variant="ghost">More Options</Button>
```

#### Destructive

- **Usage**: Dangerous actions (delete, remove)
- **Style**: Red background
- **Hover**: Darker red

```tsx
<Button variant="destructive">Delete Account</Button>
```

#### Link

- **Usage**: Link-like button
- **Style**: Text-only with underline on hover
- **Hover**: Underline appears

```tsx
<Button variant="link">View Details</Button>
```

#### Transparent

- **Usage**: Minimal, clean appearance
- **Style**: No background initially
- **Hover**: Subtle background

```tsx
<Button variant="transparent">
  <Settings className="w-4 h-4" />
</Button>
```

### Size Details

#### X-Small (`x-small`)

```tsx
<Button size="x-small">Xs</Button>
```

#### Small (`small`)

```tsx
<Button size="small">Small</Button>
```

#### Medium (`medium`) - Default

```tsx
<Button size="medium">Medium</Button>
```

#### Large (`large`)

```tsx
<Button size="large">Large</Button>
```

#### Icon (`icon`)

```tsx
<Button size="icon">
  <Heart className="w-4 h-4" />
</Button>
```

### Width Options

#### Auto (Default)

```tsx
<Button width="auto">Fits Content</Button>
```

#### Fit

```tsx
<Button width="fit">Also Fits Content</Button>
```

#### Full

```tsx
<Button width="full" className="w-full">
  Full Width Button
</Button>
```

### Complex Examples

#### Button with Icon and Loading State

```tsx
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

export function SendEmailButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Button
      startIcon={Mail}
      isLoading={isLoading}
      loadingText="Sending..."
      onClick={handleSend}
    >
      Send Email
    </Button>
  );
}
```

#### Multiple Button States in Form

```tsx
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle } from "lucide-react";

export function FormActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button variant="primary" endIcon={ChevronRight} width="fit">
        Continue
      </Button>
    </div>
  );
}
```

#### Icon Button Group

```tsx
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageCircle } from "lucide-react";

export function SocialActions() {
  return (
    <div className="flex gap-1">
      <Button size="icon" variant="ghost">
        <Heart className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <MessageCircle className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
```

#### Confirm Delete Modal

```tsx
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteConfirmation() {
  return (
    <div className="flex gap-3">
      <Button variant="outline" width="full">
        Cancel
      </Button>
      <Button variant="destructive" startIcon={Trash2} width="full">
        Delete Forever
      </Button>
    </div>
  );
}
```

#### Loading State Example

```tsx
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";

export function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Button
      startIcon={Save}
      isLoading={isSaving}
      loadingText="Saving..."
      onClick={() => setIsSaving(true)}
    >
      Save Changes
    </Button>
  );
}
```

---

## Styling & Customization

### Custom Colors via Tailwind

```tsx
<Typography className="text-purple-500 dark:text-purple-400">
  Custom purple text
</Typography>
```

### Combining with Button

```tsx
<Button>
  <Typography weight="semibold" size="sm">
    Styled Button Text
  </Typography>
</Button>
```

### Responsive Classes

```tsx
<Button className="w-full sm:w-auto" size="small">
  Responsive Button
</Button>
```

---

## Accessibility

Both components include:

- Proper ARIA attributes
- Focus states with ring indicators
- Keyboard navigation support
- Semantic HTML elements
- High contrast support for dark mode

---

## Migration Guide

### From Old Button Style

```tsx
// Old
<button className="btn btn-primary">Click</button>

// New
<Button variant="primary">Click</Button>
```

### From Old Typography

```tsx
// Old
<h1 className="title">Hello</h1>

// New
<Typography component="h1" variant="display" size="2xl">
  Hello
</Typography>
```

---

## Best Practices

1. **Use semantic components**: Prefer `<Button>` over `<div onClick>` for better accessibility
2. **Choose appropriate variants**: Use `destructive` for dangerous actions, `ghost` for less emphasis
3. **Keep text short**: Buttons should have concise, action-oriented labels
4. **Use icons wisely**: Icons should complement text, not replace it
5. **Loading states**: Always provide feedback during async operations
6. **Consistent sizing**: Maintain consistent button sizes within a feature
7. **Responsive design**: Use `width="full"` on mobile when needed
