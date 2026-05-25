# Design System Discipline

Apply these rules to every code change in this repository. Violations are treated as bugs.

## Token Infrastructure

This project uses **Tailwind CSS v4** with `@theme inline` in `frontend/app/globals.css`. All design tokens are CSS custom properties defined there. There is no `tailwind.config.ts` — the `@theme` block IS the config.

### Token tiers in this codebase

**Primitive tokens** — raw named color scales in `globals.css` `@theme inline`:
```
--color-gray-{25..950}, --color-purple-{25..950},
--color-red-{25..950}, --color-orange-{25..950}, --color-green-{25..950}
```

**Semantic tokens** — named by purpose, alias primitives:
```
--color-text-heading    → var(--color-gray-900)
--color-text-body       → var(--color-gray-700)
--color-text-muted      → var(--color-gray-600)
--color-text-disabled   → var(--color-gray-400)
--color-text-primary    → var(--color-purple-700)
--color-text-error      → var(--color-red-600)
--color-text-warning    → var(--color-orange-600)
--color-text-success    → var(--color-green-600)
```

**shadcn/ui theme tokens** — `:root` block, consumed by shadcn components:
```
--primary, --primary-foreground, --secondary, --secondary-foreground,
--muted, --muted-foreground, --accent, --accent-foreground,
--destructive, --border, --input, --ring, --background, --foreground,
--card, --card-foreground, --popover, --popover-foreground
```

**Typography tokens** — font size + line height pairs:
```
--font-size-display-{2xl,xl,lg}, --font-size-h{1..4},
--font-size-body-{lg,base,sm}, --font-size-label{,-sm},
--font-size-caption, --font-size-code{,-sm}
Each has a paired --line-height-* token.
```

**Radius tokens**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` (derived from `--radius: 0.625rem`).

**Shadow utilities** in `globals.css`: `.shadow-xs`, `.shadow-skew`, `.shadow-lg`, `.shadow-card`.

## Rules

### 1. Never hard-code colors

**Wrong:**
```tsx
<p className="text-[#2d3748]">         // arbitrary hex
<div className="bg-[#edf2fb]">         // arbitrary hex
<span className="border-[#d7e3fc]/40"> // arbitrary hex with opacity
```

**Right:**
```tsx
<p className="text-text-heading">       // semantic token
<p className="text-gray-900">           // primitive token (when no semantic fits)
<div className="bg-purple-50">          // primitive token
<span className="border-border">        // shadcn theme token
```

Use Tailwind's built-in token classes. Since `@theme inline` registers `--color-gray-900` etc., Tailwind generates classes like `text-gray-900`, `bg-purple-50`, `text-text-heading` automatically.

### 2. Never use arbitrary spacing, font sizes, or radii

**Wrong:**
```tsx
className="p-[13px] text-[10px] rounded-[2rem] gap-[10px]"
```

**Right:**
```tsx
className="p-3 text-xs rounded-xl gap-2.5"
```

Stick to Tailwind's default spacing scale (multiples of 4px). For radii, use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` — or the token-derived `rounded-radius-sm` etc.

If a value truly cannot map to the scale, add it as a named token in `@theme inline` rather than using an arbitrary value.

### 3. Never use arbitrary shadow values

**Wrong:**
```tsx
className="shadow-[0_8px_32px_rgba(31,56,100,0.06)]"
```

**Right:**
```tsx
className="shadow-card"   // or shadow-xs, shadow-skew, shadow-lg
```

If a new shadow level is needed, define it as a utility class in `globals.css`, not inline.

### 4. Reuse shadcn/ui components before building new ones

Before creating a new component, check `frontend/components/ui/` for an existing primitive. The project has: Button, Card, Input, Textarea, Select, Command, Dialog, Popover, Label, InputGroup, NavigationMenu.

**Decision framework:**
- Existing component, wrong visual → add a variant to the `cva()` definition
- Existing component, different element → use `asChild` prop (Base UI supports this)
- No match, pattern recurs 3+ times → build shared component in `components/`
- Unique one-time layout → local markup, do not create a component

