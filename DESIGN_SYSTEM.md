# Avery Marsh — Global Design System Specification

## 1. System Philosophy & North Star
The Avery Marsh platform follows an enterprise dark construction management design language. Every screen, component, modal, form control, navigation element, empty state, and data card strictly adheres to this unified system. 

### Core Tenet: Strict Height & Touch-Target Standardization
> **Mandatory Rule**: All input fields, textareas (base height), custom dropdown triggers, selects, search bars, and standard action buttons must maintain an exact standard height of **44px** (`h-11` / `2.75rem`) with an interior horizontal padding of **14px** (`px-3.5`) and a corner radius of **12px** (`rounded-xl`).
> 
> *Prior inconsistencies (e.g. 36px / `h-9` or 40px / `h-10`) are strictly deprecated and prohibited throughout the codebase.*

---

## 2. Color Palette & Surface Tokens

### Brand / Primary Sapphire
* **Primary Brand**: `#2563EB` (Tailwind `blue-600`) — Primary CTA buttons, active state indicators, focus outlines.
* **Brand Hover**: `#1D4ED8` (Tailwind `blue-700`) — Hover states for primary elements.
* **Brand Active**: `#1E40AF` (Tailwind `blue-800`) — Active/pressed button feedback.
* **Brand Light / Accent**: `#3B82F6` (Tailwind `blue-500`) — Glow highlights, progress fills, badges.
* **Brand Subtle**: `rgba(37, 99, 235, 0.12)` — Selected item backgrounds, active pill highlights.

### Neutral Dark Hierarchy
* **App Canvas (Level 0)**: `#070A12` — Default screen background. Deep charcoal black with subtle sapphire undertone.
* **Input / Inset Surface (Level 1)**: `#050811` — Recessed background for text fields, select dropdowns, search inputs, nested item strips.
* **Card Surface (Level 2)**: `#0A111F` / `#070D1A` — Elevated container for data cards, lists, panels, and tab modules.
* **Modal / Elevated Popover (Level 3)**: `#0E1A30` — Top-level floating containers, modal sheets, dropdown flyout menus.

### Borders & Dividers
* **Default Border**: `#142036` — Standard separation line for cards, list dividers, and idle inputs.
* **Subtle Border**: `#10192A` — Soft contrast separators and internal grid dividers.
* **Hover / Strong Border**: `#1E2E4A` — Card hover borders, elevated card outlines.
* **Focus Ring**: `#2563EB` (Sapphire) — Interactive focus state across all interactive elements.

### Semantic Status Palette
* **Success**: Emerald `#10B981` (Background: `rgba(16, 185, 129, 0.12)`, Border: `rgba(16, 185, 129, 0.25)`)
* **Warning**: Amber `#F59E0B` (Background: `rgba(245, 158, 11, 0.12)`, Border: `rgba(245, 158, 11, 0.25)`)
* **Danger / Error**: Rose `#F43F5E` (Background: `rgba(244, 63, 94, 0.12)`, Border: `rgba(244, 63, 94, 0.25)`)
* **Info**: Sky `#0EA5E9` (Background: `rgba(14, 165, 233, 0.12)`, Border: `rgba(14, 165, 233, 0.25)`)
* **AI / Intelligence**: Purple `#8B5CF6` (Background: `rgba(139, 92, 246, 0.12)`, Border: `rgba(139, 92, 246, 0.25)`)

---

## 3. Typography Hierarchy
System font stack uses Inter / system sans-serif: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

| Token | Size | Line Height | Weight | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 24px (1.5rem) | 1.2 | 800 (Extrabold) | `text-2xl font-extrabold tracking-tight` | Top Hero & KPI Big Numbers |
| **H1** | 20px (1.25rem) | 1.25 | 700 (Bold) | `text-xl font-bold tracking-tight` | Page & Hub Titles |
| **H2** | 16px (1rem) | 1.3 | 700 (Bold) | `text-base font-bold tracking-tight` | Section & Card Headers |
| **H3** | 14px (0.875rem) | 1.4 | 600 (Semibold) | `text-sm font-semibold` | Modal Subheadings, Group Titles |
| **Body Large** | 14px (0.875rem) | 1.5 | 500 (Medium) | `text-sm font-medium` | Emphasized descriptions, list items |
| **Body (Default)** | 13px (0.8125rem) | 1.5 | 400 (Regular) / 500 (Medium) | `text-xs font-medium` | Default application content, tables |
| **Body Small** | 12px (0.75rem) | 1.4 | 400 (Regular) | `text-[12px]` | Field hints, secondary metadata |
| **Caption / Badge** | 10px (0.625rem) | 1.2 | 700 (Bold) | `text-[10px] font-bold uppercase tracking-wider` | Pill badges, micro tags, timestamps |

