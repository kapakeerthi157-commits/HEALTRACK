import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '480px' }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#1e3a8a',
          700: '#172a5e',
          900: '#0b1330'
        },
        emergency: {
          DEFAULT: 'hsl(var(--emergency))',
          foreground: 'hsl(var(--emergency-foreground))',
          50: '#fef2f2',
          500: '#e11d2e',
          600: '#c81525',
          700: '#a3121f'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          50: '#ecfdf5',
          500: '#12b981',
          600: '#0d9668'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgb(15 23 42 / 0.08), 0 1px 3px -1px rgb(15 23 42 / 0.06)',
        card: '0 8px 24px -8px rgb(15 23 42 / 0.12)',
        floating: '0 12px 32px -8px rgb(15 23 42 / 0.22)'
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite',
        heartbeat: 'heartbeat 1.8s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-in': 'fade-in 0.35s ease-out',
        'scale-in': 'scale-in 0.2s ease-out'
      }
    }
  },
  plugins: []
} satisfies Config
