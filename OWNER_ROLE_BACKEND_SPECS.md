# Master Specification: Owner / Executive Role (Architecture & Backend Integration Guide)

> **Document Version:** 1.0.0  
> **Audience:** Product Managers, Frontend Engineers, Backend Architects, Database Designers  
> **Persona:** Avery Scott — GC Owner, Managing Partner & Real Estate Principal  
> **Application:** LATTICE Construction Management Platform  

---

## 1. Executive Overview & Mental Model

### Who is the Owner?
The **Owner / Executive** (Role: `admin`) is the business owner, managing partner, or general contractor principal. 

### What is their Core Job to be Done?
Unlike a Field Superintendent who tracks hammer-and-nail checklists or a Project Manager who coordinates daily RFIs, **the Owner cares about high-altitude business survival, capital preservation, and portfolio profitability**:
1. **Capital Security:** Is investor/bank capital protected, or are jobs bleeding money?
2. **Contingency Health:** Are cost overruns absorbing our profit contingency reserve?
3. **Macro Schedule Delivery:** Are milestone deadlines on track, or are city inspections stalling?
4. **Live Jobsite Pulse:** How many workers are currently on our sites today?

---

## 2. Comprehensive Feature-by-Feature Specification

```
┌───────────────────────────────────────────────────────────────────────┐
│                          OWNER DASHBOARD ANATOMY                      │
├───────────────────────────────────────────────────────────────────────┤
│ 1. HERO OPERATIONAL FOCUS CARD (Today's Milestone, Telemetry, Weather)│
├───────────────────────────────────────────────────────────────────────┤
│ 2. 3 EXECUTIVE PORTFOLIO KPIS (Total Budget, Total Spend, Projects)  │
├───────────────────────────────────────────────────────────────────────┤
│ 3. EXECUTIVE CAPITAL BALANCE CARD (Paid, Committed, Contingency Bar)  │
├───────────────────────────────────────────────────────────────────────┤
│ 4. LATTI AI EXECUTIVE BRIEFING (Predictive Cost Overrun & Risk Alert) │
├───────────────────────────────────────────────────────────────────────┤
│ 5. ACTIVE PROJECTS MULTI-PROJECT ROLLUP (Portfolio Cards)             │
├───────────────────────────────────────────────────────────────────────┤
│ 6. EXECUTIVE MODALS (Risk Audit Breakdown & Weather Crane Radar)      │
└───────────────────────────────────────────────────────────────────────┘
```

---

### Feature 1: Hero Operational Focus & Site Telemetry Card

#### A. Visual Representation & Placement
The top-most card on the dashboard with a soft gradient (`#EAF3FF` to `#FFFFFF`) and a subtle blue hairline border (`#DCE8F8`).

#### B. Functional Purpose
Gives the executive an instant 3-second snapshot of today's highest-stakes operational event across the entire company portfolio.

#### C. What It Shows & Why It Exists (Business Value)
1. **Focus Badge (`Today's Focus`):** Immediate visual anchor indicating the priority event of the day.
2. **Live Headcount Dot (`94 on site`):** 
   - *Why it exists:* Construction owners need immediate visibility into whether subcontractors actually showed up to work. Low headcount directly correlates with project delays and liquidated damages.
   - *Pulsing Green Dot:* Signals real-time telemetry from connected morning daily logs.
3. **Milestone Headline (`City Framing Walkthrough`):**
   - *Why it exists:* Highlights the critical-path event that can halt the project if failed.
4. **Subtitle & Time (`Snell Isle Residence · Inspector arriving 10:00 AM`):**
   - Location and time of inspector arrival.
5. **Live Weather Pill (`82°F Sunny`):**
   - *Why it exists:* Severe weather (rain >0.5 in/hr or wind >25 mph) halts concrete pours and 50-ton crane lifts.

#### D. Frontend Triggers & Interactivity
- **Clicking the Card:** Navigates directly to the active project (`Snell Isle Residence`).
- **Clicking the Weather Pill:** Opens the `WeatherImpactModal` showing a 3-day radar forecast, crane wind limits, and exterior concrete cure impact.

#### E. Backend Requirements & Data Contract
- **API Endpoint:** `GET /api/v1/owner/site-pulse`
- **Response Schema:**
```json
{
  "focusMilestone": {
    "id": "ms-101",
    "projectId": "proj-1",
    "projectName": "Snell Isle Residence",
    "title": "City Framing Walkthrough",
    "scheduledTime": "2026-09-05T10:00:00Z",
    "inspector": "Frank Rodriguez (City of Tampa)",
    "criticalPath": true
  },
  "liveTelemetry": {
    "totalHeadcountOnSite": 94,
    "activeSubcontractorCrews": 6,
    "timestamp": "2026-09-05T08:30:00Z"
  },
  "weather": {
    "tempFahrenheit": 82,
    "condition": "Sunny",
    "windSpeedMph": 8,
    "precipitationChance": 10,
    "isCraneHalted": false
  }
}
```

