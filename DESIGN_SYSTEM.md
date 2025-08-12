# FleetFlow Design System

A comprehensive design system built with **Jost** typography and a **Crimson Red + Peach** color palette for the FleetFlow car rental management platform.

## 🎨 Brand Identity

### Primary Colors
- **Crimson Red**: `#A4193D` - Primary brand color representing power, reliability, and premium service
- **Peach**: `#FFDFB9` - Secondary brand color representing warmth, accessibility, and customer care

### Color Philosophy
The color combination of Crimson Red and Peach creates a sophisticated yet approachable brand identity that balances professionalism with warmth, perfect for a premium car rental service.

## 🔤 Typography

### Font Family: Jost
Jost is a modern, geometric sans-serif font that provides:
- **Excellent readability** across all devices and sizes
- **Professional appearance** suitable for business applications
- **Versatile weights** from Light (300) to Bold (700)
- **Optimized for screens** with good letter spacing and line height

### Font Weights
```css
/* Available weights */
font-weight: 300; /* Light */
font-weight: 400; /* Regular */
font-weight: 500; /* Medium */
font-weight: 600; /* SemiBold */
font-weight: 700; /* Bold */
```

### Typography Scale
```css
/* Heading styles */
h1: 3rem (48px) - 5xl
h2: 2.25rem (36px) - 4xl  
h3: 1.875rem (30px) - 3xl
h4: 1.5rem (24px) - 2xl
h5: 1.25rem (20px) - xl
h6: 1.125rem (18px) - lg

/* Body styles */
body: 1rem (16px) - base
small: 0.875rem (14px) - sm
caption: 0.75rem (12px) - xs
```

## 🎨 Color System

### Brand Palette

#### Crimson Red Scale
```css
--brand-crimson-50: #fef2f3    /* Lightest tint */
--brand-crimson-100: #fde6e8
--brand-crimson-200: #fbd0d6
--brand-crimson-300: #f7aab6
--brand-crimson-400: #f17892
--brand-crimson-500: #e84d70
--brand-crimson-600: #d73161
--brand-crimson-700: #b52751
--brand-crimson-800: #A4193D    /* Primary brand color */
--brand-crimson-900: #7a1a32
--brand-crimson-950: #440b18    /* Darkest shade */
```

#### Peach Scale
```css
--brand-peach-50: #fffefb      /* Lightest tint */
--brand-peach-100: #fffcf5
--brand-peach-200: #fff7e6
--brand-peach-300: #FFDFB9      /* Primary peach color */
--brand-peach-400: #ffc97a
--brand-peach-500: #ffb347
--brand-peach-600: #ff9a1f
--brand-peach-700: #e67e00
--brand-peach-800: #cc6600
--brand-peach-900: #b35500
--brand-peach-950: #7a3a00      /* Darkest shade */
```

### Semantic Colors

#### Success (Green)
```css
--success-50: #f0fdf4
--success-500: #22c55e         /* Primary success */
--success-900: #14532d
```

#### Warning (Orange)
```css
--warning-50: #fffbeb
--warning-500: #f97316         /* Primary warning */
--warning-900: #7c2d12
```

#### Error (Red)
```css
--error-50: #fef2f2
--error-500: #ef4444           /* Primary error */
--error-900: #7f1d1d
```

#### Info (Blue)
```css
--info-50: #eff6ff
--info-500: #3b82f6            /* Primary info */
--info-900: #1e3a8a
```

### Neutral Scale
```css
--neutral-50: #fafafa          /* Background */
--neutral-100: #f5f5f5         /* Light gray */
--neutral-200: #e5e5e5         /* Border */
--neutral-300: #d4d4d4
--neutral-400: #a3a3a3
--neutral-500: #737373         /* Medium gray */
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717         /* Dark text */
--neutral-950: #0a0a0a
```

## 🏗️ Spacing System

### Base Unit: 4px (0.25rem)
```css
/* Spacing scale */
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
```

## 🔲 Component Guidelines

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--brand-crimson-800);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 200ms;
}

.btn-primary:hover {
  background: var(--brand-crimson-700);
  box-shadow: var(--shadow-brand-md);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--brand-peach-300);
  color: var(--brand-crimson-800);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 200ms;
}
```

#### Outline Button
```css
.btn-outline {
  background: transparent;
  color: var(--brand-crimson-800);
  border: 2px solid var(--brand-crimson-800);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 200ms;
}
```

### Cards

#### Default Card
```css
.card {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  transition: all 200ms;
}

