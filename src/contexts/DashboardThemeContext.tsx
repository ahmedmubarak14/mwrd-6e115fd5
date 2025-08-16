import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

interface DashboardThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }
  return context;
};

export const DashboardThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('dashboard-theme', 'system');
  const [theme, setTheme] = useState<Theme>(storedTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getResolvedTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    };

    const resolved = getResolvedTheme();
    setResolvedTheme(resolved);

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newResolved = getResolvedTheme();
        setResolvedTheme(newResolved);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
};