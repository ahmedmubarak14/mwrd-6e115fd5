import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, FileText, Users, TrendingUp } from "lucide-react";

export const ClientDashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { title: "Active Requests", value: "3", icon: FileText, color: "text-primary" },
    { title: "Pending Offers", value: "8", icon: TrendingUp, color: "text-lime" },
    { title: "Suppliers Connected", value: "12", icon: Users, color: "text-primary" }
  ];

  const recentRequests = [
    { id: 1, title: "AVL Equipment for Conference", status: "pending", offers: 3 },
    { id: 2, title: "Catering Services", status: "active", offers: 5 },
    { id: 3, title: "Booth Design & Setup", status: "completed", offers: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-xl opacity-90 mb-6">{t('dashboard.subtitle')}</p>
        <Button className="bg-lime hover:bg-lime/90 text-black font-semibold">
          <Plus className="h-5 w-5 mr-2" />
          {t('dashboard.createRequest')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {t('dashboard.createRequest')}
            </CardTitle>
            <CardDescription>
              Post a new service request and get offers from suppliers
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('dashboard.viewRequests')}
            </CardTitle>
            <CardDescription>
              View and manage your existing service requests
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('dashboard.browseSuppliers')}
            </CardTitle>
            <CardDescription>
              Discover vetted suppliers for your events
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Service Requests</CardTitle>
          <CardDescription>Your latest service requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{request.title}</h4>
                  <p className="text-sm text-muted-foreground">{request.offers} offers received</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'active' ? 'bg-lime/20 text-lime-foreground' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                  <Button variant="outline" size="sm">
                    {t('common.view')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};