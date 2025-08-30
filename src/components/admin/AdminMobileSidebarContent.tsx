import { Badge } from "@/components/ui/badge";
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
  Ticket,
  Crown,
  User
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { AdminUserProfile } from "./AdminUserProfile";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface AdminMobileSidebarContentProps {
  onItemClick?: () => void;
}

export const AdminMobileSidebarContent = ({ onItemClick }: AdminMobileSidebarContentProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const pendingTickets = getPendingTicketsCount();

  // Use the same navigation structure as desktop sidebar
  const navigationGroups = [
    {
      id: 'overview',
      label: t('admin.groups.overview'),
      items: [
        {
          name: t('admin.dashboard'),
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('admin.analytics'),
          href: "/admin/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'management',
      label: t('admin.groups.management'),
      items: [
        {
          name: t('admin.users'),
          href: "/admin/users",
          icon: Users,
        },
        {
          name: t('admin.requests'),
          href: "/admin/requests",
          icon: FileText,
        },
        {
          name: t('admin.offers'),
          href: "/admin/offers",
          icon: Package,
        },
        {
          name: t('admin.projects'),
          href: "/admin/projects", 
          icon: Building2,
        },
        {
          name: t('admin.orders'),
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          name: t('admin.verificationQueue'),
          href: "/admin/verification",
          icon: UserCheck,
        },
      ]
    },
    {
      id: 'business',
      label: t('admin.groups.business'),
      items: [
        {
          name: t('admin.financialTransactions'),
          href: "/admin/financial-transactions",
          icon: CreditCard,
        },
        {
          name: t('admin.subscriptions'),
          href: "/admin/subscriptions",
          icon: Crown,
        },
        {
          name: t('admin.supportTickets'),
          href: "/admin/support",
          icon: Ticket,
          badge: pendingTickets > 0 ? pendingTickets : undefined,
          badgeVariant: "destructive" as const,
        },
        {
          name: t('admin.communications'),
          href: "/admin/communications",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'system',
      label: t('admin.groups.system'),
      items: [
        {
          name: t('admin.categoryManagement'),
          href: "/admin/category-management",
          icon: FolderOpen,
        },
        {
          name: t('admin.expertConsultations'),
          href: "/admin/content/consultations",
          icon: HelpCircle,
        },
        {
          name: t('admin.settings'),
          href: "/admin/settings",
          icon: Settings,
        },
        {
          name: t('admin.profile'),
          href: "/admin/profile",
          icon: User,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/admin/dashboard';

  return (
    <div className="flex h-full flex-col bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="border-b border-border bg-background p-4">
        <AdminUserProfile variant="mobile" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.id} className="mb-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 font-medium">
              {group.label}
            </div>
            <div className="px-3">
              {group.items.map((item) => {
                const active = isActive(item.href) || isParentActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href} 
                    className={cn(
                      "flex items-center gap-3 w-full h-11 px-3 mb-1.5 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50",
                      active && "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    )}
                    onClick={onItemClick}
                    aria-label={`${t('admin.navigateTo')} ${item.name}`}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-primary" : "text-neutral-600"
                    )} />
                    <span className="truncate flex-1 text-sm font-medium">
                      {item.name}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant={item.badgeVariant || "secondary"} 
                        className={cn(
                          "h-5 min-w-5 px-1.5 text-xs flex items-center justify-center shrink-0",
                          item.badgeVariant === "destructive" && "animate-pulse"
                        )}
                      >
                        {item.badge > 99 ? t('admin.badgeMax') : item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};