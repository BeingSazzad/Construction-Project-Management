/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Lattice Master Mobile Design System ────────────────────────
        // All tokens reference CSS vars defined in index.css :root
        lattice: {
          bg:           'var(--color-bg)',
          surface:      'var(--color-surface)',
          'surface-secondary': 'var(--color-surface-secondary)',
          subtle:       'var(--color-subtle)',
          border:       'var(--color-border)',
          'border-strong': 'var(--color-border-strong)',
          primary:      'var(--color-text-primary)',
          secondary:    'var(--color-text-secondary)',
          muted:        'var(--color-text-muted)',
          subtleText:   'var(--color-text-subtle)',
          tertiary:     'var(--color-text-tertiary)',
          blue:         'var(--color-blue)',
          'blue-dark':  'var(--color-blue-dark)',
          'blue-hover': 'var(--color-blue-hover)',
          'blue-soft':  'var(--color-blue-soft)',
          'blue-light': 'var(--color-blue-light)',
          'blue-surface': 'var(--color-blue-surface)',
          success:      'var(--color-success)',
          'success-bg': 'var(--color-success-bg)',
          'success-soft': 'var(--color-success-soft)',
          warning:      'var(--color-warning)',
          'warning-bg': 'var(--color-warning-bg)',
          'warning-soft': 'var(--color-warning-soft)',
          danger:       'var(--color-danger)',
          'danger-bg':  'var(--color-danger-bg)',
          'danger-soft': 'var(--color-danger-soft)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'hero': '20px',
        'card': '16px',
        'element': '12px',
        'chip': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.03)',
        'modal': '0 20px 60px -10px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}
