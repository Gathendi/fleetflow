// FleetFlow Design System Tokens
// Comprehensive design system with Jost font and Crimson Red + Peach color palette

export const designTokens = {
  // Typography
  fonts: {
    sans: ['Jost', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Jost', 'system-ui', 'sans-serif'],
    body: ['Jost', 'system-ui', 'sans-serif'],
  },

  // Font Weights
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Font Sizes
  fontSizes: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },

  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Colors
  colors: {
    // Primary Brand Colors
    brand: {
      crimson: {
        50: '#fef2f3',
        100: '#fde6e8',
        200: '#fbd0d6',
        300: '#f7aab6',
        400: '#f17892',
        500: '#e84d70',
        600: '#d73161',
        700: '#b52751',
        800: '#A4193D', // Main Crimson Red
        900: '#7a1a32',
        950: '#440b18',
      },
      peach: {
        50: '#fffefb',
        100: '#fffcf5',
        200: '#fff7e6',
        300: '#FFDFB9', // Main Peach
        400: '#ffc97a',
        500: '#ffb347',
        600: '#ff9a1f',
        700: '#e67e00',
        800: '#cc6600',
        900: '#b35500',
        950: '#7a3a00',
      },
    },

    // Semantic Colors
    semantic: {
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },

    // Neutral Colors
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
  },

  // Spacing
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    18: '4.5rem',      // 72px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem',       // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    // Brand shadows
    'brand-sm': '0 1px 2px 0 rgba(164, 25, 61, 0.05)',
    'brand-md': '0 4px 6px -1px rgba(164, 25, 61, 0.1), 0 2px 4px -1px rgba(164, 25, 61, 0.06)',
    'brand-lg': '0 10px 15px -3px rgba(164, 25, 61, 0.1), 0 4px 6px -2px rgba(164, 25, 61, 0.05)',
    'brand-xl': '0 20px 25px -5px rgba(164, 25, 61, 0.1), 0 10px 10px -5px rgba(164, 25, 61, 0.04)',
    'peach-glow': '0 0 20px rgba(255, 223, 185, 0.3)',
  },

  // Transitions
  transitions: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Animation Durations
  durations: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  // Z-Index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    toast: '1080',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// Type exports for TypeScript
export type DesignTokens = typeof designTokens
export type ColorScale = typeof designTokens.colors.brand.crimson
export type SpacingValue = keyof typeof designTokens.spacing
export type FontSize = keyof typeof designTokens.fontSizes
export type FontWeight = keyof typeof designTokens.fontWeights

// Utility functions for working with design tokens
export const getColor = (path: string) => {
  const keys = path.split('.')
  let value: any = designTokens.colors
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) break
  }
  
  return value
}

export const getSpacing = (key: SpacingValue) => {
  return designTokens.spacing[key]
}

export const getFontSize = (key: FontSize) => {
  return designTokens.fontSizes[key]
}

export const getShadow = (key: keyof typeof designTokens.shadows) => {
  return designTokens.shadows[key]
}

// Component-specific token helpers
export const buttonTokens = {
  sizes: {
    sm: {
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      fontSize: designTokens.fontSizes.sm,
      borderRadius: designTokens.borderRadius.md,
    },
    md: {
      padding: `${designTokens.spacing[2.5]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.fontSizes.base,
      borderRadius: designTokens.borderRadius.lg,
    },
    lg: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      fontSize: designTokens.fontSizes.lg,
      borderRadius: designTokens.borderRadius.lg,
    },
    xl: {
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      fontSize: designTokens.fontSizes.xl,
      borderRadius: designTokens.borderRadius.xl,
    },
  },
  variants: {
    primary: {
      backgroundColor: designTokens.colors.brand.crimson[800],
      color: 'white',
      borderColor: designTokens.colors.brand.crimson[800],
    },
    secondary: {
      backgroundColor: designTokens.colors.brand.peach[300],
      color: designTokens.colors.brand.crimson[800],
      borderColor: designTokens.colors.brand.peach[300],
    },
    outline: {
      backgroundColor: 'transparent',
      color: designTokens.colors.brand.crimson[800],
      borderColor: designTokens.colors.brand.crimson[800],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: designTokens.colors.brand.crimson[800],
      borderColor: 'transparent',
    },
  },
}

export const cardTokens = {
  variants: {
    default: {
      backgroundColor: 'white',
      borderColor: designTokens.colors.neutral[200],
      borderRadius: designTokens.borderRadius.xl,
      boxShadow: designTokens.shadows.sm,
    },
    elevated: {
      backgroundColor: 'white',
      borderColor: 'transparent',
      borderRadius: designTokens.borderRadius.xl,
      boxShadow: designTokens.shadows.md,
    },
    brand: {
      backgroundColor: 'white',
      borderColor: designTokens.colors.brand.peach[300],
      borderRadius: designTokens.borderRadius.xl,
      boxShadow: designTokens.shadows['brand-sm'],
    },
    gradient: {
      background: `linear-gradient(135deg, ${designTokens.colors.brand.crimson[800]} 0%, ${designTokens.colors.brand.peach[300]} 100%)`,
      color: 'white',
      borderRadius: designTokens.borderRadius.xl,
      boxShadow: designTokens.shadows['brand-lg'],
    },
  },
}