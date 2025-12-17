# Typography & Button Components - Visual Guide

## 📐 Typography Sizing Chart

```
DISPLAY VARIANT (Headings)
┌─────────────────────────────────────┐
│ size="2xl" - 32px / 48px          │ Main Page Title
│                                     │ H1 equivalent
├─────────────────────────────────────┤
│ size="xl" - 24px / 36px            │ Section Header
│                                     │ H1/H2 equivalent
├─────────────────────────────────────┤
│ size="lg" - 18px / 28px            │ Subsection Header
│                                     │ H2/H3 equivalent
├─────────────────────────────────────┤
│ size="md" - 16px / 24px            │ Small Header
│                                     │ H3/H4 equivalent
├─────────────────────────────────────┤
│ size="sm" - 14px / 20px            │ Minor Header
│                                     │ H4/H5 equivalent
├─────────────────────────────────────┤
│ size="xs" - 12px / 16px            │ Caption Header
│                                     │ H5/H6 equivalent
└─────────────────────────────────────┘

TEXT VARIANT (Body)
┌─────────────────────────────────────┐
│ size="2xl" - 24px / 32px          │ Large Display Text
├─────────────────────────────────────┤
│ size="xl" - 20px / 28px            │ Extra Large Body
├─────────────────────────────────────┤
│ size="lg" - 18px / 28px            │ Large Body
├─────────────────────────────────────┤
│ size="md" - 16px / 24px            │ Default Body
├─────────────────────────────────────┤
│ size="sm" - 14px / 20px            │ Small Body
├─────────────────────────────────────┤
│ size="xs" - 12px / 16px            │ Extra Small Body
└─────────────────────────────────────┘
```

---

## 🎨 Typography Weight & Color Examples

```
WEIGHTS:
┌──────────────────────────────────────────┐
│ Regular (400)      - Normal text         │
│ Medium (500)       - Slightly bolder     │
│ Semibold (600)     - Noticeable emphasis │
│ Bold (700)         - Strong emphasis     │
└──────────────────────────────────────────┘

COLORS:
┌──────────────────────────────────────────┐
│ 🟦 primary         - Main brand color    │
│ ⬜ secondary       - Secondary color    │
│ 🔴 error          - Errors/alerts       │
│ 🟨 warning        - Warnings            │
│ 🟩 success        - Success/good        │
│ ⬜ foreground      - Main text           │
│ ⬛ muted-foreground - Secondary text    │
│ ⚪ white          - White text          │
│ 🔷 accent         - Accent/highlights   │
│ 🎨 #custom        - Any CSS color       │
└──────────────────────────────────────────┘

FONTS:
┌──────────────────────────────────────────┐
│ sans - Default readable font (Most use)  │
│ mono - Monospace font (Code, technical)  │
└──────────────────────────────────────────┘
```

---

## 🔘 Button Sizing Chart

```
SIZE COMPARISON:
┌────────────────────────────────────────────┐
│ x-small    [    Small    ]    28px height │
├────────────────────────────────────────────┤
│ small      [    Smaller    ]   32px height │
├────────────────────────────────────────────┤
│ medium     [  Default Button  ]  36px (9)  │
├────────────────────────────────────────────┤
│ large      [   Large Button   ]  40px (10) │
├────────────────────────────────────────────┤
│ icon       [   🔍   ]         36px square  │
├────────────────────────────────────────────┤
│ icon-sm    [🔍]               32px square  │
├────────────────────────────────────────────┤
│ icon-lg    [    🔍    ]       40px square  │
└────────────────────────────────────────────┘
```

---

## 🎨 Button Variant Visual Guide

```
VARIANT STYLES & COLORS:

┌─────────────────────────────────────────┐
│ PRIMARY (Blue Background)               │
│ ┌─────────────────────────────────────┐ │
│ │  Click Me                           │ │ Default state
│ ├─────────────────────────────────────┤ │
│ │  Click Me                           │ │ Hover (darker)
│ ├─────────────────────────────────────┤ │
│ │  ⟳ Loading...                       │ │ Loading state
│ ├─────────────────────────────────────┤ │
│ │  Click Me                           │ │ Disabled (faded)
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ SECONDARY (Gray Background)             │
│ ┌─────────────────────────────────────┐ │
│ │  Click Me                           │ │ Default state
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ OUTLINE (Bordered)                      │
│ ┌─────────────────────────────────────┐ │
│ │  Click Me                           │ │ Default
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ GHOST (Minimal)                         │
│ ┌─────────────────────────────────────┐ │
│   Click Me                              │ No background
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ DESTRUCTIVE (Red Background)            │
│ ┌─────────────────────────────────────┐ │
│ │  🗑️ Delete                          │ │ Delete action
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ LINK (Text Only)                        │
│   Click Me                              │ Link styling
├─────────────────────────────────────────┤
│ TRANSPARENT (Minimal)                   │
│   🔍                                    │ Icon only
└─────────────────────────────────────────┘
```

