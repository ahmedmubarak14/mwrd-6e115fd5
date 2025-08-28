
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
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
          950: "hsl(var(--primary-950))",
        },

        /* Secondary color system */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },

        /* Accent color system */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          50: "hsl(var(--accent-50))",
          100: "hsl(var(--accent-100))",
          200: "hsl(var(--accent-200))",
          300: "hsl(var(--accent-300))",
          400: "hsl(var(--accent-400))",
          500: "hsl(var(--accent-500))",
          600: "hsl(var(--accent-600))",
          700: "hsl(var(--accent-700))",
          800: "hsl(var(--accent-800))",
          900: "hsl(var(--accent-900))",
          950: "hsl(var(--accent-950))",
        },

        /* Semantic colors */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          50: "hsl(var(--danger-50))",
          100: "hsl(var(--danger-100))",
          600: "hsl(var(--danger-600))",
          900: "hsl(var(--danger-900))",
        },

        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          hover: "hsl(var(--success-hover))",
          active: "hsl(var(--success-active))",
          disabled: "hsl(var(--success-disabled))",
          "disabled-foreground": "hsl(var(--success-disabled-foreground))",
          50: "hsl(var(--success-50))",
          100: "hsl(var(--success-100))",
          600: "hsl(var(--success-600))",
          900: "hsl(var(--success-900))",
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          hover: "hsl(var(--warning-hover))",
          active: "hsl(var(--warning-active))",
          disabled: "hsl(var(--warning-disabled))",
          "disabled-foreground": "hsl(var(--warning-disabled-foreground))",
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
          600: "hsl(var(--warning-600))",
          900: "hsl(var(--warning-900))",
        },

        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          hover: "hsl(var(--info-hover))",
          active: "hsl(var(--info-active))",
          disabled: "hsl(var(--info-disabled))",
          "disabled-foreground": "hsl(var(--info-disabled-foreground))",
          50: "hsl(var(--info-50))",
          100: "hsl(var(--info-100))",
          600: "hsl(var(--info-600))",
          900: "hsl(var(--info-900))",
        },

        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
          hover: "hsl(var(--error-hover))",
          active: "hsl(var(--error-active))",
          disabled: "hsl(var(--error-disabled))",
          "disabled-foreground": "hsl(var(--error-disabled-foreground))",
        },

        /* Neutral color system */
        neutral: {
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
          950: "hsl(var(--neutral-950))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* Brand colors */
        bronze: "hsl(var(--bronze))",
        orange: "hsl(var(--orange))",
        gold: "hsl(var(--gold))",
      },
      backgroundImage: {
        'unified-page': 'var(--unified-page)',
        'page-overlay': 'var(--page-overlay)',
        'landing': 'var(--unified-page)',
        'dashboard': 'var(--unified-page)',
        'auth': 'var(--unified-page)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-warning': 'var(--gradient-warning)',
        'gradient-danger': 'var(--gradient-danger)',
        'gradient-subtle': 'var(--gradient-subtle-light)',
        'gradient-radial': 'var(--gradient-radial)',
      },

      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'primary': 'var(--shadow-primary)',
        'accent': 'var(--shadow-accent)',
        'success': 'var(--shadow-success)',
        'warning': 'var(--shadow-warning)',
        'danger': 'var(--shadow-danger)',
      },

      fontSize: {
        'xs': ['var(--font-size-xs)', 'var(--line-height-normal)'],
        'sm': ['var(--font-size-sm)', 'var(--line-height-normal)'],
        'base': ['var(--font-size-base)', 'var(--line-height-normal)'],
        'lg': ['var(--font-size-lg)', 'var(--line-height-normal)'],
        'xl': ['var(--font-size-xl)', 'var(--line-height-tight)'],
        '2xl': ['var(--font-size-2xl)', 'var(--line-height-tight)'],
        '3xl': ['var(--font-size-3xl)', 'var(--line-height-tight)'],
        '4xl': ['var(--font-size-4xl)', 'var(--line-height-tight)'],
        '5xl': ['var(--font-size-5xl)', 'var(--line-height-tight)'],
        '6xl': ['var(--font-size-6xl)', 'var(--line-height-tight)'],
        'display': ['var(--font-size-6xl)', 'var(--line-height-tight)'],
        'headline': ['var(--font-size-5xl)', 'var(--line-height-tight)'],
        'title': ['var(--font-size-3xl)', 'var(--line-height-tight)'],
        'subtitle': ['var(--font-size-xl)', 'var(--line-height-normal)'],
        'body': ['var(--font-size-base)', 'var(--line-height-normal)'],
        'caption': ['var(--font-size-sm)', 'var(--line-height-normal)'],
        'overline': ['var(--font-size-xs)', 'var(--line-height-normal)'],
      },

      letterSpacing: {
        'tight': 'var(--letter-spacing-tight)',
        'normal': 'var(--letter-spacing-normal)',
        'wide': 'var(--letter-spacing-wide)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        /* ========== ENHANCED ANIMATIONS ========== */
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "slide-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.4)",
          },
          "50%": {
            boxShadow: "0 0 30px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.3)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        /* ========== ENHANCED ANIMATIONS ========== */
        "accordion-down": "accordion-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      // RTL-specific utilities
      spacing: {
        'rtl-0': '0',
        'rtl-1': '0.25rem',
        'rtl-2': '0.5rem',
        'rtl-3': '0.75rem',
        'rtl-4': '1rem',
        'rtl-5': '1.25rem',
        'rtl-6': '1.5rem',
        'rtl-8': '2rem',
        'rtl-10': '2.5rem',
        'rtl-12': '3rem',
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
