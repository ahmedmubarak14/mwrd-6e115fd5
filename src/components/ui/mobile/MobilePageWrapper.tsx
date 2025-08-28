import React from 'react';
import { MobileContainer } from '../MobileContainer';
import { PullToRefresh } from './PullToRefresh';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { cn } from '@/lib/utils';

interface MobilePageWrapperProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  enablePullToRefresh?: boolean;
  pageType?: 'landing' | 'dashboard' | 'auth' | 'default';
  className?: string;
}

export const MobilePageWrapper = ({
  children,
  onRefresh,
  enablePullToRefresh = false,
  pageType = 'default',
  className
}: MobilePageWrapperProps) => {
  const { isMobile, orientation } = useMobileDetection();

  const content = enablePullToRefresh && onRefresh && isMobile ? (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="min-h-full">
        {children}
      </div>
    </PullToRefresh>
  ) : children;

  return (
    <MobileContainer
      pageType={pageType}
      className={cn(
        "relative",
        orientation === 'landscape' && isMobile && "landscape-mobile",
        className
      )}
    >
      {content}
    </MobileContainer>
  );
};