import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Home, 
  FileText, 
  Package, 
  MessageSquare, 
  User, 
  Settings, 
  Shield, 
  Users,
  Building2,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Search,
  Bell,
  HelpCircle,
  Briefcase,
  Award,
  ShoppingCart,
  DollarSign,
  Calendar,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  userProfile?: any;
}

export const Sidebar = ({ userRole = 'client', userProfile }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { language, t } = useLanguage();
  const [quickActionsOpen, setQuickActionsOpen] = useState(true);
  const [exploreOpen, setExploreOpen] = useState(true);
  const isRTL = language === 'ar';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        label: t('dashboard.dashboard'),
        icon: Home,
        path: '/dashboard',
        badge: null
      }
    ];

    if (userRole === 'admin') {
      return [
        ...baseItems,
        {
          label: t('dashboard.users'),
          icon: Users,
          path: '/admin/users',
          badge: null
        },
        {
          label: t('dashboard.requests'),
          icon: FileText,
          path: '/admin/requests',
          badge: null
        },
        {
          label: t('dashboard.offers'),
          icon: Package,
          path: '/admin/offers',
          badge: null
        },
        {
          label: t('dashboard.analytics'),
          icon: BarChart3,
          path: '/admin/analytics',
          badge: null
        }
      ];
    }

    if (userRole === 'vendor' || userRole === 'procurement_vendor') {
      return [
        ...baseItems,
        {
          label: t('dashboard.requests'),
          icon: FileText,
          path: '/browse-requests',
          badge: null
        },
        {
          label: t('dashboard.myOffers'),
          icon: Package,
          path: '/my-offers',
          badge: null
        },
        {
          label: t('dashboard.orders'),
          icon: ShoppingCart,
          path: '/orders',
          badge: null
        },
        {
          label: t('dashboard.messages'),
          icon: MessageSquare,
          path: '/enhanced-messages',
          badge: null
        }
      ];
    }

    return [
      ...baseItems,
      {
        label: t('dashboard.requests'),
        icon: FileText,
        path: '/requests',
        badge: null
      },
      {
        label: t('dashboard.offers'),
        icon: Package,
        path: '/offers',
        badge: null
      },
      {
        label: t('dashboard.projects'),
        icon: Briefcase,
        path: '/projects',
        badge: null
      },
      {
        label: t('dashboard.vendors'),
        icon: Building2,
        path: '/vendors',
        badge: null
      },
      {
        label: t('dashboard.messages'),
        icon: MessageSquare,
        path: '/enhanced-messages',
        badge: null
      }
    ];
  };

  const navigationItems = getNavigationItems();

  const quickActions = [
    {
      label: t('dashboard.createRequest'),
      icon: PlusCircle,
      onClick: () => navigate('/requests/create')
    },
    {
      label: t('dashboard.searchRequests'),
      icon: Search,
      onClick: () => navigate('/browse-requests')
    },
    {
      label: t('dashboard.notifications'),
      icon: Bell,
      onClick: () => navigate('/notifications')
    }
  ];

  const exploreSections = [
    {
      title: t('dashboard.resources'),
      items: [
        {
          label: t('dashboard.helpCenter'),
          icon: HelpCircle,
          onClick: () => navigate('/help-center')
        },
        {
          label: t('dashboard.communityForum'),
          icon: Users,
          onClick: () => navigate('/community-forum')
        }
      ]
    },
    {
      title: t('dashboard.legal'),
      items: [
        {
          label: t('dashboard.termsOfService'),
          icon: FileText,
          onClick: () => navigate('/terms-of-service')
        },
        {
          label: t('dashboard.privacyPolicy'),
          icon: Shield,
          onClick: () => navigate('/privacy-policy')
        }
      ]
    }
  ];

  return (
    <div className={`w-64 flex-shrink-0 border-r border-border bg-secondary/5 text-secondary-foreground flex flex-col h-screen`}>
      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            {t('dashboard.menu')}
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start ${isActive(item.path) ? 'font-semibold' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <Separator />

        <div className="px-3 py-2">
          <Collapsible open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1">
              {t('dashboard.quickActions')}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${quickActionsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={action.onClick}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator />

        <div className="px-3 py-2">
          <Collapsible open={exploreOpen} onOpenChange={setExploreOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1">
              {t('dashboard.explore')}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {exploreSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h3 className="px-4 text-xs font-semibold text-muted-foreground">{section.title}</h3>
                  {section.items.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={item.onClick}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={() => logout()}>
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
};
