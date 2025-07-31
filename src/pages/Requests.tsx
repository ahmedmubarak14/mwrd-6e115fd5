import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, FileText, Clock, Eye } from "lucide-react";
import { useState } from "react";

export const Requests = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const requests = [
    { 
      id: 1, 
      title: "Conference AVL Equipment", 
      category: "AVL", 
      status: "active", 
      offers: 3, 
      budget: "18,800 - 30,000",
      deadline: "Mar 20, 2024"
    },
    { 
      id: 2, 
      title: "Corporate Event Catering", 
      category: "Hospitality", 
      status: "pending", 
      offers: 0, 
      budget: "11,300 - 18,800",
      deadline: "Mar 25, 2024"
    },
    { 
      id: 3, 
      title: "Trade Show Booth Setup", 
      category: "Booth Stands", 
      status: "completed", 
      offers: 5, 
      budget: "37,500 - 56,300",
      deadline: "Mar 15, 2024"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-lime/20 text-lime-foreground';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'client'} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role || 'client'} />
        </div>
        
        <main className="flex-1 p-4 lg:p-8 max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Enhanced Header with gradient background like dashboard */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('nav.requests')}</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Manage your service requests and track offers</p>
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-3 shadow-lg hover-scale w-full sm:w-auto">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {t('request.create')}
                </Button>
              </div>
            </div>

            {/* Enhanced Stats - Dashboard style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Requests</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">3</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">8</div>
                  <p className="text-xs text-muted-foreground mt-1">Received this month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">2</div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Requests List - More user-friendly */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Your Service Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Track and manage all your requests in one place</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {requests.map((request, index) => (
                    <div key={request.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-all duration-200">
                      {/* Mobile-first layout */}
                      <div className="space-y-4">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-12 rounded-full ${
                                request.status === 'active' ? 'bg-lime' :
                                request.status === 'pending' ? 'bg-accent' : 'bg-primary'
                              }`}></div>
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-1">{request.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{request.category}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-5">
                          <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg">
                          <div className="flex items-center gap-1">
                            <span className="text-lime text-lg font-bold">{request.budget}</span>
                            <img 
                              src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                              alt="SAR" 
                              className="h-4 w-4 opacity-80"
                            />
                          </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                            <Clock className="h-4 w-4 text-accent" />
                            <div>
                              <p className="text-xs text-muted-foreground">Deadline</p>
                              <p className="font-semibold text-sm">{request.deadline}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                            <Eye className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Offers</p>
                              <p className="font-semibold text-sm">{request.offers} received</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pl-5">
                          <Button size="sm" className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent hover-scale">
                            <Eye className="h-4 w-4 mr-2" />
                            {t('common.view')}
                          </Button>
                          {request.status === 'pending' && (
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-initial hover-scale">
                              {t('common.edit')}
                            </Button>
                          )}
                          {request.offers > 0 && (
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-initial bg-lime/10 border-lime/20 text-lime hover:bg-lime/20 hover-scale">
                              View Offers ({request.offers})
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};