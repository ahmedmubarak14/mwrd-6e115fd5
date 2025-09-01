import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartSkeletonProps {
  title?: string;
  description?: string;
  height?: string;
  showLegend?: boolean;
  type?: 'bar' | 'line' | 'pie' | 'area';
}

export const ChartSkeleton = ({ 
  title = "Loading Chart...",
  description = "Please wait while we fetch the data",
  height = "h-80",
  showLegend = false,
  type = 'bar'
}: ChartSkeletonProps) => {
  const renderChartSkeleton = () => {
    switch (type) {
      case 'pie':
        return (
          <div className="flex items-center justify-center">
            <div className="relative">
              <Skeleton className="w-40 h-40 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-20 h-20 rounded-full" />
              </div>
            </div>
          </div>
        );
      
      case 'line':
        return (
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-48">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <Skeleton 
                    className="w-full bg-gradient-to-t from-primary/20 to-primary/5" 
                    style={{ 
                      height: `${Math.random() * 80 + 20}%`,
                      borderRadius: '2px 2px 0 0'
                    }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-12" />
              ))}
            </div>
          </div>
        );
      
      case 'area':
        return (
          <div className="space-y-4">
            <div className="relative h-48">
              <svg className="w-full h-full">
                <defs>
                  <linearGradient id="skeleton-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q50,120 100,130 T200,110 T300,120 T400,100 L400,200 L0,200 Z"
                  fill="url(#skeleton-gradient)"
                  className="animate-pulse"
                />
                <path
                  d="M0,150 Q50,120 100,130 T200,110 T300,120 T400,100"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-12" />
              ))}
            </div>
          </div>
        );
      
      default: // bar chart
        return (
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-48">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end space-y-1">
                  <Skeleton 
                    className="w-full" 
                    style={{ height: `${Math.random() * 80 + 20}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle>
              {title ? title : <Skeleton className="h-5 w-40" />}
            </CardTitle>
            <CardDescription>
              {description ? description : <Skeleton className="h-4 w-60" />}
            </CardDescription>
          </div>
          {showLegend && (
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={height}>
          {renderChartSkeleton()}
        </div>
      </CardContent>
    </Card>
  );
};