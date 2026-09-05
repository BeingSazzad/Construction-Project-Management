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
        lattice: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          subtle: '#EAEDF1',
          border: '#DDE1E7',
          'text-primary': '#171A1F',
          'text-secondary': '#68707C',
          blue: '#1677FF',
          'blue-light': '#EAF3FF',
          'blue-hover': '#0958D9',
        },
        navy: {
          950: '#070A11',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#131C2E',
          750: '#172238',
          700: '#1C2A45',
          600: '#273B5E',
          500: '#3B527E',
        },
        electric: {
          blue: '#1677FF',
          hover: '#0958D9',
          light: '#4096FF',
          dark: '#003EB3',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          accent: '#1677FF',
          glow: '#1677FF',
        },
        surface: {
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          border: '#DDE1E7',
          hover: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-blue': '0 0 25px -3px rgba(0, 102, 255, 0.45)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 240, 255, 0.08) 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(19, 28, 46, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
