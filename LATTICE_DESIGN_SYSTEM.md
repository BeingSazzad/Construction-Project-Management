# LATTICE — MASTER MOBILE PRODUCT DESIGN SYSTEM & UX RULES
> **Senior Product Designer Standard**: Construction Operations, B2B SaaS & Financial Intelligence Platform.  
> **Core Experience Principle**: *"Calm control over complex construction operations."*

---

## 01. PRODUCT CONTEXT & ROLE-BASED ARCHITECTURE

Lattice serves four primary operational personas within one unified product ecosystem:
1. **Company Owner / Admin**: Company health, active projects, macro financials, cross-project risk alerts, key approvals, Latti AI insights.
2. **Project Manager**: Project health, today's work, active tasks, critical milestones, trade coordination, field updates, immediate decisions.
3. **Finance / Budget Manager**: Budget vs. actual spend, committed subcontracts, paid invoices, variance analysis, cost-to-complete, cash-flow risks.
4. **Employee / Field Staff**: Today's work list, assigned location, architectural drawings/pins, specific instructions, photo capture, daily logs, one-tap completion.

**Rule**: All modules (Projects, Tasks, Schedule, Gantt, Budgets, Daily Logs, Punch Lists, Documents, Photos, Team, Latti AI) share this design ecosystem. Never make a module feel like a disconnected app.

---

## 02. CORE EXPERIENCE PRINCIPLES

The interface must communicate **calm control**. It must feel:
- **Clear · Professional · Operational · Trustworthy · Data-aware · Efficient · Modern · Premium · Mobile-friendly · Consistent**

It must **NEVER** feel:
- Decorative, card-heavy, template-driven, social-media-like, crypto-like, gaming-like, randomly colorful, overly futuristic, or visually noisy.

**The Golden Question for every screen**:
1. *What is happening?*
2. *What needs attention?*
3. *What should I do next?*

---

## 03. MOBILE FRAME, GRID & RESPONSIVE LOGIC

- **Primary Reference Frame**: `430px` mobile viewport (iPhone 14/15/16 Pro Max standard).
- **Horizontal Margins**: `20px` left margin, `20px` right margin (`px-5`).
- **Usable Content Grid**: `430px - 40px = 390px` primary grid width.
- **Responsive Behavior**: Fluidly scales across `390px`, `402px`, `414px`, and `430px` viewports with `16–20px` safe horizontal padding.
- **No Artboard Trap**: Allow natural vertical scrolling. Never clip text, break buttons, force horizontal page scrolling, or clamp height arbitrarily. Full bleed is reserved *strictly* for hero media, photo galleries, or horizontal milestone timelines.

---

## 04. 4PX BASE SPACING SYSTEM

Use a strict 4px mathematical spacing system. Spacing communicates relationship: **Closer = Related, Further = Separated**.

| Spacing Token | Pixels | Semantic Usage |
| :--- | :--- | :--- |
| **Micro** | `4px` | Title-to-supporting subtitle micro gaps, icon-to-badge padding |
| **Tight** | `8px` | Icon → text, related metadata chips, tag spacing |
| **Related** | `12px` | Related content blocks, tight input stack |
| **Component** | `16px` | Standard card internal padding, component vertical margins |
| **Comfortable** | `20px` | Page horizontal padding (`px-5`), summary card padding |
| **Section** | `24px` | Section → section vertical separation |
| **Major Section** | `32px` | Major functional group separation |
| **Large Separation** | `40px` | Distinct structural partition |
| **Structural** | `48px` | Exceptional macro division / screen clearance |

*Prohibited arbitrary spacing*: `13px`, `17px`, `19px`, `21px`, `23px`, `26px`, `29px`, `31px`. Never add empty space merely for "decoration."

---

## 05. TYPOGRAPHY ARCHITECTURE

- **Single Primary Typeface**: **Plus Jakarta Sans** (Fallback: Inter / SF Pro / System Sans-Serif). Always use Plus Jakarta Sans. Zero font mixing.
- **Approved Scale**: `10px`, `12px`, `14px`, `16px`, `20px`, `24px`, `28px`, `32px`, `36px`, `40px`.
- **Approved Weights**: Regular (`400`), Medium (`500`), Semibold (`600`), Bold (`700`).

