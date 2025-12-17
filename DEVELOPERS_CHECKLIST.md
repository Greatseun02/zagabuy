# Developer's Checklist - Using Typography & Button Components

## Before You Start Coding

- [ ] I've seen the `/component-demo` page
- [ ] I've read the component documentation
- [ ] I understand the color palette available
- [ ] I know when to use each variant

## When Adding Typography

### Selecting the Right Element

- [ ] Using semantic HTML (`h1`, `h2`, `p`, etc.)
- [ ] Using `component="h1"` for main page title only
- [ ] Using `component="h2"` for section headings
- [ ] Using default `p` for body text

### Selecting the Right Variant

- [ ] Using `variant="display"` for headings/titles
- [ ] Using `variant="text"` (default) for body/paragraphs
- [ ] Using size `2xl` + `bold` for important titles
- [ ] Using size `sm` + `color="muted-foreground"` for captions

### Styling & Colors

- [ ] Using predefined colors when possible
- [ ] Using `color="primary"` for actions/clickable text
- [ ] Using `color="error"` for error messages
- [ ] Using `color="warning"` for warnings
- [ ] Using `color="muted-foreground"` for secondary text
- [ ] Checking colors look good in dark mode
- [ ] Not relying on color alone (text is also clear)

### Accessibility

- [ ] Text is readable (not too small)
- [ ] Contrast ratio is sufficient (WCAG AA minimum)
- [ ] Long text is not in caps (all caps for titles only)
- [ ] Line height is sufficient for readability

## When Adding Buttons

### Selecting the Right Variant

- [ ] Using `variant="primary"` for main actions
- [ ] Using `variant="secondary"` for supporting actions
- [ ] Using `variant="outline"` for alternative actions
- [ ] Using `variant="ghost"` for less important actions
- [ ] Using `variant="destructive"` for delete/remove actions
- [ ] Using `variant="link"` for link-like buttons
- [ ] Using `variant="transparent"` for icon-only buttons

### Selecting the Right Size

- [ ] Using `size="large"` for primary CTAs
- [ ] Using `size="medium"` (default) for most buttons
- [ ] Using `size="small"` for less important actions
- [ ] Using `size="x-small"` for compact spaces
- [ ] Using `size="icon"` for icon-only buttons
- [ ] Avoiding mixed sizes in the same action group

### Width Management

- [ ] Using `width="auto"` (default) for most buttons
- [ ] Using `width="full"` for form submit buttons
- [ ] Using `width="fit"` for content-fit buttons
- [ ] Using `width="full"` on mobile in forms
- [ ] Using `width="auto"` on desktop for better spacing

### With Icons

- [ ] Icons are from lucide-react
- [ ] Using `startIcon` for icons before text
- [ ] Using `endIcon` for icons after text
- [ ] Icon-only buttons use `size="icon"` variants
- [ ] Icon text is clear (not relying on icon alone)
- [ ] Icons are contextually appropriate

### Loading States

- [ ] Button has `isLoading={isLoading}` prop
- [ ] Loading state is set during async operations
- [ ] Providing feedback about what's loading
- [ ] Optional: adding `loadingText` for clarity
- [ ] Button is disabled during loading
- [ ] Resetting loading state on success/error

### Accessibility

- [ ] Button text is clear and descriptive
- [ ] Buttons are keyboard accessible (automatic)
- [ ] Focus indicators are visible
- [ ] Dangerous actions use `variant="destructive"`
- [ ] Icon-only buttons have `aria-label`
- [ ] Button purpose is obvious

### Responsive Design

- [ ] Buttons work on mobile (not too small)
- [ ] Full-width buttons have adequate spacing
- [ ] Icon-only buttons scale appropriately
- [ ] Text doesn't wrap unexpectedly
- [ ] Button group wraps properly on mobile

## When Building Forms

### Button Groups

- [ ] Cancel button is on the left (`variant="outline"`)
- [ ] Primary action is on the right (`variant="primary"`)
- [ ] Using consistent sizing across group
- [ ] Proper gap spacing between buttons
- [ ] Full-width on mobile if needed

### Submit Buttons

- [ ] Using `type="submit"` on form button
- [ ] Showing loading state during submission
- [ ] Disabling only during loading (automatic)
- [ ] Success/error feedback after submission
- [ ] Clear action text (e.g., "Save Changes", not "OK")

### Destructive Actions

- [ ] Dangerous actions use `variant="destructive"`
- [ ] Using `startIcon={Trash2}` or similar
- [ ] Confirmation dialog before execution
- [ ] Clear warning text
- [ ] Cannot be accidentally triggered

## When Styling Components

### Custom Styling

