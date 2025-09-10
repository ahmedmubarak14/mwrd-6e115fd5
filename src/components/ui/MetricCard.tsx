import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
  loading?: boolean;
}

export const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
  loading = false
}: MetricCardProps) => {
  const variantStyles = {
    default: "hover:shadow-md",
    success: "border-success/20 bg-success/5 hover:shadow-success/20",
    warning: "border-warning/20 bg-warning/5 hover:shadow-warning/20", 
    destructive: "border-destructive/20 bg-destructive/5 hover:shadow-destructive/20"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive"
  };

  if (loading) {
    return (
      <Card 
        className={cn(
          "animate-pulse",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 animate-shimmer" />
            {Icon && <Skeleton className="h-5 w-5 rounded animate-shimmer" />}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2 animate-shimmer" />
          <Skeleton className="h-3 w-32 animate-shimmer" />
          {trend && <Skeleton className="h-4 w-16 mt-2 animate-shimmer" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
        className={cn(
          "group",
          className
      )}
    >
      <CardHeader className={cn("pb-3", className?.includes('text-right') && "text-right")}>
        <div className={cn(
          "flex items-center justify-between",
          className?.includes('text-right') && "flex-row-reverse"
        )}>
          <CardDescription className={cn(
            "text-xs font-medium uppercase tracking-wide",
            className?.includes('text-right') && "text-right"
          )}>
            {title}
          </CardDescription>
          {Icon && (
            <Icon className={cn(
              "h-5 w-5 transition-transform group-hover:scale-110", 
              iconStyles[variant]
            )} />
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(className?.includes('text-right') && "text-right")}>
        <div className="space-y-2">
          <div className={cn(
            "text-2xl font-bold tracking-tight",
            className?.includes('text-right') && "text-right"
          )}>
            {value}
          </div>
          {description && (
            <p className={cn(
              "text-foreground opacity-75",
              className?.includes('text-right') && "text-right"
            )}>
              {description}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center space-x-1",
              className?.includes('text-right') && "flex-row-reverse space-x-reverse"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <Badge 
                variant={(trend.isPositive ? "secondary" : "destructive") as any}
                className="text-xs"
              >
                {trend.value}%
              </Badge>
              {trend.label && (
                <span className={cn(
                  "text-xs text-foreground opacity-75",
                  className?.includes('text-right') && "text-right"
                )}>
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};