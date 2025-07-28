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
                    <option>جميع المواقع</option>
                    <option>الرياض</option>
                    <option>جدة</option>
                    <option>الدمام</option>
                    <option>مكة المكرمة</option>
                    <option>المدينة المنورة</option>
                    <option>الطائف</option>
                    <option>تبوك</option>
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
                        <CardTitle className="text-xl">
                          {t('language') === 'ar' ? supplier.name : supplier.englishName}
                        </CardTitle>
                        <CardDescription className="text-primary font-medium">
                          {t('language') === 'ar' ? supplier.category : supplier.englishCategory}
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
                          {t('language') === 'ar' ? supplier.location : supplier.englishLocation}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? supplier.description : supplier.englishDescription}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {t('language') === 'ar' ? 'المشاريع المكتملة:' : 'Completed Projects:'}
                        </span>
                        <p className="font-semibold">{supplier.completedProjects}+</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {t('language') === 'ar' ? 'وقت الاستجابة:' : 'Response Time:'}
                        </span>
                        <p className="font-semibold text-lime">
                          {t('language') === 'ar' ? supplier.responseTime : supplier.englishResponseTime}
                        </p>
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