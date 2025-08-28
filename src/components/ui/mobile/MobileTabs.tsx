import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    content: React.ReactNode;
    badge?: number;
  }>;
  defaultValue?: string;
  className?: string;
  stickyTabs?: boolean;
}

export const MobileTabs = ({ 
  tabs, 
  defaultValue, 
  className,
  stickyTabs = true 
}: MobileTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} className={cn("w-full", className)}>
      <TabsList 
        className={cn(
          "grid w-full h-auto bg-background border-b",
          stickyTabs && "sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/95",
          `grid-cols-${tabs.length}`
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col gap-1 py-3 px-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary relative"
          >
            {tab.icon && (
              <tab.icon className="h-4 w-4" />
            )}
            <span className="text-xs font-medium truncate">
              {tab.label}
            </span>
            {tab.badge && tab.badge > 0 && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {tab.badge > 9 ? '9+' : tab.badge}
              </div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="mt-0 focus-visible:outline-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

// Swipeable tabs for better mobile UX
export const SwipeableTabs = ({ 
  tabs, 
  defaultValue, 
  className 
}: MobileTabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.id);
  const [startX, setStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      
      if (diff > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - next tab
        setActiveTab(tabs[currentIndex + 1].id);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        setActiveTab(tabs[currentIndex - 1].id);
      }
    }
    
    setIsDragging(false);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className={cn("w-full", className)}>
      <TabsList className="grid w-full h-auto bg-background border-b sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col gap-1 py-3 px-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary relative"
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span className="text-xs font-medium truncate">{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {tab.badge > 9 ? '9+' : tab.badge}
              </div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="mt-0 focus-visible:outline-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="touch-pan-y">
            {tab.content}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};