import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Star, MapPin, Eye, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Suppliers = () => {
  const { t } = useLanguage();

  const suppliers = [
    {
      id: 1,
      name: "Elite Events Co.",
      category: "AVL (Audio-Visual-Lighting)",
      rating: 4.8,
      reviews: 24,
      location: "Dubai, UAE",
      description: "Professional audio-visual and lighting solutions for corporate events and exhibitions.",
      completedProjects: 150,
      responseTime: "2 hours"
    },
    {
      id: 2,
      name: "Premium Catering Services",
      category: "Hospitality",
      rating: 4.9,
      reviews: 18,
      location: "Abu Dhabi, UAE",
      description: "High-quality catering services for corporate events, conferences, and exhibitions.",
      completedProjects: 200,
      responseTime: "1 hour"
    },
    {
      id: 3,
      name: "Creative Booth Designs",
      category: "Booth Stands",
      rating: 4.7,
      reviews: 32,
      location: "Dubai, UAE",
      description: "Custom booth design and construction for trade shows and exhibitions.",
      completedProjects: 120,
      responseTime: "3 hours"
    },
    {
      id: 4,
      name: "PrintMaster Pro",
      category: "Printing",
      rating: 4.6,
      reviews: 45,
      location: "Sharjah, UAE",
      description: "Complete printing solutions including banners, brochures, and promotional materials.",
      completedProjects: 300,
      responseTime: "30 minutes"
    }
  ];

  const categories = [
    "All Categories",
    "AVL (Audio-Visual-Lighting)",
    "Booth Stands",
    "Printing",
    "Furniture",
    "Equipment",
    "Giveaways",
    "Logistics",
    "Hospitality",
    "Manpower"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar userRole="client" />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">{t('nav.suppliers')}</h1>
              <p className="text-muted-foreground">Discover vetted service providers for your events</p>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search suppliers by name, category, or location..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select className="px-3 py-2 border rounded-md bg-background">
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border rounded-md bg-background">
                    <option>All Locations</option>
                    <option>Dubai</option>
                    <option>Abu Dhabi</option>
                    <option>Sharjah</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{supplier.name}</CardTitle>
                        <CardDescription className="text-primary font-medium">
                          {supplier.category}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{supplier.rating}</span>
                          <span className="text-sm text-muted-foreground">({supplier.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          {supplier.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{supplier.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completed Projects:</span>
                        <p className="font-semibold">{supplier.completedProjects}+</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <p className="font-semibold text-lime">{supplier.responseTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Suppliers
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};