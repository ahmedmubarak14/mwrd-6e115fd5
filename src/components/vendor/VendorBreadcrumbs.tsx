import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const VendorBreadcrumbs = () => {
  const location = useLocation();
  const languageContext = useLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key.split('.').pop() || key, 
    isRTL: false 
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Remove 'vendor' from the beginning if it exists
  const cleanSegments = pathSegments[0] === 'vendor' ? pathSegments.slice(1) : pathSegments;
  
  const getBreadcrumbLabel = (segment: string, index: number) => {
    const segmentMap: Record<string, string> = {
      'dashboard': t('nav.dashboard'),
      'projects-management': t('vendor.navigation.projectsManagement'),
      'cr-management': t('vendor.navigation.crManagement'),
      'portfolio-management': t('vendor.navigation.portfolioManagement'),
      'browse-requests': t('nav.browseRequests'),
      'my-offers': t('nav.myOffers'),
      'messages': t('nav.messages'),
      'orders': t('nav.orders'),
      'settings': t('nav.settings'),
      'profile': t('nav.profile'),
      'support': t('nav.support'),
    };
    
    return segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  const getBreadcrumbPath = (index: number) => {
    // For clean segments, we need to reconstruct the full path including 'vendor'
    const vendorSegments = ['vendor', ...cleanSegments.slice(0, index + 1)];
    return '/' + vendorSegments.join('/');
  };

  return (
    <Breadcrumb className={cn(isRTL && "rtl")}>
      <BreadcrumbList className={cn(
        "flex items-center gap-1.5 text-sm",
        isRTL ? "flex-row-reverse text-right" : "text-left"
      )}>
        {/* Home/Dashboard Link */}
        <BreadcrumbItem>
          <BreadcrumbLink 
            asChild
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link to="/vendor/dashboard" className={cn(
              "flex items-center gap-1.5",
              isRTL ? "flex-row-reverse text-right" : "text-left"
            )}>
              <HomeIcon className="h-3.5 w-3.5" />
              <span className="font-medium">{t('nav.dashboard')}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Path Segments */}
        {cleanSegments.length > 0 && cleanSegments[0] !== 'dashboard' && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                isRTL && "rotate-180"
              )} />
            </BreadcrumbSeparator>
            
            {cleanSegments.map((segment, index) => {
              const isLast = index === cleanSegments.length - 1;
              const path = getBreadcrumbPath(index);
              const label = getBreadcrumbLabel(segment, index);

              return (
                <BreadcrumbItem key={segment}>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink 
                        asChild
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        <Link to={path}>{label}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator>
                        <ChevronRight className={cn(
                          "h-3.5 w-3.5 text-muted-foreground",
                          isRTL && "rotate-180"
                        )} />
                      </BreadcrumbSeparator>
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};