### Typographic Roles
- **Metadata / Tiny Status**: `10–12px` / Medium (Uppercase codes e.g. `03-000`, micro chips)
- **Caption / Helper Text**: `12px` / Regular (`#475569` or `#64748B`)
- **Secondary Text / Descriptions**: `14px` / Regular (Max 2–3 lines on overviews)
- **Primary Body / Field Inputs**: `14–16px` / Regular (`#0F172A`)
- **Interactive Label / Table Header**: `14px` / Semibold
- **Important Row Title**: `14–16px` / Semibold (Prefer 1 line)
- **Section Heading**: `16–20px` / Semibold
- **Screen Heading**: `24px` / Bold
- **Key Financial Metric**: `28–32px` / Bold
- **Hero Macro Metric**: `36–40px` / Bold

*Strict Rule*: Never solve visual hierarchy by making everything larger and bolder. Balance size, contrast, position, and whitespace.

---

## 06. BRAND & FUNCTIONAL COLOR SYSTEM

Lattice is **Blue-First** and grounded in clean neutral surfaces.

```css
/* ── NEUTRALS ─────────────────────────────────────── */
--color-bg:               #F7F9FC; /* Neutral App Canvas */
--color-surface:          #FFFFFF; /* Primary Cards & Panels */
--color-surface-secondary:#F1F5F9; /* Inset controls, table headers */
--color-border:           #E2E8F0; /* Clean 1px Dividers & Card Outlines */
--color-border-strong:    #CBD5E1; /* Active control borders */

--color-text-primary:     #0F172A; /* High-contrast Headings & Body */
--color-text-secondary:   #475569; /* Supporting metadata & captions */
--color-text-muted:       #64748B; /* Subtle descriptions */
--color-text-subtle:      #94A3B8; /* Placeholders & disabled states */

/* ── BRAND BLUE ──────────────────────────────────── */
--color-blue:             #1677FF; /* Primary CTA, Navigation, Focus */
--color-blue-dark:        #0F5FD7; /* Button Hover / Active */
--color-blue-soft:        #EAF3FF; /* Active Pill / Selected tint */
--color-blue-surface:     #F5F9FF; /* Highlighted card fill */

/* ── FUNCTIONAL STATUS ───────────────────────────── */
--color-success:          #10A976; /* Completed, On-Track, Positive Spend */
--color-success-soft:     #E9F9F3;
--color-warning:          #F59E0B; /* Attention Needed, Pending Decision */
--color-warning-soft:     #FFF7E6;
--color-danger:           #E5484D; /* Critical Risk, Overdue, Defect */
--color-danger-soft:      #FFF0F0;
```

### Color Behavior Rules
- **Blue**: Primary action, active selection, tab navigation, primary progress.
- **Green**: Healthy state, verified sign-off, completed milestone, positive variance.
- **Orange**: Warning flag, pending inspection, weather delay risk.
- **Red**: Overdue task, critical safety risk, blocked milestone, destructive action.
- *Strict Rule*: No decorative rainbow dashboards. Most of every screen must remain neutral. Color directs attention to actionable intelligence.

---

## 07. LATTI AI VISUAL LANGUAGE

- Latti uses the subtle sapphire-to-cyan transition for **identity, insight highlights, and AI CTAs**.
- **Rule**: AI must NOT create an alien visual theme. Never wrap ordinary operational UI in heavy gradients. Latti is a deeply integrated assistant, not a bolted-on widget.

---

## 08. SURFACE & CARD PHILOSOPHY

> **"NOT EVERYTHING NEEDS A CARD."**

Use three distinct levels of surface hierarchy:
1. **Level 1 — Page Canvas**: The `#F7F9FC` neutral background.
2. **Level 2 — Section**: Formed naturally through a `24px` gap, a `16–20px` semibold heading, or a hairline `#E2E8F0` divider. Sections do **NOT** require container cards.
3. **Level 3 — Card**: Used **only** when multiple heterogeneous items form a single meaningful object (e.g. Project Summary, Budget Hero, AI Insight Card, Grouped Phase).

### Card System
- **Standard Card**: Background `#FFFFFF`, 1px `#E2E8F0` border, `16px` radius, `16px` padding.
- **Prominent Summary Card**: Background `#FFFFFF`, 1px `#E2E8F0` border, `20px` radius, `20px` padding.
- **Compact Surface**: `12px` radius, `12–16px` padding.
- Use shadows with extreme restraint (e.g. `0 1px 3px rgba(0,0,0,0.05)`). Prefer `surface + border + spacing`.

---

## 09. RADIUS ARCHITECTURE

A unified 5-tier radius scale:
- `8px`: Small badges, micro tags, status chips.
- `12px`: Interactive buttons, form inputs, segmented control containers.
- `16px`: Standard cards, modal dialogs, bottom sheets.
- `20px`: Hero cards, executive overview panels.
- `Full Pill (9999px)`: Status pills, filter chips, user avatars.

