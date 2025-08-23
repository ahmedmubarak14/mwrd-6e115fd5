
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, Clock, Shield, DollarSign, Search, Filter } from "lucide-react";
import { useVendors, VendorFilters } from "@/hooks/useVendors";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const VendorDirectory: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { vendors, loading, totalCount, fetchVendors } = useVendors();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<VendorFilters>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVendors(filters, page, 20, sortBy, sortOrder);
  }, [filters, page, sortBy, sortOrder]);

  const handleFilterChange = (key: keyof VendorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const newCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter(id => id !== categoryId);
    
    handleFilterChange('categories', newCategories);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const renderVendorCard = (vendor: any) => (
    <Card key={vendor.id} className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {vendor.avatar_url ? (
                <img src={vendor.avatar_url} alt="" className="w-full h-full rounded-lg object-cover" />
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {vendor.company_name?.[0] || vendor.full_name?.[0] || 'V'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{vendor.company_name || vendor.full_name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">(124)</span>
                </div>
                {vendor.address && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{vendor.address}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {isRTL ? 'متاح' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {vendor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{vendor.bio}</p>
        )}
        
        {/* Categories */}
        {vendor.vendor_categories && vendor.vendor_categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isRTL ? 'التخصصات' : 'Specialties'}
            </h4>
            <div className="flex flex-wrap gap-1">
              {vendor.vendor_categories.slice(0, 3).map((vc: any) => (
                <Badge key={vc.id} variant="outline" className="text-xs">
                  {isRTL ? vc.categories.name_ar : vc.categories.name_en}
                </Badge>
              ))}
              {vendor.vendor_categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{vendor.vendor_categories.length - 3} {isRTL ? 'المزيد' : 'more'}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? 'التسليم' : 'Delivery'}
              </span>
            </div>
            <span className="text-sm font-medium">3-5 {isRTL ? 'أيام' : 'days'}</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? 'معتمد' : 'Certified'}
              </span>
            </div>
            <span className="text-sm font-medium">ISO 9001</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? 'أدنى طلب' : 'Min Order'}
              </span>
            </div>
            <span className="text-sm font-medium">1,000 SAR</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            {isRTL ? 'عرض الملف' : 'View Profile'}
          </Button>
          <Button size="sm" className="flex-1">
            {isRTL ? 'إرسال طلب شراء' : 'Send Procurement Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFilters = () => (
    <Collapsible open={showFilters} onOpenChange={setShowFilters}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {isRTL ? 'المرشحات' : 'Filters'}
          </div>
          <Badge variant="secondary">
            {Object.keys(filters).filter(key => filters[key as keyof VendorFilters]).length}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'البحث' : 'Search'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? 'ابحث عن الموردين...' : 'Search vendors...'}
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'الفئات' : 'Categories'}
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map(category => (
              <div key={category.id}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories?.includes(category.id) || false}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, !!checked)}
                  />
                  <label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                    {isRTL ? category.name_ar : category.name_en}
                  </label>
                </div>
                {/* Subcategories */}
                {category.children && category.children.map(subcat => (
                  <div key={subcat.id} className="ml-6 flex items-center space-x-2 mt-1">
                    <Checkbox
                      id={subcat.id}
                      checked={filters.categories?.includes(subcat.id) || false}
                      onCheckedChange={(checked) => handleCategoryToggle(subcat.id, !!checked)}
                    />
                    <label htmlFor={subcat.id} className="text-sm cursor-pointer text-muted-foreground">
                      {isRTL ? subcat.name_ar : subcat.name_en}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'الموقع' : 'Location'}
          </label>
          <Input
            placeholder={isRTL ? 'المدينة أو المنطقة' : 'City or region'}
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Budget Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'نطاق الميزانية (ريال سعودي)' : 'Budget Range (SAR)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={isRTL ? 'الحد الأدنى' : 'Min'}
              value={filters.budgetMin || ''}
              onChange={(e) => handleFilterChange('budgetMin', parseFloat(e.target.value) || undefined)}
            />
            <Input
              type="number"
              placeholder={isRTL ? 'الحد الأقصى' : 'Max'}
              value={filters.budgetMax || ''}
              onChange={(e) => handleFilterChange('budgetMax', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </div>

        {/* Delivery Time */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'وقت التسليم' : 'Delivery Time'}
          </label>
          <Select value={filters.deliveryTime || ''} onValueChange={(value) => handleFilterChange('deliveryTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isRTL ? 'اختر وقت التسليم' : 'Select delivery time'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">≤3 {isRTL ? 'أيام' : 'days'}</SelectItem>
              <SelectItem value="4-7">≤7 {isRTL ? 'أيام' : 'days'}</SelectItem>
              <SelectItem value="8-14">≤14 {isRTL ? 'يوم' : 'days'}</SelectItem>
              <SelectItem value="15-30">≤30 {isRTL ? 'يوم' : 'days'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={clearFilters} variant="outline" size="sm" className="flex-1">
            {isRTL ? 'مسح المرشحات' : 'Clear Filters'}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isRTL ? 'دليل الموردين' : 'Vendor Directory'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 
              `اكتشف ${totalCount.toLocaleString()} مورد معتمد في المملكة العربية السعودية` :
              `Discover ${totalCount.toLocaleString()} verified vendors in Saudi Arabia`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
              <SelectItem value="rating">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
              <SelectItem value="response_rate">{isRTL ? 'معدل الاستجابة' : 'Response Rate'}</SelectItem>
              <SelectItem value="company_name">{isRTL ? 'اسم الشركة' : 'Company Name'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isRTL ? 'تصفية النتائج' : 'Filter Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderFilters()}
            </CardContent>
          </Card>
        </div>

        {/* Vendors Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : vendors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendors.map(renderVendorCard)}
              </div>
              
              {/* Pagination */}
              {totalCount > 20 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      {isRTL ? 'السابق' : 'Previous'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 
                        `الصفحة ${page} من ${Math.ceil(totalCount / 20)}` :
                        `Page ${page} of ${Math.ceil(totalCount / 20)}`
                      }
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(totalCount / 20)}
                    >
                      {isRTL ? 'التالي' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {isRTL ? 'لم يتم العثور على موردين بهذه المعايير' : 'No vendors found matching your criteria'}
                </p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  {isRTL ? 'مسح المرشحات' : 'Clear Filters'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
