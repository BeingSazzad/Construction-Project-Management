# Complete Master Reference Specifications & Persistent Repository Memory

> **Persistent Web Architecture & Construction App Master Reference**: This document records the exhaustive reference specifications, component schemas, module architectures, visual tokens, and business logic gathered from the **Lattice Web Reference Platform** and the Avery Marsh Construction Management ecosystem. When pulling this repository on any computer or browser, this document provides 100% complete context without needing to redo any research.

---

## 🎨 1. Core Visual System & Design Tokens (Dark Sapphire Architecture)

- **Canvas Background**: `#070A12` (Ultra Dark Slate Navy)
- **Primary Card Background**: `#070D1A` / `#0A111F`
- **Secondary Card Background (Nested/Input)**: `#050811` / `#0E1A33`
- **Borders & Dividers**: `#142036` (Subtle 1px border)
- **Primary Brand Accent**: `#2563EB` (Sapphire Blue), Hover: `#1D4ED8`, Focus: `#3875F6`
- **Functional Status Accents**:
  - **Success / On Schedule / Done**: `#10B981` (Emerald Green)
  - **In Progress / Activity**: `#06B6D4` / `#0EA5E9` (Cyan / Sky Blue with pulsing indicator)
  - **Pending / To Do / At Risk**: `#F59E0B` (Amber)
  - **Critical / Blocked / Punch Item**: `#EF4444` (Rose / Red)
  - **AI Intelligence**: `#8B5CF6` (Purple / Sparkles)
- **Strict Typography Scale (Even Scaling Rule)**:
  - `10px`: Status pills, micro tags, uppercase code prefixes (`01-000`), item counts.
  - `12px`: Secondary descriptions, subtext, vendor names, dates, metadata.
  - `14px`: Input field text, card titles, table headers, button labels.
  - `16px+`: Page headers, KPI metric numerals, hero titles.
  - *Strict Rule*: Zero `8px`, `9px`, `11px`, or `13px` fonts anywhere.
- **Safe Breathing Space & Ergonomics**:
  - Screen standard padding: `px-5 py-4`
  - Safe Bottom Clearance: `pb-28` to `pb-32` across all scrollable views to prevent overlap with the fixed bottom navigation bar.
  - Minimum touch target height: `44px` with active scale feedback (`active:scale-95`).

---

## 📊 2. Home Dashboard 4-KPI Metric Suite & Risk Alerts

The Home Screen (`SimpleHomeView.tsx`) matches the reference platform's 4-card metric suite:
1. **Active Projects**: Displays count of active sites with a `{total} total` top-right green badge.
2. **Tasks In Progress**: Displays active tasks count with a cyan Activity/Pulse icon.
3. **Tasks Due Today**: Displays scheduled tasks due on the current date with a Calendar icon.
4. **Completed Today**: Displays tasks finished today with a green CheckSquare icon.
- **Risk Alerts Widget**: Real-time warning feed highlighting schedule delays, safety flags, and pending inspection sign-offs.

---

## 💰 3. Budgets & Financials Master Ledger Specs

### A. Top Primary Actions
- **`Create Project Budget`**: Opens `CreateProjectBudgetModal` for setting up new standalone or project-linked CSI budgets.
- **`Analyze a Deal` (Latti Deal Analyzer™)**: Opens `DealAnalyzerModal` featuring:
  - Latti Deal Score™ (1 to 100) with rating badge (`Strong Buy`, `Moderate`, `High Risk`).
  - Target After Repair Value (ARV), Purchase Price, Construction Costs, Soft Costs, Financing Rates.
  - 3 Dynamic Scenarios: `Base Case`, `Conservative (-10%)`, `Aggressive (+15%)`.
  - Real-time Cash-on-cash ROI and Net Profit Margin calculations.
- **`Import from BuildScope AI`**: Opens `ImportBudgetModal` for ingesting AI-generated takeoffs and 16-division scopes.

