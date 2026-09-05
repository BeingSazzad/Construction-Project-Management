---
name: lattice-design-guardian
description: Strict UI/UX guardian and design system normalizer for Lattice. Automatically intercepts any screenshot, wireframe, user request, or raw UI context and normalizes it to strictly conform to the Lattice Master Mobile Design System (Plus Jakarta Sans, 430px viewport, 20px padding, 4px grid, exact hex tokens, zero card-bloat, zero random font sizes or spacing).
---

# Lattice Design Guardian — Autonomous UI/UX Normalizer

Whenever the user provides a screenshot, mock data, raw request, or feature idea, activate this skill to **intercept, sanitize, and normalize** the design before writing any code.

---

## 🚫 ZERO-TOLERANCE ANTI-PATTERNS (INSTANT REJECTION)

| Anti-Pattern | Violation | Guardian Automatic Fix |
| :--- | :--- | :--- |
| **Random Font Sizes** | `text-[13px]`, `text-[15px]`, `text-[17px]`, `text-[19px]`, `text-[21px]`, `text-[23px]` | Clamp strictly to approved scale: `10px`, `12px`, `14px`, `16px`, `20px`, `24px`, `28px`, `32px` |
| **Wrong Font Family** | Inter, Roboto, Arial, System Sans | Always enforce: `'Plus Jakarta Sans', sans-serif` |
| **Random Spacing** | `gap-[7px]`, `p-[9px]`, `m-[13px]`, `mb-[17px]`, `p-[22px]` | Clamp strictly to 4px grid: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px` |
| **Card Bloat** | Wrapping every single metric, label, field, or row in its own card | Demolish container. Use **Level 2 Section** (spacing + heading) or **ListRow** (56–72px, hairline divider) |
| **Duplicate Headers** | Sub-screens rendering another header with `<` back arrow & title inside tabs | Remove duplicate header. Use a compact toolbar or section header |
| **Off-Brand Colors** | Arbitrary blues (`#0066FF`, `#3B82F6`), greens (`#22C55E`), or dark grays | Replace with exact tokens: Blue `#1677FF`, Green `#10A976`, Gray `#0F172A`/`#64748B` |
| **Giant Hero Visuals** | 80px+ donut charts and duplicate progress bars eating 50% of the screen | Replace with compact 100-120px executive summary cards with inline progress pills |

---

## 📐 1. STRICT TYPOGRAPHY NORMALIZATION TABLE

Every text element must map to one of these semantic roles:

```
┌─────────────────────────┬──────────────┬───────────────┬────────────────────────────────────────────┐
│ Semantic Role           │ Size / Weight│ Color Token   │ Tailwind Class                             │
├─────────────────────────┼──────────────┼───────────────┼────────────────────────────────────────────┤
│ Micro Metadata / Code   │ 10-11px Med  │ #64748B       │ text-[10px] md:text-[11px] font-medium     │
│ Caption / Subtext       │ 12px Regular │ #64748B       │ text-xs text-[#64748B] font-normal         │
│ Secondary Description   │ 13-14px Reg  │ #475569       │ text-xs md:text-sm text-[#475569]          │
│ Primary Body / Input    │ 14-16px Reg  │ #0F172A       │ text-sm md:text-base text-[#0F172A]        │
│ Row Title / Button      │ 14-15px Semi │ #0F172A       │ text-sm font-semibold text-[#0F172A]       │
│ Section Heading         │ 16-18px Semi │ #0F172A       │ text-base font-bold text-[#0F172A]         │
│ Screen / Page Title     │ 20-24px Bold │ #0F172A       │ text-xl md:text-2xl font-bold text-[#0F172A]│
│ Key Financial Metric    │ 24-28px Bold │ #0F172A       │ text-2xl font-bold text-[#0F172A]          │
│ Hero Executive Metric   │ 32-36px Bold │ #0F172A       │ text-3xl font-bold text-[#0F172A]          │
└─────────────────────────┴──────────────┴───────────────┴────────────────────────────────────────────┘
```

---

## 🎨 2. EXACT COLOR TOKENS (NEVER INVENT COLORS)

