
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'system';
type ThemeMode = 'auto' | 'manual';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
  isDashboard: boolean;
  isDashboardRoute: boolean;
  forceLightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export alias for compatibility
export const useRouteAwareTheme = useTheme;

// Routes that are considered landing/marketing pages (force light mode in auto)
const LANDING_ROUTES = [
  '/landing',
  '/auth', 
  '/login',
  '/register',
  '/why-start-with-mwrd',
  '/what-makes-us-unique', 
  '/why-move-to-mwrd',
  '/terms',
  '/privacy',
  '/pricing',
];

// Routes that are considered dashboard routes (can use dark mode)
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/vendor-dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/requests',
  '/offers',
  '/projects',
  '/vendors',
  '/messages',
  '/orders',
  '/analytics',
  '/activity-feed',
  '/expert-consultation',
  '/support',
  '/manage-subscription',
];

export const RouteAwareThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [mode, setMode] = useLocalStorage<ThemeMode>('themeMode', 'auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  // Determine if current route is a dashboard route
  const isDashboard = DASHBOARD_ROUTES.some(route => location.pathname.startsWith(route));
  const isDashboardRoute = isDashboard;
  const isLanding = LANDING_ROUTES.some(route => location.pathname.startsWith(route));
  const forceLightMode = isLanding && mode === 'auto';

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate effective theme
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (mode === 'manual') {
      return theme === 'system' ? systemTheme : theme;
    }
    
    // Auto mode: force light for landing pages, allow dark for dashboard
    if (isLanding) {
      return 'light';
    }
    
    if (isDashboard) {
      return theme === 'system' ? systemTheme : theme;
    }
    
    // Default fallback
    return 'light';
  };

  const effectiveTheme = getEffectiveTheme();

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    mode,
    setMode,
    effectiveTheme,
    isDashboard,
    isDashboardRoute,
    forceLightMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
