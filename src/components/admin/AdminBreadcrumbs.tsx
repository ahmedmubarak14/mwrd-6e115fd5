import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const breadcrumbKeys: Record<string, string> = {
  "/admin": "admin.breadcrumbs.admin",
  "/admin/dashboard": "admin.breadcrumbs.dashboardOverview", 
  "/admin/users": "admin.breadcrumbs.userManagement",
  "/admin/requests": "admin.breadcrumbs.requestsManagement",
  "/admin/offers": "admin.breadcrumbs.offersManagement", 
  "/admin/orders": "admin.breadcrumbs.ordersManagement",
  "/admin/projects": "admin.breadcrumbs.projectsManagement",
  "/admin/analytics": "admin.breadcrumbs.platformAnalytics",
  "/admin/subscriptions": "admin.breadcrumbs.subscriptionManagement",
  "/admin/support": "admin.breadcrumbs.supportCenter",
  "/admin/category-management": "admin.breadcrumbs.categoryManagement",
  "/admin/financial-transactions": "admin.breadcrumbs.financialTransactions",
  "/admin/security": "admin.breadcrumbs.securityMonitoring",
  "/admin/communications": "admin.breadcrumbs.communicationCenter"
};

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbItems = [];
  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    const translationKey = breadcrumbKeys[currentPath];
    const title = translationKey ? t(translationKey) : t('admin.breadcrumbs.unknown');
    
    breadcrumbItems.push({
      path: currentPath,
      title,
      isLast
    });
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Breadcrumb>
        <BreadcrumbList className={cn(isRTL && "flex-row-reverse")}>
          {/* Home/Admin root */}
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="/admin" 
              className={cn(
                "flex items-center gap-1 text-foreground opacity-80 hover:text-foreground hover:opacity-100 transition-colors",
                isRTL && "flex-row-reverse"
              )}
            >
              <Home className="h-3 w-3" />
              <span className="admin-caption">{t('admin.breadcrumbs.admin')}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems.length > 1 && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className={cn(
                  "h-3 w-3 text-foreground opacity-60",
                  isRTL && "rotate-180"
                )} />
              </BreadcrumbSeparator>
              
              {breadcrumbItems.slice(1).map((item, index) => (
                <div key={item.path} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                  <BreadcrumbItem>
                    {item.isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground text-xs">
                      {item.title}
                    </BreadcrumbPage>
                    ) : (
                    <BreadcrumbLink href={item.path} className="text-foreground opacity-80 hover:text-foreground hover:opacity-100 text-xs transition-colors">
                      {item.title}
                    </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  
                  {!item.isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className={cn(
                        "h-3 w-3 text-foreground opacity-60",
                        isRTL && "rotate-180"
                      )} />
                    </BreadcrumbSeparator>
                  )}
                </div>
              ))}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};