### 5. Use semantic tokens over primitives when available

Prefer `text-text-heading` over `text-gray-900`. Semantic tokens enable theming and dark mode without touching component code. If a semantic token doesn't exist for your use case, add one to the `@theme inline` block.

### 6. Extend the token system, don't bypass it

When you need a value that doesn't exist in the token system:
1. Add a new token to `@theme inline` in `globals.css`
2. Use the Tailwind class generated from that token
3. Never use an arbitrary value as a workaround

Example — adding a new semantic background token:
```css
@theme inline {
  /* ... existing tokens ... */
  --color-bg-subtle: var(--color-gray-50);
  --color-bg-surface: var(--color-purple-25);
}
```
Then use: `className="bg-bg-subtle"` or `className="bg-bg-surface"`.

### 7. Shadow and elevation as named utilities only

All box-shadows must be defined as utility classes in `globals.css`. The existing set:
- `.shadow-xs` — subtle 1px drop
- `.shadow-skew` — inset border illusion + drop
- `.shadow-lg` — elevated card
- `.shadow-card` — standard card with border

To add a new level, define it in `globals.css` with a descriptive class name. Reference existing patterns there for the `rgba()` values used.

## Hardcoded-to-token mapping reference

Use this when migrating existing violations:

| Hardcoded value | Replace with (Tailwind class) | Token |
|---|---|---|
| `text-[#2d3748]` | `text-text-heading` | `--color-text-heading` (gray-900) |
| `text-[#4a5568]` | `text-text-body` | `--color-text-body` (gray-700) |
| `text-[#718096]` | `text-text-muted` | `--color-text-muted` (gray-600) |
| `text-[#535862]` | `text-text-muted` | `--color-text-muted` (gray-600) |
| `bg-[#edf2fb]` | `bg-purple-50` | `--color-purple-50` (needs adding — see note) |
| `bg-[#e2eafc]` | `bg-purple-100` | `--color-purple-100` (needs adding — see note) |
| `bg-[#c1d3fe]` | `bg-purple-200` | `--color-purple-200` (needs mapping) |
| `border-[#d7e3fc]` | `border-border` | `--border` / `--color-border` |
| `border-[#e2eafc]` | `border-border` | `--border` / `--color-border` |
| `text-[#b6ccfe]` | `text-purple-300` | `--color-purple-300` |
| `text-[#e2eafc]` | `text-purple-100` | `--color-purple-100` |
| `text-[#7b9ad8]` | `text-purple-400` | `--color-purple-400` |
| `fill-[#e2eafc]` | `fill-purple-100` | `--color-purple-100` |
| `bg-[#b6ccfe]` | `bg-purple-300` | `--color-purple-300` |
| `from-[#e2eafc]` | `from-purple-100` | `--color-purple-100` |
| `rounded-[2rem]` | `rounded-2xl` | — (32px = 2rem, maps to 2xl) |
| `rounded-[1.25rem]` | `rounded-xl` | — (20px = 1.25rem, maps to xl) |
| `shadow-[0_8px_32px_rgba(31,56,100,0.06)]` | `shadow-card` | defined in globals.css |

**Note on blue-tinted colors:** The codebase uses light blue/purple hex values (`#edf2fb`, `#e2eafc`, `#c1d3fe`, `#d7e3fc`, `#b6ccfe`) that don't map to the existing purple palette in `@theme`. These need to be added as a `--color-blue-*` scale or remapped to existing purple tokens if close enough. When migrating, add the missing primitives to `@theme inline` first.

### 8. Lightweight DOM — fewer nodes, flatter trees

Every DOM node costs layout, paint, and memory. Keep the tree shallow and lean.

**Wrong:**
```tsx
<div className="wrapper">
  <div className="container">
    <div className="inner">
      <p>Text</p>
    </div>
  </div>
</div>
```

**Right:**
```tsx
<p className="container">Text</p>
```

