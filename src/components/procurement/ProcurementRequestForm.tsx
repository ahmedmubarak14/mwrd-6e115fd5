import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { CategorySelector } from '@/components/enhanced/CategorySelector';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Plus, X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRequests } from '@/hooks/useRequests';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { BOQItem } from '@/types/boq';

interface ProcurementRequestFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const ProcurementRequestForm: React.FC<ProcurementRequestFormProps> = ({ onSuccess, onClose }) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { createRequest } = useRequests();
  const { categories } = useCategories();
  const isRTL = language === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    location: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    payment_terms: '',
    delivery_requirements: '',
    quality_standards: ''
  });
  const [deadline, setDeadline] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const steps = [
    { id: 1, title: isRTL ? 'الفئات' : 'Categories', description: isRTL ? 'اختر فئات المشروع' : 'Select project categories' },
    { id: 2, title: isRTL ? 'قائمة الكميات' : 'BOQ Items', description: isRTL ? 'أضف عناصر قائمة الكميات' : 'Add bill of quantities items' },
    { id: 3, title: isRTL ? 'التفاصيل' : 'Details', description: isRTL ? 'املأ تفاصيل الطلب' : 'Fill request details' }
  ];

  const addBOQItem = () => {
    setBOQItems([...boqItems, {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 0,
      unit: '',
      unit_price: 0,
      total_price: 0,
      category: '',
      specifications: '',
      notes: ''
    }]);
  };

  const removeBOQItem = (id: string) => {
    setBOQItems(boqItems.filter(item => item.id !== id));
  };

  const updateBOQItem = (id: string, field: keyof BOQItem, value: any) => {
    setBOQItems(boqItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Auto-calculate total price
        if (field === 'quantity' || field === 'unit_price') {
          updated.total_price = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleCSVUpload = (file: File) => {
    setCsvFile(file);
    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const items: BOQItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 4) {
          items.push({
            id: `csv-${i}`,
            description: values[0] || '',
            quantity: parseFloat(values[1]) || 0,
            unit: values[2] || '',
            unit_price: parseFloat(values[3]) || 0,
            total_price: (parseFloat(values[1]) || 0) * (parseFloat(values[3]) || 0),
            category: values[4] || '',
            specifications: values[5] || '',
            notes: values[6] || ''
          });
        }
      }
      setBOQItems(items);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!selectedCategories.length) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى اختيار فئة واحدة على الأقل" : "Please select at least one category",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.description) {
      toast({
        title: isRTL ? "خطأ" : "Error", 
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategories[0], // Use first category as primary
        budget_min: parseFloat(formData.budget_min) || undefined,
        budget_max: parseFloat(formData.budget_max) || undefined,
        location: formData.location || undefined,
        deadline: deadline?.toISOString().split('T')[0] || undefined,
        urgency: formData.urgency,
        // Store additional data in metadata/description for now
        metadata: {
          categories: selectedCategories,
          boq_items: boqItems,
          payment_terms: formData.payment_terms,
          delivery_requirements: formData.delivery_requirements,
          quality_standards: formData.quality_standards
        }
      };

      const result = await createRequest(requestData);
      
      if (result) {
        toast({
          title: isRTL ? "تم إنشاء الطلب" : "Request Created",
          description: isRTL ? "تم إنشاء طلب الشراء بنجاح" : "Procurement request created successfully"
        });
        onSuccess?.();
      }
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في الإنشاء" : "Creation Error",
        description: error.message || (isRTL ? "حدث خطأ أثناء إنشاء الطلب" : "Error creating request"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'اختيار الفئات' : 'Category Selection'}</CardTitle>
              <CardDescription>
                {isRTL ? 'اختر الفئات المناسبة لطلب الشراء' : 'Select appropriate categories for your procurement request'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{isRTL ? 'الفئات المطلوبة' : 'Required Categories'}</Label>
                <CategorySelector
                  selectedCategory=""
                  onChange={(categoryId: string) => {
                    if (categoryId && !selectedCategories.includes(categoryId)) {
                      setSelectedCategories([...selectedCategories, categoryId]);
                    }
                  }}
                />
              </div>
              
              {selectedCategories.length > 0 && (
                <div>
                  <Label>{isRTL ? 'الفئات المحددة' : 'Selected Categories'}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((categoryId) => {
                      const category = categories.find(c => c.id === categoryId);
                      return (
                        <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                          {isRTL ? category?.name_ar : category?.name_en}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setSelectedCategories(prev => prev.filter(id => id !== categoryId))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'قائمة الكميات (BOQ)' : 'Bill of Quantities (BOQ)'}</CardTitle>
              <CardDescription>
                {isRTL ? 'أضف عناصر قائمة الكميات أو ارفع ملف CSV' : 'Add BOQ items or upload a CSV file'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={addBOQItem} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {isRTL ? 'إضافة عنصر' : 'Add Item'}
                </Button>
                <FileUpload
                  onFileSelect={handleCSVUpload}
                  accept=".csv"
                  maxSize={5}
                >
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {isRTL ? 'رفع CSV' : 'Upload CSV'}
                  </Button>
                </FileUpload>
              </div>

              {boqItems.length > 0 && (
                <div className="space-y-4">
                  {boqItems.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">{isRTL ? `العنصر ${index + 1}` : `Item ${index + 1}`}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBOQItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{isRTL ? 'الوصف' : 'Description'}</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateBOQItem(item.id, 'description', e.target.value)}
                            placeholder={isRTL ? 'وصف العنصر' : 'Item description'}
                          />
                        </div>
                        <div>
                          <Label>{isRTL ? 'الكمية' : 'Quantity'}</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateBOQItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>{isRTL ? 'الوحدة' : 'Unit'}</Label>
                          <Input
                            value={item.unit}
                            onChange={(e) => updateBOQItem(item.id, 'unit', e.target.value)}
                            placeholder={isRTL ? 'متر، كيلو، قطعة' : 'meter, kg, piece'}
                          />
                        </div>
                        <div>
                          <Label>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateBOQItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>{isRTL ? 'المجموع' : 'Total'}</Label>
                          <Input
                            value={item.total_price.toFixed(2)}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{isRTL ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                      <span className="text-xl font-bold text-primary">
                        {boqItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)} SAR
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'تفاصيل الطلب' : 'Request Details'}</CardTitle>
              <CardDescription>
                {isRTL ? 'املأ المعلومات الأساسية للطلب' : 'Fill in the basic request information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">{isRTL ? 'عنوان الطلب *' : 'Request Title *'}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={isRTL ? 'أدخل عنوان الطلب' : 'Enter request title'}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">{isRTL ? 'وصف الطلب *' : 'Request Description *'}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={isRTL ? 'وصف تفصيلي للطلب' : 'Detailed request description'}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="budget_min">{isRTL ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                    placeholder={isRTL ? '0' : '0'}
                  />
                </div>

                <div>
                  <Label htmlFor="budget_max">{isRTL ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                    placeholder={isRTL ? '0' : '0'}
                  />
                </div>

                <div>
                  <Label htmlFor="location">{isRTL ? 'الموقع' : 'Location'}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder={isRTL ? 'موقع تنفيذ المشروع' : 'Project location'}
                  />
                </div>

                <div>
                  <Label>{isRTL ? 'الموعد النهائي' : 'Deadline'}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : <span>{isRTL ? 'اختر التاريخ' : 'Pick a date'}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="urgency">{isRTL ? 'مستوى الأولوية' : 'Urgency Level'}</Label>
                  <Select value={formData.urgency} onValueChange={(value: any) => setFormData({...formData, urgency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر مستوى الأولوية' : 'Select urgency level'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                      <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                      <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                      <SelectItem value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_terms">{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
                  <Input
                    id="payment_terms"
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    placeholder={isRTL ? '30 يوم، دفع مقدم، إلخ' : '30 days, advance payment, etc.'}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="delivery_requirements">{isRTL ? 'متطلبات التسليم' : 'Delivery Requirements'}</Label>
                  <Textarea
                    id="delivery_requirements"
                    value={formData.delivery_requirements}
                    onChange={(e) => setFormData({...formData, delivery_requirements: e.target.value})}
                    placeholder={isRTL ? 'متطلبات التسليم والشحن' : 'Delivery and shipping requirements'}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="quality_standards">{isRTL ? 'معايير الجودة' : 'Quality Standards'}</Label>
                  <Textarea
                    id="quality_standards"
                    value={formData.quality_standards}
                    onChange={(e) => setFormData({...formData, quality_standards: e.target.value})}
                    placeholder={isRTL ? 'معايير ومواصفات الجودة المطلوبة' : 'Required quality standards and specifications'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${currentStep >= step.id ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}`}>
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose?.()}
          className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep > 1 ? (isRTL ? 'السابق' : 'Previous') : (isRTL ? 'إلغاء' : 'Cancel')}
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && selectedCategories.length === 0}
            className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
          >
            {isRTL ? 'التالي' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.description}
            className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
          >
            {loading ? (isRTL ? 'جاري الإنشاء...' : 'Creating...') : (isRTL ? 'إنشاء الطلب' : 'Create Request')}
          </Button>
        )}
      </div>
    </div>
  );
};