- [ ] Using `className` for Tailwind additions
- [ ] Using `style` prop for inline overrides only if needed
- [ ] Not overriding core variants unnecessarily
- [ ] Maintaining accessibility with custom styles
- [ ] Testing in dark mode

### Dark Mode

- [ ] Using `dark:` Tailwind prefix if custom styling
- [ ] Components auto-adapt (no extra work needed)
- [ ] Colors remain accessible in dark mode
- [ ] Testing with dark mode enabled

### Responsive Classes

- [ ] Using `sm:`, `md:`, `lg:` for breakpoints
- [ ] Mobile-first approach (no breakpoint = all sizes)
- [ ] Buttons responsive on all screen sizes
- [ ] Typography scales appropriately

## When Testing Components

### Manual Testing

- [ ] Button clicks work as expected
- [ ] Loading states display correctly
- [ ] Icons align properly with text
- [ ] Colors render correctly
- [ ] Dark mode works
- [ ] Mobile view is responsive
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible

### Automated Testing

- [ ] Unit tests for custom variants
- [ ] Integration tests for forms
- [ ] Accessibility audit passing
- [ ] No console warnings
- [ ] TypeScript types are correct

### Accessibility Testing

- [ ] WCAG AA compliance
- [ ] Screen reader friendly
- [ ] Keyboard only navigation works
- [ ] Color contrast sufficient
- [ ] Focus visible always
- [ ] Motion doesn't cause issues

## Common Mistakes to Avoid

❌ **DON'T:**

- [ ] Mix multiple button variants in same action group
- [ ] Use color alone for communication
- [ ] Make buttons too small (min: `small`)
- [ ] Disable buttons without feedback
- [ ] Use vague button text ("Click here")
- [ ] Forget loading state on async buttons
- [ ] Skip icon-only button labels
- [ ] Override button styles excessively
- [ ] Use non-semantic components
- [ ] Ignore dark mode compatibility

✅ **DO:**

- [ ] Use semantic HTML
- [ ] Provide clear, descriptive text
- [ ] Show loading feedback
- [ ] Use appropriate colors
- [ ] Make buttons discoverable
- [ ] Test on mobile
- [ ] Check accessibility
- [ ] Keep components consistent
- [ ] Document custom variants
- [ ] Review in both light/dark modes

## Quick Verification Checklist

Before pushing code:

```
Typography Components:
- [ ] Headings use semantic `h1`-`h6` tags
- [ ] Body text uses `p` or `span`
- [ ] Colors are accessible
- [ ] Sizes are appropriate
- [ ] No unstyled text elements remain

Button Components:
- [ ] Variant is appropriate for action
- [ ] Size is consistent with others
- [ ] Icons (if used) are clear
- [ ] Loading state works
- [ ] Disabled state is obvious
- [ ] Mobile looks good
- [ ] Dark mode tested
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] No custom hacks needed

General:
- [ ] No console errors
- [ ] TypeScript types pass
- [ ] Responsive on all screens
- [ ] Accessible to all users
- [ ] Code is clean and maintainable
- [ ] Comments explain non-obvious code
- [ ] Team has reviewed changes
```

## When You Need Help

### Check These Locations

1. **Quick answers:** `QUICK_REFERENCE.md`
2. **Detailed info:** `src/components/ui/COMPONENT_USAGE.md`
3. **See examples:** `/component-demo` page
4. **Migration help:** `MIGRATION_GUIDE.md`
5. **Overview:** `COMPONENTS_IMPLEMENTATION.md`

### Common Questions

**Q: Which variant should I use?**
A: See "Variant Cheat Sheet" in QUICK_REFERENCE.md

**Q: How do I make a button full width?**
A: Use `width="full"` prop

**Q: Can I customize the colors?**
A: Yes! Use `className` with Tailwind classes

**Q: How do I add an icon?**
A: Use `startIcon={IconComponent}` or `endIcon={IconComponent}`

**Q: Why isn't my color showing?**
A: Use predefined colors or pass CSS value to `style` prop

## Performance Tips

- [ ] Not re-importing components unnecessarily
- [ ] Using `React.memo` if rendering many buttons
- [ ] Lazy loading icon components if needed
- [ ] Avoiding inline style objects (use className)
- [ ] Not mutating Typography/Button props

## Code Review Guidelines

When reviewing PRs using these components:

- [ ] Are variants used appropriately?
- [ ] Is text content clear?
- [ ] Is loading state handled?
- [ ] Are icons necessary?
- [ ] Is dark mode supported?
- [ ] Is mobile responsive?
- [ ] Are there TypeScript errors?
- [ ] Is accessibility maintained?
- [ ] No unnecessary overrides?
- [ ] Consistent with design system?

---

**Version:** 1.0  
**Last Updated:** December 16, 2025  
**Status:** ✅ Ready to Use

Print this checklist and keep it handy while developing!