---

### Feature 2: The 3 Core Executive KPIs

#### A. Visual Representation & Placement
A responsive 3-column metric grid (`grid grid-cols-3`) positioned directly below the Hero card.

#### B. Component Breakdown
| Metric Card | Value Displayed | Meaning & Executive Business Value |
|---|---|---|
| **1. Total Budget** | `$34.85M` | Sum of all client contracts / total authorized construction capital under management. Tells the owner the total volume of work currently in flight. |
| **2. Total Spend** | `$16.82M` | Cumulative disbursed capital (paid invoices + approved ACH pay applications to trades). |
| **3. Active Projects** | `7 Active` | Total count of ongoing jobsites under construction (excluding warranty or planning). |

#### C. Frontend Triggers & Interactivity
- Clicking **Total Budget** or **Total Spend** triggers `onOpenBudgetsHub()`, navigating to the full financial ledger.
- Clicking **Active Projects** triggers `onOpenProjects()`, navigating to the Projects Master Directory.

#### D. Backend Requirements & Aggregation Logic
- **API Endpoint:** `GET /api/v1/owner/portfolio-summary`
- **Calculation Rules:**
  $$\text{Total Portfolio Budget} = \sum \text{project.budget.total}$$
  $$\text{Total Disbursed Spend} = \sum (\text{project.budget.actual} + \text{project.budget.paid})$$
  $$\text{Active Projects Count} = \text{COUNT}(\text{projects WHERE status IN ('In Progress', 'Pre-Construction')})$$
- **Response Schema:**
```json
{
  "portfolioSummary": {
    "totalBudget": 34850000.00,
    "totalSpend": 16820000.00,
    "totalCommitted": 12080000.00,
    "totalContingency": 5950000.00,
    "activeProjectsCount": 7,
    "currency": "USD"
  }
}
```

---

### Feature 3: Executive Capital Balance & Contingency Reserve Card

#### A. Visual Representation & Placement
A full-width single-layer card featuring an executive header, status badge (`Protected`), continuous multi-color progress bar, and justified legend.

#### B. Functional Purpose & Business Value
This is the single most critical card for a construction business owner.
- **The Problem:** Construction projects fail when cost overruns eat through the unspent contingency buffer, dipping into the general contractor's profit margin.
- **The Solution:** Visualizes how portfolio capital is partitioned into:
  1. **Paid (48% / $16.8M — Deep Blue):** Capital already wired to subcontractors and suppliers.
  2. **Committed (35% / $12.1M — Sky Blue):** Signed subcontracts and issued purchase orders that are legally binding but not yet billed.
  3. **Contingency (17% / $5.95M — Soft Blue):** Unallocated emergency reserve protecting project margins against unforeseen site risks.
- **Status Badge (`Protected`):** Assures the owner that current project variances have not pierced the contingency ceiling.

#### C. Frontend Triggers & Interactivity
- Clicking this card opens the **Executive Risk Audit Modal**, detailing the specific project variances that are being absorbed by contingency.

#### D. Backend Data Contract
- **Calculation Formula:**
  $$\text{Remaining Uncommitted Contingency} = \text{Total Budget} - (\text{Paid} + \text{Committed})$$
  $$\% \text{ Contingency Ratio} = \frac{\text{Contingency}}{\text{Total Budget}} \times 100$$
- **Alert Trigger:** If `Contingency Ratio < 8%`, badge changes from `Protected` (green) to `Warning: Depleting` (amber) or `At Risk` (red).

---

### Feature 4: Latti AI Executive Briefing (Predictive Risk Intelligence)

#### A. Visual Representation & Placement
A sleek briefing card with an AI sparkle icon, concise 2-sentence executive briefing in an inset card, and two action buttons (`Inspect Budget Risks` and `Ask Copilot`).

#### B. Functional Purpose & Business Logic
Owners do not have time to comb through 500 line items in Excel. **Latti AI continuously analyzes construction cost codes (CSI MasterFormat), weather APIs, and project schedules to synthesize real-time risks.**

#### C. Real-World Construction Scenario Shown:
> *"Snell Isle concrete costs are running 8% (+$14,200) over budget due to revised pier depths. Thursday rainfall threatens exterior concrete cure. All other projects are tracking within contingency thresholds."*

1. **Concrete Variance (+$14,200):** Geotechnical testing revealed unstable waterfront subsoil, requiring 6 extra helical piers drilled to 24 ft depth.
2. **Rain Threat:** Rain prevents exterior slab curing, alerting the owner to potential schedule delays.
3. **Contingency Protection:** Informs the owner that Snell Isle's $185,000 Phase 1 contingency reserve has fully absorbed this overrun.