```typescript
export const LATTICE_COLORS = {
  // Canvas & Surfaces
  canvas:           '#F7F9FC', // Level 1 background
  surface:          '#FFFFFF', // Level 3 Card surface
  secondarySurface: '#F1F5F9', // Inset / table headers
  
  // Borders & Dividers
  border:           '#E2E8F0', // Hairline 1px borders
  borderStrong:     '#CBD5E1', // Active / strong borders
  
  // Typography Hierarchy
  textPrimary:      '#0F172A', // Headings, values, high-contrast body
  textSecondary:    '#475569', // Supporting paragraphs, card details
  textMuted:        '#64748B', // Captions, labels, timestamps
  textSubtle:       '#94A3B8', // Chevrons, placeholders, disabled
  
  // Brand Blue-First
  blue:             '#1677FF', // Primary CTA, selection, active tabs
  blueDark:         '#0F5FD7', // Hover / active press
  blueSoft:         '#EAF3FF', // Badges, active chips, icon backgrounds
  blueSurface:      '#F5F9FF', // Highlighted cards
  
  // Functional Status (Zero decorative rainbow usage)
  success:          '#10A976', // Soft: #E9F9F3 (On track, complete)
  warning:          '#F59E0B', // Soft: #FFF7E6 (Needs attention, delay)
  danger:           '#E5484D', // Soft: #FFF0F0 (Overdue, critical risk)
};
```

---

## 🧱 3. SURFACE & CARD FILTER (RULE 12)

Before creating **ANY** container, run this decision tree:

```
Is this content a single conceptual object? (e.g. Project card, Budget Hero, AI briefing)
 ├── YES ──> Level 3 Card:
 │           `bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card`
 │           (Hero variant: `p-4 md:p-5 rounded-2xl`, height < 140px)
 │
 └── NO  ──> Is it a list of repeated items? (Tasks, logs, invoices, contacts)
      ├── YES ──> Level 2 List Group:
      │           `bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9]`
      │           Each row: `ListRow` or `px-3.5 py-3 flex items-center justify-between`
      │
      └── NO  ──> Level 2 Section:
                  `SectionHeader` + 24px vertical gap (`mt-6 mb-3`).
                  ZERO CARD CONTAINER.
```

---

## 📱 4. COMPONENT NORMALIZATION TEMPLATES

### A. 4-KPI Metric Row
```tsx
<div className="grid grid-cols-4 gap-2">
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between min-h-[96px]">
    <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1">{value}</span>
      <span className="text-[10px] text-[#64748B] font-medium block">{label}</span>
    </div>
    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#FFF0F0] text-[#E5484D] w-fit">
      {badge}
    </span>
  </div>
</div>
```

### B. List Row Item (56–72px, Hairline Divider)
```tsx
<div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer">
  <div className="flex items-center gap-3 min-w-0">
    <div className="w-8 h-8 rounded-full bg-[#FFF0F0] text-[#E5484D] flex items-center justify-center shrink-0">
      <AlertCircle className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <h3 className="text-xs md:text-sm font-semibold text-[#0F172A] truncate">{title}</h3>
      <p className="text-[11px] text-[#64748B] mt-0.5 truncate">{subtitle}</p>
    </div>
  </div>
  <div className="flex items-center gap-1.5 shrink-0">
    <span className="text-xs font-semibold text-[#E5484D]">{badge}</span>
    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
  </div>
</div>
```

### C. Compact Primary & Secondary Buttons
```tsx
// Primary CTA (Strictly 48px or compact 40px)
<button className="h-12 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-xs">
  {label}
</button>

// Compact Action Button (Toolbar / Secondary)
<button className="h-8 px-3 rounded-lg bg-[#EAF3FF] text-[#1677FF] hover:bg-[#1677FF] hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95">
  <Plus className="w-3.5 h-3.5" />
  <span>{label}</span>
</button>
```

---

## 🚦 5. THE GUARDIAN 5-POINT PRE-DELIVERY AUDIT

Before outputting ANY code or layout, run these 5 verification questions:
1. **Font Check**: Is every string rendered in **Plus Jakarta Sans** with an approved scale value?
2. **Spacing Check**: Are all paddings, margins, and gaps exact multiples of **4px**?
3. **Card Check**: Does this screen have any container that shouldn't be a card? If yes, dissolve it into a list or section.
4. **Header Check**: Does this view introduce a duplicate header with another back arrow `<`? If yes, eliminate it.
5. **Color Meaning Check**: Does every single colored pixel communicate an operational status (Done, Warning, Blocker)? If purely decorative, revert to neutral.

*If all 5 pass, the UI is certified Lattice-grade.*
