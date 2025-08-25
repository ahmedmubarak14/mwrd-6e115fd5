
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  Settings,
  HelpCircle,
  MessageSquare,
  BarChart3,
  UserCheck,
  FolderOpen,
  Building2,
  Ticket
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const pendingTickets = getPendingTicketsCount();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Requests",
      href: "/admin/requests",
      icon: FileText,
    },
    {
      name: "Offers",
      href: "/admin/offers",
      icon: Package,
    },
    {
      name: "Projects",
      href: "/admin/projects", 
      icon: Building2,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Financial Transactions",
      href: "/admin/financial-transactions",
      icon: CreditCard,
    },
    {
      name: "Support Tickets",
      href: "/admin/support",
      icon: Ticket,
      badge: pendingTickets > 0 ? pendingTickets : undefined,
      badgeVariant: "destructive" as const,
    },
    {
      name: "Expert Consultations",
      href: "/admin/content/consultations",
      icon: HelpCircle,
    },
    {
      name: "Category Management",
      href: "/admin/category-management",
      icon: FolderOpen,
    },
    {
      name: "Verification Queue",
      href: "/admin/verification",
      icon: UserCheck,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Panel
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                    asChild
                  >
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badgeVariant || "secondary"} 
                          className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
