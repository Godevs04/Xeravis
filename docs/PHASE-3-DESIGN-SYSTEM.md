# Phase 3 — Enterprise Design System & UI Component Library

**Status:** Awaiting approval (documentation only — no component/page builds until approved)  
**Brand:** Xelarvis Technologies  
**Depends on:** [PHASE-2-UX-BLUEPRINT.md](./PHASE-2-UX-BLUEPRINT.md) (approved IA)  
**References:** Stripe · Apple · Linear · Vercel · IBM · Microsoft · Notion · Framer  

This document is the source of truth for visual language, tokens, and component contracts. Implementation must map 1:1 to these tokens — no hardcoded magic numbers, no inline styles, no one-off section styling.

---

## Design philosophy

| Do | Do not |
|---|---|
| Modern, premium, elegant, minimal | Flashy, playful, cartoonish |
| Confident, sophisticated, corporate | “AI template” aesthetics |
| Technology-first, purposeful chrome | Oversized gradients, floating blobs |
| Trust, precision, reliability | Decorative illustrations without meaning |
| Handcrafted enterprise product feel | Random radii, shadows, or spacing |

**Visual language:** Stripe clarity + Vercel restraint + Linear density discipline + IBM corporate confidence. Communicate trust, precision, engineering excellence, reliability, and innovation.

---

## 1. Complete Design System

### 1.1 Grid

| Breakpoint | Columns | Notes |
|---|---|---|
| Desktop (≥1024px) | 12 | Primary composition |
| Tablet (768–1023px) | 8 | Compress side columns |
| Mobile (<768px) | 4 | Stack |

| Token | Value | Usage |
|---|---|---|
| `--grid-container` | `1280px` | Outer page shell (`max-w`) |
| `--grid-section` | `1200px` | Section content rail |
| `--grid-prose` | `720px–840px` | Long-form reading (prefer `720px` / `65ch`) |
| `--grid-gutter` | `32px` | Column gutters desktop |
| `--section-pad-y` | `120px` | Section top/bottom (desktop) |
| `--section-pad-y-md` | `80px` | Tablet |
| `--section-pad-y-sm` | `64px` | Mobile |

### 1.2 Spacing scale (only these values)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 120 · 160`

Map to CSS: `--space-1` (4) … through named aliases (`--space-section` = 120). Never use arbitrary Tailwind values like `p-[13px]`.

### 1.3 Radius

| Element | Token | Value |
|---|---|---|
| Buttons | `--radius-button` | `12px` |
| Inputs | `--radius-input` | `12px` |
| Cards | `--radius-card` | `20px` |
| Images | `--radius-image` | `20px` |
| Dialogs / Modals | `--radius-dialog` | `24px` |
| Hero media frames | `--radius-hero` | `32px` |
| Pills / badges | `--radius-pill` | `9999px` (rare; tags only) |

**Rule:** Editorial rules and full-bleed heroes stay **0 radius**. Inset media/cards use the table above. Do not default everything to `rounded-full`.

### 1.4 Shadow system (soft enterprise)

| Token | Approx | Use |
|---|---|---|
| `--shadow-light` | `0 1px 2px rgb(15 23 42 / 0.04)` | Resting inputs, subtle dividers |
| `--shadow-medium` | `0 4px 12px rgb(15 23 42 / 0.06)` | Cards at rest |
| `--shadow-large` | `0 12px 32px rgb(15 23 42 / 0.08)` | Elevated panels |
| `--shadow-floating` | `0 16px 48px rgb(15 23 42 / 0.12)` | Dropdowns, mega menus, drawers |
| `--shadow-hover` | `0 8px 24px rgb(15 23 42 / 0.10)` | Card/button lift on hover |

Never harsh black drop shadows or multi-layer neon glows.

### 1.5 Color

