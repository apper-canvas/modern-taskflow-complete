/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE9',
        secondary: '#8B7FFF',
        accent: '#FF6B6B',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        success: '#4ECDC4',
        warning: '#FFD93D',
        error: '#FF6B6B',
        info: '#4DABF7',
        purple: {
          50: '#f4f2ff',
          100: '#ede8ff',
          200: '#ddd5ff',
          300: '#c3b5ff',
          400: '#a289ff',
          500: '#8B7FFF',
          600: '#6d4eff',
          700: '#5B4FE9',
          800: '#4c3fd4',
          900: '#3f35ad',
        },
        coral: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#FF6B6B',
          600: '#f04848',
          700: '#e02828',
          800: '#c21818',
          900: '#a11818',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'particle-explosion': 'particle-explosion 1s ease-out forwards',
        'completion-scale': 'completion-scale 0.3s ease-out forwards',
        'pulse-gentle': 'pulse-gentle 2s infinite',
      },
      keyframes: {
        'particle-explosion': {
          '0%': { transform: 'scale(0) translate(0, 0)', opacity: '1' },
          '100%': { transform: 'scale(1) translate(var(--x), var(--y))', opacity: '0' }
        },
        'completion-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      }
    },
  },
  plugins: [],
}