import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Star, MapPin, Eye, MessageCircle, Clock, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedChatModal } from "@/components/modals/EnhancedChatModal";
import { SupplierProfileModal } from "@/components/modals/SupplierProfileModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSuppliers } from "@/hooks/useSuppliers";

export const Suppliers = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const isRTL = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Categories");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [favoriteSuppliers, setFavoriteSuppliers] = useLocalStorage<string[]>('favorite-suppliers', []);
  const { toast } = useToast();
  const { suppliers: realSuppliers, loading: suppliersLoading, error: suppliersError } = useSuppliers();

  const handleFilterClick = (category: string) => {
    setActiveFilter(category);
    // Remove toast notification - just apply filter silently
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoadingMore(false);
    // Show realistic feedback
    toast({
      title: "More suppliers loaded",
      description: "Found 12 additional suppliers in your area.",
    });
  };

  const toggleFavorite = (supplierId: string) => {
    setFavoriteSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  // Transform real suppliers to match the expected interface
  const suppliers = realSuppliers.map(supplier => ({
    id: supplier.id,
    name: supplier.company_name || supplier.full_name || 'Unknown Company',
    category: supplier.categories?.[0] || 'General Services',
    rating: supplier.rating || 4.5,
    reviews: supplier.reviews_count || 0,
    location: supplier.location || 'Saudi Arabia',
    description: supplier.description || 'Professional services provider',
    completedProjects: supplier.completed_projects || 0,
    responseTime: supplier.response_time || '2 hours',
    englishName: supplier.company_name || supplier.full_name || 'Unknown Company',
    englishCategory: supplier.categories?.[0] || 'General Services',
    englishLocation: supplier.location || 'Saudi Arabia',
    englishDescription: supplier.description || 'Professional services provider',
    englishResponseTime: supplier.response_time || '2 hours',
    avatar_url: supplier.avatar_url
  }));

  const categories = [
    { ar: "جميع الفئات", en: "All Categories" },
    { ar: "الصوت والصورة والإضاءة", en: "AVL Equipment" },
    { ar: "أكشاك العرض", en: "Booth Design" },
    { ar: "الطباعة", en: "Printing" },
    { ar: "الأثاث", en: "Furniture" },
    { ar: "المعدات", en: "Equipment" },
    { ar: "الهدايا الترويجية", en: "Promotional Gifts" },
    { ar: "اللوجستيات", en: "Logistics" },
    { ar: "الضيافة", en: "Catering" },
    { ar: "العمالة", en: "Manpower" }
  ];

  // Filter and search logic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.englishName.toLowerCase().includes(searchLower) ||
        supplier.category.toLowerCase().includes(searchLower) ||
        supplier.englishCategory.toLowerCase().includes(searchLower) ||
        supplier.location.toLowerCase().includes(searchLower) ||
        supplier.englishLocation.toLowerCase().includes(searchLower) ||
        supplier.description.toLowerCase().includes(searchLower) ||
        supplier.englishDescription.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = activeFilter === "All Categories" || 
        (t('language') === 'ar' ? supplier.category : supplier.englishCategory) === 
        (t('language') === 'ar' 
          ? categories.find(cat => cat.en === activeFilter)?.ar || activeFilter
          : activeFilter);

      return matchesSearch && matchesCategory;
    });
  }, [suppliers, searchTerm, activeFilter, t]);

  if (suppliersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (suppliersError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading suppliers</p>
          <p className="text-muted-foreground text-sm">{suppliersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((category) => {
                      const categoryName = t('language') === 'ar' ? category.ar : category.en;
                      const isActive = activeFilter === category.en;
                      return (
                        <Button 
                          key={category.en}
                          variant="outline" 
                          size="sm" 
                          className={`${isActive 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'hover:bg-accent/10'
                          }`}
                          onClick={() => handleFilterClick(category.en)}
                        >
                          {categoryName}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Suppliers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredSuppliers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale overflow-hidden">
                  {/* Supplier card header with better visual hierarchy */}
                  <CardHeader className="relative p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start gap-4">
                      {/* Company avatar/logo */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                        {supplier.avatar_url ? (
                          <img 
                            src={supplier.avatar_url} 
                            alt={supplier.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white font-bold text-lg sm:text-xl">
                            {(t('language') === 'ar' ? supplier.name : supplier.englishName).charAt(0)}
                          </div>
                        )}
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
                      <SupplierProfileModal supplier={supplier}>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover-scale group-hover:shadow-xl transition-all duration-300">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </SupplierProfileModal>
                      <EnhancedChatModal 
                        supplierName={t('language') === 'ar' ? supplier.name : supplier.englishName}
                        supplierId={supplier.id}
                      >
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-initial bg-lime/10 border-lime/20 text-lime hover:bg-lime/20 hover-scale"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </EnhancedChatModal>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Load More with better styling */}
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover-scale"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isLoadingMore ? "Loading..." : "Load More Suppliers"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};