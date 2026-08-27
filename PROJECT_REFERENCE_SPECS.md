# Complete Master Reference Specifications & Memory Context

> **Persistent Repository Memory (Full 2-Day Web Research Audit)**: This document records the complete, exhaustive reference specifications, component schemas, module architectures, and design tokens gathered from the **Lattice Web Reference Platform**. Any developer or AI agent pulling this repository on any PC will have 100% full context without re-researching.

---

## 🎨 1. Core Design System & Tokens

- **Theme Base Background**: `#070A12` (Ultra Dark Slate Navy)
- **Container Card Fill**: `#0A111F` / `#070D1A`
- **Card Borders**: `#142036` (Subtle 1px border)
- **Primary Brand Accent**: `#2563EB` (Sapphire Blue), Hover: `#1D4ED8`, Active/Highlight: `#3875F6`
- **Secondary Status Accents**:
  - Success/On Schedule: `#10B981` (Emerald Green)
  - Warning/At Risk: `#F59E0B` (Amber)
  - Critical/Punch: `#EF4444` (Rose/Red)
  - Info/Photos: `#0EA5E9` (Sky Blue)
  - AI Assistant: `#8B5CF6` (Purple/Sparkles)
- **Typography Scale**: `10px` (badges/pills), `11px` (labels/subtext), `12px` (body text & inputs), `14px` (headers/subtitles), `16px+` (hero titles).
- **Touch Heights**: 44px - 48px minimum height for inputs, buttons, and interactive targets.
- **UX Core Rule**: Zero fake pre-filled defaults, zero unnecessary multi-step wizard friction, zero upsell clutter in core flows.

---

## 🏗️ 2. Comprehensive Module-by-Module Specifications

### A. Navigation & Frame Architecture
- **Header (`Header.tsx`)**: Sticky top header with user avatar, role greeting, drawer toggle button, unread notification count, Latti AI copilot trigger, and Messages link.
- **Bottom Navigation (`BottomNav.tsx`)**: Fixed glassmorphism bottom bar containing `Home`, `Projects`, `Center Floating FAB (+)` for quick create actions, `Opportunities`, and `Finance`.
- **Side Drawer (`SideDrawer.tsx`)**: Drawer menu covering Operations & Tools (`Opportunities`, `Team Directory`, `Field Reports`, `Latti AI Copilot`) and Account & Setup (`Settings`, `Sign Out`).

### B. New Project Creation (`CreateProjectView.tsx` / `CreateProjectModal.tsx`)
Must contain **strictly 5 core fields** (+ Cover Photo Upload) matching reference web specs 1:1:
1. **Project Cover Photo**: Image uploader + 4 curated site photo presets (`Modern Build`, `Custom Residence`, `Commercial Highrise`, `Renovation`).
2. **Project Name \*** (`placeholder="e.g. Johnson Residence"`)
3. **Client Name** (`placeholder="e.g. John & Sarah Johnson"`)
4. **Address** (`placeholder="123 Oak Lane, Austin TX"`)
5. **Type** (Dropdown: `Custom Home`, `Remodel`, `New Construction`, `Commercial`, `Design-Build`)
6. **Master Code (4 digits) \*** (`placeholder="1 2 3 4"`, helper text: `Required to unlock completed tasks.`)
- **Action**: Full-width `Create Project` button (`#2563EB` Sapphire Blue).

### C. Projects Master List (`ProjectsList.tsx`)
- **Portfolio Summary**: Total Sites count, Total Portfolio Value ($M), At Risk Site alert, `+ New` button.
- **Search & Filters**: Live search input by name or location + 4 Filter Pills (`All`, `On Schedule`, `At Risk`, `Completed`).
- **Project Cards**: Photo thumbnail, Status Badge, Location pill, Title, PM Name, Budget/Spent/Progress KPIs, Risk-colored progress bar.

