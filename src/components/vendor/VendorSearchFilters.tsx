
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface VendorSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  urgencyFilter?: string;
  onUrgencyChange?: (value: string) => void;
  resultsCount?: number;
}

export const VendorSearchFilters: React.FC<VendorSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  urgencyFilter,
  onUrgencyChange,
  resultsCount
}) => {
  const { t, language } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();

  const getAllCategoriesForFilter = () => {
    const allCats: any[] = [];
    categories.forEach(category => {
      allCats.push(category);
      if (category.children && category.children.length > 0) {
        category.children.forEach(child => {
          allCats.push({ 
            ...child, 
            isChild: true, 
            parentName: language === 'ar' ? category.name_ar : category.name_en 
          });
        });
      }
    });
    return allCats;
  };

  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          {t('vendor.findOpportunities')}
        </CardTitle>
        <CardDescription>
          {t('vendor.filterDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('vendor.searchRequests')}
              className="pl-10 h-12 bg-background/50 border-primary/20 focus:border-primary/50"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 bg-background/50 border-primary/20">
              <SelectValue placeholder={t('browseRequests.filterByCategory')} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="all">{t('common.all')} {t('browseRequests.filterByCategory')}</SelectItem>
              {categoriesLoading ? (
                <SelectItem value="" disabled>
                  <LoadingSpinner size="sm" />
                </SelectItem>
              ) : (
                getAllCategoriesForFilter().map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.isChild && "  ↳ "}
                    {language === 'ar' ? category.name_ar : category.name_en}
                    {category.isChild && ` (${category.parentName})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {urgencyFilter !== undefined && onUrgencyChange && (
            <Select value={urgencyFilter} onValueChange={onUrgencyChange}>
              <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                <SelectValue placeholder={t('common.urgency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('common.urgency')}</SelectItem>
                <SelectItem value="urgent">{t('common.urgent')}</SelectItem>
                <SelectItem value="high">{t('common.high')}</SelectItem>
                <SelectItem value="medium">{t('common.medium')}</SelectItem>
                <SelectItem value="low">{t('common.low')}</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="text-sm text-muted-foreground flex items-center">
            {resultsCount !== undefined && (
              <>
                {resultsCount} {t('vendor.opportunitiesFound')}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
