import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText, Users, TrendingUp, Package, Banknote, Star, Eye, Clock } from "lucide-react";

export const ClientDashboard = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();

  // Universal stats that work for both clients and suppliers
  const stats = userProfile?.role === 'supplier' ? [
    { title: "Active Offers", value: "12", icon: Package, color: "text-primary" },
    { title: "Monthly Revenue", value: "92,000 ر.س", icon: Banknote, color: "text-lime" },
    { title: "Success Rate", value: "85%", icon: TrendingUp, color: "text-primary" },
    { title: "Client Rating", value: "4.8", icon: Star, color: "text-lime" }
  ] : [
    { title: "Active Requests", value: "3", icon: FileText, color: "text-primary" },
    { title: "Pending Offers", value: "8", icon: TrendingUp, color: "text-lime" },
    { title: "Suppliers Connected", value: "12", icon: Users, color: "text-primary" }
  ];

  // Universal recent items that work for both user types
  const recentItems = userProfile?.role === 'supplier' ? [
    { id: 1, title: "Wedding Photography Package", description: "Happy Events Co.", value: "9,400 ر.س", status: "pending" },
    { id: 2, title: "Corporate Meeting Setup", description: "Tech Solutions Ltd.", value: "6,800 ر.س", status: "accepted" },
    { id: 3, title: "Exhibition Booth Furniture", description: "Global Exhibitions", value: "15,800 ر.س", status: "in_progress" }
  ] : [
    { id: 1, title: "AVL Equipment for Conference", status: "pending", value: "3 offers" },
    { id: 2, title: "Catering Services", status: "active", value: "5 offers" },
    { id: 3, title: "Booth Design & Setup", status: "completed", value: "2 offers" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3">{t('dashboard.welcome')}</h1>
          <p className="text-sm sm:text-base lg:text-xl opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl leading-relaxed">
            {userProfile?.role === 'supplier' 
              ? 'Manage your offers, connect with clients, and grow your business' 
              : t('dashboard.subtitle')
            }
          </p>
          <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover-scale w-full sm:w-auto text-sm sm:text-base">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {userProfile?.role === 'supplier' ? 'Create New Offer' : t('dashboard.createRequest')}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Quick Actions - Universal for both user types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {userProfile?.role === 'supplier' ? (
          <>
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Create New Offer</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Submit offers for client requests and grow your business
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">My Offers</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Track and manage all your submitted offers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-lime" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Browse Requests</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Find new opportunities and submit offers
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        ) : (
          <>
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.createRequest')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Post a new service request and get offers from suppliers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.viewRequests')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  View and manage your existing service requests
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-lime" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.browseSuppliers')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Discover vetted suppliers for your events
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced Recent Items - Universal for both user types */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            {userProfile?.role === 'supplier' ? 'Recent Offers' : 'Recent Service Requests'}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {userProfile?.role === 'supplier' 
              ? 'Your latest offers and their current status' 
              : 'Your latest service requests and their status'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {recentItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 lg:p-6 border rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 bg-background/50 gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{item.title}</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                    {userProfile?.role === 'supplier' ? item.description : `${item.value}`}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${
                    item.status === 'active' || item.status === 'accepted' || item.status === 'in_progress' 
                      ? 'bg-lime/20 text-lime-foreground border border-lime/20' :
                    item.status === 'pending' 
                      ? 'bg-accent/20 text-accent-foreground border border-accent/20' :
                    'bg-primary/20 text-primary-foreground border border-primary/20'
                  }`}>
                    {item.status === 'in_progress' ? 'In Progress' : item.status}
                  </span>
                  <Button variant="outline" size="sm" className="hover-scale w-full sm:w-auto text-xs sm:text-sm">
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