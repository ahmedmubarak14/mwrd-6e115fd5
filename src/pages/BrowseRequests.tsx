import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";

export const BrowseRequests = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const requests = [
    {
      id: "1",
      title: "Professional Audio Equipment for Corporate Event",
      category: "Audio, Visual & Lighting",
      location: "Riyadh, Saudi Arabia",
      budget: "15,000 SAR",
      deadline: "March 15, 2024",
      urgency: "High",
      client: "TechCorp Solutions",
      clientRating: "4.8",
      offers: 5,
      description: "Need high-quality audio equipment for a 500-person corporate conference including microphones, speakers, and mixing board.",
      status: "Open"
    },
    {
      id: "2", 
      title: "Catering Services for Wedding Reception",
      category: "Catering & Food Services",
      location: "Jeddah, Saudi Arabia",
      budget: "25,000 SAR",
      deadline: "April 10, 2024",
      urgency: "Medium",
      client: "Happy Events Co.",
      clientRating: "4.9",
      offers: 8,
      description: "Traditional Saudi cuisine for 200 guests with vegetarian options and dessert station.",
      status: "Open"
    },
    {
      id: "3",
      title: "Photography & Videography for Product Launch",
      category: "Photography & Videography", 
      location: "Dammam, Saudi Arabia",
      budget: "12,000 SAR",
      deadline: "March 20, 2024",
      urgency: "Medium",
      client: "Innovation Hub",
      clientRating: "4.7",
      offers: 3,
      description: "Professional photo and video coverage of new product launch event with drone footage.",
      status: "Open"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <div className="flex">
        <Sidebar userRole={userProfile?.role as any} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-3xl font-bold mb-2">
                {isRTL ? "تصفح الطلبات" : "Browse Requests"}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? "اعثر على طلبات تناسب خبرتك وقدم عروضك" : "Find requests that match your expertise and submit your offers"}
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isRTL ? "ابحث في الطلبات..." : "Search requests..."}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "الفئة" : "Category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audio">Audio, Visual & Lighting</SelectItem>
                      <SelectItem value="catering">Catering & Food Services</SelectItem>
                      <SelectItem value="photography">Photography & Videography</SelectItem>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "الأولوية" : "Urgency"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                        <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                      </div>
                      <Badge variant={getUrgencyColor(request.urgency) as any}>
                        {request.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm text-muted-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {request.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.budget}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{isRTL ? "الموعد النهائي:" : "Deadline:"} {request.deadline}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{request.offers} {isRTL ? "عروض" : "offers"}</span>
                      </div>
                    </div>

                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ViewDetailsModal 
                        item={{
                          id: parseInt(request.id),
                          title: request.title,
                          value: request.budget,
                          status: request.status
                        }}
                        userRole="supplier"
                      >
                        <Button variant="outline" size="sm" className="flex-1">
                          {isRTL ? "عرض التفاصيل" : "View Details"}
                        </Button>
                      </ViewDetailsModal>
                      
                      <CreateOfferModal>
                        <Button size="sm" className="flex-1">
                          {isRTL ? "إرسال عرض" : "Submit Offer"}
                        </Button>
                      </CreateOfferModal>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};