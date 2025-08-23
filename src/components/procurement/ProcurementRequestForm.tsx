
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/ui/FileUpload";
import { CategorySelector } from "@/components/enhanced/CategorySelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/hooks/useCategories";
import { useRequests } from "@/hooks/useRequests";
import { Calendar, MapPin, Clock, DollarSign, FileText, Plus, X } from "lucide-react";

interface BOQItem {
  id: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  specifications?: string;
  notes?: string;
}

export const ProcurementRequestForm: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { categories } = useCategories();
  const { createRequest } = useRequests();
  
  const [step, setStep] = useState<'category' | 'boq' | 'details'>('category');
  const [loading, setLoading] = useState(false);
  
  // Form data state
  const [selectedCategories, setSelectedCategories] = useState<{
    category: string;
    subcategory: string;
    requirements: Record<string, any>;
  }[]>([]);
  
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [requestDetails, setRequestDetails] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    location: '',
    deadline: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    payment_terms: '',
    delivery_requirements: '',
    quality_standards: '',
    attachments: [] as string[]
  });

  const handleCategorySelection = (category: string, subcategory: string, requirements: Record<string, any>) => {
    const newSelection = { category, subcategory, requirements };
    setSelectedCategories(prev => [...prev, newSelection]);
  };

  const removeCategorySelection = (index: number) => {
    setSelectedCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addBOQItem = () => {
    const newItem: BOQItem = {
      id: Date.now().toString(),
      description: '',
      category: selectedCategories[0]?.subcategory || '',
      unit: '',
      quantity: 1,
      unit_price: undefined,
      total_price: undefined,
      specifications: '',
      notes: ''
    };
    setBOQItems(prev => [...prev, newItem]);
  };

  const updateBOQItem = (id: string, updates: Partial<BOQItem>) => {
    setBOQItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeBOQItem = (id: string) => {
    setBOQItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCSVUpload = (file: File) => {
    // Parse CSV and convert to BOQ items
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const newItems: BOQItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 4) {
          newItems.push({
            id: Date.now().toString() + i,
            description: values[0] || '',
            category: selectedCategories[0]?.subcategory || '',
            unit: values[1] || '',
            quantity: parseFloat(values[2]) || 1,
            unit_price: parseFloat(values[3]) || undefined,
            total_price: (parseFloat(values[2]) || 1) * (parseFloat(values[3]) || 0),
            specifications: values[4] || '',
            notes: values[5] || ''
          });
        }
      }
      setBOQItems(prev => [...prev, ...newItems]);
    };
    reader.readAsText(file);
  };

  const calculateTotalBudget = () => {
    return boqItems.reduce((total, item) => {
      return total + (item.total_price || (item.quantity * (item.unit_price || 0)));
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create main request
      const requestData = {
        title: requestDetails.title,
        description: requestDetails.description,
        budget_min: requestDetails.budget_min ? parseFloat(requestDetails.budget_min) : undefined,
        budget_max: requestDetails.budget_max ? parseFloat(requestDetails.budget_max) : undefined,
        location: requestDetails.location,
        deadline: requestDetails.deadline,
        urgency: requestDetails.urgency,
        requirements: {
          payment_terms: requestDetails.payment_terms,
          delivery_requirements: requestDetails.delivery_requirements,
          quality_standards: requestDetails.quality_standards,
          boq_items: boqItems,
          categories: selectedCategories
        }
      };

      await createRequest(requestData);
      
      // Reset form
      setStep('category');
      setSelectedCategories([]);
      setBOQItems([]);
      setRequestDetails({
        title: '',
        description: '',
        budget_min: '',
        budget_max: '',
        location: '',
        deadline: '',
        urgency: 'medium',
        payment_terms: '',
        delivery_requirements: '',
        quality_standards: '',
        attachments: []
      });
      
    } catch (error) {
      console.error('Error creating procurement request:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {isRTL ? 'اختر فئات الشراء' : 'Select Procurement Categories'}
        </h2>
        <p className="text-muted-foreground">
          {isRTL ? 
            'اختر الفئات والفئات الفرعية لطلب الشراء الخاص بك' :
            'Choose the categories and subcategories for your procurement request'
          }
        </p>
      </div>

      {selectedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'الفئات المختارة' : 'Selected Categories'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedCategories.map((selection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Badge variant="outline" className="mr-2">
                      {selection.category}
                    </Badge>
                    <Badge variant="secondary">
                      {selection.subcategory}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategorySelection(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CategorySelector
        onCategoryChange={handleCategorySelection}
      />

      {selectedCategories.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => setStep('boq')}>
            {isRTL ? 'التالي: قائمة الكميات' : 'Next: BOQ Items'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderBOQStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isRTL ? 'قائمة الكميات (BOQ)' : 'Bill of Quantities (BOQ)'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'أضف العناصر المطلوبة للشراء' : 'Add items required for procurement'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <FileUpload
            accept=".csv"
            onFileSelect={(file) => handleCSVUpload(file)}
            className="hidden"
            id="csv-upload"
          />
          <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
            <FileText className="h-4 w-4 mr-2" />
            {isRTL ? 'رفع CSV' : 'Upload CSV'}
          </Button>
          
          <Button onClick={addBOQItem}>
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'إضافة عنصر' : 'Add Item'}
          </Button>
        </div>
      </div>

      {boqItems.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">
                      {isRTL ? 'الوصف' : 'Description'}
                    </th>
                    <th className="p-3 text-left font-medium">
                      {isRTL ? 'الوحدة' : 'Unit'}
                    </th>
                    <th className="p-3 text-left font-medium">
                      {isRTL ? 'الكمية' : 'Quantity'}
                    </th>
                    <th className="p-3 text-left font-medium">
                      {isRTL ? 'سعر الوحدة' : 'Unit Price'}
                    </th>
                    <th className="p-3 text-left font-medium">
                      {isRTL ? 'الإجمالي' : 'Total'}
                    </th>
                    <th className="p-3 text-left font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {boqItems.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">
                        <Input
                          value={item.description}
                          onChange={(e) => updateBOQItem(item.id, { description: e.target.value })}
                          placeholder={isRTL ? 'وصف العنصر' : 'Item description'}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={item.unit}
                          onChange={(e) => updateBOQItem(item.id, { unit: e.target.value })}
                          placeholder={isRTL ? 'قطعة، متر، كيلو...' : 'pcs, m, kg...'}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const quantity = parseFloat(e.target.value) || 0;
                            updateBOQItem(item.id, { 
                              quantity,
                              total_price: quantity * (item.unit_price || 0)
                            });
                          }}
                          min="1"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={item.unit_price || ''}
                          onChange={(e) => {
                            const unit_price = parseFloat(e.target.value) || 0;
                            updateBOQItem(item.id, { 
                              unit_price,
                              total_price: item.quantity * unit_price
                            });
                          }}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-medium">
                          {((item.total_price || (item.quantity * (item.unit_price || 0)))).toLocaleString()} SAR
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBOQItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {boqItems.length > 0 && (
              <div className="p-4 border-t bg-muted/25">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {isRTL ? 'إجمالي تقديري:' : 'Estimated Total:'}
                  </span>
                  <span className="text-lg font-bold">
                    {calculateTotalBudget().toLocaleString()} SAR
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('category')}>
          {isRTL ? 'السابق' : 'Previous'}
        </Button>
        <Button 
          onClick={() => setStep('details')}
          disabled={boqItems.length === 0}
        >
          {isRTL ? 'التالي: التفاصيل' : 'Next: Details'}
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {isRTL ? 'تفاصيل طلب الشراء' : 'Procurement Request Details'}
        </h2>
        <p className="text-muted-foreground">
          {isRTL ? 'أكمل المعلومات المطلوبة لطلب الشراء' : 'Complete the required information for your procurement request'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="title">
            {isRTL ? 'عنوان الطلب *' : 'Request Title *'}
          </Label>
          <Input
            id="title"
            value={requestDetails.title}
            onChange={(e) => setRequestDetails(prev => ({ ...prev, title: e.target.value }))}
            placeholder={isRTL ? 'عنوان واضح لطلب الشراء' : 'Clear title for procurement request'}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">
            {isRTL ? 'الوصف' : 'Description'}
          </Label>
          <Textarea
            id="description"
            value={requestDetails.description}
            onChange={(e) => setRequestDetails(prev => ({ ...prev, description: e.target.value }))}
            placeholder={isRTL ? 'وصف تفصيلي للمتطلبات' : 'Detailed description of requirements'}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="budget_min">
            {isRTL ? 'الحد الأدنى للميزانية (ريال سعودي)' : 'Minimum Budget (SAR)'}
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget_min"
              type="number"
              value={requestDetails.budget_min}
              onChange={(e) => setRequestDetails(prev => ({ ...prev, budget_min: e.target.value }))}
              placeholder="0"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="budget_max">
            {isRTL ? 'الحد الأقصى للميزانية (ريال سعودي)' : 'Maximum Budget (SAR)'}
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget_max"
              type="number"
              value={requestDetails.budget_max}
              onChange={(e) => setRequestDetails(prev => ({ ...prev, budget_max: e.target.value }))}
              placeholder="0"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">
            {isRTL ? 'موقع التسليم' : 'Delivery Location'}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              value={requestDetails.location}
              onChange={(e) => setRequestDetails(prev => ({ ...prev, location: e.target.value }))}
              placeholder={isRTL ? 'المدينة، المنطقة' : 'City, Region'}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="deadline">
            {isRTL ? 'موعد التسليم المطلوب' : 'Required Delivery Date'}
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="deadline"
              type="date"
              value={requestDetails.deadline}
              onChange={(e) => setRequestDetails(prev => ({ ...prev, deadline: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="urgency">
            {isRTL ? 'مستوى الأولوية' : 'Priority Level'}
          </Label>
          <Select 
            value={requestDetails.urgency} 
            onValueChange={(value: any) => setRequestDetails(prev => ({ ...prev, urgency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="payment_terms">
            {isRTL ? 'شروط الدفع' : 'Payment Terms'}
          </Label>
          <Select 
            value={requestDetails.payment_terms} 
            onValueChange={(value) => setRequestDetails(prev => ({ ...prev, payment_terms: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={isRTL ? 'اختر شروط الدفع' : 'Select payment terms'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net-15">{isRTL ? 'خلال 15 يوم' : 'Net 15'}</SelectItem>
              <SelectItem value="net-30">{isRTL ? 'خلال 30 يوم' : 'Net 30'}</SelectItem>
              <SelectItem value="net-45">{isRTL ? 'خلال 45 يوم' : 'Net 45'}</SelectItem>
              <SelectItem value="cash-on-delivery">{isRTL ? 'الدفع عند التسليم' : 'Cash on Delivery'}</SelectItem>
              <SelectItem value="advance-payment">{isRTL ? 'دفع مقدم' : 'Advance Payment'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="delivery_requirements">
            {isRTL ? 'متطلبات التسليم' : 'Delivery Requirements'}
          </Label>
          <Textarea
            id="delivery_requirements"
            value={requestDetails.delivery_requirements}
            onChange={(e) => setRequestDetails(prev => ({ ...prev, delivery_requirements: e.target.value }))}
            placeholder={isRTL ? 'متطلبات خاصة للتسليم والتركيب' : 'Special delivery and installation requirements'}
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="quality_standards">
            {isRTL ? 'معايير الجودة والمطابقة' : 'Quality Standards & Compliance'}
          </Label>
          <Textarea
            id="quality_standards"
            value={requestDetails.quality_standards}
            onChange={(e) => setRequestDetails(prev => ({ ...prev, quality_standards: e.target.value }))}
            placeholder={isRTL ? 'معايير الجودة، الشهادات المطلوبة، المطابقة للمواصفات' : 'Quality standards, required certifications, compliance specifications'}
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'ملخص طلب الشراء' : 'Procurement Request Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">
                {isRTL ? 'الفئات المحددة' : 'Selected Categories'}
              </h4>
              <div className="space-y-1">
                {selectedCategories.map((cat, index) => (
                  <Badge key={index} variant="outline" className="block w-fit">
                    {cat.subcategory}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">
                {isRTL ? 'عدد العناصر' : 'Total Items'}
              </h4>
              <p className="text-2xl font-bold">{boqItems.length}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">
                {isRTL ? 'الميزانية التقديرية' : 'Estimated Budget'}
              </h4>
              <p className="text-2xl font-bold">
                {calculateTotalBudget().toLocaleString()} SAR
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('boq')}>
          {isRTL ? 'السابق' : 'Previous'}
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !requestDetails.title.trim()}
        >
          {loading ? 
            (isRTL ? 'جاري الإرسال...' : 'Submitting...') :
            (isRTL ? 'إرسال طلب الشراء' : 'Submit Procurement Request')
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { key: 'category', label: isRTL ? 'الفئات' : 'Categories' },
            { key: 'boq', label: isRTL ? 'BOQ' : 'BOQ' },
            { key: 'details', label: isRTL ? 'التفاصيل' : 'Details' }
          ].map((stepItem, index) => (
            <div key={stepItem.key} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step === stepItem.key ? 'bg-primary text-primary-foreground' : 
                  ['category', 'boq', 'details'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }
              `}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${step === stepItem.key ? 'text-primary' : 'text-muted-foreground'}`}>
                {stepItem.label}
              </span>
              {index < 2 && (
                <div className={`w-12 h-px ml-4 ${
                  ['category', 'boq', 'details'].indexOf(step) > index ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {step === 'category' && renderCategoryStep()}
        {step === 'boq' && renderBOQStep()}
        {step === 'details' && renderDetailsStep()}
      </div>
    </div>
  );
};