#### D. Frontend Triggers & Interactivity
- **Button 1: `Inspect Budget Risks`:**
  - Opens the **Executive Risk Audit Modal** (Feature 6A).
- **Button 2: `Ask Copilot`:**
  - Launches Latti AI chat preloaded with the prompt `"Show owner risk analysis"`.

#### E. Backend AI Engine & Data Contract
- **API Endpoint:** `GET /api/v1/owner/ai-briefing`
- **Generation Trigger:** Generated on schedule (every 4 hours) or when a change order / cost variance $> $5,000 is logged.
- **Response Schema:**
```json
{
  "aiBriefing": {
    "generatedAt": "2026-09-05T07:00:00Z",
    "headline": "Snell Isle Phase 2 Pier Variance Contained",
    "summary": "Snell Isle concrete costs are running 8% (+$14,200) over budget due to revised pier depths. Thursday rainfall threatens exterior concrete cure. All other projects are tracking within contingency thresholds.",
    "topRisks": [
      {
        "projectId": "proj-1",
        "csiCode": "03 30 00",
        "csiName": "Cast-in-Place Concrete",
        "varianceAmount": 14200.00,
        "variancePercent": 8.2,
        "contingencyRemaining": 185000.00,
        "absorbedByContingency": true,
        "status": "Contained"
      }
    ],
    "weatherAlert": {
      "targetDate": "2026-09-10",
      "riskType": "Exterior Concrete Cure Delay"
    }
  }
}
```

---

### Feature 5: Active Projects Multi-Project Rollup

#### A. Visual Representation & Placement
Located at the bottom of the home screen, presenting clean multi-project cards with thumbnail images, status badges, progress bars, and budget metrics.

#### B. Functional Purpose
Allows the owner to scan their entire portfolio (e.g. `Snell Isle Residence`, `Downtown Commercial`, `Greenfield Residential`, `Sunset Villas`) without switching screens.

#### C. Data Displayed Per Project:
- **Project Name & City:** e.g., `Snell Isle Residence · Tampa, FL`
- **Total Project Contract:** e.g., `$4.65M`
- **Construction Progress:** e.g., `65%`
- **Schedule Health Badge:** `On Schedule` (Green) or `Needs Attention` (Amber)
- **Assigned PM:** Sarah Johnson (Lead Project Manager)

#### D. Backend Data Contract
- **API Endpoint:** `GET /api/v1/projects?status=active`

---

### Feature 6: Executive Modals & Deep Dives

#### A. Executive Risk Audit Modal (`RiskAuditModal`)
- **Trigger:** Clicked via `Inspect Budget Risks` button or `Executive Capital Balance` card.
- **Content:**
  1. **3 Metric Pills:** CSI Code (`03 30 00`), Variance (`+$14,200 / +8%`), Contingency (`$185K Reserve`).
  2. **Root Cause Analysis:** Explains that geotechnical tests by Madrid CPWG required deepening cast-in-place concrete piers from 18ft to 24ft.
  3. **Mitigation Confirmation:** 100% absorbed by Snell Isle Phase 1 contingency savings; zero completion schedule delay.
  4. **Action Buttons:** `Dismiss` (closes modal) and `Inspect Budget Ledger` (navigates to full budget ledger).

#### B. Weather Impact Modal (`WeatherImpactModal`)
- **Trigger:** Clicked via weather pill in the Hero Card.
- **Content:**
  1. **3-Day Site Radar & Rain Forecast.**
  2. **Crane Safety Limit:** Wind speed threshold alert (>25 mph halts mobile crane).
  3. **Direct Action:** `Adjust Schedule` (navigates to Gantt chart) or `Log Site Condition` (navigates to Daily Logs).

---

## 3. Database Schema Recommendations (PostgreSQL / Relational)

To support this entire Owner role in production, backend engineers should implement the following tables:

