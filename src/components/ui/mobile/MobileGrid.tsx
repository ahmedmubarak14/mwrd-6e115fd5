import React from 'react';
import { cn } from '@/lib/utils';

interface MobileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  gap?: 'sm' | 'md' | 'lg';
}

export const MobileGrid = ({ 
  children, 
  cols = 1, 
  gap = 'md', 
  className, 
  ...props 
}: MobileGridProps) => {
  const getGridCols = () => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1';
    }
  };

  const getGap = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div 
      className={cn(
        "grid w-full",
        getGridCols(),
        getGap(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface MobileStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MobileStack = ({ 
  children, 
  spacing = 'md', 
  className, 
  ...props 
}: MobileStackProps) => {
  const getSpacing = () => {
    switch (spacing) {
      case 'sm': return 'space-y-2';
      case 'md': return 'space-y-4';
      case 'lg': return 'space-y-6';
      case 'xl': return 'space-y-8';
      default: return 'space-y-4';
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col w-full",
        getSpacing(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};