---
name: lattice-mobile-system
description: Master Mobile Product Design System & Senior UX rules for Lattice construction management app (430px frame, 20px padding, 4px grid, Inter typography, brand blue #1677FF, #F7F9FC canvas, zero card-bloat).
---

# Lattice Mobile Product Design System & UX Standards

Use this skill whenever designing, refactoring, or reviewing any mobile screen, component, or interaction in Lattice.

## 1. Frame, Layout & Grid
- **Primary Viewport**: 430px mobile frame (`max-w-[430px] mx-auto min-h-screen bg-[#F7F9FC]`).
- **Screen Margin**: 20px horizontal safe padding (`px-5`).
- **Usable Content Grid**: 390px.
- **Scroll Clearance**: Safe bottom clearance `pb-28` to `pb-32` so fixed bottom navigation bars never obscure actionable content.

## 2. Mathematical Spacing System (4px Base)
- `4px`: Micro gap (title to subtitle, badge padding)
- `8px`: Tight gap (icon to text, chip margin)
- `12px`: Related elements, tight inputs
- `16px`: Component gap, standard card padding
- `20px`: Page horizontal padding, summary card padding
- `24px`: Section-to-section vertical gap
- `32px`: Major group separation
- `40px` / `48px`: Distinct structural clearance

## 3. Approved Typography Roles (Plus Jakarta Sans)
- **Metadata**: 10–12px / Medium (`text-[11px] font-medium text-[#64748B]`)
- **Caption / Subtitle**: 12px / Regular (`text-xs text-[#475569]`)
- **Secondary Body**: 14px / Regular (`text-sm text-[#475569]`)
- **Primary Body**: 14–16px / Regular (`text-sm md:text-base text-[#0F172A]`)
- **Interactive Label / Button**: 14–16px / Semibold (`text-sm font-semibold text-white`)
- **Row Title**: 14–16px / Semibold (`text-sm font-semibold text-[#0F172A]`)
- **Section Heading**: 16–20px / Semibold (`text-base font-semibold text-[#0F172A]`)
- **Screen Heading**: 24px / Bold (`text-2xl font-bold text-[#0F172A]`)
- **Metric Numeral**: 28–32px / Bold (`text-3xl font-bold text-[#0F172A]`)
- **Hero Metric**: 36–40px / Bold (`text-4xl font-bold text-[#0F172A]`)

## 4. Color Palette & Functional Meanings
- **Canvas**: `#F7F9FC`
- **Surface**: `#FFFFFF`
- **Inset / Secondary**: `#F1F5F9`
- **Borders**: Hairline `#E2E8F0`, Strong `#CBD5E1`
- **Text**: Primary `#0F172A`, Secondary `#475569`, Muted `#64748B`, Subtle `#94A3B8`
- **Brand Blue**: Primary `#1677FF`, Hover `#0F5FD7`, Soft Tint `#EAF3FF`, Card Fill `#F5F9FF`
- **Status Green**: `#10A976` (Soft `#E9F9F3`) — Healthy, complete, positive spend.
- **Status Amber**: `#F59E0B` (Soft `#FFF7E6`) — Attention, pending inspection, weather risk.
- **Status Red**: `#E5484D` (Soft `#FFF0F0`) — Overdue, safety flag, critical defect, destructive action.

## 5. Surface & Card Rules
- **No Card-Bloat**: Level 1 (Page) ➔ Level 2 (Section with 24px spacing & heading) ➔ Level 3 (Card only for unified conceptual objects).
- Standard Card: `bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs`
- Summary Card: `bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-xs`
- Compact Box: `bg-white border border-[#E2E8F0] rounded-xl p-3`
- Prefer **List Rows** (`h-14` to `h-16`, hairline bottom divider `border-b border-[#E2E8F0]`) over wrapping each item in its own card.

## 6. Controls & Touch Targets
- **Primary Button**: `h-12 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-semibold text-sm md:text-base active:scale-[0.98]`
- **Secondary Button**: `h-11 md:h-12 px-4 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-medium text-sm hover:bg-[#F1F5F9]`
- **Icon Target**: Min `44×44px` touch bounding box with `20–24px` icon inside.
- **Form Input**: `h-12 px-4 rounded-xl bg-white border border-[#E2E8F0] text-[16px] text-[#0F172A] focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]`
- **Status Chip**: `h-7 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`

## 7. Pre-Delivery Checklist
Before completing any visual or component:
- [ ] 3–5s Scannability (What's happening? What needs attention? What's next?)
- [ ] No extraneous cards (Use lists/dividers where appropriate)
- [ ] All colors communicate operational reality (No rainbow widgets)
- [ ] Exactly one visually dominant primary CTA
- [ ] Touch targets at least 44×44px
- [ ] Aligned strictly to the 20px mobile grid