```sql
-- 1. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Project Budgets Table
CREATE TABLE project_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    total_budget NUMERIC(15,2) NOT NULL,
    committed_amount NUMERIC(15,2) DEFAULT 0.00,
    actual_spent_amount NUMERIC(15,2) DEFAULT 0.00,
    contingency_reserve NUMERIC(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cost Code Items (CSI MasterFormat)
CREATE TABLE cost_code_variances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    csi_code VARCHAR(20) NOT NULL, -- e.g. '03 30 00'
    division_name VARCHAR(100) NOT NULL, -- e.g. 'Cast-in-Place Concrete'
    budgeted_amount NUMERIC(15,2) NOT NULL,
    actual_amount NUMERIC(15,2) NOT NULL,
    variance_amount NUMERIC(15,2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
    variance_percentage NUMERIC(5,2) GENERATED ALWAYS AS (((actual_amount - budgeted_amount) / NULLIF(budgeted_amount, 0)) * 100) STORED,
    root_cause_summary TEXT,
    is_contingency_absorbed BOOLEAN DEFAULT TRUE
);

-- 4. Site Telemetry & Headcount Logs
CREATE TABLE daily_headcount_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    total_workers_on_site INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI Risk Briefings Table
CREATE TABLE executive_ai_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline VARCHAR(255) NOT NULL,
    summary_text TEXT NOT NULL,
    severity_level VARCHAR(20) DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 4. Backend API Specifications Summary

| HTTP Method | Endpoint Path | Description | Required Auth Role |
|---|---|---|---|
| `GET` | `/api/v1/owner/site-pulse` | Fetches today's critical milestone, live headcount, and current weather. | `admin` |
| `GET` | `/api/v1/owner/portfolio-summary` | Returns aggregated total budget, total spent, commitments, and active project counts. | `admin` |
| `GET` | `/api/v1/owner/capital-balance` | Returns breakdown of Paid, Committed, and Contingency percentages and amounts. | `admin` |
| `GET` | `/api/v1/owner/ai-briefing` | Fetches the latest synthesized executive briefing from the risk analysis engine. | `admin` |
| `GET` | `/api/v1/owner/risk-audit/:projectId` | Fetches in-depth CSI variance and root-cause details for the Executive Risk Audit modal. | `admin` |
| `GET` | `/api/v1/owner/weather-impact/:projectId` | Fetches crane wind thresholds and 3-day radar precipitation data. | `admin`, `pm`, `field` |

---

## 5. Backend টিমকে যেভাবে সংক্ষেপে উপস্থাপন করবেন (Quick Presentation Guide in Bengali)

আপনি যখন এই ডক্যুমেন্টটি ব্যাকএন্ড ডেভেলপারদের হাতে দেবেন, তখন নিচের মূল পয়েন্টগুলো স্পষ্টভাবে ব্যাখ্যা করতে পারবেন:

1. **অনার ড্যাশবোর্ডের কাজ কী?**
   - অনার মাইক্রো-টাস্ক দেখতে আসেন না। তিনি দেখতে আসেন **কোম্পানির সব প্রজেক্ট মিলিয়ে মোট কত টাকা ইনভেস্ট হয়েছে (`Total Budget`), কত খরচ হয়েছে (`Total Spend`), এবং লাভ বাঁচানোর জন্য রাখা ইমার্জেন্সি ফান্ড (`Contingency Reserve`) সুরক্ষিত আছে কি না।**

2. **লাইভ হেডকাউন্ট (`94 on site`) কোথা থেকে আসবে?**
   - ফিল্ড সুপারিনটেনডেন্ট সকালে যে `Daily Log` তৈরি করেন, সেখানকার সাবকন্ট্রাক্টর ম্যানপাওয়ার যোগ করে সরাসরি রিয়েল-টাইম সামারি হিসেবে অনার রোলে দেখানো হয়।

3. **ক্যাপিটাল ব্যালেন্স বার (`48% Paid, 35% Committed, 17% Contingency`):**
   - এটি ৩টি ডেটা ফিল্ডের রেশিও: অলরেডি পেইড ইনভয়েস (`Paid`), সাইন করা কিন্তু এখনো বিল না হওয়া কনট্রাক্ট (`Committed`), এবং অবশিষ্ট আন-কমিটেড রিজার্ভ (`Contingency`)। ব্যাকএন্ডকে এই ৩টি যোগফল প্রোভাইড করতে হবে।

4. **Latti AI Briefing ও Risk Audit:**
   - যখন কোনো প্রজেক্টে নির্ধারিত বাজেটের চেয়ে বেশি খরচ হয় (যেমন: স্নেল আইলে ফাউন্ডেশন পাইলিং করতে গিয়ে $14,200 বেশি লেগেছে), তখন AI সিস্টেম এই ওভাররান ডিটেক্ট করে একটি ব্রিফিং তৈরি করবে এবং অনারকে জানাবে যে এটি কন্টিনজেন্সি রিজার্ভ থেকে অ্যাডজাস্ট করা হয়েছে কি না।

5. **সব ডেটা সিঙ্গেল-লাইন ও রেসপনসিভ:**
   - ফ্রন্টএন্ডে সমস্ত ডেটা সুন্দর ফরম্যাটে (যেমন: `$34.85M`, `$16.82M`, `94 on site`) সাজানো আছে, যাতে মোবাইল বা ট্যাবলেটে কোনো টেক্সট ভেঙে না যায়।
