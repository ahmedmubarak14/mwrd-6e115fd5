
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CategorySelector } from '@/components/enhanced/CategorySelector';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Upload, 
  X,
  Plus,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

interface BOQItem {
  id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price?: number;
  total_price?: number;
}

interface FormData {
  title: string;
  description: string;
  categories: string[];
  budget_min: number;
  budget_max: number;
  location: string;
  deadline: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requirements: {
    payment_terms: string;
    delivery_requirements: string;
    quality_standards: string;
    boq_items: BOQItem[];
  };
}

export const ProcurementRequestForm: React.FC = () => {
  const { createRequest, loading } = useRequests();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    categories: [],
    budget_min: 0,
    budget_max: 0,
    location: '',
    deadline: '',
    urgency: 'medium',
    requirements: {
      payment_terms: '',
      delivery_requirements: '',
      quality_standards: '',
      boq_items: []
    }
  });

  const steps = [
    { id: 1, title: isRTL ? 'اختيار الفئات' : 'Select Categories', description: isRTL ? 'اختر فئات المشتريات' : 'Choose procurement categories' },
    { id: 2, title: isRTL ? 'جدول الكميات' : 'Bill of Quantities', description: isRTL ? 'أضف تفاصيل المواد والخدمات' : 'Add items and services details' },
    { id: 3, title: isRTL ? 'تفاصيل الطلب' : 'Request Details', description: isRTL ? 'أكمل معلومات الطلب' : 'Complete request information' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      categories: categoryIds
    }));
  };

  const addBOQItem = () => {
    const newItem: BOQItem = {
      id: Date.now().toString(),
      item_name: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      unit_price: 0,
      total_price: 0
    };
    
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        boq_items: [...prev.requirements.boq_items, newItem]
      }
    }));
  };

  const updateBOQItem = (id: string, field: keyof BOQItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        boq_items: prev.requirements.boq_items.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unit_price') {
              updatedItem.total_price = updatedItem.quantity * (updatedItem.unit_price || 0);
            }
            return updatedItem;
          }
          return item;
        })
      }
    }));
  };

  const removeBOQItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        boq_items: prev.requirements.boq_items.filter(item => item.id !== id)
      }
    }));
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const items: BOQItem[] = [];

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [item_name, description, quantity, unit, unit_price] = line.split(',');
        
        if (item_name) {
          const qty = parseFloat(quantity) || 1;
          const price = parseFloat(unit_price) || 0;
          
          items.push({
            id: Date.now().toString() + i,
            item_name: item_name.trim(),
            description: description?.trim() || '',
            quantity: qty,
            unit: unit?.trim() || 'pcs',
            unit_price: price,
            total_price: qty * price
          });
        }
      }

      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          boq_items: [...prev.requirements.boq_items, ...items]
        }
      }));

      toast({
        title: "Success",
        description: `${items.length} items imported from CSV`
      });
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      // Convert categories array to primary category for legacy API
      const primaryCategory = formData.categories[0] || '';
      
      await createRequest({
        title: formData.title,
        description: formData.description,
        category: primaryCategory, // Legacy field
        budget_min: formData.budget_min,
        budget_max: formData.budget_max,
        location: formData.location,
        deadline: formData.deadline,
        urgency: formData.urgency,
        // Store additional data in requirements field
        requirements: JSON.stringify({
          ...formData.requirements,
          categories: formData.categories.map(id => ({ id }))
        })
      });

      toast({
        title: "Success",
        description: "Procurement request created successfully"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        categories: [],
        budget_min: 0,
        budget_max: 0,
        location: '',
        deadline: '',
        urgency: 'medium',
        requirements: {
          payment_terms: '',
          delivery_requirements: '',
          quality_standards: '',
          boq_items: []
        }
      });
      setCurrentStep(1);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create request",
        variant: "destructive"
      });
    }
  };

  const canProceedFromStep1 = formData.categories.length > 0;
  const canProceedFromStep2 = formData.requirements.boq_items.length > 0;
  const canSubmit = formData.title && formData.description && canProceedFromStep1 && canProceedFromStep2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{isRTL ? 'إنشاء طلب مشتريات جديد' : 'Create New Procurement Request'}</span>
          </CardTitle>
          <CardDescription>
            {isRTL ? 'اتبع الخطوات لإنشاء طلب مشتريات شامل' : 'Follow the steps to create a comprehensive procurement request'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className={`flex items-center ${step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.id < currentStep ? 'bg-primary text-primary-foreground border-primary' :
                    step.id === currentStep ? 'border-primary text-primary' : 'border-muted'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">{isRTL ? 'اختر فئات المشتريات' : 'Select Procurement Categories'}</h2>
                <p className="text-muted-foreground">
                  {isRTL ? 'اختر فئة أو أكثر لطلب المشتريات الخاص بك' : 'Choose one or more categories for your procurement request'}
                </p>
              </div>
              
              <CategorySelector
                selectedCategory={formData.categories}
                onChange={handleCategoryChange}
                multiple={true}
              />

              {formData.categories.length > 0 && (
                <div className="space-y-2">
                  <Label>{isRTL ? 'الفئات المختارة:' : 'Selected Categories:'}</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((categoryId) => (
                      <Badge key={categoryId} variant="secondary">
                        {categoryId} {/* This would need to be resolved to category name */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => handleCategoryChange(formData.categories.filter(id => id !== categoryId))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">{isRTL ? 'جدول الكميات (BOQ)' : 'Bill of Quantities (BOQ)'}</h2>
                <p className="text-muted-foreground">
                  {isRTL ? 'أضف المواد والخدمات المطلوبة' : 'Add required items and services'}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={addBOQItem} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {isRTL ? 'إضافة عنصر' : 'Add Item'}
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    {isRTL ? 'رفع CSV' : 'Upload CSV'}
                  </Button>
                </div>
              </div>

              {formData.requirements.boq_items.length > 0 && (
                <div className="space-y-4">
                  {formData.requirements.boq_items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div>
                          <Label>{isRTL ? 'اسم العنصر' : 'Item Name'}</Label>
                          <Input
                            value={item.item_name}
                            onChange={(e) => updateBOQItem(item.id, 'item_name', e.target.value)}
                            placeholder={isRTL ? 'اسم العنصر' : 'Item name'}
                          />
                        </div>
                        
                        <div>
                          <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateBOQItem(item.id, 'quantity', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => updateBOQItem(item.id, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pcs">Pieces</SelectItem>
                              <SelectItem value="kg">Kilograms</SelectItem>
                              <SelectItem value="m">Meters</SelectItem>
                              <SelectItem value="m2">Square Meters</SelectItem>
                              <SelectItem value="m3">Cubic Meters</SelectItem>
                              <SelectItem value="hrs">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unit_price || ''}
                            onChange={(e) => updateBOQItem(item.id, 'unit_price', parseFloat(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div>
                          <Label>{isRTL ? 'إجمالي السعر' : 'Total Price'}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.total_price || 0}
                            disabled
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeBOQItem(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {isRTL ? 'المجموع:' : 'Total:'} {' '}
                      {formData.requirements.boq_items.reduce((sum, item) => sum + (item.total_price || 0), 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">{isRTL ? 'تفاصيل الطلب' : 'Request Details'}</h2>
                <p className="text-muted-foreground">
                  {isRTL ? 'أكمل معلومات طلب المشتريات' : 'Complete your procurement request information'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{isRTL ? 'عنوان الطلب' : 'Request Title'}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={isRTL ? 'عنوان واضح وموجز' : 'Clear and concise title'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">{isRTL ? 'وصف الطلب' : 'Request Description'}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={isRTL ? 'وصف مفصل للمتطلبات' : 'Detailed description of requirements'}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">{isRTL ? 'الحد الأدنى للميزانية' : 'Min Budget'}</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="budget_min"
                          type="number"
                          value={formData.budget_min}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget_min: parseFloat(e.target.value) }))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget_max">{isRTL ? 'الحد الأقصى للميزانية' : 'Max Budget'}</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="budget_max"
                          type="number"
                          value={formData.budget_max}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget_max: parseFloat(e.target.value) }))}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">{isRTL ? 'الموقع' : 'Location'}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder={isRTL ? 'موقع التسليم' : 'Delivery location'}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deadline">{isRTL ? 'الموعد النهائي' : 'Deadline'}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="urgency">{isRTL ? 'درجة الأولوية' : 'Urgency Level'}</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                        <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                        <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                        <SelectItem value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment_terms">{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
                    <Textarea
                      id="payment_terms"
                      value={formData.requirements.payment_terms}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, payment_terms: e.target.value }
                      }))}
                      placeholder={isRTL ? 'شروط وطرق الدفع' : 'Payment terms and methods'}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="delivery_requirements">{isRTL ? 'متطلبات التسليم' : 'Delivery Requirements'}</Label>
                    <Textarea
                      id="delivery_requirements"
                      value={formData.requirements.delivery_requirements}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, delivery_requirements: e.target.value }
                      }))}
                      placeholder={isRTL ? 'متطلبات وشروط التسليم' : 'Delivery terms and requirements'}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quality_standards">{isRTL ? 'معايير الجودة' : 'Quality Standards'}</Label>
                    <Textarea
                      id="quality_standards"
                      value={formData.requirements.quality_standards}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requirements: { ...prev.requirements, quality_standards: e.target.value }
                      }))}
                      placeholder={isRTL ? 'معايير ومواصفات الجودة المطلوبة' : 'Required quality standards and specifications'}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {isRTL ? 'السابق' : 'Previous'}
            </Button>

            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedFromStep1) ||
                  (currentStep === 2 && !canProceedFromStep2)
                }
              >
                {isRTL ? 'التالي' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  isRTL ? 'جاري الإرسال...' : 'Submitting...'
                ) : (
                  isRTL ? 'إرسال الطلب' : 'Submit Request'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
