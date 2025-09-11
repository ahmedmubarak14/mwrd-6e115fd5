
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock, Shield, Search, Filter, Users, Building2 } from "lucide-react";
import { format } from "date-fns";
import { useVendors, VendorFilters } from "@/hooks/useVendors";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VendorProfileModal } from "@/components/modals/VendorProfileModal";
import { EnhancedVendorProfileModal } from "@/components/modals/EnhancedVendorProfileModal";
import { PrivateRequestModal } from "@/components/modals/PrivateRequestModal";
import { useNavigate } from "react-router-dom";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { createLogger } from '@/utils/logger';

const logger = createLogger('VendorDirectory');

export const VendorDirectory: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const { vendors, loading, totalCount, fetchVendors } = useVendors();
  const { categories } = useCategories();
  const { startConversation } = useRealTimeChat();
  const [filters, setFilters] = useState<VendorFilters>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [privateRequestVendor, setPrivateRequestVendor] = useState<any | null>(null);

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

  // Convert vendor data to VendorProfileModal format
  const mapVendorForModal = (vendor: any) => ({
    id: vendor.id,
    name: vendor.company_name || vendor.full_name || 'Unknown Vendor',
    englishName: vendor.company_name || vendor.full_name || 'Unknown Vendor',
    category: vendor.vendor_categories?.[0]?.categories?.name_en || 'General',
    englishCategory: vendor.vendor_categories?.[0]?.categories?.name_en || 'General',
    rating: vendor.rating || 4.5,
    reviews: vendor.total_orders || 0,
    location: vendor.address || 'Saudi Arabia',
    englishLocation: vendor.address || 'Saudi Arabia',
    description: vendor.bio || 'Professional vendor providing quality services.',
    englishDescription: vendor.bio || 'Professional vendor providing quality services.',
    completedProjects: vendor.total_orders || 5,
    services: vendor.vendor_categories?.map((vc: any) => vc.categories?.name_en).filter(Boolean) || [],
    projects: [
      { title: 'Recent Project', category: vendor.vendor_categories?.[0]?.categories?.name_en || 'General' }
    ],
    certifications: vendor.certifications || ['ISO Certified', 'Quality Assured'],
    responseTime: vendor.response_time || '2 hours',
    englishResponseTime: vendor.response_time || '2 hours',
    avatar_url: vendor.avatar_url
  });

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
                {vendor.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{vendor.address}</span>
                  </div>
                )}
                {vendor.verification_status === 'approved' && (
                  <>
                    {vendor.address && <span className="text-muted-foreground">•</span>}
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span className="text-sm text-green-600">
                        {isRTL ? 'معتمد' : 'Verified'}
                      </span>
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

        {/* Vendor Info */}
        <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {isRTL ? 'انضم في' : 'Joined'} {format(new Date(vendor.created_at), 'MMM yyyy')}
            </span>
          </div>
          {vendor.portfolio_url && (
            <a 
              href={vendor.portfolio_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {isRTL ? 'عرض الأعمال' : 'Portfolio'}
            </a>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <EnhancedVendorProfileModal vendorId={vendor.id.toString()}>
            <Button variant="outline" size="sm" className="flex-1">
              {isRTL ? 'عرض الملف' : 'View Profile'}
            </Button>
          </EnhancedVendorProfileModal>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1" 
            onClick={async () => {
              try {
                logger.debug('Starting direct conversation', { vendorId: vendor.id });
                const conversation = await startConversation(vendor.id.toString());
                if (conversation) {
                  navigate('/messages');
                }
              } catch (error) {
                logger.error('Error starting conversation', { error, vendorId: vendor.id });
              }
            }}
          >
            {isRTL ? 'رسالة' : 'Message'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={() => setPrivateRequestVendor(vendor)}
          >
            {isRTL ? 'طلب خاص' : 'Private Request'}
          </Button>
          <Button size="sm" className="flex-1" onClick={() => navigate('/requests/create')}>
            {isRTL ? 'طلب عام' : 'Public Request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {isRTL ? 'تصفية النتائج' : 'Filter Results'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? 'ابحث عن الموردين...' : 'Search vendors...'}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'ترتيب حسب' : 'Sort by'}
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
              <SelectItem value="rating">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
              <SelectItem value="company_name">{isRTL ? 'اسم الشركة' : 'Company Name'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'نطاق الميزانية' : 'Budget Range (SAR)'}
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

        {/* Categories Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isRTL ? 'الفئات' : 'Categories'}
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={(filters.categories || []).includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryToggle(category.id, checked as boolean)}
                />
                <label 
                  htmlFor={`category-${category.id}`} 
                  className="text-sm cursor-pointer flex-1"
                >
                  {isRTL ? category.name_ar : category.name_en}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={clearFilters} variant="outline" size="sm" className="w-full">
          {isRTL ? 'مسح المرشحات' : 'Clear All Filters'}
        </Button>
      </CardContent>
    </Card>
  );

  // Vendor metrics
  const metrics = useMemo(() => {
    if (!vendors) return { total: 0, verified: 0, available: 0, categories: 0 };
    
    return {
      total: totalCount || vendors.length,
      verified: vendors.filter(v => v.verification_status === 'approved').length,
      available: vendors.length, // Assuming all shown vendors are available
      categories: categories.length,
    };
  }, [vendors, totalCount, categories]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vendor Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Vendors"
          value={metrics.total}
          icon={Building2}
          description="Registered vendors"
        />
        <MetricCard
          title="Verified Vendors"
          value={metrics.verified}
          icon={Shield}
          variant="success"
          description="Quality assured partners"
        />
        <MetricCard
          title="Available Now"
          value={metrics.available}
          icon={Users}
          description="Ready for new projects"
        />
        <MetricCard
          title="Service Categories"
          value={metrics.categories}
          icon={Filter}
          description="Different specializations"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">{renderFilters()}</div>

        {/* Vendors Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {vendors.map(renderVendorCard)}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title={isRTL ? 'لم يتم العثور على موردين' : 'No vendors found'}
              description={isRTL ? 'جرب تعديل معايير البحث' : 'Try adjusting your search criteria'}
              action={{
                label: isRTL ? 'مسح المرشحات' : 'Clear Filters',
                onClick: clearFilters,
                variant: "outline" as const
              }}
            />
          )}

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
                <span className="text-sm text-muted-foreground px-4">
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
        </div>
      </div>

      {/* Private Request Modal */}
      {privateRequestVendor && (
        <PrivateRequestModal
          open={!!privateRequestVendor}
          onOpenChange={(open) => !open && setPrivateRequestVendor(null)}
          vendorId={privateRequestVendor.id}
          vendorName={privateRequestVendor.name}
        />
      )}
    </div>
  );
};
