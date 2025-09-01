import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dashboard' | 'form' | 'table';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const ResponsiveContainer = ({ 
  children, 
  className,
  variant = 'default',
  maxWidth = 'full'
}: ResponsiveContainerProps) => {
  const breakpoints = useResponsiveBreakpoints();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'dashboard':
        return cn(
          'space-y-6',
          breakpoints.xs && 'px-3 py-4',
          breakpoints.sm && 'px-4 py-6', 
          breakpoints.lg && 'px-6 py-8'
        );
      case 'form':
        return cn(
          'space-y-4',
          breakpoints.xs && 'px-4 py-6',
          breakpoints.sm && 'px-6 py-8',
          breakpoints.lg && 'px-8 py-10'
        );
      case 'table':
        return cn(
          'space-y-4',
          breakpoints.xs && 'px-2 py-4',
          breakpoints.sm && 'px-4 py-6',
          breakpoints.lg && 'px-6 py-8'
        );
      default:
        return cn(
          breakpoints.xs && 'px-4 py-4',
          breakpoints.sm && 'px-6 py-6',
          breakpoints.lg && 'px-8 py-8'
        );
    }
  };

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-full';
    }
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      getMaxWidthClass(),
      getVariantStyles(),
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md'
}: ResponsiveGridProps) => {
  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-3';
      case 'md': return 'gap-4 md:gap-6';
      case 'lg': return 'gap-6 md:gap-8';
      default: return 'gap-4';
    }
  };

  const getColsClass = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      getColsClass(),
      getGapClass(),
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Stack Component
interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const ResponsiveStack = ({
  children,
  className,
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start'
}: ResponsiveStackProps) => {
  const getDirectionClass = () => {
    const classes = ['flex'];
    
    if (direction.default) classes.push(`flex-${direction.default}`);
    if (direction.sm) classes.push(`sm:flex-${direction.sm}`);
    if (direction.md) classes.push(`md:flex-${direction.md}`);
    if (direction.lg) classes.push(`lg:flex-${direction.lg}`);
    
    return classes.join(' ');
  };

  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'start': return 'items-start';
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      case 'stretch': return 'items-stretch';
      default: return 'items-start';
    }
  };

  const getJustifyClass = () => {
    switch (justify) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
      case 'between': return 'justify-between';
      case 'around': return 'justify-around';
      case 'evenly': return 'justify-evenly';
      default: return 'justify-start';
    }
  };

  return (
    <div className={cn(
      getDirectionClass(),
      getGapClass(),
      getAlignClass(),
      getJustifyClass(),
      className
    )}>
      {children}
    </div>
  );
};