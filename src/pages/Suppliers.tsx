import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Star, MapPin, Eye, MessageCircle, Clock, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";

export const Suppliers = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleContactSupplier = (supplierName: string) => {
    toast({
      title: "Contact Initiated",
      description: `A message has been sent to ${supplierName}. They will respond within their typical response time.`,
    });
  };

  const handleFilterClick = (category: string) => {
    toast({
      title: "Filter Applied",
      description: `Showing suppliers in: ${category}`,
    });
  };

  const suppliers = [
    {
      id: 1,
      name: "شركة الفعاليات المتميزة",
      category: "الصوت والصورة والإضاءة",
      rating: 4.8,
      reviews: 24,
      location: "الرياض، المملكة العربية السعودية",
      description: "حلول احترافية للصوت والصورة والإضاءة للفعاليات الشركاتية والمعارض في المملكة.",
      completedProjects: 150,
      responseTime: "ساعتان",
      englishName: "Elite Events Co.",
      englishCategory: "AVL (Audio-Visual-Lighting)",
      englishLocation: "Riyadh, Saudi Arabia",
      englishDescription: "Professional audio-visual and lighting solutions for corporate events and exhibitions.",
      englishResponseTime: "2 hours"
    },
    {
      id: 2,
      name: "خدمات الضيافة المتميزة",
      category: "الضيافة",
      rating: 4.9,
      reviews: 18,
      location: "جدة، المملكة العربية السعودية",
      description: "خدمات ضيافة عالية الجودة للفعاليات الشركاتية والمؤتمرات والمعارض.",
      completedProjects: 200,
      responseTime: "ساعة واحدة",
      englishName: "Premium Catering Services",
      englishCategory: "Hospitality",
      englishLocation: "Jeddah, Saudi Arabia",
      englishDescription: "High-quality catering services for corporate events, conferences, and exhibitions.",
      englishResponseTime: "1 hour"
    },
    {
      id: 3,
      name: "تصاميم الأكشاك الإبداعية",
      category: "أكشاك العرض",
      rating: 4.7,
      reviews: 32,
      location: "الدمام، المملكة العربية السعودية",
      description: "تصميم وإنشاء أكشاك مخصصة للمعارض التجارية والفعاليات في المملكة.",
      completedProjects: 120,
      responseTime: "3 ساعات",
      englishName: "Creative Booth Designs",
      englishCategory: "Booth Stands",
      englishLocation: "Dammam, Saudi Arabia",
      englishDescription: "Custom booth design and construction for trade shows and exhibitions.",
      englishResponseTime: "3 hours"
    },
    {
      id: 4,
      name: "مطبعة الخبراء المحترفة",
      category: "الطباعة",
      rating: 4.6,
      reviews: 45,
      location: "مكة المكرمة، المملكة العربية السعودية",
      description: "حلول طباعة شاملة تشمل اللافتات والكتيبات والمواد الترويجية.",
      completedProjects: 300,
      responseTime: "30 دقيقة",
      englishName: "PrintMaster Pro",
      englishCategory: "Printing",
      englishLocation: "Makkah, Saudi Arabia",
      englishDescription: "Complete printing solutions including banners, brochures, and promotional materials.",
      englishResponseTime: "30 minutes"
    }
  ];

  const categories = [
    "جميع الفئات",
    "الصوت والصورة والإضاءة",
    "أكشاك العرض",
    "الطباعة",
    "الأثاث",
    "المعدات",
    "الهدايا الترويجية",
    "اللوجستيات",
    "الضيافة",
    "العمالة"
  ];

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
            {/* Enhanced Header with gradient background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('nav.suppliers')}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Discover and connect with vetted service providers</p>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  Find Your Perfect Supplier
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Filter and search through our verified service providers</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by company name, services, or location..."
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  
                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      onClick={() => handleFilterClick("All Categories")}
                    >
                      All Categories
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-accent/10"
                      onClick={() => handleFilterClick("AVL Equipment")}
                    >
                      AVL Equipment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-lime/10"
                      onClick={() => handleFilterClick("Catering")}
                    >
                      Catering
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-accent/10"
                      onClick={() => handleFilterClick("Booth Design")}
                    >
                      Booth Design
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Suppliers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale overflow-hidden">
                  {/* Supplier card header with better visual hierarchy */}
                  <CardHeader className="relative p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start gap-4">
                      {/* Company avatar/logo placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <div className="text-white font-bold text-lg sm:text-xl">
                          {(t('language') === 'ar' ? supplier.name : supplier.englishName).charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl mb-1 line-clamp-1">
                          {t('language') === 'ar' ? supplier.name : supplier.englishName}
                        </CardTitle>
                        <CardDescription className="text-primary font-medium text-sm sm:text-base mb-2">
                          {t('language') === 'ar' ? supplier.category : supplier.englishCategory}
                        </CardDescription>
                        
                        {/* Rating and location */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{supplier.rating}</span>
                            <span className="text-muted-foreground">({supplier.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">
                              {t('language') === 'ar' ? supplier.location.split(',')[0] : supplier.englishLocation.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Description */}
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2">
                      {t('language') === 'ar' ? supplier.description : supplier.englishDescription}
                    </p>
                    
                    {/* Stats in attractive boxes */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg border border-lime/10">
                        <div className="w-8 h-8 bg-lime/20 rounded-lg flex items-center justify-center">
                          <div className="text-lime font-bold text-sm">✓</div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t('language') === 'ar' ? 'المشاريع' : 'Projects'}
                          </p>
                          <p className="font-semibold text-sm">{supplier.completedProjects}+</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/10">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t('language') === 'ar' ? 'الاستجابة' : 'Response'}
                          </p>
                          <p className="font-semibold text-sm text-accent">
                            {t('language') === 'ar' ? supplier.responseTime : supplier.englishResponseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <ViewDetailsModal 
                        item={{
                          id: supplier.id,
                          title: t('language') === 'ar' ? supplier.name : supplier.englishName,
                          description: t('language') === 'ar' ? supplier.description : supplier.englishDescription,
                          value: `${supplier.completedProjects}+ projects completed`,
                          status: "Active"
                        }}
                        userRole={userProfile?.role as any}
                      >
                        <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover-scale group-hover:shadow-xl transition-all duration-300">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </ViewDetailsModal>
                      <Button 
                        variant="outline" 
                        className="flex-1 sm:flex-initial bg-lime/10 border-lime/20 text-lime hover:bg-lime/20 hover-scale"
                        onClick={() => handleContactSupplier(t('language') === 'ar' ? supplier.name : supplier.englishName)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More with better styling */}
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover-scale"
                onClick={() => toast({
                  title: "Loading More Suppliers",
                  description: "Fetching additional suppliers in your area...",
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Load More Suppliers
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};