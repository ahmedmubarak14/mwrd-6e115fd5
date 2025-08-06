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

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "User Management",
  "/admin/users/advanced": "Advanced User Management",
  "/admin/users/profiles": "User Profiles",
  "/admin/financial": "Financial Dashboard",
  "/admin/financial/transactions": "Transactions",
  "/admin/financial/subscriptions": "Subscriptions",
  "/admin/analytics": "Platform Analytics",
  "/admin/analytics/users": "User Activity",
  "/admin/analytics/reports": "Reports",
  "/admin/content": "Content Management",
  "/admin/content/requests": "Request Approval",
  "/admin/content/offers": "Offer Management",
  "/admin/content/consultations": "Expert Consultations",
  "/admin/settings": "System Settings",
  "/admin/settings/theme": "Theme & Design",
  "/admin/settings/database": "Database Management",
};

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbItems = [];
  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += '/' + pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    const title = breadcrumbMap[currentPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1);
    
    breadcrumbItems.push({
      path: currentPath,
      title,
      isLast
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home/Admin root */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin" className="flex items-center gap-1">
            <Home className="h-3 w-3" />
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.length > 1 && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3" />
            </BreadcrumbSeparator>
            
            {breadcrumbItems.slice(1).map((item, index) => (
              <div key={item.path} className="flex items-center">
                <BreadcrumbItem>
                  {item.isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {item.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {!item.isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};