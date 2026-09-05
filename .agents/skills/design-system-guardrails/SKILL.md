---
name: design-system-guardrails
description: Enforce the Avery Marsh/Lattice global design system during UI creation, refactors, reviews, and visual QA. Use when Codex designs or edits web/mobile screens, components, dashboards, forms, cards, navigation, or typography, especially to prevent random text sizes, inconsistent spacing, off-token colors, card bloat, overflow, weak hierarchy, or layouts that do not match existing global design and typography systems.
---

# Design System Guardrails

Use this skill as a final design constraint layer after reading any directly relevant product skills such as `lattice-mobile-system`, `color-scheme-palette`, `ui-ux-design-pro`, `visual-hierarchy-mastery`, or `reference-web-specs`.

## Core Workflow

1. Read the existing component/page patterns before editing.
2. Identify the closest approved typography role, spacing step, color token, and surface pattern.
3. Replace one-off visual decisions with those approved roles.
4. Verify the UI at mobile and desktop breakpoints when the app can run locally.
5. Fix visual drift before delivery, even when the feature works functionally.

## Typography Guardrails

- Use named typography roles instead of arbitrary sizes.
- Prefer the existing project scale: `10`, `11`, `12`, `14`, `16`, `18`, `20`, `24`, `28`, `32`, `36`, and `40px`.
- Use `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, and `text-4xl` unless the local design system explicitly requires an arbitrary value.
- Do not use viewport-based font sizing such as `text-[vw]`, `clamp()` tied to viewport width, or `calc()` for normal UI text.
- Keep letter spacing at `0` unless an established badge/eyebrow pattern uses uppercase micro text.
- Match type size to container size: compact panels, rows, cards, inputs, badges, sidebars, and toolbars must not use hero-scale headings.
- Use one dominant heading per screen or major panel. Everything else should step down predictably.
- Keep long labels from overflowing by using wrapping, truncation, shorter copy, or wider stable containers.

## Layout And Spacing Guardrails

- Use the 4px spacing rhythm: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, and `48px`.
- Avoid random margins like `7px`, `13px`, `18px`, `27px`, or unrelated Tailwind arbitrary spacing.
- Align mobile screens to the 430px Lattice frame and 20px page padding when working on mobile experiences.
- Give fixed-format UI such as boards, grids, toolbars, icon buttons, counters, and tiles stable dimensions with `min/max`, grid tracks, or `aspect-ratio`.
- Keep touch targets at least `44x44px` for primary interactive controls.
- Do not let hover, selected, loading, or empty states resize the layout.

## Color And Surface Guardrails

- Use global palette tokens or established hex values from the project skills.
- Do not introduce new accent colors unless the feature needs a new semantic status and the existing palette cannot express it.
- Avoid one-note pages dominated by a single hue family.
- Use cards only for unified objects, repeated items, modals, or framed tools.
- Do not nest cards inside cards or use decorative page sections as floating cards.
- Prefer rows, dividers, bands, and constrained layouts over extra boxes.

## Component Consistency

- Use icons for common actions when the repo already uses an icon library, especially tool buttons.
- Keep buttons visually distinct by priority: one primary action, quieter secondary actions, and icon-only actions where appropriate.
- Use existing control patterns for tabs, segmented controls, filters, menus, toggles, checkboxes, sliders, steppers, and inputs.
- Ensure loading, empty, error, disabled, active, hover, and focus states follow the same sizing and visual language as the normal state.
- Do not add visible instructional copy explaining layout, shortcuts, or visual design unless the product workflow genuinely requires it.

## Pre-Delivery QA

Before finalizing UI work, inspect the implementation for:

- Typography scale: no unexplained arbitrary text sizes or viewport-scaled UI text.
- Hierarchy: primary title, section headings, labels, metadata, and metrics have clear roles.
- Spacing: all padding/gaps sit on the 4px rhythm.
- Overflow: labels, buttons, cards, tables, and nav items do not clip or overlap.
- Responsiveness: mobile and desktop breakpoints preserve alignment and readable density.
- Palette: colors match project tokens and communicate semantic state.
- Surfaces: no card bloat, nested cards, or redundant borders.
- Interaction: touch targets, focus states, and state changes are stable.

## When Editing Existing Code

- Prefer modifying existing classes/tokens instead of creating parallel styles.
- Search for nearby component patterns before inventing a new variant.
- If a file already has a design token helper, CSS variable, Tailwind theme value, or shared component, use it.
- Keep changes scoped to visual consistency unless the user also asks for behavior changes.
