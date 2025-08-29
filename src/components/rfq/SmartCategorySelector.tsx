import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

interface ProcurementCategory {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  icon?: string;
  parent_id?: string;
  is_active: boolean;
}

interface SmartCategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  maxSelections?: number;
  required?: boolean;
}

export const SmartCategorySelector = ({ 
  selectedCategories, 
  onCategoriesChange, 
  maxSelections = 3,
  required = false 
}: SmartCategorySelectorProps) => {
  const [categories, setCategories] = useState<ProcurementCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('procurement_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories((data as ProcurementCategory[]) || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryAdd = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId) && selectedCategories.length < maxSelections) {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
  };

  const getAvailableCategories = () => {
    return categories.filter(cat => !selectedCategories.includes(cat.id));
  };

  const getSelectedCategoryNames = () => {
    return selectedCategories.map(id => {
      const category = categories.find(cat => cat.id === id);
      if (!category) return null;
      return {
        id,
        name: language === 'ar' && category.name_ar ? category.name_ar : category.name,
        icon: category.icon
      };
    }).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{language === 'ar' ? 'الفئات المطلوبة' : 'Required Categories'}</Label>
        <div className="h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2">
          {language === 'ar' ? 'الفئات المطلوبة' : 'Required Categories'}
          {required && <span className="text-destructive">*</span>}
          <span className="text-sm text-muted-foreground">
            ({selectedCategories.length}/{maxSelections})
          </span>
        </Label>
        
        {selectedCategories.length < maxSelections && (
          <Select onValueChange={handleCategoryAdd}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={
                language === 'ar' 
                  ? 'اختر فئة...' 
                  : 'Select a category...'
              } />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCategories().map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon && (
                      <span className="text-sm">{category.icon}</span>
                    )}
                    <div>
                      <div className="font-medium">
                        {language === 'ar' && category.name_ar ? category.name_ar : category.name}
                      </div>
                      {category.description && (
                        <div className="text-xs text-muted-foreground">
                          {language === 'ar' && category.description_ar 
                            ? category.description_ar 
                            : category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {language === 'ar' ? 'الفئات المختارة:' : 'Selected Categories:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedCategoryNames().map((category: any) => (
              <Badge 
                key={category.id} 
                variant="secondary" 
                className="flex items-center gap-2 px-3 py-1"
              >
                {category.icon && <span className="text-xs">{category.icon}</span>}
                <span>{category.name}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryRemove(category.id)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedCategories.length === maxSelections && (
        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
          {language === 'ar' 
            ? `تم الوصول إلى الحد الأقصى من الفئات (${maxSelections})`
            : `Maximum categories selected (${maxSelections})`
          }
        </div>
      )}
    </div>
  );
};