| Role | Hex | Token |
|---|---|---|
| Primary | `#0F172A` | `--color-primary` |
| Secondary | `#334155` | `--color-secondary` |
| Accent | `#2563EB` | `--color-accent` |
| Accent hover | `#1D4ED8` | `--color-accent-hover` |
| Background | `#FFFFFF` | `--color-background` |
| Surface | `#F8FAFC` | `--color-surface` |
| Muted (border/line) | `#E2E8F0` | `--color-muted-line` |
| Muted text | `#64748B` | `--color-muted` |
| Success | `#16A34A` | `--color-success` |
| Warning | `#F59E0B` | `--color-warning` |
| Danger | `#DC2626` | `--color-danger` |
| Dark background | `#020617` | `--color-dark` |

### 1.6 Typography (Inter)

| Style | Size | Weight | Token |
|---|---|---|---|
| Display XL | 64 | 700–900 | `--text-display-xl` |
| Display L | 56 | 700 | `--text-display-l` |
| H1 | 48 | 700 | `--text-h1` |
| H2 | 40 | 700 | `--text-h2` |
| H3 | 32 | 600–700 | `--text-h3` |
| H4 | 24 | 600 | `--text-h4` |
| H5 | 20 | 600 | `--text-h5` |
| H6 | 18 | 600 | `--text-h6` |
| Body Large | 18 | 400 | `--text-body-lg` |
| Body | 16 | 400 | `--text-body` |
| Caption | 14 | 400–500 | `--text-caption` |
| Small | 12 | 400–500 | `--text-small` |

**Line height:** Display `1.1–1.15` · Headings `1.2` · Body `1.6` · Caption `1.45`  
**Letter spacing:** Display `-0.02em` · Body `0`  
**Measure:** Body copy max ~`65ch` / `--grid-prose`.

Mobile type steps down one tier (e.g. Display XL → 40–48) via fluid or breakpoint maps — never shrink below readable body 16.

### 1.7 Iconography

- Lucide only · consistent stroke (1.5–2) · monochrome (inherit `currentColor`)  
- No emoji · no multicolor icons  

### 1.8 Imagery

Real photography: offices, engineers, meetings, infrastructure. No AI faces, no decorative vector blobs. Images use `--radius-image` when inset; full-bleed heroes are edge-to-edge (0 radius).

### 1.9 Section template (mandatory structure)

Every marketing section:

1. Eyebrow (optional)  
2. Heading (H2)  
3. Supporting text (≤2 sentences, prose width)  
4. Content (grid/list/media)  
5. CTA (optional, stage-appropriate copy from Phase 2)  
6. Motion (reveal once)  
7. Whitespace (`--section-pad-y`)  
8. Divider only when hierarchy requires separation  

---

## 2. Design Tokens (implementation contract)

Target file (post-approval): `src/design-system/tokens.css` + Tailwind `@theme` bridge.

```css
:root {
  /* Color */
  --color-primary: #0F172A;
  --color-secondary: #334155;
  --color-accent: #2563EB;
  --color-accent-hover: #1D4ED8;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-muted-line: #E2E8F0;
  --color-muted: #64748B;
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-danger: #DC2626;
  --color-dark: #020617;

  /* Space */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-14: 56px; --space-16: 64px; --space-20: 80px;
  --space-24: 96px; --space-30: 120px; --space-40: 160px;

  /* Radius */
  --radius-button: 12px;
  --radius-input: 12px;
  --radius-card: 20px;
  --radius-image: 20px;
  --radius-dialog: 24px;
  --radius-hero: 32px;

  /* Shadow */
  --shadow-light: 0 1px 2px rgb(15 23 42 / 0.04);
  --shadow-medium: 0 4px 12px rgb(15 23 42 / 0.06);
  --shadow-large: 0 12px 32px rgb(15 23 42 / 0.08);
  --shadow-floating: 0 16px 48px rgb(15 23 42 / 0.12);
  --shadow-hover: 0 8px 24px rgb(15 23 42 / 0.10);

  /* Motion */
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);

  /* Layout */
  --grid-container: 1280px;
  --grid-section: 1200px;
  --grid-prose: 45rem; /* ~720px */
  --grid-gutter: 32px;
  --section-pad-y: 120px;
  --touch-min: 44px;

  /* Breakpoints (reference) */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}
```

