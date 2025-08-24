
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProcurementRequestForm } from "@/components/procurement/ProcurementRequestForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, FileText, Calendar, MapPin, Clock, Package, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Mock data for demonstration
const mockRequests = [
  {
    id: '1',
    title: 'Office Furniture Procurement',
    description: 'Need office chairs, desks, and filing cabinets for new branch office',
    category: 'Office Equipment',
    budget: '$15,000',
    deadline: '2024-02-15',
    status: 'open',
    location: 'Riyadh, Saudi Arabia',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'IT Equipment Purchase',
    description: 'Laptops, monitors, and networking equipment for IT department',
    category: 'Technology',
    budget: '$25,000',
    deadline: '2024-02-28',
    status: 'in_progress',
    location: 'Jeddah, Saudi Arabia',
    created_at: '2024-01-10',
  },
];

const ProcurementRequests = () => {
  const { t, language } = useLanguage();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading] = useState(false);
  const isRTL = language === 'ar';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('procurement.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('procurement.description')}
            </p>
          </div>
          
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('procurement.createNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('procurement.createNew')}</DialogTitle>
              </DialogHeader>
              <ProcurementRequestForm 
                onSuccess={() => setCreateModalOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockRequests.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight">{request.title}</CardTitle>
                  <Badge variant={
                    request.status === 'open' ? 'default' :
                    request.status === 'in_progress' ? 'secondary' : 'outline'
                  }>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {request.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{request.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-foreground">{request.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>
                      Deadline: {format(new Date(request.deadline), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Created: {format(new Date(request.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('procurement.noRequests')}</h3>
            <p className="text-muted-foreground mb-4">{t('procurement.createFirst')}</p>
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('procurement.createNew')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('procurement.createNew')}</DialogTitle>
                </DialogHeader>
                <ProcurementRequestForm 
                  onSuccess={() => setCreateModalOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProcurementRequests;
