import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#131419',
        surface: '#1c1e26',
        'surface-hover': '#23262f',
        ink: {
          DEFAULT: '#d8dae0',
          muted: '#9096a3',
          faint: '#666c7a',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
        status: {
          todo: '#94a3b8',
          progress: '#fbbf24',
          review: '#a78bfa',
          done: '#34d399',
        },
        danger: {
          DEFAULT: '#f87171',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '0.75rem',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config
