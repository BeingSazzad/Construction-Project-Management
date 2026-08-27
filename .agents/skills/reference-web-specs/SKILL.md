---
name: reference-web-specs
description: Complete persistent memory and master reference specifications for Avery Marsh Construction Project Management web/mobile application.
---

# Complete Master Reference Specifications & Memory Skill

Use this skill whenever working on the Avery Marsh Construction Project Management codebase. It contains the complete memory and specifications collected from the Lattice Web Reference Platform across all application modules.

## System Memory & Core Rules

1. **New Project Creation Form Content**:
   - Strictly 5 fields (+ Cover Photo Upload & Presets):
     1. Cover Photo Upload & Presets (`Modern Build`, `Custom Residence`, `Commercial Highrise`, `Renovation`)
     2. `Project Name *` (`placeholder="e.g. Johnson Residence"`)
     3. `Client Name` (`placeholder="e.g. John & Sarah Johnson"`)
     4. `Address` (`placeholder="123 Oak Lane, Austin TX"`)
     5. `Type` (`Custom Home`, `Remodel`, `New Construction`, `Commercial`, `Design-Build`)
     6. `Master Code (4 digits) *` (`placeholder="1 2 3 4"`, subtext: `Required to unlock completed tasks.`)
   - Primary submit button: `Create Project`

2. **Design Tokens & Theme Architecture**:
   - Base Theme: `#070A12` Ultra Dark Navy
   - Card Fill: `#0A111F` / `#070D1A`
   - Primary Brand Accent: `#2563EB` Sapphire Blue
   - Borders: `#142036`
   - Zero nakli/fake pre-filled state initializers
   - Zero multi-step wizard friction in creation forms
   - Zero upsell clutter in settings

3. **Master Modules Breakdown**:
   - **Projects List**: Portfolio value ($M), live search, 4 filter pills (`All`, `On Schedule`, `At Risk`, `Completed`), project cards with photo thumbnail, location pill, budget KPIs, progress bar.
   - **Project Overview**: Hero image banner, 4-stage connected stepper (`Planning` → `Pre-Con` → `In Progress` → `Completed`), 4 Vitals KPI cards, Quick Navigation grid (`Tasks`, `Punch`, `Photos`, `Docs`), Priority Punch items feed.
   - **Opportunities & Pipeline**: Pipeline stages kanban/list, single-page creation form with 3 clear sections (`Create Opportunity`).
   - **Budgets & Finance**: Master budget ledger, CSI 16-division breakdown, single-page budget creation (`Create Project Budget`).
   - **Team & Messages**: Unified discussion thread with Latti AI bot, company team directory with role filters.
   - **Settings & Company Profile**: Clean 4-field company profile form (`Company Name`, `Business Phone`, `Office Address`, `GC License #`).

4. **Build Verification**:
   - `npx tsc --noEmit` must return 0 errors.
