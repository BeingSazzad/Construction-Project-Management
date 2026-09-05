# LATTICE DESIGN GUARDIAN MANDATE

Whenever designing, refactoring, or generating ANY UI for Lattice:

1. **Automatic Context Sanitization**:
   - You MUST NOT blindly copy screenshot margins, bloated cards, or arbitrary font sizes.
   - You MUST sanitize and normalize the input using the `lattice-design-guardian` skill.

2. **Font Family**:
   - ALWAYS `Plus Jakarta Sans`. Never use Inter, Roboto, or generic sans.

3. **Strict Size Hierarchy**:
   - Metrics: `24-28px` (Standard) or `32-36px` (Hero).
   - Headings: `16-20px` Semibold.
   - Body/Inputs: `14-16px` Regular.
   - Captions/Metadata: `10-12px` Regular/Medium.
   - PROHIBITED: `13px`, `15px`, `17px`, `19px`, `21px`, `23px`, `27px`.

4. **Spacing & 4px Grid**:
   - Page margins: `20px` (`px-5`).
   - Card padding: `12-16px` (`p-3` to `p-4`).
   - Vertical section gaps: `24px` (`gap-4` to `gap-6`).
   - Touch targets: Minimum `44×44px`.

5. **No Card Bloat & No Duplicate Headers**:
   - Never wrap individual metrics or list items in repeated standalone cards. Use grouped lists (`divide-y divide-[#F1F5F9]`).
   - Never render a secondary screen header with back arrow `<` inside a project sub-tab.

6. **Color Semantics**:
   - Canvas: `#F7F9FC`
   - Primary Cards: `#FFFFFF`
   - Border: `#E2E8F0`
   - Text: `#0F172A` (Primary), `#475569` (Secondary), `#64748B` (Muted), `#94A3B8` (Subtle)
   - Brand Blue: `#1677FF`, Hover `#0F5FD7`, Tint `#EAF3FF`
   - Status: Success `#10A976`, Warning `#F59E0B`, Danger `#E5484D`.
