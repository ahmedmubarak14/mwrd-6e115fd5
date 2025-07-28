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
    <div className="space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white rounded-2xl p-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">{t('dashboard.welcome')}</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">{t('dashboard.subtitle')}</p>
          <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 shadow-lg hover-scale">
            <Plus className="h-5 w-5 mr-2" />
            {t('dashboard.createRequest')}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {t('dashboard.createRequest')}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Post a new service request and get offers from suppliers
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-4">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-xl">
              {t('dashboard.viewRequests')}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              View and manage your existing service requests
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-4">
              <Users className="h-8 w-8 text-lime" />
            </div>
            <CardTitle className="text-xl">
              {t('dashboard.browseSuppliers')}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Discover vetted suppliers for your events
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Enhanced Recent Requests */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Recent Service Requests</CardTitle>
          <CardDescription className="text-base">Your latest service requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-background/50">
                <div>
                  <h4 className="font-semibold text-lg">{request.title}</h4>
                  <p className="text-muted-foreground">{request.offers} offers received</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    request.status === 'active' ? 'bg-lime/20 text-lime-foreground border border-lime/20' :
                    request.status === 'pending' ? 'bg-accent/20 text-accent-foreground border border-accent/20' :
                    'bg-primary/20 text-primary-foreground border border-primary/20'
                  }`}>
                    {request.status}
                  </span>
                  <Button variant="outline" size="sm" className="hover-scale">
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