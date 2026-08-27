# Project Reference Specifications & Memory Context

> **Persistent Repository Memory**: This file documents all research, specifications, component schemas, and design guidelines derived from the **Lattice Web Reference Application**. Any AI assistant or developer working on this project across different devices should follow these exact specs without re-researching.

---

## 🎨 1. Core Design System & Tokens

- **Theme Base Background**: `#070A12` (Ultra Dark Slate Navy)
- **Container Card Fill**: `#0A111F` / `#070D1A`
- **Card Borders**: `#142036` (Subtle 1px border)
- **Primary Brand Accent**: `#2563EB` (Sapphire Blue), Hover: `#1D4ED8`, Active/Highlight: `#3875F6`
- **Typography Scale**: Strictly `10px` (badges), `11px` (labels/subtext), `12px` (body/inputs), `14px` (headers), `16px+` (hero titles).
- **Touch Targets**: 44px - 48px height minimum for all buttons and inputs.
- **Clutter-Free Principle**: Zero fake pre-filled defaults, zero unnecessary multi-step wizards, zero upsell popups in core workflows.

---

## 📋 2. Screen-by-Screen Reference Content Specs

### A. New Project Creation (`CreateProjectView.tsx` / `CreateProjectModal.tsx`)
Must contain **strictly 5 core fields** (+ Cover Photo Upload) matching reference web specs:
1. **Cover Photo Upload**: File drop / tap selector + 4 preset site photos (`Modern Build`, `Custom Residence`, `Commercial Highrise`, `Renovation`).
2. **Project Name \*** (`placeholder="e.g. Johnson Residence"`)
3. **Client Name** (`placeholder="e.g. John & Sarah Johnson"`)
4. **Address** (`placeholder="123 Oak Lane, Austin TX"`)
5. **Type** (Dropdown: `Custom Home`, `Remodel`, `New Construction`, `Commercial`, `Design-Build`)
6. **Master Code (4 digits) \*** (`placeholder="1 2 3 4"`, helper text: `Required to unlock completed tasks.`)
- **Action**: Full-width `Create Project` button (`#2563EB` Sapphire Blue).

### B. Projects Master List (`ProjectsList.tsx`)
- **Header Summary**: Total Sites Count, Total Portfolio Value ($M), At Risk Count, `+ New` button.
- **Search & Filters**: Real-time search bar + 4 Filter Pills (`All`, `On Schedule`, `At Risk`, `Completed`).
- **Project Cards**: Photo thumbnail, Status Badge, Location pill, Title, PM Name, Budget/Spent/Progress KPIs, Risk-colored progress bar.

### C. Project Overview Workspace (`ProjectOverviewTab.tsx`)
- **Hero Banner**: Image header, City/State, PM Name, Status Badge, Progress %.
- **Connected Lifecycle Stepper**: 4 stages (`Planning` → `Pre-Con` → `In Progress` → `Completed`).
- **Key Vitals Grid**: Overall Progress %, Tasks Metric, Financial Vitals ($Spent vs $Total), Remaining Budget.
- **Quick Navigation**: `Tasks`, `Punch`, `Photos`, `Docs`.
- **Priority Items**: High-priority punch list feed.
- *Excluded Clutter*: Hardcoded build order checklists and duplicate popups in Overview are strictly omitted.

### D. Opportunities & Pipeline (`CreateDealView.tsx` / `OpportunitiesView.tsx`)
- **Single-Page Creation**: Clean form with 3 sections (Opportunity & Client Info, Pipeline & Financials, Schedule & Scope).
- *Excluded Clutter*: Multi-step wizard flows (step 1/2/3) are strictly omitted in favor of single scrollable form.

### E. Company Settings (`CompanyProfileView.tsx`)
- **Fields**: Company Name, Business Phone, Office Address, GC License #.
- *Excluded Clutter*: Custom report branding upsell cards and artificial score badges are strictly omitted.

---

## 🛠️ 3. Verification Commands

To verify code integrity on any machine:
```bash
npx tsc --noEmit
npm run dev
```

---
*Created and committed to Git for persistent multi-device memory.*
