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
  "/admin/dashboard": "Dashboard Overview", 
  "/admin/users": "User Management",
  "/admin/requests": "Requests Management",
  "/admin/offers": "Offers Management", 
  "/admin/orders": "Orders Management",
  "/admin/projects": "Projects Management",
  "/admin/analytics": "Platform Analytics",
  "/admin/subscriptions": "Subscription Management",
  "/admin/support": "Support Center",
  "/admin/verification-queue": "Verification Queue",
  "/admin/category-management": "Category Management",
  "/admin/expert-consultations": "Expert Consultations",
  "/admin/financial-transactions": "Financial Transactions",
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
          <BreadcrumbLink href="/admin" className="flex items-center gap-1 text-foreground opacity-80 hover:text-foreground hover:opacity-100 transition-colors">
            <Home className="h-3 w-3" />
            <span className="admin-caption">Admin</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.length > 1 && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3 text-foreground opacity-60" />
            </BreadcrumbSeparator>
            
            {breadcrumbItems.slice(1).map((item, index) => (
              <div key={item.path} className="flex items-center">
                <BreadcrumbItem>
                  {item.isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground admin-caption">
                      {item.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path} className="text-foreground opacity-80 hover:text-foreground hover:opacity-100 admin-caption transition-colors">
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {!item.isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3 text-foreground opacity-60" />
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