
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      },
      backgroundImage: {
        'unified-page': 'var(--unified-page)',
        'landing': 'var(--unified-page)',
        'dashboard': 'var(--unified-page)',
        'auth': 'var(--unified-page)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
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
            transform: "translateY(10px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
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
