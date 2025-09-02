import { cn } from "@/lib/utils";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";

interface AdminPageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerActions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  spacing?: "sm" | "md" | "lg";
}

export const AdminPageContainer = ({
  children,
  className,
  title,
  description,
  headerActions,
  maxWidth = "full",
  spacing = "md"
}: AdminPageContainerProps) => {
  const { isRTL } = useOptionalLanguage();
  const breakpoints = useResponsiveBreakpoints();

  const maxWidthClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-full",
    full: "max-w-none"
  };

  const spacingClasses = {
    sm: "px-4 py-4 sm:px-6 sm:py-6",
    md: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
    lg: "px-6 sm:px-8 lg:px-12 py-8 sm:py-12"
  };

  const contentSpacing = {
    sm: "space-y-4",
    md: "space-y-6", 
    lg: "space-y-8"
  };

  return (
    <div 
      className={cn(
        "min-h-full relative",
        isRTL ? "rtl" : "ltr"
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={cn(
        "mx-auto",
        spacingClasses[spacing],
        maxWidthClasses[maxWidth],
        className
      )}>
        {(title || description || headerActions) && (
          <div className={cn(
            "mb-6 sm:mb-8",
            headerActions && "flex flex-col gap-4",
            headerActions && breakpoints.sm && "sm:flex-row sm:justify-between sm:items-start"
          )}>
            <div className={cn(isRTL ? "text-right" : "text-left")}>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {headerActions && (
              <div className={cn(
                "flex items-center gap-2 flex-shrink-0",
                isRTL && "flex-row-reverse"
              )}>
                {headerActions}
              </div>
            )}
          </div>
        )}
        <div className={contentSpacing[spacing]}>
          {children}
        </div>
      </div>
    </div>
  );
};