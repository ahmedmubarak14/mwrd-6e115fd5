import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, FileText, Package, Users, Calendar, MapPin } from "lucide-react";

interface SearchModalProps {
  children: React.ReactNode;
}

export const SearchModal = ({ children }: SearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Dummy search results
  const searchResults = query.length > 0 ? [
    {
      id: 1,
      type: "request",
      title: "Audio Equipment for Corporate Conference",
      description: "Professional audio setup needed for 200+ attendees",
      location: "Riyadh",
      date: "March 25, 2024",
      status: "active",
      relevance: 95
    },
    {
      id: 2,
      type: "supplier",
      title: "TechAudio Pro",
      description: "Professional audio and lighting equipment rental",
      location: "Riyadh",
      rating: "4.9",
      status: "verified",
      relevance: 88
    },
    {
      id: 3,
      type: "offer",
      title: "Complete Wedding Photography Package",
      description: "Full day wedding photography with editing",
      price: "8,500 SAR",
      supplier: "Creative Lens Studio",
      status: "pending",
      relevance: 75
    }
  ].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "request": return <FileText className="h-4 w-4" />;
      case "supplier": return <Users className="h-4 w-4" />;
      case "offer": return <Package className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      request: { label: isRTL ? "طلب" : "Request", variant: "default" as const },
      supplier: { label: isRTL ? "مورد" : "Supplier", variant: "secondary" as const },
      offer: { label: isRTL ? "عرض" : "Offer", variant: "outline" as const }
    };
    return typeMap[type as keyof typeof typeMap] || typeMap.request;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: isRTL ? "نشط" : "Active", variant: "default" as const },
      verified: { label: isRTL ? "موثق" : "Verified", variant: "default" as const },
      pending: { label: isRTL ? "في الانتظار" : "Pending", variant: "secondary" as const }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "البحث في سبلفاي" : "Search Supplify"}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "ابحث عن الطلبات والموردين والعروض" : "Search for requests, suppliers, and offers"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
            <Input
              placeholder={isRTL ? "ابحث عن أي شيء..." : "Search for anything..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {query.length === 0 ? (
              <div className={`text-center py-8 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL ? "ابدأ بكتابة كلمة للبحث" : "Start typing to search"}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className={`text-center py-8 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL ? "لم يتم العثور على نتائج" : "No results found"}</p>
                <p className="text-sm">{isRTL ? "جرب كلمات مختلفة" : "Try different keywords"}</p>
              </div>
            ) : (
              searchResults.map((result) => {
                const typeBadge = getTypeBadge(result.type);
                const statusBadge = getStatusBadge(result.status);
                
                return (
                  <div key={result.id} className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {getTypeIcon(result.type)}
                        <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {result.relevance}% {isRTL ? "مطابقة" : "match"}
                      </span>
                    </div>

                    <h4 className={`font-semibold mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {result.title}
                    </h4>
                    
                    <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {result.description}
                    </p>

                    <div className={`flex items-center gap-4 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {'location' in result && (
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-3 w-3" />
                          <span>{result.location}</span>
                        </div>
                      )}
                      
                      {'date' in result && (
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          <span>{result.date}</span>
                        </div>
                      )}
                      
                      {'price' in result && (
                        <div className="font-medium text-primary">
                          {result.price}
                        </div>
                      )}
                      
                      {'supplier' in result && (
                        <div>
                          {isRTL ? "بواسطة:" : "by"} {result.supplier}
                        </div>
                      )}
                      
                      {'rating' in result && (
                        <div>
                          ⭐ {result.rating}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          {query.length > 0 && searchResults.length > 0 && (
            <div className={`flex gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" size="sm">
                {isRTL ? "حفظ البحث" : "Save Search"}
              </Button>
              <Button variant="outline" size="sm">
                {isRTL ? "تصفية النتائج" : "Filter Results"}
              </Button>
              <Button size="sm">
                {isRTL ? "عرض الكل" : "View All"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};