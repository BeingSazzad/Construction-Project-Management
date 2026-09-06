/**
 * LATTICE / AVERY MARSH GLOBAL DESIGN SYSTEM TOKENS
 * Single Source of Truth for Colors, Typography, Spacing, Radius, Shadows, and Form Controls.
 */

export const colors = {
  // 1. Brand Palette
  brand: {
    primary: '#1677FF',       // Core Lattice Brand Blue
    hover: '#0F5FD7',         // Interactive Hover
    active: '#094BBD',        // Interactive Active/Pressed
    light: '#EAF3FF',         // Focus Ring / Tint Highlight
    dark: '#0B3A82',          // Deep Accent
    glow: 'rgba(22, 119, 255, 0.25)',
    gradient: 'linear-gradient(135deg, #1677FF 0%, #06B6D4 100%)',
    gradientSubtle: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
  },

  // 2. Neutral Surfaces (Apple Light Palette)
  neutral: {
    canvas: '#F7F9FC',        // Clean Light Canvas
    surface: '#FFFFFF',       // Primary Card Surface
    surfaceElevated: '#FFFFFF', // Modals, Popovers, Sheets
    surfaceInset: '#F8FAFC',  // Form Input Backgrounds, Table Insets
    surfaceHover: '#F1F5F9',  // Hoverable List Item/Card State
    border: '#E2E8F0',        // Subtle 1px Border & Divider
    borderSubtle: '#F1F5F9',  // Sub-element Borders
    borderStrong: '#CBD5E1',  // Active/Elevated Borders
    borderFocus: '#1677FF',   // Accessible Focus Border
    divider: '#E2E8F0',       // Section Dividers
  },

  // 3. Typography Colors
  text: {
    primary: '#0F172A',       // Slate 900 - High Contrast Headings & Main Content
    secondary: '#475569',     // Slate 600 - Supporting Descriptions & Subheadings
    tertiary: '#64748B',      // Slate 500 - Captions, Metadata, Subtext
    disabled: '#94A3B8',      // Slate 400 - Inactive Elements, Placeholders
    inverse: '#FFFFFF',       // White Text for Primary Buttons
  },

  // 4. Semantic Status Colors
  semantic: {
    success: {
      text: '#10A976',        // Green 600
      bg: '#E9F9F3',
      border: 'rgba(16, 169, 118, 0.25)',
      solid: '#10A976',
    },
    warning: {
      text: '#F59E0B',        // Amber 500
      bg: '#FFF7E6',
      border: 'rgba(245, 158, 11, 0.25)',
      solid: '#F59E0B',
    },
    error: {
      text: '#E5484D',        // Red 500
      bg: '#FFF0F0',
      border: 'rgba(229, 72, 77, 0.25)',
      solid: '#E5484D',
    },
    info: {
      text: '#1677FF',        // Blue 500
      bg: '#EAF3FF',
      border: 'rgba(22, 119, 255, 0.25)',
      solid: '#1677FF',
    },
    ai: {
      text: '#8B5CF6',        // Purple 500
      bg: '#F3E8FF',
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
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  glowBrand: '0 4px 14px 0 rgba(22, 119, 255, 0.25)',
} as const;

export const formStandards = {
  inputHeight: '44px',         // Universal 44px Height Standard across entire app (h-11)
  inputRadius: '12px',         // rounded-xl
  inputBg: '#FFFFFF',          // Clean white surface
  inputBorder: '#E2E8F0',      // Subtle border
  inputBorderFocus: '#1677FF', // Brand blue focus border
  inputTextSize: '13px',
  inputPaddingX: '14px',       // px-3.5
  labelSize: '12px',           // text-xs font-semibold
  labelColor: '#334155',       // slate-700
} as const;

export const buttonStandards = {
  sizes: {
    sm: { height: '32px', px: '12px', fontSize: '12px', radius: '8px' },
    md: { height: '44px', px: '16px', fontSize: '13px', radius: '12px' }, // Standard touch target (44px)
    lg: { height: '48px', px: '20px', fontSize: '14px', radius: '12px' },
    icon: { size: '44px', radius: '12px' },
  }
} as const;
