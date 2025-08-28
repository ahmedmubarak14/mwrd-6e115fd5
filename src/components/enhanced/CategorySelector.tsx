
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES } from "@/constants/categories";

interface CategorySelectorProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [mainCategory, setMainCategory] = useState<string>(selectedCategory || '');
  const [subCategory, setSubCategory] = useState<string>('');

  const selectedCategoryData = CATEGORIES.find(cat => cat.value === mainCategory);

  const handleMainCategoryChange = (categoryValue: string) => {
    setMainCategory(categoryValue);
    setSubCategory(''); // Reset subcategory when main category changes
    onCategoryChange(categoryValue);
  };

  const handleSubCategoryChange = (subcategoryValue: string) => {
    setSubCategory(subcategoryValue);
    const fullCategoryPath = `${mainCategory} > ${subcategoryValue}`;
    onCategoryChange(fullCategoryPath);
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
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{isRTL ? category.labelAr : category.labelEn}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory Dropdown - Only show if main category is selected */}
      {mainCategory && selectedCategoryData && selectedCategoryData.subcategories.length > 0 && (
        <div className="space-y-2">
          <Label>{isRTL ? 'الفئة الفرعية' : 'Subcategory'}</Label>
          <Select value={subCategory} onValueChange={handleSubCategoryChange}>
            <SelectTrigger className="w-full bg-background border-border">
              <SelectValue placeholder={isRTL ? 'اختر الفئة الفرعية' : 'Select subcategory'} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background border-border shadow-lg">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.value} value={subcategory.value}>
                  <div className="flex flex-col">
                    <span>{isRTL ? subcategory.labelAr : subcategory.labelEn}</span>
                    <span className="text-xs text-muted-foreground">
                      {subcategory.priceRangeMin.toLocaleString()} - {subcategory.priceRangeMax.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Show subcategory details if selected */}
          {subCategory && (
            <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
              {(() => {
                const selectedSubcategoryData = selectedCategoryData.subcategories.find(sub => sub.value === subCategory);
                if (!selectedSubcategoryData) return null;
                
                return (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {selectedSubcategoryData.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>{isRTL ? 'المتطلبات الأساسية:' : 'Key Requirements:'}</strong> {selectedSubcategoryData.requirements.join(', ')}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

