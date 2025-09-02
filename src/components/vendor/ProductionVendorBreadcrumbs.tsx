import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const VENDOR_ROUTE_MAP: Record<string, string> = {
  '/vendor/dashboard': 'vendor.navigation.breadcrumbs.dashboard',
  '/vendor/rfqs': 'vendor.navigation.breadcrumbs.rfqs',
  '/vendor/projects': 'vendor.navigation.breadcrumbs.projects',
  '/vendor/portfolio': 'vendor.navigation.breadcrumbs.portfolio',
  '/vendor/subscription': 'vendor.navigation.breadcrumbs.subscription',
  '/vendor/transactions': 'vendor.navigation.breadcrumbs.transactions',
  '/vendor/notifications': 'vendor.navigation.breadcrumbs.notifications',
  '/vendor/clients': 'vendor.navigation.breadcrumbs.clients',
  '/vendor/documents': 'vendor.navigation.breadcrumbs.documents',
  '/vendor/reports': 'vendor.navigation.breadcrumbs.reports',
  '/vendor/messages': 'vendor.navigation.breadcrumbs.messages',
  '/vendor/profile': 'vendor.navigation.breadcrumbs.profile',
  '/vendor/settings': 'vendor.navigation.breadcrumbs.settings',
  '/vendor/support': 'vendor.navigation.breadcrumbs.support',
  '/vendor/cr-management': 'vendor.crManagement.title'
};

export const ProductionVendorBreadcrumbs = () => {
  const location = useLocation();
  const languageContext = useLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key.split('.').pop() || key, 
    isRTL: false 
  };

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Always start with home
    items.push({
      label: t('vendor.navigation.breadcrumbs.home'),
      path: '/vendor/dashboard',
      isActive: false
    });

    // Build breadcrumb trail
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip if it's just '/vendor'
      if (currentPath === '/vendor') return;

      const translationKey = VENDOR_ROUTE_MAP[currentPath];
      const isLastItem = index === pathSegments.length - 1;
      
      items.push({
        label: translationKey ? t(translationKey) : segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
        isActive: isLastItem
      });
    });

    return items;
  }, [location.pathname, t]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs if we're just at home
  }

  return (
    <nav 
      className="flex items-center space-x-1 text-sm text-muted-foreground"
      aria-label={t('vendor.navigation.breadcrumbs')}
    >
      <div className={cn(
        "flex items-center gap-1 overflow-hidden",
        isRTL && "flex-row-reverse"
      )}>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-muted-foreground/50 shrink-0",
                  isRTL && "rotate-180"
                )} 
              />
            )}
            
            {item.isActive ? (
              <span 
                className="font-medium text-foreground truncate"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "hover:text-foreground transition-colors truncate",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1"
                )}
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};