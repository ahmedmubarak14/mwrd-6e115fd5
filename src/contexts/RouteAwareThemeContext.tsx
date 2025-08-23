import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

interface RouteAwareThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  isDashboardRoute: boolean;
  forceLightMode: boolean;
}

const RouteAwareThemeContext = createContext<RouteAwareThemeContextType | undefined>(undefined);

export const useRouteAwareTheme = () => {
  const context = useContext(RouteAwareThemeContext);
  if (!context) {
    throw new Error('useRouteAwareTheme must be used within a RouteAwareThemeProvider');
  }
  return context;
};

// Routes that should always use light mode
const LANDING_ROUTES = [
  '/',
  '/landing',
  '/pricing',
  '/suppliers',
  '/why-start-with-mwrd',
  '/why-move-to-mwrd',
  '/privacy-policy',
  '/terms-and-conditions',
  '/support'
];

// Routes that are considered dashboard routes (can use dark mode)
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/client-dashboard',
  '/supplier-dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/analytics',
  '/orders',
  '/messages',
  '/my-offers',
  '/browse-requests',
  '/requests',
  '/expert-consultation',
  '/manage-subscription'
];

export const RouteAwareThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', 'system');
  const [theme, setTheme] = useState<Theme>(storedTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Determine if current route is a dashboard route
  const isDashboardRoute = DASHBOARD_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  // Determine if current route should force light mode
  const forceLightMode = LANDING_ROUTES.some(route => 
    location.pathname === route || (route === '/' && location.pathname === '/')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getResolvedTheme = (): 'light' | 'dark' => {
      // Force light mode for landing pages
      if (forceLightMode) {
        return 'light';
      }

      // For dashboard routes, respect user's theme preference
      if (isDashboardRoute) {
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme as 'light' | 'dark';
      }

      // Default to light for other routes
      return 'light';
    };

    const resolved = getResolvedTheme();
    setResolvedTheme(resolved);

    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Listen for system theme changes only for dashboard routes with system theme
    if (isDashboardRoute && theme === 'system' && !forceLightMode) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newResolved = getResolvedTheme();
        setResolvedTheme(newResolved);
        root.classList.remove('light', 'dark');
        root.classList.add(newResolved);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isDashboardRoute, forceLightMode]);

  const handleSetTheme = (newTheme: Theme) => {
    // Only allow theme changes on dashboard routes
    if (isDashboardRoute && !forceLightMode) {
      setTheme(newTheme);
      setStoredTheme(newTheme);
    }
  };

  return (
    <RouteAwareThemeContext.Provider 
      value={{ 
        theme: forceLightMode ? 'light' : theme, 
        setTheme: handleSetTheme, 
        resolvedTheme,
        isDashboardRoute,
        forceLightMode
      }}
    >
      {children}
    </RouteAwareThemeContext.Provider>
  );
};