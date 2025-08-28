
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CategorySelectorProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const { language } = useLanguage();
  const { categories, loading } = useCategories();
  const isRTL = language === 'ar';
  
  const [mainCategory, setMainCategory] = useState<string>(selectedCategory || '');
  const [subCategory, setSubCategory] = useState<string>('');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  // Get main categories (categories without parent_id)
  const mainCategories = categories.filter(cat => !cat.parent_id && cat.is_active);
  
  // Find selected main category data
  const selectedMainCategoryData = categories.find(cat => cat.slug === mainCategory);
  
  // Get subcategories for the selected main category
  const subCategories = selectedMainCategoryData ? 
    categories.filter(cat => cat.parent_id === selectedMainCategoryData.id && cat.is_active) : [];

  const handleMainCategoryChange = (categorySlug: string) => {
    setMainCategory(categorySlug);
    setSubCategory(''); // Reset subcategory when main category changes
    onCategoryChange(categorySlug);
  };

  const handleSubCategoryChange = (subcategorySlug: string) => {
    setSubCategory(subcategorySlug);
    onCategoryChange(subcategorySlug);
  };

  return (
    <div className="space-y-4">
      {/* Main Category Dropdown */}
      <div className="space-y-2">
        <Label>{isRTL ? 'الفئة الرئيسية' : 'Main Category'}</Label>
        <Select value={mainCategory} onValueChange={handleMainCategoryChange}>
          <SelectTrigger className="w-full bg-background border-border">
            <SelectValue placeholder={isRTL ? 'اختر الفئة الرئيسية' : 'Select main category'} />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background border-border shadow-lg">
            {mainCategories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                <span>{isRTL ? category.name_ar : category.name_en}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory Dropdown - Only show if main category is selected and has subcategories */}
      {mainCategory && subCategories.length > 0 && (
        <div className="space-y-2">
          <Label>{isRTL ? 'الفئة الفرعية (اختياري)' : 'Subcategory (Optional)'}</Label>
          <Select value={subCategory} onValueChange={handleSubCategoryChange}>
            <SelectTrigger className="w-full bg-background border-border">
              <SelectValue placeholder={isRTL ? 'اختر الفئة الفرعية' : 'Select subcategory'} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background border-border shadow-lg">
              {subCategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.slug}>
                  <span>{isRTL ? subcategory.name_ar : subcategory.name_en}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

