import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, FileText, Clock, Eye } from "lucide-react";

export const Requests = () => {
  const { t } = useLanguage();

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
      <Header />
      <div className="flex">
        <Sidebar userRole="client" />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{t('nav.requests')}</h1>
                <p className="text-muted-foreground">Manage your service requests and track offers</p>
              </div>
              <Button className="bg-lime hover:bg-lime/90 text-black font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                {t('request.create')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">3</CardTitle>
                  <CardDescription>Active Requests</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">8</CardTitle>
                  <CardDescription>Total Offers Received</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">2</CardTitle>
                  <CardDescription>Completed Projects</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Requests List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Requests
                </CardTitle>
                <CardDescription>All your service requests and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{request.title}</h3>
                          <p className="text-muted-foreground">{request.category}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Budget:</span>
                          <p className="font-medium text-lime">{request.budget}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Deadline:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {request.deadline}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Offers:</span>
                          <p className="font-medium">{request.offers} received</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.view')}
                        </Button>
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            {t('common.edit')}
                          </Button>
                        )}
                        {request.offers > 0 && (
                          <Button size="sm" variant="outline">
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