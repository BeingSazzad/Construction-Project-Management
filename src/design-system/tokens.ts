/**
 * LATTICE / AVERY MARSH GLOBAL DESIGN SYSTEM TOKENS
 * Single Source of Truth for Colors, Typography, Spacing, Radius, Shadows, and Form Controls.
 */

export const colors = {
  // 1. Brand Palette
  brand: {
    primary: '#2563EB',       // Core Sapphire Blue
    hover: '#1D4ED8',         // Interactive Hover
    active: '#1E40AF',        // Interactive Active/Pressed
    light: '#3B82F6',         // Focus Ring / Highlight
    dark: '#1E3A8A',          // Deep Accent
    glow: 'rgba(37, 99, 235, 0.35)',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
  },

  // 2. Neutral Surfaces (Dark Enterprise Palette)
  neutral: {
    canvas: '#070A12',        // Ultra-dark background
    surface: '#0A111F',       // Primary card surface
    surfaceElevated: '#0E1A30', // Modals, popovers, dropdown menus
    surfaceInset: '#050811',  // Form input backgrounds, nested table rows
    surfaceHover: '#121F38',  // Hoverable list item/card state
    border: '#142036',        // Subtle card & divider border
    borderSubtle: '#10192A',  // Sub-element borders
    borderStrong: '#1E2E4A',  // Active/elevated borders
    borderFocus: '#2563EB',   // Accessible focus border
    divider: '#142036',       // Section dividers
  },

  // 3. Typography Colors
  text: {
    primary: '#F8FAFC',       // Slate 50 - High contrast headings & main content
    secondary: '#94A3B8',     // Slate 400 - Supporting descriptions & subheadings
    tertiary: '#64748B',      // Slate 500 - Captions, metadata, placeholders
    disabled: '#475569',      // Slate 600 - Inactive elements
    inverse: '#070A12',       // Dark text for bright badges/buttons
  },

  // 4. Semantic Status Colors
  semantic: {
    success: {
      text: '#10B981',        // Emerald 500
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      solid: '#10B981',
    },
    warning: {
      text: '#F59E0B',        // Amber 500
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      solid: '#F59E0B',
    },
    error: {
      text: '#EF4444',        // Rose/Red 500
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      solid: '#EF4444',
    },
    info: {
      text: '#06B6D4',        // Cyan 500
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      solid: '#06B6D4',
    },
    ai: {
      text: '#8B5CF6',        // Violet/Purple 500
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
      solid: '#8B5CF6',
    },
  },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  scale: {
    display: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    h1: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '700',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    bodyLarge: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: '400',
    },
    body: {
      fontSize: '13px',
      lineHeight: '20px',
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: '500',
    },
    caption: {
      fontSize: '10px',
      lineHeight: '14px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const radius = {
  none: '0px',
  sm: '8px',       // Badges, small tags, sub-pills (rounded-lg)
  md: '12px',      // Standard Form Controls, Inputs, Buttons (rounded-xl)
  lg: '16px',      // Standard Content Cards, Nested blocks (rounded-2xl)
  xl: '24px',      // Modals, Bottom Drawers, Outer Frames (rounded-3xl)
  full: '9999px',  // Circular buttons, avatars, pill badges (rounded-full)
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
  md: '0 4px 16px -2px rgba(0, 0, 0, 0.6)',
  lg: '0 12px 36px -4px rgba(0, 0, 0, 0.8)',
  glowBrand: '0 0 24px -2px rgba(37, 99, 235, 0.35)',
  glowCyan: '0 0 24px -2px rgba(6, 182, 212, 0.35)',
} as const;

export const formStandards = {
  inputHeight: '44px',     // Universal 44px Height Standard across entire app (h-11)
  inputRadius: '12px',     // rounded-xl
  inputBg: '#050811',      // Deep inset neutral
  inputBorder: '#142036',  // Subtle border
  inputBorderFocus: '#2563EB', // Sapphire focus border
  inputTextSize: '13px',
  inputPaddingX: '14px',   // px-3.5
  labelSize: '12px',       // text-xs font-semibold
  labelColor: '#CBD5E1',   // slate-300
} as const;

export const buttonStandards = {
  sizes: {
    sm: { height: '32px', px: '12px', fontSize: '12px', radius: '8px' },
    md: { height: '44px', px: '16px', fontSize: '13px', radius: '12px' }, // Standard touch target (44px)
    lg: { height: '48px', px: '20px', fontSize: '14px', radius: '12px' },
    icon: { size: '44px', radius: '12px' },
  }
} as const;
