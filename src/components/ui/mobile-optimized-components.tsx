import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  X, 
  Menu,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Hook to detect mobile screen size
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Mobile-optimized collapsible card
interface MobileCollapsibleCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  className?: string;
}

export const MobileCollapsibleCard: React.FC<MobileCollapsibleCardProps> = ({
  title,
  description,
  children,
  defaultExpanded = false,
  icon: Icon,
  badge,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { isRTL } = useLanguage();

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader 
        className="cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2 min-w-0", isRTL && "flex-row-reverse")}>
            {Icon && <Icon className="h-5 w-5 text-primary flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg leading-tight">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm mt-1 line-clamp-2">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          
          <div className={cn("flex items-center gap-2 flex-shrink-0", isRTL && "flex-row-reverse")}>
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="border-t bg-muted/20 animate-in slide-in-from-top-1 duration-200">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

// Mobile-optimized search and filter bar
interface MobileSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterComponent?: React.ReactNode;
  showFilter?: boolean;
  className?: string;
}

export const MobileSearchFilter: React.FC<MobileSearchFilterProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  filterComponent,
  showFilter = false,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  const SearchInput = (
    <div className="relative flex-1">
      <Search className={cn(
        "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
        isRTL ? "right-3" : "left-3"
      )} />
      <Input
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10",
          isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSearchChange('')}
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted",
            isRTL ? "left-2" : "right-2"
          )}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  if (!showFilter || !filterComponent) {
    return (
      <div className={cn("w-full", className)}>
        {SearchInput}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search and filter toggle */}
      <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
        {SearchInput}
        
        {isMobile ? (
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "left" : "right"} className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search results
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                {filterComponent}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-10 gap-2 flex-shrink-0",
              showFilters && "bg-muted"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* Desktop filter panel */}
      {!isMobile && showFilters && (
        <Card className="animate-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4">
            {filterComponent}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mobile-optimized data list with swipe actions
interface MobileDataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  empty?: React.ReactNode;
  loadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export const MobileDataList = <T,>({
  items,
  renderItem,
  keyExtractor,
  loading = false,
  empty,
  loadMore,
  hasMore = false,
  className
}: MobileDataListProps<T>) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loadMore || !hasMore || loading) return;

    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadMore();
      }
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, loading]);

  if (items.length === 0 && !loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        {empty || (
          <div className="text-center text-muted-foreground">
            <div className="text-lg font-semibold">No items found</div>
            <p className="text-sm mt-1">No data available at the moment</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className={cn("w-full", className)}
    >
      <div className={cn(
        "space-y-2",
        isMobile ? "px-1" : "px-0"
      )}>
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)} className="w-full">
            {renderItem(item, index)}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Loading...
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

// Mobile-optimized form section
interface MobileFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  required?: boolean;
  className?: string;
}

export const MobileFormSection: React.FC<MobileFormSectionProps> = ({
  title,
  description,
  children,
  icon: Icon,
  collapsible = false,
  defaultExpanded = true,
  required = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  if (!collapsible || !isMobile) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className={cn(
            "flex items-center gap-2 text-lg",
            isRTL && "flex-row-reverse"
          )}>
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
            {required && <span className="text-destructive">*</span>}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <MobileCollapsibleCard
      title={title}
      description={description}
      icon={Icon}
      defaultExpanded={defaultExpanded}
      badge={required ? "Required" : undefined}
      className={className}
    >
      <div className="space-y-4 pt-4">
        {children}
      </div>
    </MobileCollapsibleCard>
  );
};

// Mobile-optimized action sheet
interface MobileActionSheetProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  trigger,
  title,
  description,
  children,
  className
}) => {
  const isMobile = useIsMobile();
  const { isRTL } = useLanguage();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent className={className}>
          <DrawerHeader className={cn("text-center", isRTL && "text-right")}>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-4 pb-8">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className={className}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="mt-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Mobile-optimized metric cards grid
interface MobileMetricsGridProps {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  className?: string;
}

export const MobileMetricsGrid: React.FC<MobileMetricsGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  className
}) => {
  return (
    <div className={cn(
      "grid gap-3 sm:gap-4 lg:gap-6",
      `grid-cols-${columns.mobile}`,
      `sm:grid-cols-${columns.tablet}`,
      `lg:grid-cols-${columns.desktop}`,
      className
    )}>
      {children}
    </div>
  );
};

// Mobile-optimized responsive container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4 lg:p-6',
    lg: 'p-4 sm:p-6 lg:p-8'
  };

  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};