---

## 📏 Button Width Options

```
WIDTH BEHAVIOR:

auto (Default)
┌──────────────┐
│ Click Me     │  Fits content width
└──────────────┘

fit
┌──────────────┐
│ Click Me     │  Same as auto
└──────────────┘

full
┌─────────────────────────────────────┐
│         Full Width Button            │  Extends to 100%
└─────────────────────────────────────┘
```

---

## 🎭 Button with Icons

```
START ICON:
┌──────────────────────────────┐
│ ✉️  Send Email              │
└──────────────────────────────┘

END ICON:
┌──────────────────────────────┐
│ Next Step          ➜         │
└──────────────────────────────┘

BOTH ICONS:
┌──────────────────────────────┐
│ 📎 Add File        ➜         │
└──────────────────────────────┘

ICON ONLY:
┌──────┐
│  ❤️   │
└──────┘
```

---

## 🔄 Button States & Transitions

```
STATE FLOW:

        Default
           ↓
    [   Normal   ]  → User hovers
           ↓
        Hover (opacity/color change)
           ↓
    [  Darker  ]  → User clicks
           ↓
        Active (more change)
           ↓
    [  Active   ]  → Release mouse
           ↓
        Hover
           ↓
    [  Darker  ]

LOADING STATE:

    [   Save   ]  → Click
           ↓
    [ ⟳ Saving... ]  → Processing
           ↓
    [   Save   ]  → Complete

DISABLED STATE:

    [ Disabled ]  → Grayed out
                  → Not clickable
                  → Cursor not-allowed
```

---

## 🎯 Color System

```
SEMANTIC COLORS:

🔵 Primary
   └─ Main actions, links, focus states

⚪ Secondary
   └─ Supporting actions, alternatives

🔴 Error/Destructive
   └─ Errors, dangerous actions

🟨 Warning
   └─ Warnings, cautions

🟩 Success
   └─ Success messages, confirmations

⬜ Neutral
   └─ Backgrounds, borders, disabled

🎨 Custom
   └─ Any CSS color value

DARK MODE SUPPORT:
✅ All colors automatically adjust
✅ Maintains contrast ratios
✅ No extra styling needed
```

---

## 📱 Responsive Layout Examples

```
MOBILE (Full Width):
┌──────────────────────┐
│  Full Width Button   │
├──────────────────────┤
│  Another Full Button │
└──────────────────────┘

TABLET (Side by Side):
┌─────────────────────────────────┐
│  Button  │  Second Button       │
├─────────────────────────────────┤
│  One More  │  And One More      │
└─────────────────────────────────┘

DESKTOP (Flexible):
┌─────────────────────────────────────────┐
│  Button  │  Secondary  │  Link         │
├─────────────────────────────────────────┤
│ Primary  │ Outline │ Ghost │ Transparent │
└─────────────────────────────────────────┘
```

---

## 🎓 Typography Usage Patterns

```
HEADER + SUBTITLE:
┌────────────────────────────────┐
│ Main Heading (display, 2xl)    │ H1
├────────────────────────────────┤
│ Subtitle text (text, lg, muted-foreground)
│ This explains the page         │
└────────────────────────────────┘

SECTION + BODY:
┌────────────────────────────────┐
│ Section Title (display, xl)    │ H2
├────────────────────────────────┤
│ Body paragraph text (text, md) │
│ Regular weight for readability │
│ Using primary color            │
└────────────────────────────────┘

STYLED ELEMENTS:
┌────────────────────────────────┐
│ Important (bold, primary)      │
│ Secondary (semibold, muted)    │
│ Code (mono, accent)            │
│ Error (error color)            │
└────────────────────────────────┘
```

---

## ⚙️ Component Integration Map

