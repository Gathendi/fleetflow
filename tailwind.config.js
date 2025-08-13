/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Jost',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        display: ['Jost', 'system-ui', 'sans-serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        // FleetFlow Brand Colors - Crimson Red Scale
        crimson: {
          50: '#fef2f3',
          100: '#fde6e8',
          200: '#fbd0d6',
          300: '#f7aab6',
          400: '#f17892',
          500: '#e84d70',
          600: '#d73161',
          700: '#b52751',
          800: '#A4193D', // Primary Brand Color
          900: '#7a1a32',
          950: '#440b18',
        },
        // FleetFlow Brand Colors - Peach Scale  
        peach: {
          50: '#fffefb',
          100: '#fffcf5',
          200: '#fff7e6',
          300: '#FFDFB9', // Secondary Brand Color
          400: '#ffc97a',
          500: '#ffb347',
          600: '#ff9a1f',
          700: '#e67e00',
          800: '#cc6600',
          900: '#b35500',
          950: '#7a3a00',
        },
        // Semantic Colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f97316',
          900: '#7c2d12',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Neutral Scale
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // shadcn/ui Colors adapted for FleetFlow
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(164, 25, 61, 0.1), 0 1px 2px 0 rgba(164, 25, 61, 0.06)',
        'brand-md': '0 4px 6px -1px rgba(164, 25, 61, 0.1), 0 2px 4px -1px rgba(164, 25, 61, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(164, 25, 61, 0.1), 0 4px 6px -2px rgba(164, 25, 61, 0.05)',
        'brand-xl': '0 20px 25px -5px rgba(164, 25, 61, 0.1), 0 10px 10px -5px rgba(164, 25, 61, 0.04)',
        'peach-glow': '0 0 20px rgba(255, 223, 185, 0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #A4193D 0%, #FFDFB9 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #FFDFB9 0%, #A4193D 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #fef2f3 0%, #fff7e6 100%)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pulse-brand': 'pulse-brand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(164, 25, 61, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(164, 25, 61, 0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}