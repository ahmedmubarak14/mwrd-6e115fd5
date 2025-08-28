import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  href: string;
  icon?: React.ElementType;
}

export const ClientBreadcrumbs = () => {
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home }
  ];
  
  // Build breadcrumbs from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Skip adding dashboard again
    if (segment !== 'dashboard') {
      breadcrumbItems.push({
        name,
        href: currentPath,
      });
    }
  });
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-2 h-3 w-3 text-muted-foreground/50" />
          )}
          
          {index === breadcrumbItems.length - 1 ? (
            // Current page - not clickable
            <span 
              className="flex items-center gap-1.5 text-foreground font-medium"
              aria-current="page"
            >
              {item.icon && <item.icon className="h-3 w-3" />}
              {item.name}
            </span>
          ) : (
            // Previous pages - clickable
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 hover:text-foreground transition-colors",
                "text-muted-foreground hover:underline underline-offset-4"
              )}
            >
              {item.icon && <item.icon className="h-3 w-3" />}
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};