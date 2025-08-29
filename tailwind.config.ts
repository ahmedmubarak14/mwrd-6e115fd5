
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* ========== ENHANCED COLOR SYSTEM ========== */
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        "input-border": "hsl(var(--input-border))",
        "input-placeholder": "hsl(var(--input-placeholder))",
        "input-caret": "hsl(var(--input-caret))",
        "input-selection": "hsl(var(--input-selection))",
        "input-selection-foreground": "hsl(var(--input-selection-foreground))",
        ring: "hsl(var(--ring))",
        "ring-offset": "hsl(var(--ring-offset))",
        "focus-ring": "hsl(var(--focus-ring))",
        "focus-ring-offset": "hsl(var(--focus-ring-offset))",
        "focus-outline": "hsl(var(--focus-outline))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* Button interaction states - Enhanced for accessibility */
        "button-disabled": "hsl(var(--button-disabled))",
        "button-disabled-foreground": "hsl(var(--button-disabled-foreground))",
        "button-disabled-border": "hsl(var(--button-disabled-border))",
        "primary-hover": "hsl(var(--primary-hover))",
        "primary-active": "hsl(var(--primary-active))",
        "secondary-hover": "hsl(var(--secondary-hover))",
        "secondary-active": "hsl(var(--secondary-active))",
        "outline-hover": "hsl(var(--outline-hover))",
        "outline-active": "hsl(var(--outline-active))",
        "accent-hover": "hsl(var(--accent-hover))",
        "accent-active": "hsl(var(--accent-active))",
        
        /* Glass effect colors */
        glass: "hsl(var(--glass))",
        "glass-strong": "hsl(var(--glass-strong))",
        "glass-border": "hsl(var(--glass-border))",

        /* Primary color system */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "hsl(var(--primary-50))",
          "100": "hsl(var(--primary-100))",
          "200": "hsl(var(--primary-200))",
          "300": "hsl(var(--primary-300))",
          "400": "hsl(var(--primary-400))",
          "500": "hsl(var(--primary-500))",
          "600": "hsl(var(--primary-600))",
          "700": "hsl(var(--primary-700))",
          "800": "hsl(var(--primary-800))",
          "900": "hsl(var(--primary-900))",
          "950": "hsl(var(--primary-950))",
        },

        /* Secondary color system */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          "50": "hsl(var(--secondary-50))",
          "100": "hsl(var(--secondary-100))",
          "200": "hsl(var(--secondary-200))",
          "300": "hsl(var(--secondary-300))",
          "400": "hsl(var(--secondary-400))",
          "500": "hsl(var(--secondary-500))",
          "600": "hsl(var(--secondary-600))",
          "700": "hsl(var(--secondary-700))",
          "800": "hsl(var(--secondary-800))",
          "900": "hsl(var(--secondary-900))",
          "950": "hsl(var(--secondary-950))",
        },

        /* Accent color system */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          "50": "hsl(var(--accent-50))",
          "100": "hsl(var(--accent-100))",
          "200": "hsl(var(--accent-200))",
          "300": "hsl(var(--accent-300))",
          "400": "hsl(var(--accent-400))",
          "500": "hsl(var(--accent-500))",
          "600": "hsl(var(--accent-600))",
          "700": "hsl(var(--accent-700))",
          "800": "hsl(var(--accent-800))",
          "900": "hsl(var(--accent-900))",
          "950": "hsl(var(--accent-950))",
        },

        /* Destructive color system */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          "50": "hsl(var(--destructive-50))",
          "100": "hsl(var(--destructive-100))",
          "200": "hsl(var(--destructive-200))",
          "300": "hsl(var(--destructive-300))",
          "400": "hsl(var(--destructive-400))",
          "500": "hsl(var(--destructive-500))",
          "600": "hsl(var(--destructive-600))",
          "700": "hsl(var(--destructive-700))",
          "800": "hsl(var(--destructive-800))",
          "900": "hsl(var(--destructive-900))",
          "950": "hsl(var(--destructive-950))",
        },

        /* Muted color system */
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        /* Card color system */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* Popover color system */
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        /* Status indicators */
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          "50": "hsl(var(--success-50))",
          "100": "hsl(var(--success-100))",
          "200": "hsl(var(--success-200))",
          "300": "hsl(var(--success-300))",
          "400": "hsl(var(--success-400))",
          "500": "hsl(var(--success-500))",
          "600": "hsl(var(--success-600))",
          "700": "hsl(var(--success-700))",
          "800": "hsl(var(--success-800))",
          "900": "hsl(var(--success-900))",
          "950": "hsl(var(--success-950))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          "50": "hsl(var(--warning-50))",
          "100": "hsl(var(--warning-100))",
          "200": "hsl(var(--warning-200))",
          "300": "hsl(var(--warning-300))",
          "400": "hsl(var(--warning-400))",
          "500": "hsl(var(--warning-500))",
          "600": "hsl(var(--warning-600))",
          "700": "hsl(var(--warning-700))",
          "800": "hsl(var(--warning-800))",
          "900": "hsl(var(--warning-900))",
          "950": "hsl(var(--warning-950))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          "50": "hsl(var(--info-50))",
          "100": "hsl(var(--info-100))",
          "200": "hsl(var(--info-200))",
          "300": "hsl(var(--info-300))",
          "400": "hsl(var(--info-400))",
          "500": "hsl(var(--info-500))",
          "600": "hsl(var(--info-600))",
          "700": "hsl(var(--info-700))",
          "800": "hsl(var(--info-800))",
          "900": "hsl(var(--info-900))",
          "950": "hsl(var(--info-950))",
        },

        /* Special themed backgrounds */
        "unified-page": "hsl(var(--unified-page-bg))",
        "landing": "hsl(var(--landing-bg))",
        "dashboard": "hsl(var(--dashboard-bg))",
        "auth": "hsl(var(--auth-bg))",

        /* New gradient backgrounds for enhanced theming */
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        /* ========== ENHANCED ANIMATION SYSTEM ========== */
        
        /* Accordion Animations */
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" }
        },

        /* Fade Animations */
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },

        /* Scale Animations */
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" }
        },

        /* Slide Animations */
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }
        },

        /* Bounce & Spring Animations */
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "spring": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" }
        },

        /* Shimmer & Loading Animations */
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" }
        },

        /* Page Transition Animations */
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "page-exit": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(0.98)" }
        },

        /* Micro-interactions */
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--primary))" },
          "50%": { boxShadow: "0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))" }
        }
      },
      animation: {
        /* ========== ENHANCED ANIMATIONS ========== */
        
        /* Basic Animations */
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-out",
        
        /* Enhanced Animations */
        "bounce-in": "bounce-in 0.5s ease-out",
        "spring": "spring 0.3s ease-in-out",
        "shimmer": "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "page-enter": "page-enter 0.4s ease-out",
        "page-exit": "page-exit 0.3s ease-in",
        
        /* Micro-interactions */
        "wiggle": "wiggle 0.5s ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        
        /* Combined Animations */
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
        "enter-spring": "fade-in-up 0.4s ease-out, spring 0.3s 0.1s ease-out"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // RTL plugin
    function({ addUtilities, addComponents }: any) {
      const rtlUtilities = {
        // RTL margin utilities
        '.rtl-mr-0': { '[dir="rtl"] &': { marginLeft: '0', marginRight: 'auto' } },
        '.rtl-mr-1': { '[dir="rtl"] &': { marginLeft: '0.25rem', marginRight: 'auto' } },
        '.rtl-mr-2': { '[dir="rtl"] &': { marginLeft: '0.5rem', marginRight: 'auto' } },
        '.rtl-mr-3': { '[dir="rtl"] &': { marginLeft: '0.75rem', marginRight: 'auto' } },
        '.rtl-mr-4': { '[dir="rtl"] &': { marginLeft: '1rem', marginRight: 'auto' } },
        '.rtl-mr-6': { '[dir="rtl"] &': { marginLeft: '1.5rem', marginRight: 'auto' } },
        '.rtl-mr-8': { '[dir="rtl"] &': { marginLeft: '2rem', marginRight: 'auto' } },
        
        '.rtl-ml-0': { '[dir="rtl"] &': { marginRight: '0', marginLeft: 'auto' } },
        '.rtl-ml-1': { '[dir="rtl"] &': { marginRight: '0.25rem', marginLeft: 'auto' } },
        '.rtl-ml-2': { '[dir="rtl"] &': { marginRight: '0.5rem', marginLeft: 'auto' } },
        '.rtl-ml-3': { '[dir="rtl"] &': { marginRight: '0.75rem', marginLeft: 'auto' } },
        '.rtl-ml-4': { '[dir="rtl"] &': { marginRight: '1rem', marginLeft: 'auto' } },
        '.rtl-ml-6': { '[dir="rtl"] &': { marginRight: '1.5rem', marginLeft: 'auto' } },
        '.rtl-ml-8': { '[dir="rtl"] &': { marginRight: '2rem', marginLeft: 'auto' } },

        // RTL padding utilities
        '.rtl-pl-0': { '[dir="rtl"] &': { paddingRight: '0' } },
        '.rtl-pl-1': { '[dir="rtl"] &': { paddingRight: '0.25rem' } },
        '.rtl-pl-2': { '[dir="rtl"] &': { paddingRight: '0.5rem' } },
        '.rtl-pl-3': { '[dir="rtl"] &': { paddingRight: '0.75rem' } },
        '.rtl-pl-4': { '[dir="rtl"] &': { paddingRight: '1rem' } },
        '.rtl-pl-6': { '[dir="rtl"] &': { paddingRight: '1.5rem' } },
        '.rtl-pl-8': { '[dir="rtl"] &': { paddingRight: '2rem' } },

        '.rtl-pr-0': { '[dir="rtl"] &': { paddingLeft: '0' } },
        '.rtl-pr-1': { '[dir="rtl"] &': { paddingLeft: '0.25rem' } },
        '.rtl-pr-2': { '[dir="rtl"] &': { paddingLeft: '0.5rem' } },
        '.rtl-pr-3': { '[dir="rtl"] &': { paddingLeft: '0.75rem' } },
        '.rtl-pr-4': { '[dir="rtl"] &': { paddingLeft: '1rem' } },
        '.rtl-pr-6': { '[dir="rtl"] &': { paddingLeft: '1.5rem' } },
        '.rtl-pr-8': { '[dir="rtl"] &': { paddingLeft: '2rem' } },

        // RTL positioning
        '.rtl-left-0': { '[dir="rtl"] &': { right: '0', left: 'auto' } },
        '.rtl-left-1': { '[dir="rtl"] &': { right: '0.25rem', left: 'auto' } },
        '.rtl-left-2': { '[dir="rtl"] &': { right: '0.5rem', left: 'auto' } },
        '.rtl-left-3': { '[dir="rtl"] &': { right: '0.75rem', left: 'auto' } },
        '.rtl-left-4': { '[dir="rtl"] &': { right: '1rem', left: 'auto' } },

        '.rtl-right-0': { '[dir="rtl"] &': { left: '0', right: 'auto' } },
        '.rtl-right-1': { '[dir="rtl"] &': { left: '0.25rem', right: 'auto' } },
        '.rtl-right-2': { '[dir="rtl"] &': { left: '0.5rem', right: 'auto' } },
        '.rtl-right-3': { '[dir="rtl"] &': { left: '0.75rem', right: 'auto' } },
        '.rtl-right-4': { '[dir="rtl"] &': { left: '1rem', right: 'auto' } },

        // RTL text alignment
        '.rtl-text-left': { '[dir="rtl"] &': { textAlign: 'right' } },
        '.rtl-text-right': { '[dir="rtl"] &': { textAlign: 'left' } },

        // RTL border radius
        '.rtl-rounded-l': { '[dir="rtl"] &': { borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' } },
        '.rtl-rounded-r': { '[dir="rtl"] &': { borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem', borderTopRightRadius: '0', borderBottomRightRadius: '0' } },

        // RTL transform
        '.rtl-scale-x-flip': { '[dir="rtl"] &': { transform: 'scaleX(-1)' } },

        // RTL transition for smooth switching
        '.rtl-transition': { 
          transition: 'all 0.3s ease-in-out',
          '[dir="rtl"] &': { transition: 'all 0.3s ease-in-out' }
        }
      };

      addUtilities(rtlUtilities);

      // RTL flex utilities
      const rtlComponents = {
        '.rtl-flex': {
          display: 'flex',
          '[dir="rtl"] &': {
            flexDirection: 'row-reverse'
          }
        },
        '.rtl-flex-col': {
          display: 'flex',
          flexDirection: 'column',
          '[dir="rtl"] &': {
            flexDirection: 'column'
          }
        }
      };

      addComponents(rtlComponents);
    }
  ],
} satisfies Config;

export default config;
