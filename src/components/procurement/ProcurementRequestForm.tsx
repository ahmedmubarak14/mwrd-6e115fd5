
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CategorySelector } from "@/components/enhanced/CategorySelector";
import { useRequests } from "@/hooks/useRequests";
import { useToast } from "@/hooks/use-toast";

interface BOQItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  specifications?: string;
}

export const ProcurementRequestForm = () => {
  const { t, language } = useLanguage();
  const { createRequest } = useRequests();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    budget_min: '',
    budget_max: '',
    currency: 'SAR',
    payment_terms: '',
    delivery_requirements: '',
    quality_standards: ''
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date>();
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [newBOQItem, setNewBOQItem] = useState<Partial<BOQItem>>({
    description: '',
    category: '',
    quantity: 1,
    unit: '',
    estimatedPrice: 0,
    specifications: ''
  });

  const addBOQItem = () => {
    if (newBOQItem.description && newBOQItem.category) {
      const item: BOQItem = {
        id: Date.now().toString(),
        description: newBOQItem.description || '',
        category: newBOQItem.category || '',
        quantity: newBOQItem.quantity || 1,
        unit: newBOQItem.unit || 'piece',
        estimatedPrice: newBOQItem.estimatedPrice || 0,
        specifications: newBOQItem.specifications || ''
      };
      setBOQItems([...boqItems, item]);
      setNewBOQItem({
        description: '',
        category: '',
        quantity: 1,
        unit: '',
        estimatedPrice: 0,
        specifications: ''
      });
    }
  };

  const removeBOQItem = (id: string) => {
    setBOQItems(boqItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || selectedCategories.length === 0) {
      toast({
        title: isRTL ? "خطأ في البيانات" : "Validation Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategories[0], // Primary category
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        currency: formData.currency,
        location: formData.location || undefined,
        deadline: deadline?.toISOString().split('T')[0] || undefined,
        urgency: formData.urgency,
        requirements: {
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
          title: isRTL ? "تم إنشاء الطلب بنجاح" : "Request Created Successfully",
          description: isRTL ? "سيتم مراجعة طلبك قريباً" : "Your request will be reviewed shortly"
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          urgency: 'medium',
          budget_min: '',
          budget_max: '',
          currency: 'SAR',
          payment_terms: '',
          delivery_requirements: '',
          quality_standards: ''
        });
        setSelectedCategories([]);
        setDeadline(undefined);
        setBOQItems([]);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: isRTL ? "خطأ في إنشاء الطلب" : "Error Creating Request",
        description: isRTL ? "حدث خطأ أثناء إنشاء الطلب" : "An error occurred while creating the request",
        variant: "destructive"
      });
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isRTL ? 'إنشاء طلب توريد جديد' : 'Create New Procurement Request'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{isRTL ? 'عنوان الطلب' : 'Request Title'}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={isRTL ? 'أدخل عنوان الطلب' : 'Enter request title'}
                  required
                />
              </div>
              
              <div>
                <Label>{isRTL ? 'الموقع' : 'Location'}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder={isRTL ? 'أدخل الموقع' : 'Enter location'}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>{isRTL ? 'وصف الطلب' : 'Request Description'}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder={isRTL ? 'وصف تفصيلي للطلب' : 'Detailed description of the request'}
                className="min-h-32"
                required
              />
            </div>

            {/* Categories */}
            <div>
              <Label>{isRTL ? 'الفئات المطلوبة' : 'Required Categories'}</Label>
              <CategorySelector
                selectedCategory=""
                onCategoryChange={(category: string) => {
                  if (category && !selectedCategories.includes(category)) {
                    setSelectedCategories([...selectedCategories, category]);
                  }
                }}
              />
              
              {/* Display selected categories */}
              {selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <div key={category} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span>{category}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{isRTL ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}</Label>
                <Input
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label>{isRTL ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}</Label>
                <Input
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">{isRTL ? 'ريال سعودي' : 'Saudi Riyal'}</SelectItem>
                    <SelectItem value="USD">{isRTL ? 'دولار أمريكي' : 'US Dollar'}</SelectItem>
                    <SelectItem value="EUR">{isRTL ? 'يورو' : 'Euro'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline and Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <CalendarIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {deadline ? format(deadline, "PPP") : (isRTL ? 'اختر التاريخ' : 'Pick a date')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>{isRTL ? 'الأولوية' : 'Urgency'}</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
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
            </div>

            {/* BOQ Items Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? 'عناصر جدول الكميات (BOQ)' : 'Bill of Quantities (BOQ) Items'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new BOQ item */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <Input
                    placeholder={isRTL ? 'وصف العنصر' : 'Item description'}
                    value={newBOQItem.description || ''}
                    onChange={(e) => setNewBOQItem({...newBOQItem, description: e.target.value})}
                  />
                  <Input
                    placeholder={isRTL ? 'الفئة' : 'Category'}
                    value={newBOQItem.category || ''}
                    onChange={(e) => setNewBOQItem({...newBOQItem, category: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={isRTL ? 'الكمية' : 'Quantity'}
                      value={newBOQItem.quantity || ''}
                      onChange={(e) => setNewBOQItem({...newBOQItem, quantity: parseInt(e.target.value) || 0})}
                    />
                    <Input
                      placeholder={isRTL ? 'الوحدة' : 'Unit'}
                      value={newBOQItem.unit || ''}
                      onChange={(e) => setNewBOQItem({...newBOQItem, unit: e.target.value})}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={isRTL ? 'السعر المقدر' : 'Estimated price'}
                    value={newBOQItem.estimatedPrice || ''}
                    onChange={(e) => setNewBOQItem({...newBOQItem, estimatedPrice: parseFloat(e.target.value) || 0})}
                  />
                  <Input
                    placeholder={isRTL ? 'المواصفات' : 'Specifications'}
                    value={newBOQItem.specifications || ''}
                    onChange={(e) => setNewBOQItem({...newBOQItem, specifications: e.target.value})}
                  />
                  <Button type="button" onClick={addBOQItem} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {isRTL ? 'إضافة عنصر' : 'Add Item'}
                  </Button>
                </div>

                {/* Display BOQ items */}
                {boqItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.category} • {item.quantity} {item.unit} • {item.estimatedPrice} {formData.currency}
                      </div>
                      {item.specifications && (
                        <div className="text-sm text-muted-foreground">{item.specifications}</div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeBOQItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Requirements */}
            <div className="space-y-4">
              <div>
                <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
                <Textarea
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                  placeholder={isRTL ? 'شروط الدفع المطلوبة' : 'Required payment terms'}
                />
              </div>
              
              <div>
                <Label>{isRTL ? 'متطلبات التسليم' : 'Delivery Requirements'}</Label>
                <Textarea
                  value={formData.delivery_requirements}
                  onChange={(e) => setFormData({...formData, delivery_requirements: e.target.value})}
                  placeholder={isRTL ? 'متطلبات التسليم' : 'Delivery requirements'}
                />
              </div>
              
              <div>
                <Label>{isRTL ? 'معايير الجودة' : 'Quality Standards'}</Label>
                <Textarea
                  value={formData.quality_standards}
                  onChange={(e) => setFormData({...formData, quality_standards: e.target.value})}
                  placeholder={isRTL ? 'معايير الجودة المطلوبة' : 'Required quality standards'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isRTL ? 'إنشاء طلب التوريد' : 'Create Procurement Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