---

## 4. Spacing & Elevation System

### Spacing
* `xs`: 4px (`gap-1` / `p-1`)
* `sm`: 8px (`gap-2` / `p-2`)
* `md`: 12px (`gap-3` / `p-3`)
* `lg`: 16px (`gap-4` / `p-4`)
* `xl`: 24px (`gap-6` / `p-6`)
* `2xl`: 32px (`gap-8` / `p-8`)

### Radii Hierarchy
* **Small (8px)**: `rounded-lg` — Inner badge elements, micro buttons.
* **Standard (12px)**: `rounded-xl` — Form inputs, select triggers, standard buttons, tabs.
* **Card (16px)**: `rounded-2xl` — Data cards, list containers, sub-panels.
* **Modal (24px)**: `rounded-3xl` — Bottom sheets, dialog modals, flyouts.
* **Full (9999px)**: `rounded-full` — Avatars, pill tags, close buttons.

---

## 5. Form & Button Specifications

### Inputs (`<input>`, `<select>`, `<textarea>`)
* **Height**: `44px` (`h-11`)
* **Background**: `#050811` (Tailwind `bg-[#050811]`)
* **Border**: `#142036` (Tailwind `border border-[#142036]`)
* **Focus State**: `focus:border-[#2563EB] focus:outline-none`
* **Text**: `text-xs text-white font-medium`
* **Placeholder**: `placeholder-slate-500`
* **Padding**: `px-3.5`
* **Corner Radius**: `rounded-xl` (12px)

### Buttons (`Button.tsx`)
1. **Primary**:
   * `bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold h-11 px-5 rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer`
2. **Secondary / Neutral**:
   * `bg-[#0E1A33] hover:bg-[#142445] text-slate-300 hover:text-white font-semibold h-11 px-4 rounded-xl border border-[#1E2E4A] transition-colors cursor-pointer`
3. **Outline**:
   * `bg-transparent border border-[#142036] hover:border-slate-500 text-slate-300 hover:text-white font-medium h-11 px-4 rounded-xl transition-colors cursor-pointer`
4. **Ghost**:
   * `bg-transparent hover:bg-[#0E1A30] text-slate-400 hover:text-white font-medium h-11 px-3 rounded-xl transition-colors cursor-pointer`
5. **Danger**:
   * `bg-rose-600/15 border border-rose-500/30 hover:bg-rose-600/25 text-rose-400 font-bold h-11 px-4 rounded-xl transition-all cursor-pointer`

---

## 6. Shared Components Reference
The standard components are located in `src/components/common/`:
* `Button.tsx`: Full-featured standard button conforming to 44px height and size variants.
* `Input.tsx`: Complete form input component with label, error display, icon slots, and 44px baseline.
* `CustomSelect.tsx`: Dropdown select trigger (44px `h-11`) with floating `#0E1A30` menu.
* `Card.tsx`: Standard card container with `surface`, `elevated`, and `inset` variants.
* `Modal.tsx`: Standard modal shell with mobile backdrop blur, drag indicator, and header/footer.
* `EmptyState.tsx`: Reusable empty view with icon, title, description, and action button.
* `StatusBadge.tsx`: Status indicator pill supporting all semantic variants.

---

## 7. Quality Assurance Checklist for New Features
Before shipping any new view or component, verify:
- [ ] Are all inputs, selects, and buttons exactly 44px (`h-11`) in height?
- [ ] Is horizontal padding on inputs at least 14px (`px-3.5`)?
- [ ] Are corner radii aligned (12px for controls, 16px for cards, 24px for modals)?
- [ ] Does input background use `#050811` and border use `#142036`?
- [ ] Is primary action sapphire `#2563EB` with `#1D4ED8` on hover?
- [ ] Does `npx tsc -b` pass with 0 errors?