### B. Master CSI 16-Division Cost Code Ledger
The financial ledger covers all standard CSI MasterFormat divisions with live spend, committed subcontracts, and progress bars:
- `01-000 General Requirements & PM`
- `02-000 Site Construction & Grading`
- `03-000 Concrete & Foundations`
- `04-000 Masonry & Brickwork`
- `05-000 Metals & Structural Steel`
- `06-000 Wood, Plastics & Carpentry`
- `07-000 Thermal & Moisture Protection`
- `08-000 Doors & Windows`
- `09-000 Finishes & Drywall`
- `10-000 Specialties`
- `11-000 Equipment`
- `12-000 Furnishings`
- `13-000 Special Construction`
- `14-000 Conveying Systems (Elevators)`
- `15-000 Mechanical & HVAC`
- `16-000 Electrical & Power Systems`

### C. Pre-Built CSI Master Templates
- **Commercial Highrise Master (71 Divisions)**: Heavy civil, steel framing, curtain walls, MEP systems.
- **Custom Residential Build (50 Divisions)**: Grading, post-tension slab foundation, framing, luxury finishes.
- **Multi-Family Interior Renovation (28 Divisions)**: Fast-turnaround tenant fit-outs, drywall, cabinetry, MEP fixtures.

---

## ⚡ 4. Task Management & 3-State Status Lifecycle

- **1-Click Seamless Progression (Zero PIN Code Friction)**:
  - `To Do` ➔ Clicking advances to `In Progress` (Cyan background, pulse dot).
  - `In Progress` ➔ Clicking advances to `Done` (Emerald background, checkmark icon).
  - `Done` ➔ Clicking resets to `To Do`.
  - Task toggles execute smoothly in both `ProjectTasksTab.tsx` and `ProjectOverviewTab.tsx` without popup dialog blockers.

---

## 👥 5. Team Directory & Member Affiliation Model

- **Explicit Affiliation Classification**:
  - `🏢 GC (In-House Staff)`: General Contractor project managers, superintendents, and engineers.
  - `🔨 Sub (Subcontractor)`: External trade partners and specialty trade crews.
- **Standard Trade Designations**:
  - Project Manager, Site Superintendent, Lead Architect, Structural Engineer, MEP Coordinator, Concrete Lead, Electrical Subcontractor, Drywall & Paint Lead.

---

## 📸 6. Site Photo Gallery & Document Management

- **Site Photo Gallery (`ProjectPhotosTab.tsx`)**:
  - Clean, unobstructed `aspect-square` grid with minimal glassmorphism category tags.
  - Authentic construction photography presets (civil excavation, structural steel, rough electrical, crane rigging, HVAC ducting).
  - High-res Lightbox Modal with zoom, image download, date/phase metadata, and fallback fail-safe.
- **Project Documents (`ProjectDocumentsTab.tsx`)**:
  - Organized file categories: `Contracts & Agreements`, `Permits & Approvals`, `Drawings & Plans`, `Submittals & Specs`.

---

## 🗺️ 7. Interactive Drawing & Blueprint PlanGrid (`ProjectPlanGridTab.tsx`)

- Zoom and pan viewport for architectural floor plans.
- Pin placement system for:
  - `📍 Task Markers`: Linked directly to milestone schedule items.
  - `⚠️ Punch Item Pins`: Non-conformance defect markers with photo attachments.
  - `🔍 Inspection Pins`: Municipal and third-party inspection sign-offs.

---

## 🤖 8. Latti AI Copilot Architecture (`LattiAssistant.tsx`)

- Single unified AI stream for real-time construction intelligence:
  - Automated Daily Log summarization.
  - Budget risk variance detection and contingency alerts.
  - Schedule delay impact forecasts.
  - Quick natural language navigation across projects and tabs.

---

## 🛠️ 9. Build, Verification & Deployment Commands

To run and verify the codebase locally on any machine:
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Compile and verify TypeScript types + production bundle
npm run build
```

---
*All web specifications and domain knowledge are fully versioned in Git for multi-device collaboration.*