.card:hover {
  box-shadow: var(--shadow-brand-md);
}
```

#### Brand Card
```css
.card-brand {
  background: white;
  border: 1px solid var(--brand-peach-300);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-brand-sm);
  padding: 1.5rem;
}
```

#### Gradient Card
```css
.card-gradient {
  background: linear-gradient(135deg, var(--brand-crimson-800) 0%, var(--brand-peach-300) 100%);
  color: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-brand-lg);
  padding: 1.5rem;
}
```

### Forms

#### Input Fields
```css
.input {
  background: white;
  border: 1px solid var(--neutral-300);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 150ms;
}

.input:focus {
  border-color: var(--brand-crimson-800);
  box-shadow: 0 0 0 3px rgba(164, 25, 61, 0.1);
  outline: none;
}
```

## 🎭 Dark Mode

### Dark Theme Colors
```css
.dark {
  --background: rgb(15, 15, 15);
  --foreground: rgb(250, 250, 250);
  --primary: rgb(241, 120, 146);     /* Lighter crimson */
  --secondary: rgb(204, 102, 0);     /* Darker peach */
  --muted: rgb(39, 39, 42);
  --border: rgb(39, 39, 42);
}
```

## ✨ Animations

### Transitions
```css
/* Standard transition */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Color transitions */
transition: color 150ms, background-color 150ms, border-color 150ms;

/* Transform transitions */
transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations
```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slide-up {
  from { 
    transform: translateY(10px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

/* Brand pulse */
@keyframes pulse-brand {
  0%, 100% { box-shadow: 0 0 0 0 rgba(164, 25, 61, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(164, 25, 61, 0); }
}
```

## 🌊 Gradients

### Brand Gradients
```css
/* Primary gradient */
.bg-gradient-brand {
  background: linear-gradient(135deg, #A4193D 0%, #FFDFB9 100%);
}

/* Reverse gradient */
.bg-gradient-brand-reverse {
  background: linear-gradient(135deg, #FFDFB9 0%, #A4193D 100%);
}

/* Subtle gradient */
.bg-gradient-subtle {
  background: linear-gradient(135deg, #fef2f3 0%, #fff7e6 100%);
}
```

## 🎯 Usage Guidelines

### Do's
- ✅ Use Crimson Red for primary actions and important elements
- ✅ Use Peach for secondary actions and highlights
- ✅ Maintain proper contrast ratios (4.5:1 minimum)
- ✅ Use consistent spacing based on the 4px grid
- ✅ Apply hover states to interactive elements
- ✅ Use semantic colors for status indicators

### Don'ts
- ❌ Don't use colors outside the defined palette
- ❌ Don't mix different font families
- ❌ Don't ignore spacing guidelines
- ❌ Don't create new component variants without documentation
- ❌ Don't use Crimson Red for destructive actions (use error red instead)

## 🛠️ Implementation

### CSS Classes
```css
/* Brand colors */
.text-brand-crimson { color: var(--brand-crimson); }
.text-brand-peach { color: var(--brand-peach); }
.bg-brand-crimson { background-color: var(--brand-crimson); }
.bg-brand-peach { background-color: var(--brand-peach); }

/* Typography */
.font-display { font-family: 'Jost', system-ui, sans-serif; }
.font-body { font-family: 'Jost', system-ui, sans-serif; }

/* Utilities */
.glass { backdrop-blur: 12px; background: rgba(255, 255, 255, 0.3); }
.scrollbar-thin { scrollbar-width: thin; scrollbar-color: var(--brand-crimson) transparent; }
```

### Tailwind Classes
```html
<!-- Primary button -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all">
  Book Now
</button>

<!-- Brand card -->
<div class="card-brand p-6">
  <h3 class="text-brand-crimson font-semibold text-xl mb-4">Vehicle Details</h3>
  <p class="text-neutral-600">Information about the vehicle...</p>
</div>

<!-- Gradient background -->
<div class="bg-gradient-brand text-white p-8 rounded-xl">
  <h2 class="text-3xl font-bold mb-4">Welcome to FleetFlow</h2>
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```css
/* Mobile first */
.card { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .card { padding: 1.5rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card { padding: 2rem; }
}
```

## 🎨 Brand Applications

### Logo Usage
- Use Crimson Red (#A4193D) for the primary logo
- Use Peach (#FFDFB9) for accent elements
- Maintain minimum clear space of 2x the logo height
- Never stretch or distort the logo

### Marketing Materials
- Headlines: Jost Bold (700) in Crimson Red
- Body text: Jost Regular (400) in Neutral 900
- Accent elements: Peach backgrounds with Crimson text
- Call-to-action buttons: Crimson background with white text

This design system ensures consistency across all FleetFlow interfaces while maintaining the premium, professional brand identity.