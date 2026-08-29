# UI/UX Master Rules

Enforce these strict UI/UX engineering and design rules across all project components:

1. **Anti-Generic Aesthetics**:
   - Use curated color palettes with deep dark modes (`#070A12`, `#091122`, `#1E2E4A`) and vibrant accents (`#2563EB`, `#38BDF8`, `#C084FC`).
   - Use glassmorphism, subtle borders, and smooth backdrop blurs (`backdrop-blur-md`).
   - Never use plain browser default colors or unstyled default components.

2. **Strict Design Tokens**:
   - Button & Input Heights: `48px` (lg), `40px` (md), `32px` (sm).
   - Border Radius: Shell = `24px` (`rounded-3xl`), Cards/Inputs = `16px` (`rounded-2xl`), Buttons/Elements = `12px` (`rounded-xl`), Pills/Badges = `9999px` (`rounded-full`).

3. **Mobile Layout Standard**:
   - Container Shell Width: `max-w-[430px] mx-auto`.
   - Side Padding: `px-5` (`20px` margin), resulting in exact **390px inner working width**.

4. **Clutter-Free Minimalism**:
   - Keep cards concise. Display primary title, date/status badge, and main metric. Avoid repetitive inline subtitles.
   - Micro-animations for feedback (`active:scale-[0.98]`, `transition-all`).

5. **Zero Blank Views & Robust Routing**:
   - Always provide fallback renders for missing states or invalid tabs.