### D. Project Workspace & Detail Tabs (`ProjectWorkspace.tsx`)
- **Project Overview (`ProjectOverviewTab.tsx`)**:
  - Hero image banner, City/State, PM details, Status Badge, Progress %.
  - Connected 4-Stage Lifecycle Stepper (`Planning` → `Pre-Con` → `In Progress` → `Completed`).
  - Key Vitals Grid (Progress %, Tasks Completed, Financial Vitals $Spent vs $Total, Remaining Budget).
  - Quick Navigation Grid (`Tasks`, `Punch`, `Photos`, `Docs`).
  - Priority Punch Items feed.
- **Tasks (`ProjectTasksTab.tsx`)**: Task list with milestone tags, priority badges, assignee avatars, subtask checklists, and task detail modal.
- **Schedule (`ProjectScheduleTab.tsx`)**: Phase timeline bars (Gantt style), milestone target dates.
- **Drawings / PlanGrid (`ProjectPlanGridTab.tsx`)**: Interactive floor plan blueprint viewer with pin markers (Task, Punch, Inspection), room/area tags, and status updates.
- **Punch List (`ProjectPunchListTab.tsx`)**: Quality non-conformance logs, responsible trade assignees, defect photos, priority levels, status toggles.
- **Daily Logs (`ProjectDailyLogsTab.tsx`)**: Site logs with weather widgets, total crew headcount, trade worker hours, materials received, safety signoffs.
- **Budget (`ProjectBudgetTab.tsx`)**: CSI 16-division master cost code ledger, committed vs actual spend, paid vs remaining budget.
- **Photos (`ProjectPhotosTab.tsx`)**: Site photo gallery categorized by progress phase, photo upload modal, photo preview modal.
- **Documents (`ProjectDocumentsTab.tsx`)**: File directory (Contracts, Permits, Submittals, Specifications), document upload & preview modals.
- **Team (`ProjectTeamTab.tsx`)**: Project team members, role assignments, contact details.
- **Reports (`ProjectReportsTab.tsx`)**: Report templates (Daily Summary, Budget Variance, Punch List Audit, Safety Compliance), PDF export action.

### E. Opportunities & Pipeline (`CreateDealView.tsx` / `OpportunitiesView.tsx`)
- **Pipeline Kanban & List**: Pipeline stages (`New Lead`, `Contacted`, `Discovery`, `Plans Received`, `Estimating`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`). Total value ($M), weighted probability value ($M), win rate %.
- **Single-Page Opportunity Creation (`CreateDealView.tsx`)**: Clean 1-page form with 3 sections: Opportunity & Client Info, Pipeline Classification & Financials, Schedule & Scope Details. Submit action: `Create Opportunity`.

### F. Budgets & Finance Hub (`BudgetsHubView.tsx` / `CreateProjectBudgetModal.tsx`)
- **Master Budget Overview**: Cross-project budget health, committed vs actual expenditure, CSI division breakdown.
- **Budget Creation Form (`CreateProjectBudgetModal.tsx`)**: Clean 1-page form for Budget Name, Budget Number, Project Type, Attach to Project, Prepared By, and Budget Methodology (`CSI 16-Division Template` or `AI Takeoff`).

### G. Messages & Team Hub (`MessagesHubView.tsx` / `TeamHubView.tsx`)
- **Messages**: Project discussion threads, team chat channels, direct messages, and Latti AI milestone bot notifications.
- **Team Directory**: Company directory, role filtering (Execs, PMs, Field Engineers, Subcontractors), invite member modal.

### H. Latti AI Copilot (`LattiAssistant.tsx`)
- Single unified AI stream for construction queries, daily log summaries, budget risk analysis, schedule forecasts, and quick in-app tab navigation.

### I. Settings & Legal (`SettingsView.tsx` / `CompanyProfileView.tsx` / Legal Pages)
- **Account & Security**: Profile editing, password security updates, notification preference toggles.
- **Company Profile (`CompanyProfileView.tsx`)**: Company Name, Business Phone, Office Address, General Contractor License #.
- **Legal Suite**: Terms & Conditions, Privacy Policy, AI Disclaimer, Subscription Terms, Beta Agreement.

---

## 🛠️ 4. Build & Type Checking Commands

Verify clean build on any machine:
```bash
npx tsc --noEmit
npm run dev
```

---
*Exhaustive Web Research Memory stored in Git repository for multi-device sync.*
