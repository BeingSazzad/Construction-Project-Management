# Lattice — 4-Role Permission Matrix (Locked)

Source of truth for Figma and app gating.  
Roles: **Owner** (`admin`) · **Project Manager** (`pm`) · **Field** (`field`) · **Finance** (`finance`)

## Legend

| Word | Meaning |
| :--- | :--- |
| **Full** | Create / Edit / Delete / Manage |
| **Manage** | Create / Edit / Assign on assigned work. No company or billing control. |
| **Action** | Create / update only own assigned items |
| **View** | Read only |
| **Approve** | Final yes that changes money or company state |
| **—** | No access. Hide the control. |

---

## 1. Company & workspace

| Area | Owner | PM | Field | Finance | Best vs SS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Company Settings | **Full** | **View** | — | **View** | SS thik. Read-only company card for PM/Finance. |
| Subscription | **Full** | — | — | — | SS thik. |
| Invite company users | **Full** | — | — | — | SS thik. Seat + role = Owner only. |
| Roles & permissions | **Full** | — | — | — | SS thik. |
| Add member to a **project** | Full | **Manage assigned** | — | — | SS-e missing. Split from company invite. |
| Make Admin / Remove user | **Full** | — | — | — | SS Roles row. |

---

## 2. Projects

| Area | Owner | PM | Field | Finance | Best vs SS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| See projects | **All jobs** | **Assigned only** | **Assigned only** | **All jobs (ledger)** | SS “budget-related” = all jobs with a budget. |
| Create Project | **Full** | — | — | — | SS thik. Owner creates, then assigns Lead PM. |
| Edit Project | Full | **Manage assigned** | — | — | SS thik. |
| Delete Project | **Full** | — | — | — | SS thik. |
| Assign Lead PM | **Full** | — | — | — | SS thik. PM cannot appoint the PM. |
| Project Overview | **View all** | **Manage assigned** | **View assigned** | **View** | SS thik. PM landing tab = Tasks. Overview still visible. |

---

## 3. Job delivery

| Area | Owner | PM | Field | Finance | Best vs SS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Tasks | View | **Full / Assign** | **Action assigned** | View | SS thik. Owner does not run the board. |
| Schedule | View | **Manage** | View assigned | View | SS thik. |
| Milestones | View | **Manage** | View | View | SS thik. |
| Daily Logs | View | **Review / Manage** | **Create / Edit own** | View | SS thik. Drop “if needed”. |
| Project Updates | View / Post | **Create / Manage** | View | View | SS thik. |
| Site Photos | Full | Manage | **Upload / View** | View | SS thik. |
| Documents / Plans | Full | Manage | Upload / View | View financial docs | SS thik. |
| Project Team | Full | **Manage assigned team** | View | View | SS thik. Trades/staff only, not company roles. |

---

## 4. Money

| Area | Owner | PM | Field | Finance | Best vs SS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Create Budget | **Approve / Full** | — | — | **Create / Manage** | SS thik. |
| Edit Budget | Full | Limited / View | — | Full | SS thik. PM cannot rewrite the book. |
| View Budget | Full | **View** | — | Full | SS thik. |
| Add Expense / Cost | Full | **Limited** (job cost) | — | Full | SS thik. |
| Commitments | Full | View | — | **Manage** | SS thik. |
| Change Orders | **Approve** | **Create / Request** | — | Manage / Review | SS thik. |
| Pay App / Draw | **Approve** | — (forward only) | — | **Create / Manage** | SS-e chilo na. Add kora. |
| Lien Waiver | **Full** | — | — | **Manage** | Add kora. |
| Cost codes | Full | View | — | **Manage** | SS thik. |
| Financial reports | Full | Project summary | — | Full | SS thik. |
| Profit / Loss | **View** | — | — | **Manage / View** | SS thik. |

---

## 5. System

| Area | Owner | PM | Field | Finance | Best vs SS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Latti project insights | All jobs | Assigned | Limited assigned | Financial context | SS thik. |
| Latti budget insights | Full | Summary | — | Full | SS thik. |
| Notifications | Own | Own | Own | Own | SS thik. |
| Activity / audit | Full | Project activity | Own / relevant | Financial activity | SS thik. |
| Profile | Edit self + company | Edit self | Edit self | Edit self | App thik. |

---

## Locked product rules

1. Only Owner buys Lattice and owns the company record.
2. Owner creates the project, then assigns the Lead PM. PM never self-creates a company job.
3. PM / Field see only assigned jobs. Finance sees every job ledger.
4. Field never sees budget, CO, pay app, draw, or billing.
5. PM can request a CO. Owner approves (contract sum). Finance reviews/manages the ledger.
6. Hide any control that is **—**. Do not show a disabled Owner button.

## App alignment

The app hides any control marked **—**. Company Settings is **View** for PM and Finance (no Save). Field does not see Company or Subscription.