---

## 10. INTERACTIVE COMPONENTS & CONTROLS

### Buttons
- **Primary**: `48px` height, `12px` radius, `#1677FF` background, hover `#0F5FD7`, white `14–16px` Semibold label.
- **Secondary**: `44–48px` height, `#FFFFFF` background, 1px `#E2E8F0` border, `#0F172A` label.
- **Tertiary**: Text/icon only with hover tint. No enclosing box.
- **Icon Actions**: Minimum touch target `44×44px` (visible icon `20–24px`).
- **One Primary Rule**: Each screen or sheet must have **ONE** visually dominant primary action.

### Form Inputs
- **Height**: `48px`, `12px` radius, `#FFFFFF` background, 1px `#E2E8F0` border, `px-4` padding.
- **Typography**: Label `12–14px` Medium, Input `16px` Regular (prevents iOS auto-zoom), Helper `12px`.
- Do not box inputs inside nested sub-cards. Group inputs logically with clean spacing.

### Filter Chips
- **Height**: `28–36px`, full pill radius.
- Do not compete with primary buttons. Move deep multi-criteria filters to a dedicated bottom sheet.

### Iconography
- Simple outline icons (`1.75–2px` stroke, Lucide React).
- Sizes: `16px` metadata, `20px` standard, `24px` navigation/header. Zero 3D or cartoon icons.

---

## 11. LIST DESIGN STANDARD

Lists are the lifeblood of construction management.
- **Rule**: Prefer clean lists with hairline dividers over stacked individual cards for:
  *Tasks, Documents, Daily Logs, Subcontractors, Cost Codes, Invoices, Punch Items, Team Members.*
- **Row Height**: `56–72px`.
- **Anatomy**: `[Leading Identifier/Icon] ➔ [Primary Title] ➔ [Secondary Metadata] ➔ [Status Pill] ➔ [Trailing Action/Chevron]`.

---

## 12. INFORMATION PRIORITY MODEL (P0 to P3)

1. **P0 — Immediate (3-Second Rule)**: Critical blocker, overdue task, budget overrun risk, weather hazard.
2. **P1 — Primary**: Core data required for the main workflow (Project name, today's tasks, total spent).
3. **P2 — Supporting**: Contextual info (Assignee, target date, cost code category).
4. **P3 — Detail**: Full specs, vendor tax IDs, change order audit trails (Disclosed on drill-down).

*Rule*: Never render P3 information with P0 visual weight.

---

## 13. DOMAIN UX PATTERNS

### Project Hierarchy Progression
- **Level 1 — Project List**: Name, status pill, location, progress %, next critical date.
- **Level 2 — Project Overview**: Health summary, schedule progress, budget macro state, recent activity, primary CTAs.
- **Level 3 — Dedicated Module**: Full task board, CSI budget ledger, daily logs, drawing plan grid.
- **Level 4 — Item Details**: Complete inspection history, submittal attachments, financial log.

### Budget & Financial Experience
- **First Screen Focus**: Total Planned, Total Spent, Total Remaining, Health Status.
- **Visuals**: Clean progress bars, simple SVG donut ring, 4-segment stacked cost distribution. Avoid squeezing massive multi-axis desktop charts onto a 390px mobile canvas. Numeric values must always accompany visualizations.

### Task Experience
- Priority order: **Overdue ➔ Due Today ➔ In Progress ➔ Upcoming ➔ Completed**.
- Completed items visually recede (`text-[#94A3B8]` with green check).
- Zero-friction status advancement (1-tap toggle without popup friction).

### Daily Logs & Project Updates
- Operational evidence, not social chatter.
- Prioritize **Decision Needed** or **Critical Issue** over routine logs.
- Form fields are for creation; the log detail view groups data cleanly with typography and dividers, not 10 nested boxes.

---

## 14. 5 SENIOR DESIGNER TESTS (MANDATORY BEFORE ANY SCREEN IS FINALIZED)

1. **The 3–5 Second Scannability Test**: Can the superintendent or PM immediately answer: *What is happening? What needs attention? What's next?*
2. **The Card Test**: *Why does this need a card?* If it doesn't represent one unified conceptual object, replace it with a list row, divider, or typographic section.
3. **The Color Test**: *What operational fact does this color communicate?* If it's just decorative, revert to neutral.
4. **The Metric Test**: *Can the user make an actionable jobsite decision from this number?* If not, push to details.
5. **The Primary Action Test**: Is the single most important next step unmistakable?

---

*This document is the permanent single source of truth for the Lattice mobile design system.*
