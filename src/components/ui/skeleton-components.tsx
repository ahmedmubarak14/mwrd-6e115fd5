import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Dashboard metrics skeleton
export const MetricCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("relative overflow-hidden", className)}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

// Table row skeleton
export const TableRowSkeleton: React.FC<{ columns: number; className?: string }> = ({ 
  columns, 
  className 
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Form field skeleton
export const FormFieldSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-2", className)}>
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Chat message skeleton
export const ChatMessageSkeleton: React.FC<{ isOwn?: boolean }> = ({ isOwn = false }) => (
  <div className={cn("flex gap-3 mb-4", isOwn ? "justify-end" : "justify-start")}>
    {!isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
    <div className={cn("max-w-[70%] space-y-2", isOwn ? "items-end" : "items-start")}>
      <Skeleton className={cn("h-4", isOwn ? "w-16" : "w-24")} />
      <div className={cn(
        "rounded-lg p-3 space-y-2",
        isOwn ? "bg-primary/10" : "bg-muted"
      )}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
    {isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
  </div>
);

// List item skeleton  
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center gap-3 p-4 rounded-lg border", className)}>
    <Skeleton className="h-10 w-10 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

// Profile card skeleton
export const ProfileCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("p-6", className)}>
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </Card>
);

// Chart skeleton
export const ChartSkeleton: React.FC<{ height?: string; className?: string }> = ({ 
  height = "h-64", 
  className 
}) => (
  <Card className={className}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardHeader>
    <CardContent>
      <div className={cn("w-full bg-muted/30 rounded-lg animate-pulse", height)} />
    </CardContent>
  </Card>
);

// Dashboard grid skeleton
export const DashboardGridSkeleton: React.FC<{ 
  metrics?: number; 
  charts?: number; 
  className?: string 
}> = ({ 
  metrics = 4, 
  charts = 2, 
  className 
}) => (
  <div className={cn("space-y-8", className)}>
    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-48" />
    </div>
    
    {/* Metrics grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: metrics }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Charts grid */}
    {charts > 0 && (
      <div className={cn(
        "grid gap-6",
        charts === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      )}>
        {Array.from({ length: charts }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
    )}
  </div>
);