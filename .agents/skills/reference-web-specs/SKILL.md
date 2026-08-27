---
name: reference-web-specs
description: Persistent memory and reference web specifications for Avery Marsh Construction Project Management web/mobile application.
---

# Reference Web Specifications & Memory Skill

Use this skill whenever working on Avery Marsh Construction Project Management codebase. It contains authoritative guidelines, component content schemas, and design system rules.

## Core Rules & Memory

1. **New Project Creation Form Content**:
   - Strictly 5 fields (+ Cover Photo Upload):
     1. Cover Photo Upload & Presets
     2. `Project Name *` (`e.g. Johnson Residence`)
     3. `Client Name` (`e.g. John & Sarah Johnson`)
     4. `Address` (`123 Oak Lane, Austin TX`)
     5. `Type` (`Custom Home`, `Remodel`, `New Construction`, `Commercial`, `Design-Build`)
     6. `Master Code (4 digits) *` (`1 2 3 4`, helper subtext: `Required to unlock completed tasks.`)
   - Primary submit button: `Create Project`

2. **Design System & Theme**:
   - Base Theme: `#070A12` Ultra Dark Navy
   - Primary Accent: `#2563EB` Sapphire Blue
   - Borders: `#142036`
   - Zero nakli/fake pre-filled state initializers
   - Zero multi-step wizard friction in forms
   - Zero upsell clutter in settings

3. **Projects List & Overview**:
   - Projects List: Header stats, search input, 4 filter pills (`All`, `On Schedule`, `At Risk`, `Completed`), project cards with photo thumbnail, location pill, budget KPIs, progress bar.
   - Project Overview: Hero banner, 4-stage lifecycle stepper, 4 Vitals KPI cards, Quick Navigation grid, Priority items feed.
