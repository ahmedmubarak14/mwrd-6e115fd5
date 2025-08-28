import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointState {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
  current: Breakpoint;
}

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsiveBreakpoints = (): BreakpointState => {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024; // Default to desktop for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Debounce resize events
    let timeoutId: number;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Determine current breakpoint
  const getCurrentBreakpoint = (): Breakpoint => {
    if (windowWidth >= breakpoints['2xl']) return '2xl';
    if (windowWidth >= breakpoints.xl) return 'xl';
    if (windowWidth >= breakpoints.lg) return 'lg';
    if (windowWidth >= breakpoints.md) return 'md';
    if (windowWidth >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  return {
    xs: windowWidth >= breakpoints.xs,
    sm: windowWidth >= breakpoints.sm,
    md: windowWidth >= breakpoints.md,
    lg: windowWidth >= breakpoints.lg,
    xl: windowWidth >= breakpoints.xl,
    '2xl': windowWidth >= breakpoints['2xl'],
    current: getCurrentBreakpoint(),
  };
};