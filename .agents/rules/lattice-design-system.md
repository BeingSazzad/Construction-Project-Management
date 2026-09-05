# LATTICE MASTER MOBILE PRODUCT DESIGN SYSTEM & UX RULES

Senior Product Designer standard for all mobile interfaces in Lattice.

## Core Mandate
- **Product Principle**: "Calm control over complex construction operations."
- **Visual Feel**: Clear, operational, trustworthy, data-aware, modern, premium, mobile-friendly, consistent.
- **NEVER**: Decorative, card-heavy, rainbow-colored, gaming-like, crypto-like, visually noisy.

## Frame & Grid
- Reference Frame: 430px mobile viewport (`max-w-[430px] mx-auto`).
- Margins: 20px horizontal safe padding (`px-5`). Usable grid: 390px.
- Scrolling: Natural vertical scrolling. Never clip text, force horizontal scrolling, or squash content to fit one screen height.

## 4px Base Spacing System
- Micro: 4px
- Tight: 8px (icon to text, related metadata)
- Related: 12px
- Component: 16px (card padding)
- Comfortable: 20px (page padding, summary cards)
- Section: 24px
- Major Section: 32px
- Large: 40px
- Structural: 48px
- Prohibited: Arbitrary values (13, 17, 19, 21, 23, 27, etc.).

## Typography
- Primary: Plus Jakarta Sans (ALWAYS Plus Jakarta Sans; Fallback: Inter / SF Pro / system-sans).
- Scale: 10px, 12px, 14px, 16px, 20px, 24px, 28px, 32px, 36px, 40px.
- Roles:
  - 10-12px Medium: Metadata, status pills, cost code prefixes.
  - 12px Regular: Captions, helper text.
  - 14px Regular: Secondary body, card descriptions (max 2-3 lines).
  - 14-16px Semibold: Row titles, button labels, table headers.
  - 16-20px Semibold: Section headings.
  - 24px Bold: Screen headings.
  - 28-32px / 36-40px Bold: Major metrics.

## Color Tokens
- App Background: `#F7F9FC`
- Primary Surface: `#FFFFFF`
- Secondary Surface: `#F1F5F9`
- Border: `#E2E8F0`, Strong Border: `#CBD5E1`
- Primary Text: `#0F172A`, Secondary Text: `#475569`, Muted: `#64748B`, Subtle: `#94A3B8`
- Brand Blue: `#1677FF`, Blue Dark: `#0F5FD7`, Blue Soft: `#EAF3FF`, Blue Surface: `#F5F9FF`
- Status: Success `#10A976` (Soft `#E9F9F3`), Warning `#F59E0B` (Soft `#FFF7E6`), Danger `#E5484D` (Soft `#FFF0F0`).
- Rule: Most of every screen is neutral. Blue guides interaction. Status colors are strictly functional.

## Surface & Card Strategy
- Level 1 Page: Neutral `#F7F9FC` canvas.
- Level 2 Section: 24px spacing + heading + optional hairline divider. NO CONTAINER CARD.
- Level 3 Card: Only when multiple elements form ONE unified conceptual object.
- Standard Card: 16px radius, 16px padding, white, 1px `#E2E8F0` border.
- Hero Card: 20px radius, 20px padding.

## Controls & Components
- Primary Button: 48px height, 12px radius, `#1677FF`, hover `#0F5FD7`, white semibold text.
- Secondary Button: 44-48px height, white bg, `#E2E8F0` border, `#0F172A` text.
- Icon Action: Min 44x44px touch target (20-24px visible icon).
- Inputs: 48px height, 12px radius, white bg, `#E2E8F0` border, 16px text.
- Filter Chips: 28-36px height, full pill radius.
- Lists: Prefer list rows (56-72px, hairline dividers) over repeated cards for tasks, logs, contacts, and cost items.

## 5 Mandatory Tests Before Delivering Any Screen
1. 3-5 Second Scannability Test (What's happening? What needs attention? What's next?)
2. Card Test ("Why does this need a card?")
3. Color Test ("What operational fact does this color communicate?")
4. Metric Test ("Can the user make a decision from this number?")
5. Primary Action Test (One clear primary CTA per screen)
