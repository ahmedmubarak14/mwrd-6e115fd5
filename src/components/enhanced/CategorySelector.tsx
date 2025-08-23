
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Info, DollarSign, Tag, CheckCircle, ArrowLeft } from "lucide-react";

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
  const { categories, loading } = useCategories();
  
  const [step, setStep] = useState<'category' | 'subcategory' | 'requirements'>('category');
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [formRequirements, setFormRequirements] = useState<Record<string, any>>(requirements);

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setCurrentCategory(category);
      setStep('subcategory');
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (!currentCategory) return;
    const subcategory = currentCategory.children?.find((s: any) => s.id === subcategoryId);
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
      onCategoryChange(currentCategory.id, currentSubcategory.id, formRequirements);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderCategoryStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {isRTL ? 'اختر فئة الشراء' : 'Select Procurement Category'}
        </h3>
        <p className="text-muted-foreground">
          {isRTL ? 'اختر الفئة التي تناسب احتياجاتك' : 'Choose the category that matches your needs'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xl">
                    {/* You can add icons based on category.slug */}
                    {category.slug === 'direct-procurement' && '🏭'}
                    {category.slug === 'indirect-procurement' && '🏢'}
                    {category.slug === 'logistics-supply-chain' && '🚚'}
                    {category.slug === 'professional-business-services' && '💼'}
                    {category.slug === 'construction-infrastructure' && '🏗️'}
                    {category.slug === 'mro-maintenance-repair-operations' && '🔧'}
                  </span>
                </div>
                <div className="flex-1">
                  {isRTL ? category.name_ar : category.name_en}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Tag className="h-3 w-3" />
                <span>
                  {category.children?.length || 0} {isRTL ? 'خدمة فرعية' : 'subcategories'}
                </span>
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
          <ArrowLeft className="h-4 w-4" />
          {isRTL ? 'العودة' : 'Back'}
        </Button>
        <div>
          <h3 className="text-xl font-semibold">
            {isRTL ? currentCategory?.name_ar : currentCategory?.name_en}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isRTL ? 'اختر نوع الخدمة المحدد' : 'Select specific service type'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentCategory?.children?.map((subcategory: any) => (
          <Card 
            key={subcategory.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            onClick={() => handleSubcategorySelect(subcategory.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    {isRTL ? subcategory.name_ar : subcategory.name_en}
                  </h4>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span>{isRTL ? 'خدمة فرعية' : 'Subcategory'}</span>
                    </div>
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
          <ArrowLeft className="h-4 w-4" />
          {isRTL ? 'العودة' : 'Back'}
        </Button>
        <div>
          <h3 className="text-xl font-semibold">
            {isRTL ? currentSubcategory?.name_ar : currentSubcategory?.name_en}
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
          {/* Generic requirement fields */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'وصف تفصيلي للمتطلبات' : 'Detailed Requirements Description'}
            </Label>
            <Textarea
              placeholder={isRTL ? 'اكتب وصفاً تفصيلياً لما تحتاجه' : 'Describe in detail what you need'}
              value={formRequirements.description || ''}
              onChange={(e) => handleRequirementChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isRTL ? 'الكمية المطلوبة' : 'Required Quantity'}
              </Label>
              <Input
                type="number"
                placeholder={isRTL ? 'الكمية' : 'Quantity'}
                value={formRequirements.quantity || ''}
                onChange={(e) => handleRequirementChange('quantity', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isRTL ? 'الوحدة' : 'Unit'}
              </Label>
              <Input
                placeholder={isRTL ? 'قطعة، متر، كيلو...' : 'pcs, meter, kg...'}
                value={formRequirements.unit || ''}
                onChange={(e) => handleRequirementChange('unit', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'مستوى الجودة المطلوب' : 'Required Quality Level'}
            </Label>
            <Select
              value={formRequirements.quality_level || ''}
              onValueChange={(value) => handleRequirementChange('quality_level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر مستوى الجودة' : 'Select quality level'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">{isRTL ? 'أساسي' : 'Basic'}</SelectItem>
                <SelectItem value="standard">{isRTL ? 'قياسي' : 'Standard'}</SelectItem>
                <SelectItem value="premium">{isRTL ? 'ممتاز' : 'Premium'}</SelectItem>
                <SelectItem value="luxury">{isRTL ? 'فاخر' : 'Luxury'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'المواصفات الفنية' : 'Technical Specifications'}
            </Label>
            <Textarea
              placeholder={isRTL ? 'حدد المواصفات الفنية المطلوبة' : 'Specify required technical specifications'}
              value={formRequirements.specifications || ''}
              onChange={(e) => handleRequirementChange('specifications', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'شهادات الجودة المطلوبة' : 'Required Quality Certifications'}
            </Label>
            <div className="flex flex-wrap gap-2">
              {['ISO 9001', 'SASO', 'CE', 'FDA', 'HACCP'].map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formRequirements.certifications?.includes(cert) || false}
                    onCheckedChange={(checked) => {
                      const currentCerts = formRequirements.certifications || [];
                      const newCerts = checked 
                        ? [...currentCerts, cert]
                        : currentCerts.filter((c: string) => c !== cert);
                      handleRequirementChange('certifications', newCerts);
                    }}
                  />
                  <Label htmlFor={cert} className="text-sm cursor-pointer">
                    {cert}
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
