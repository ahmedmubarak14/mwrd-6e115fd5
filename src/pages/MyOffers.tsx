import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Clock, Package } from "lucide-react";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const MyOffers = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const offers = [
    {
      id: "1",
      title: "Professional Audio Equipment Package",
      requestTitle: "Corporate Event Audio Setup",
      client: "TechCorp Solutions",
      price: "14,500 SAR",
      status: "Pending",
      submittedDate: "March 8, 2024",
      deliveryTime: "2 days",
      description: "Complete audio equipment package including wireless microphones, speakers, and mixing console for 500-person event.",
      location: "Riyadh, Saudi Arabia"
    },
    {
      id: "2",
      title: "Wedding Catering Service",
      requestTitle: "Traditional Saudi Wedding Reception",
      client: "Happy Events Co.",
      price: "23,000 SAR",
      status: "Accepted",
      submittedDate: "March 5, 2024",
      deliveryTime: "1 day",
      description: "Traditional Saudi cuisine for 200 guests with dessert station and tea service.",
      location: "Jeddah, Saudi Arabia"
    },
    {
      id: "3",
      title: "Product Launch Photography",
      requestTitle: "Tech Product Launch Coverage",
      client: "Innovation Hub",
      price: "11,500 SAR",
      status: "Completed",
      submittedDate: "February 28, 2024",
      deliveryTime: "Same day",
      description: "Professional photography and videography with drone footage for product launch event.",
      location: "Dammam, Saudi Arabia"
    },
    {
      id: "4",
      title: "Event Booth Design",
      requestTitle: "Trade Show Booth Setup",
      client: "Global Tech",
      price: "8,500 SAR",
      status: "Rejected",
      submittedDate: "March 1, 2024",
      deliveryTime: "3 days",
      description: "Custom booth design and setup for international trade show with interactive displays.",
      location: "Riyadh, Saudi Arabia"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "default";
      case "Accepted": return "default";
      case "Completed": return "default";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return Clock;
      case "Accepted": return Package;
      case "Completed": return Package;
      case "Rejected": return Package;
      default: return Package;
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto">
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-3xl font-bold mb-2">
                {isRTL ? "عروضي" : "My Offers"}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? "تتبع حالة عروضك وإدارة مشاريعك" : "Track your offer status and manage your projects"}
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isRTL ? "ابحث في العروض..." : "Search offers..."}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "الموقع" : "Location"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">Riyadh</SelectItem>
                      <SelectItem value="jeddah">Jeddah</SelectItem>
                      <SelectItem value="dammam">Dammam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {offers.map((offer) => {
                const StatusIcon = getStatusIcon(offer.status);
                return (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <CardTitle className="text-lg mb-1">{offer.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mb-2">
                            {isRTL ? "للطلب:" : "For:"} {offer.requestTitle}
                          </p>
                          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <MapPin className="h-4 w-4" />
                            <span>{offer.location}</span>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(offer.status) as any} className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <StatusIcon className="h-3 w-3" />
                          {offer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {offer.description}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-lg">{offer.price}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{isRTL ? "تاريخ الإرسال:" : "Submitted:"} {offer.submittedDate}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{isRTL ? "وقت التسليم:" : "Delivery:"} {offer.deliveryTime}</span>
                        </div>
                      </div>

                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ViewDetailsModal 
                          item={{
                            id: parseInt(offer.id),
                            title: offer.title,
                            value: offer.price,
                            status: offer.status
                          }}
                          userRole="supplier"
                        >
                          <Button variant="outline" size="sm" className="flex-1">
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </Button>
                        </ViewDetailsModal>
                        
                        {offer.status === "Pending" && (
                          <Button variant="destructive" size="sm" className="flex-1">
                            {isRTL ? "سحب العرض" : "Withdraw Offer"}
                          </Button>
                        )}
                        
                        {offer.status === "Accepted" && (
                          <Button size="sm" className="flex-1">
                            {isRTL ? "بدء المشروع" : "Start Project"}
                          </Button>
                        )}
                        
                        {offer.status === "Completed" && (
                          <Button variant="outline" size="sm" className="flex-1">
                            {isRTL ? "عرض الفاتورة" : "View Invoice"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};