Rules:
- Never add a wrapper `<div>` purely for styling when the child element can carry the classes directly
- Prefer CSS (`gap`, `grid`, `flex`) over extra markup for spacing and alignment — never add an empty `<div>` as a spacer
- Use semantic HTML elements (`<section>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<main>`, `<aside>`) instead of generic `<div>` where they apply
- Fragments (`<>...</>`) over wrapper divs when you only need to return multiple siblings
- Flatten nested flex/grid containers — if a parent is `flex` and the only child is another `flex` container, collapse them into one
- Before adding a node, ask: "Can I achieve this with a class on an existing element?" If yes, don't add the node

### 9. Mobile-first — base styles are the mobile layout

All styles are written for mobile screens first. Larger layouts are added with `md:` and `lg:` breakpoints. **Never use `sm:`** — the base (unprefixed) styles ARE the small-screen styles.

**Wrong:**
```tsx
// Desktop-first: hides on mobile, shows on desktop
<div className="hidden sm:flex sm:flex-row sm:gap-6">

// Using sm: breakpoint
<h1 className="text-lg sm:text-xl md:text-2xl">
```

**Right:**
```tsx
// Mobile-first: stacks by default, row on md+
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// Base is mobile, scale up at md/lg only
<h1 className="text-lg md:text-xl lg:text-2xl">
```

Rules:
- **Base (unprefixed) styles = mobile layout.** This is the default for every element.
- **`md:` (768px+)** — tablet and small desktop adjustments (column → row, show sidebar, increase spacing)
- **`lg:` (1024px+)** — full desktop layout (wider containers, larger type, multi-column grids)
- **Never use `sm:` (640px).** There is no meaningful design breakpoint between 0 and 768px for this app. Using `sm:` creates a third layout tier that adds complexity without value.
- **Test mobile first.** When building a component, start with the browser at 375px width. Only add `md:`/`lg:` classes after the mobile layout is correct.
- **Avoid `hidden` + breakpoint show patterns when possible.** Instead, render the same content and let it reflow. Only use `hidden md:block` when the mobile and desktop experiences are structurally different (e.g., hamburger menu vs. nav bar).
- **Container widths:** Use `max-w-screen-md`, `max-w-screen-lg`, or `max-w-7xl` — never arbitrary `max-w-[1200px]`.

Breakpoint reference for this project:
| Prefix | Min-width | Use for |
|---|---|---|
| *(none)* | 0px | Mobile layout (default) |
| `md:` | 768px | Tablet / small desktop |
| `lg:` | 1024px | Full desktop |

## When writing new code

1. Open `frontend/app/globals.css` and review available tokens before writing any className
2. Use semantic tokens (`text-text-heading`) over primitives (`text-gray-900`) over arbitrary (`text-[#2d3748]`)
3. Use shadcn theme tokens (`bg-primary`, `text-muted-foreground`, `border-border`) for UI chrome
4. Use primitive palette tokens (`text-green-600`, `bg-red-50`) for status/semantic colors
5. Every `className` should be fully resolvable from the `@theme` block — zero arbitrary values for color, spacing, font size, or radius
6. If you need a value not in the system, extend `@theme inline` with a named token
7. Write base styles for mobile (375px). Add `md:` for tablet, `lg:` for desktop. Never use `sm:`
8. Minimize DOM depth — audit every `<div>` and remove it if its classes can live on a parent or child

## When reviewing code

Flag as violations:
- Any `text-[#...]`, `bg-[#...]`, `border-[#...]`, `fill-[#...]` arbitrary color
- Any `p-[...]`, `m-[...]`, `gap-[...]` arbitrary spacing that isn't on the 4px grid
- Any `text-[Npx]` arbitrary font size
- Any `rounded-[...]` arbitrary radius
- Any `shadow-[...]` arbitrary shadow
- Any inline `style={{ color: '...' }}` with hardcoded values (CSS variable refs are acceptable)
- Any new component that duplicates existing shadcn/ui functionality
- Any use of `sm:` breakpoint — base styles should cover mobile, jump to `md:` for tablet+
- Wrapper `<div>`s that exist only to hold a single class — merge the class onto the child or parent
- Spacer divs or empty elements used for layout — use `gap`, `margin`, or `padding` instead
- Deeply nested flex/grid containers that could be flattened
