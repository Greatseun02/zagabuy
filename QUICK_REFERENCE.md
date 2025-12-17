# Quick Reference - Typography & Button Components

## Typography - 30-Second Usage

```tsx
import Typography from "@/components/ui/typography";

// Display heading
<Typography component="h1" variant="display" size="2xl">Title</Typography>

// Body text
<Typography>Regular paragraph text</Typography>

// Styled text
<Typography weight="semibold" color="primary">Emphasis</Typography>

// Code text
<Typography font="mono" color="accent">const x = 5</Typography>
```

**All Sizes at a Glance:**
```tsx
<Typography size="xs">Tiny</Typography>
<Typography size="sm">Small</Typography>
<Typography size="md">Medium</Typography>
<Typography size="lg">Large</Typography>
<Typography size="xl">Extra Large</Typography>
<Typography size="2xl">Double Extra Large</Typography>
```

**All Colors:**
```
primary | secondary | error | warning | success | white | muted | 
muted-foreground | foreground | accent | (#hex or rgb)
```

---

## Button - 30-Second Usage

```tsx
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

// Basic
<Button>Click</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="large">Large</Button>

// With icon
<Button startIcon={Heart}>Like</Button>

// Loading
<Button isLoading>Loading...</Button>

// Full width
<Button width="full">Submit</Button>
```

---

## Variant Cheat Sheet

### Typography

| Variant | Use For | Example |
|---------|---------|---------|
| `display` + `2xl` | Page titles | `<Typography variant="display" size="2xl">` |
| `display` + `lg` | Section headers | `<Typography variant="display" size="lg">` |
| `text` + `lg` | Large body | `<Typography size="lg">` |
| `text` + `sm` | Small body | `<Typography size="sm">` |

### Button

| Variant | Use For | Color |
|---------|---------|-------|
| `primary` | Main action | Blue |
| `secondary` | Secondary action | Gray |
| `outline` | Alternative | Bordered |
| `ghost` | Tertiary | Minimal |
| `destructive` | Delete/Remove | Red |
| `link` | Link-like | Text only |
| `transparent` | Icon-only | Minimal |

---

## Common Patterns

### Header with Subtitle
```tsx
<Typography component="h1" variant="display" size="2xl" weight="bold">
  Main Title
</Typography>
<Typography size="lg" color="muted-foreground">
  Subtitle description
</Typography>
```

### Form Button Group
```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Submit</Button>
</div>
```

### Loading Button
```tsx
const [isLoading, setIsLoading] = useState(false);

<Button 
  isLoading={isLoading} 
  onClick={() => { setIsLoading(true); /* ... */ }}
>
  Save Changes
</Button>
```

### Icon Button Group
```tsx
<div className="flex gap-1">
  <Button size="icon" variant="ghost"><Heart /></Button>
  <Button size="icon" variant="ghost"><Share2 /></Button>
  <Button size="icon" variant="ghost"><Settings /></Button>
</div>
```

### Full Width Form
```tsx
<Button width="full" variant="primary" size="large">
  Login
</Button>
```

### Responsive Buttons
```tsx
<div className="flex flex-col sm:flex-row gap-2">
  <Button width="full" variant="outline">Cancel</Button>
  <Button width="full" variant="primary">Save</Button>
</div>
```

---

## Color Combinations (Recommended)

### Professional
- Text: `color="foreground"` (default)
- Headings: `color="primary"`
- Secondary: `color="muted-foreground"`

### With Accents
- Primary buttons: `variant="primary"`
- Accent text: `color="accent"` + `font="mono"`
- Warnings: `color="warning"`
- Errors: `color="error"`

### Dark Mode
All components automatically adapt to dark mode. Colors remain accessible.

---

## Accessibility Essentials

✅ **DO:**
- Use semantic components: `h1`, `h2`, `p`, etc.
- Use `variant="destructive"` for dangerous actions
- Provide `loadingText` or show loading spinner
- Use descriptive button text
- Include `aria-label` for icon-only buttons

❌ **DON'T:**
- Don't disable buttons without feedback
- Don't use color alone to communicate (add text)
- Don't make tiny buttons (min size: `small`)
- Don't skip focus indicators

---

## Troubleshooting

**Button text not showing?**
- Check you're passing `children` or `text` prop
- For icons only, use `size="icon"`

**Color not applied?**
- Use predefined colors: `primary`, `secondary`, `error`, etc.
- Or pass custom color: `color="#ff0000"`

**Loading spinner wrong color?**
- Automatic based on variant
- Override with `loadingSpinnerColor="#color"`

**Typography too small/large?**
- Change `size` prop
- Display sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- Text is more readable than display

---

## Performance Tips

- ✅ Use `Typography` for all text (better tree-shaking)
- ✅ Use `Button` for all interactive elements
- ✅ Icons load on-demand from lucide-react
- ✅ Memoize components if rendering many buttons
- ✅ Use `variant="ghost"` for minimal styling overhead

---

## Integration with Forms

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/typography";

<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div>
      <Typography weight="semibold" className="mb-2">Email</Typography>
      <Input type="email" />
    </div>
    <Button type="submit" width="full">
      Sign In
    </Button>
  </div>
</form>
```

---

## Icon Integration

```tsx
import { Heart, Trash2, Share2, Mail, Settings } from "lucide-react";

// With text
<Button startIcon={Mail}>Send Email</Button>

// Icon only
<Button size="icon"><Heart /></Button>

// End icon
<Button endIcon={Trash2}>Delete</Button>

// Both sides
<Button startIcon={Mail} endIcon={Trash2}>Forward Delete</Button>
```

---

## Size Comparison

```
Typography:        Button:
xs (18px)          x-small (28px)
sm (14px) default  small (32px)
md (16px)          medium (36px) default
lg (18px)          large (40px)
xl (20px)          icon (36px)
2xl (32px)
```

---

## File Locations

- **Components:** 
  - `src/components/ui/typography.tsx`
  - `src/components/ui/button.tsx`

- **Documentation:**
  - `src/components/ui/COMPONENT_USAGE.md` (full docs)
  - `COMPONENTS_IMPLEMENTATION.md` (overview)

- **Demo:**
  - `/component-demo` (interactive showcase)

---

## Need Help?

1. Check the demo page: `/component-demo`
2. Read full docs: `src/components/ui/COMPONENT_USAGE.md`
3. Check implementation notes: `COMPONENTS_IMPLEMENTATION.md`
4. Look at examples in this file
5. Type hints in your IDE will show all options

---

**Last Updated:** December 16, 2025  
**Status:** ✅ Production Ready