```
APP STRUCTURE:

└─ Page
   ├─ Hero Section
   │  ├─ Typography (display, size xl)
   │  ├─ Typography (text, size lg)
   │  └─ Button (primary, large)
   │
   ├─ Feature Cards
   │  ├─ Card
   │  │  ├─ Typography (h3)
   │  │  ├─ Typography (body)
   │  │  └─ Button (outline)
   │  └─ Card
   │
   └─ Form
      ├─ Typography (label)
      ├─ Input
      ├─ Typography (helper, muted)
      └─ Button (primary, full width)
```

---

## 🎯 Decision Tree: Which Variant?

```
TYPOGRAPHY VARIANT?
├─ Is it a heading?
│  ├─ Yes → variant="display"
│  └─ No  → variant="text" (default)
│
└─ What size?
   ├─ Very small → size="xs" or "sm"
   ├─ Small → size="sm" or "md"
   ├─ Medium → size="md" or "lg" ✓
   ├─ Large → size="lg" or "xl"
   └─ Extra large → size="xl" or "2xl"

BUTTON VARIANT?
├─ Is it the main action?
│  ├─ Yes → variant="primary"
│  ├─ Dangerous (delete)? → variant="destructive"
│  ├─ Alternative? → variant="outline"
│  ├─ Less important? → variant="ghost"
│  ├─ Link-like? → variant="link"
│  └─ Icon only? → variant="transparent"
│
└─ What size?
   ├─ Icon only → size="icon" (or sm/lg)
   ├─ Mobile → size="small" or "medium"
   ├─ Desktop → size="medium" or "large"
   └─ Compact → size="x-small"

WIDTH?
├─ Form submit → width="full"
├─ Action group → width="auto"
└─ Content fit → width="fit"
```

---

## 📊 Typography Color Contrast Matrix

```
Color Combinations (✓ = Good):

           Light   Dark
Primary     ✓      ✓
Secondary   ✓      ✓
Error       ✓      ✓
Warning     ✓      ✓
Success     ✓      ✓
Foreground  ✓      ✓
Muted-FG    ✓      ✓
White       ✓      ✓
Accent      ✓      ✓

All combinations meet WCAG AA standards
for both light and dark modes.
```

---

## 🔄 Loading State Behavior

```
BEFORE LOADING:
┌──────────────────────┐
│   Send Email        │ Button visible
└──────────────────────┘

DURING LOADING:
┌──────────────────────┐
│   ⟳ Sending...      │ Spinner visible
│   (disabled)         │ Button disabled
└──────────────────────┘

AFTER LOADING:
┌──────────────────────┐
│   Send Email        │ Back to normal
└──────────────────────┘

TIMING:
0ms - Loading starts (spinner appears)
X ms - Loading completes (spinner disappears)
      Button re-enabled automatically
```

---

## 🎨 Dark Mode Support

```
LIGHT MODE:
┌──────────────────────────────────┐
│ Light background (#FAFAF9)       │
│ Dark text (#1F2937)              │
│ Blue buttons & links             │
│ Subtle shadows                   │
└──────────────────────────────────┘

DARK MODE:
┌──────────────────────────────────┐
│ Dark background (#0F172A)        │
│ Light text (#F8FAFC)             │
│ Adjusted button colors           │
│ Elevated shadows                 │
└──────────────────────────────────┘

NO EXTRA WORK NEEDED:
✓ Automatic dark: prefix support
✓ Colors adjust intelligently
✓ Contrast maintained
✓ Animations smooth in both modes
```

---

## 📋 Component Slot Reference

```
TYPOGRAPHY RENDERING:
┌──────────────────────────────┐
│ <Component>                  │
│ ├─ className (tailwind)      │
│ ├─ style (optional)          │
│ ├─ color (CSS value)         │
│ ├─ ref (forwardable)         │
│ └─ children                  │
└──────────────────────────────┘

BUTTON RENDERING:
┌──────────────────────────────┐
│ <button>                     │
│ ├─ startIcon (optional)      │
│ ├─ content                   │
│ │  ├─ text OR                │
│ │  └─ spinner                │
│ ├─ endIcon (optional)        │
│ └─ disabled (if loading)     │
└──────────────────────────────┘
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** December 16, 2025  
**Status:** ✅ Complete

This visual guide helps you understand the components at a glance!
