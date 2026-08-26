---
name: ui-ux-design-pro
description: "Master level UI/UX design rules for modern web and mobile apps: clutter-free spacing, single-layer cards, touch targets, and micro-interactions."
---

# UI/UX Design Pro Skill

This skill provides opinionated, production-grade UI/UX design rules for building memorable, clutter-free mobile and web interfaces.

## 1. Core Design Mandates

1. **Eliminate Box Inception & Multi-Layered Border Clutter**
   - Never nest dark cards inside dark cards inside dark containers.
   - Use subtle hairline dividers (`border-[#141F33]`) or background contrast (`bg-[#0D1424]`) instead of double-heavy stroke borders.

2. **Single-Layer Card Hierarchy**
   - **Line 1:** Full-width Title + Primary Metric/Value (Bold contrast).
   - **Line 2:** Subtext metadata (Location, PM, Date) in muted slate (`text-slate-400`).
   - **Line 3:** Compact Status Badge or Pill.

3. **Touch Target Ergonomics**
   - Minimum button height: `44px` (`h-11`) or `40px` (`h-10 rounded-2xl`).
   - Active tactile feedback: `active:scale-95` / `active:scale-[0.99]`.
   - Hover contrast: `hover:border-blue-500/40 hover:text-white transition-all`.

4. **Zero Redundant Navigation**
   - Main bottom nav tabs do NOT need a top back button.
   - Sub-pages (Workspace, Notifications, Settings detail) require a single, top-left back button (`←`).
