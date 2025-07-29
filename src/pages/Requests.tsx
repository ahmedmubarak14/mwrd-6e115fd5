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
      budget: "$5,000 - $8,000",
      deadline: "Mar 20, 2024"
    },
    { 
      id: 2, 
      title: "Corporate Event Catering", 
      category: "Hospitality", 
      status: "pending", 
      offers: 0, 
      budget: "$3,000 - $5,000",
      deadline: "Mar 25, 2024"
    },
    { 
      id: 3, 
      title: "Trade Show Booth Setup", 
      category: "Booth Stands", 
      status: "completed", 
      offers: 5, 
      budget: "$10,000 - $15,000",
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
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-full overflow-hidden">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('nav.requests')}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Manage your service requests and track offers</p>
              </div>
              <Button className="bg-lime hover:bg-lime/90 text-black font-semibold w-full sm:w-auto">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t('request.create')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <Card className="border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl">3</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Active Requests</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl">8</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Total Offers Received</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 bg-card/70 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl">2</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Completed Projects</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Requests List */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Your Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">All your service requests and their current status</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold truncate">{request.title}</h3>
                          <p className="text-muted-foreground text-sm sm:text-base">{request.category}</p>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div>
                          <span className="text-xs sm:text-sm text-muted-foreground">Budget:</span>
                          <p className="font-medium text-lime text-sm sm:text-base">{request.budget}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm text-muted-foreground">Deadline:</span>
                          <p className="font-medium flex items-center gap-1 text-sm sm:text-base">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            {request.deadline}
                          </p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <span className="text-xs sm:text-sm text-muted-foreground">Offers:</span>
                          <p className="font-medium text-sm sm:text-base">{request.offers} received</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          {t('common.view')}
                        </Button>
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
                            {t('common.edit')}
                          </Button>
                        )}
                        {request.offers > 0 && (
                          <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
                            View Offers ({request.offers})
                          </Button>
                        )}
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