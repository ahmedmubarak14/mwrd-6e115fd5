
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const { t, isRTL } = useLanguage();

  const tabs = [
    {
      value: "overview",
      label: t('dashboard.overview') || 'Overview',
      title: t('dashboard.rfqPerformance') || 'RFQ Performance',
      description: t('dashboard.recentActivity') || 'Recent RFQ activity and status',
      content: t('dashboard.noDataAvailable') || 'No data available for RFQ performance.'
    },
    {
      value: "requests",
      label: t('requests.title') || 'Requests',
      title: t('requests.title') || 'Requests',
      description: t('requests.manageRequests') || 'Manage and track your service requests',
      content: t('requests.noRequests') || 'No requests found.',
      hasAction: true,
      actionLabel: t('requests.createRequest') || 'Create Request'
    },
    {
      value: "suppliers",
      label: t('suppliers.title') || 'Suppliers',
      title: t('suppliers.title') || 'Suppliers',
      description: t('suppliers.findManage') || 'Find and manage your preferred suppliers',
      content: t('suppliers.noSuppliers') || 'No suppliers found.'
    },
    {
      value: "orders",
      label: t('orders.title') || 'Orders',
      title: t('orders.title') || 'Orders',
      description: t('orders.trackManage') || 'Track and manage your orders',
      content: t('orders.noOrders') || 'No orders found.'
    }
  ];

  return (
    <Tabs value={activeTab} className="space-y-4" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          <Card>
            <CardHeader>
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CardTitle>{tab.title}</CardTitle>
                {tab.hasAction && (
                  <Button size="sm" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Plus className="h-4 w-4" />
                    {tab.actionLabel}
                  </Button>
                )}
              </div>
              <CardDescription>
                {tab.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {tab.content}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
