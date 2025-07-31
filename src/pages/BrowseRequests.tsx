import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Search, MapPin, Calendar, DollarSign, Clock, Star, Eye, Filter } from "lucide-react";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

export const BrowseRequests = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const { toast } = useToast();

  const requests = [
    {
      id: "1",
      title: "Professional Audio Equipment for Corporate Event",
      category: "Audio, Visual & Lighting",
      location: "Riyadh",
      budget: "15,000 - 20,000 SAR",
      deadline: "March 15, 2024",
      urgency: "High",
      client: "TechCorp Solutions",
      clientRating: 4.8,
      offers: 5,
      description: "Need high-quality audio equipment for a 500-person corporate conference including microphones, speakers, and mixing board.",
      status: "Open",
      postedDate: "Feb 20, 2024"
    },
    {
      id: "2", 
      title: "Catering Services for Wedding Reception",
      category: "Catering & Food Services",
      location: "Jeddah",
      budget: "25,000 - 30,000 SAR",
      deadline: "April 10, 2024",
      urgency: "Medium",
      client: "Happy Events Co.",
      clientRating: 4.9,
      offers: 8,
      description: "Traditional Saudi cuisine for 200 guests with vegetarian options and dessert station.",
      status: "Open",
      postedDate: "Feb 25, 2024"
    },
    {
      id: "3",
      title: "Photography & Videography for Product Launch",
      category: "Photography & Videography", 
      location: "Dammam",
      budget: "12,000 - 15,000 SAR",
      deadline: "March 20, 2024",
      urgency: "Medium",
      client: "Innovation Hub",
      clientRating: 4.7,
      offers: 3,
      description: "Professional photo and video coverage of new product launch event with drone footage.",
      status: "Open",
      postedDate: "Feb 18, 2024"
    },
    {
      id: "4",
      title: "Booth Design & Construction for Trade Show",
      category: "Booth Design",
      location: "Riyadh",
      budget: "30,000 - 45,000 SAR",
      deadline: "April 1, 2024",
      urgency: "High",
      client: "Global Exhibitions",
      clientRating: 4.6,
      offers: 12,
      description: "Custom booth design and construction for major international trade show with interactive displays.",
      status: "Open",
      postedDate: "Feb 28, 2024"
    },
    {
      id: "5",
      title: "Event Security & Crowd Management",
      category: "Security Services",
      location: "Mecca",
      budget: "18,000 - 25,000 SAR",
      deadline: "March 30, 2024",
      urgency: "High",
      client: "SafeEvents Ltd",
      clientRating: 4.5,
      offers: 6,
      description: "Professional security team for large outdoor festival with crowd control expertise.",
      status: "Open",
      postedDate: "Feb 22, 2024"
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

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        request.title.toLowerCase().includes(searchLower) ||
        request.category.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.client.toLowerCase().includes(searchLower) ||
        request.location.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;

      // Location filter
      const matchesLocation = locationFilter === "all" || request.location === locationFilter;

      // Urgency filter
      const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;

      return matchesSearch && matchesCategory && matchesLocation && matchesUrgency;
    });
  }, [requests, searchTerm, categoryFilter, locationFilter, urgencyFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'supplier'} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role || 'supplier'} />
        </div>
        
        <main className="flex-1 p-4 lg:p-8 max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Enhanced Header with gradient background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Browse Service Requests</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Find requests that match your expertise and submit your offers</p>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  Search & Filter Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Find the perfect requests for your services</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by title, category, client, or location..."
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filter selects */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Audio, Visual & Lighting">Audio, Visual & Lighting</SelectItem>
                        <SelectItem value="Catering & Food Services">Catering & Food Services</SelectItem>
                        <SelectItem value="Photography & Videography">Photography & Videography</SelectItem>
                        <SelectItem value="Booth Design">Booth Design</SelectItem>
                        <SelectItem value="Security Services">Security Services</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Riyadh">Riyadh</SelectItem>
                        <SelectItem value="Jeddah">Jeddah</SelectItem>
                        <SelectItem value="Dammam">Dammam</SelectItem>
                        <SelectItem value="Mecca">Mecca</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgency Levels</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="Low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                </div>
              ) : (
                filteredRequests.map((request) => (
                <Card key={request.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale overflow-hidden">
                  {/* Request card header with better visual hierarchy */}
                  <CardHeader className="relative p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-2">{request.title}</CardTitle>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-primary font-medium text-sm">{request.category}</span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{request.location}</span>
                          </div>
                        </div>
                        
                        {/* Client info */}
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{request.client.charAt(0)}</span>
                            </div>
                            <span className="font-medium">{request.client}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{request.clientRating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getUrgencyColor(request.urgency) as any} className="text-xs">
                          {request.urgency}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{request.postedDate}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Description */}
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                      {request.description}
                    </p>
                    
                    {/* Details in attractive boxes */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg border border-lime/10">
                        <DollarSign className="h-4 w-4 text-lime" />
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-semibold text-sm text-lime">{request.budget}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/10">
                        <Calendar className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-semibold text-sm">{request.deadline}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <Eye className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Offers</p>
                          <p className="font-semibold text-sm">{request.offers} submitted</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Posted</p>
                          <p className="font-semibold text-sm">{request.postedDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <ViewDetailsModal 
                        item={{
                          id: parseInt(request.id),
                          title: request.title,
                          description: request.description,
                          value: request.budget,
                          status: request.status
                        }}
                        userRole="supplier"
                      >
                        <Button variant="outline" className="flex-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover-scale">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </ViewDetailsModal>
                      
                      <CreateOfferModal>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover-scale">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Submit Offer
                        </Button>
                      </CreateOfferModal>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};