import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES, Category, SubCategory } from "@/constants/categories";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Info, DollarSign, Tag, CheckCircle } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange: (category: string, subcategory: string, requirements: Record<string, any>) => void;
  requirements?: Record<string, any>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  requirements = {}
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [step, setStep] = useState<'category' | 'subcategory' | 'requirements'>('category');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<SubCategory | null>(null);
  const [formRequirements, setFormRequirements] = useState<Record<string, any>>(requirements);

  const handleCategorySelect = (categoryValue: string) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    if (category) {
      setCurrentCategory(category);
      setStep('subcategory');
    }
  };

  const handleSubcategorySelect = (subcategoryValue: string) => {
    if (!currentCategory) return;
    const subcategory = currentCategory.subcategories.find(s => s.value === subcategoryValue);
    if (subcategory) {
      setCurrentSubcategory(subcategory);
      setStep('requirements');
    }
  };

  const handleRequirementChange = (key: string, value: any) => {
    setFormRequirements(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    if (currentCategory && currentSubcategory) {
      onCategoryChange(currentCategory.value, currentSubcategory.value, formRequirements);
    }
  };

  const renderCategoryStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {isRTL ? 'اختر فئة الخدمة' : 'Select Service Category'}
        </h3>
        <p className="text-muted-foreground">
          {isRTL ? 'اختر الفئة التي تناسب احتياجاتك' : 'Choose the category that matches your needs'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((category) => (
          <Card 
            key={category.value}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            onClick={() => handleCategorySelect(category.value)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xl">
                    {category.icon === 'speaker' && '🔊'}
                    {category.icon === 'utensils' && '🍽️'}
                    {category.icon === 'palette' && '🎨'}
                    {category.icon === 'chair' && '🪑'}
                    {category.icon === 'shield' && '🛡️'}
                    {category.icon === 'car' && '🚗'}
                  </span>
                </div>
                <div className="flex-1">
                  {isRTL ? category.labelAr : category.labelEn}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {isRTL ? category.description.ar : category.description.en}
              </p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Tag className="h-3 w-3" />
                <span>{category.subcategories.length} {isRTL ? 'خدمة فرعية' : 'subcategories'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSubcategoryStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setStep('category')}
          className="gap-2"
        >
          ← {isRTL ? 'العودة' : 'Back'}
        </Button>
        <div>
          <h3 className="text-xl font-semibold">
            {isRTL ? currentCategory?.labelAr : currentCategory?.labelEn}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isRTL ? 'اختر نوع الخدمة المحدد' : 'Select specific service type'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentCategory?.subcategories.map((subcategory) => (
          <Card 
            key={subcategory.value}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            onClick={() => handleSubcategorySelect(subcategory.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    {isRTL ? subcategory.labelAr : subcategory.labelEn}
                  </h4>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-3 w-3" />
                      <span>{subcategory.priceRangeMin.toLocaleString()}-{subcategory.priceRangeMax.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span>{subcategory.requirements.length} {isRTL ? 'متطلبات' : 'requirements'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {subcategory.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRequirementsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setStep('subcategory')}
          className="gap-2"
        >
          ← {isRTL ? 'العودة' : 'Back'}
        </Button>
        <div>
          <h3 className="text-xl font-semibold">
            {isRTL ? currentSubcategory?.labelAr : currentSubcategory?.labelEn}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isRTL ? 'حدد متطلباتك التفصيلية' : 'Specify your detailed requirements'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            {isRTL ? 'تفاصيل المتطلبات' : 'Requirement Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSubcategory?.requirements.map((requirement, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm font-medium">{requirement}</Label>
              {requirement.toLowerCase().includes('count') || requirement.toLowerCase().includes('size') || requirement.toLowerCase().includes('number') ? (
                <Input
                  type="number"
                  placeholder={`Enter ${requirement.toLowerCase()}`}
                  value={formRequirements[requirement] || ''}
                  onChange={(e) => handleRequirementChange(requirement, e.target.value)}
                />
              ) : requirement.toLowerCase().includes('type') || requirement.toLowerCase().includes('style') || requirement.toLowerCase().includes('level') ? (
                <Select
                  value={formRequirements[requirement] || ''}
                  onValueChange={(value) => handleRequirementChange(requirement, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${requirement.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Textarea
                  placeholder={`Describe your ${requirement.toLowerCase()}`}
                  value={formRequirements[requirement] || ''}
                  onChange={(e) => handleRequirementChange(requirement, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Additional Tags Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'كلمات مفتاحية إضافية' : 'Additional Tags'}
            </Label>
            <div className="flex flex-wrap gap-2">
              {currentSubcategory?.tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={formRequirements.selectedTags?.includes(tag) || false}
                    onCheckedChange={(checked) => {
                      const currentTags = formRequirements.selectedTags || [];
                      const newTags = checked 
                        ? [...currentTags, tag]
                        : currentTags.filter((t: string) => t !== tag);
                      handleRequirementChange('selectedTags', newTags);
                    }}
                  />
                  <Label htmlFor={tag} className="text-sm cursor-pointer">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'تأكيد الاختيار' : 'Confirm Selection'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 'category' && renderCategoryStep()}
      {step === 'subcategory' && renderSubcategoryStep()}
      {step === 'requirements' && renderRequirementsStep()}
    </div>
  );
};