**Rule:** Components consume tokens only. Theme readiness = swap token values, not rewrite components.

---

## 3. Component Inventory

### Foundations
Container · Section · Divider · Prose · SkipLink · FocusRing

### Navigation
Navbar · MegaMenu · MobileDrawer · Breadcrumb · Footer · SearchBar

### Actions
Button (primary / secondary outline / ghost / text / danger / success / icon / loading / split) · Link

### Forms
Text · Email · Phone · Search · Textarea · Select · Checkbox · Radio · Switch · Upload · DatePicker · Field (label, helper, error, success) · FloatingLabel · ContactForm · NewsletterForm · CareerApplyForm

### Data display
Badge · Tag · Avatar · Stats · StatCounter · Timeline · Table (sticky header, hover row, sort, pagination) · TechnologyGrid · PricingTable (if needed later)

### Cards
ServiceCard · BlogCard · CareerCard · TeamCard · IndustryCard · TechnologyCard · StatisticCard · TestimonialCard · FeatureCard · CaseStudyCard

### Feedback
Toast · Dialog · Modal · Drawer · EmptyState · ErrorState · Skeleton · Loader · Progress

### Marketing blocks
Hero · CTABand · TrustBar · TestimonialsCarousel · Accordion · Tabs · Carousel

### Content chrome
Pagination · ReadingMeta · Share · TableOfContents · Newsletter

---

## 4. Component Hierarchy

```
AppShell
├── SkipLink
├── Navbar
│   ├── Logo
│   ├── MegaMenu (Solutions | Services | Industries)
│   ├── NavLink
│   ├── Button (Let's Talk)
│   └── MobileDrawer
│       ├── SearchBar
│       ├── NavLink[]
│       ├── SocialLinks
│       └── Button
├── Main
│   └── Page
│       ├── Hero | PageHeader
│       ├── Section[]
│       │   ├── SectionHeader (eyebrow, title, support)
│       │   ├── Content (Cards | Grid | Timeline | Form | …)
│       │   └── CTA
│       └── …
└── Footer
    ├── FooterColumns
    ├── Newsletter
    ├── SocialLinks
    └── Legal
```

**Composition rules**
- Pages compose **Sections**; Sections compose **primitives + domain cards**.  
- Domain cards never invent private colors/radii.  
- Forms always wrap controls in `Field`.  
- Modals/Drawers share FocusTrap + Escape + return-focus behavior.

---

## 5. Responsive Rules

| Principle | Spec |
|---|---|
| Strategy | Desktop-first |
| Container | `max-width: 1280px`; horizontal pad `24px` mobile → `32px` desktop |
| Section Y | 120 → 80 → 64 |
| Touch targets | Min `44×44px` |
| Mega menus | Desktop/tablet landscape; collapse to accordion groups in drawer |
| Tables | Card-stack or horizontal scroll with sticky first column |
| Images | `next/image`; explicit sizes; no CLS |
| Type | Step down display sizes below `lg` |
| Ultra-wide | Content stays within container; no stretched full-bleed text |

---

## 6. Animation Guidelines

| Principle | Spec |
|---|---|
| Purpose | Guide attention — never entertain |
| Library | Framer Motion (+ CSS transitions for chrome) |
| Durations | **200ms / 300ms / 500ms** only — never longer |
| Easing | `--ease-standard` / `--ease-emphasized` |
| Patterns | Page fade · Slide · Scale · Reveal · Stagger · Count-up · Hover lift |
| Intersection | Reveal once; `amount: 0.2` |
| Magnetic buttons | Subtle (≤6px pull); primary CTAs only |
| Parallax | Hero photography only, subtle, disabled on reduced motion |
| Carousel | Testimonials only (one carousel site-wide preference) |
| Reduced motion | Instant opacity; no translate/scale; counters snap to final |

**Nav motion (from Phase 2):** transparent→solid, hide on scroll down, reveal on scroll up — durations ≤300ms.

---

## 7. Accessibility Checklist (WCAG AA)

- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`)  
- [ ] One `h1` per page; heading order intact  
- [ ] Visible `:focus-visible` rings (accent, 2px+)  
- [ ] Keyboard: tab order, Escape closes overlays, arrow keys in menus/accordions  
- [ ] Focus trap in Modal/Drawer; restore focus on close  
- [ ] ARIA: `aria-expanded`, `aria-controls`, `aria-invalid`, live regions for toasts/errors  
- [ ] Color contrast ≥ 4.5:1 body; ≥ 3:1 large text / UI chrome  
- [ ] Forms: associated labels (floating labels still need programmatic label)  
- [ ] Images: meaningful `alt`; decorative `alt=""`  
- [ ] Touch ≥ 44px; no hover-only essential actions  
- [ ] `prefers-reduced-motion` honored  
- [ ] Skip link to `#main`  

---

## 8. Visual Consistency Rules

1. **Tokens only** — no hex/px outside the token file.  
2. **One radius family** — use the radius table; don’t invent `rounded-xl` ad hoc.  
3. **One shadow family** — resting = medium; hover = hover; overlays = floating.  
4. **CTA hierarchy** — one primary per viewport; secondary outline/ghost.  
5. **Section rhythm** — always header → content → optional CTA; same pad-y.  
6. **Cards** — lift + shadow-hover + 300ms; never bounce or spin.  
7. **Icons** — Lucide, monochrome, aligned to text cap-height.  
8. **Photography** — real business/tech; consistent grade (cool neutral, no heavy filters).  
9. **No decoration for emptiness** — if space exists, it is grid rhythm or focus, not filler icons.  
10. **IA binding** — Phase 2 CTA copy and section order win over visual novelty.  
11. **CMS-ready** — components accept props matching Payload fields (title, summary, media, href).  
12. **No duplicated primitives** — one Button, one Field, one Card shell.

---

## Component contracts (selected)

### Button
Variants: primary (filled accent), secondary (outline), ghost, text, danger, success, icon, loading, split.  
States: hover, focus-visible, pressed, disabled, loading.  
Radius: `--radius-button`. Min height: `--touch-min`.

### Field / Inputs
Types: text, email, phone, search, textarea, select, checkbox, radio, switch, upload, date.  
States: default, focus, error, success, disabled. Helper + error text required patterns. Floating labels allowed if a11y-equivalent.

### Cards
Shared shell: `--radius-card`, `--shadow-medium` → `--shadow-hover`, padding `--space-6`–`--space-8`.  
Domain slots: Service (icon, title, description, tech, CTA) · Blog (image, category, date, reading time, title, summary, CTA) · Career (role, dept, location, type, experience, Apply) · Testimonial (glass optional, photo, logo, designation, quote).

### Hero
Display type · minimal copy · photo background · primary + secondary CTAs · optional scroll indicator · optional subtle motion (reduced-motion safe).

### Stats
Elegant count-up; no flashy particles; TrustBar layout after hero (Phase 2).

---

## File structure (post-approval implementation)

```
src/design-system/
  tokens.css
  typography.css
  motion.ts
src/components/
  ui/           # primitives (Button, Input, Dialog, …)
  layout/       # Navbar, Footer, Container, Section
  domain/       # ServiceCard, BlogCard, …
  marketing/    # Hero, TrustBar, CTABand, …
  forms/
  feedback/     # Empty, Error, Skeleton, Toast
```

---

## Approval gate

| Deliverable | Status |
|---|---|
| 1 Complete Design System | Documented above |
| 2 Design Tokens | Spec ready |
| 3 Component Inventory | Listed |
| 4 Component Hierarchy | Defined |
| 5 Responsive Rules | Defined |
| 6 Animation Guidelines | Defined |
| 7 Accessibility Checklist | Defined |
| 8 Visual Consistency Rules | Defined |

**Approve this document to unlock implementation:** token CSS + reusable component library (still no full page rebuild until components land).  

**Out of scope until approval:** coding pages, replacing Phase 1 UI wholesale, or inventing new visual directions outside these tokens.
