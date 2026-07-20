import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f5f7',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#1c1f26',
          muted: '#5b6270',
          faint: '#9aa1ac',
        },
        accent: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          soft: '#eef2ff',
        },
        status: {
          todo: '#64748b',
          'todo-soft': '#f1f5f9',
          progress: '#d97706',
          'progress-soft': '#fef3c7',
          review: '#7c3aed',
          'review-soft': '#f3e8ff',
          done: '#059669',
          'done-soft': '#d1fae5',
        },
        danger: {
          DEFAULT: '#dc2626',
          soft: '#fee2e2',
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
        card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1)',
        'card-hover': '0 4px 8px rgba(16, 24, 40, 0.08), 0 2px 4px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config
