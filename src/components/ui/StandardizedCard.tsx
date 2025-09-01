import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StandardizedCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  badge?: string;
  loading?: boolean;
}

export const StandardizedCard = ({
  title,
  description,
  children,
  className,
  status,
  badge,
  loading = false
}: StandardizedCardProps) => {
  const statusClasses = {
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning', 
    error: 'border-l-4 border-l-destructive',
    info: 'border-l-4 border-l-primary'
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200",
      "hover:shadow-md",
      status && statusClasses[status],
      loading && "opacity-60",
      className
    )}>
      {(title || description || badge) && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <CardTitle className="text-base font-medium leading-none tracking-tight">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </div>
            {badge && (
              <Badge variant="secondary" className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!title && !description && "pt-6")}>
        {children}
      </CardContent>
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </Card>
  );
};