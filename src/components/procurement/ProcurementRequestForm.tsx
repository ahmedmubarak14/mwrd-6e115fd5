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
import { CategorySelector } from "@/components/forms/CategorySelector";
import { useRealTimeRequests } from "@/hooks/useRealTimeRequests";
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

interface RequestItem {
  id: string;
  title: string;
  description: string;
  categories: string[];
  budget_min: string;
  budget_max: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  boqItems: BOQItem[];
  payment_terms: string;
  delivery_requirements: string;
  quality_standards: string;
}

export const ProcurementRequestForm = () => {
  const { t, language } = useLanguage();
  const { createRequest } = useRealTimeRequests();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [globalFormData, setGlobalFormData] = useState({
    location: '',
    national_address: '',
    currency: 'SAR',
  });

  const [requests, setRequests] = useState<RequestItem[]>([{
    id: '1',
    title: '',
    description: '',
    categories: [],
    budget_min: '',
    budget_max: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    deadline: undefined,
    boqItems: [],
    payment_terms: '',
    delivery_requirements: '',
    quality_standards: ''
  }]);

  const [activeRequestIndex, setActiveRequestIndex] = useState(0);

  const [newBOQItem, setNewBOQItem] = useState<Partial<BOQItem>>({
    description: '',
    category: '',
    quantity: 1,
    unit: '',
    estimatedPrice: 0,
    specifications: ''
  });

  const addRequest = () => {
    const newRequest: RequestItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      categories: [],
      budget_min: '',
      budget_max: '',
      urgency: 'medium',
      deadline: undefined,
      boqItems: [],
      payment_terms: '',
      delivery_requirements: '',
      quality_standards: ''
    };
    setRequests([...requests, newRequest]);
    setActiveRequestIndex(requests.length);
  };

  const removeRequest = (index: number) => {
    if (requests.length > 1) {
      const newRequests = requests.filter((_, i) => i !== index);
      setRequests(newRequests);
      setActiveRequestIndex(Math.max(0, activeRequestIndex - 1));
    }
  };

  const updateRequest = (index: number, updates: Partial<RequestItem>) => {
    const newRequests = [...requests];
    newRequests[index] = { ...newRequests[index], ...updates };
    setRequests(newRequests);
  };

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
      
      const updatedRequests = [...requests];
      updatedRequests[activeRequestIndex].boqItems.push(item);
      setRequests(updatedRequests);
      
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
    const updatedRequests = [...requests];
    updatedRequests[activeRequestIndex].boqItems = updatedRequests[activeRequestIndex].boqItems.filter(item => item.id !== id);
    setRequests(updatedRequests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('All requests:', requests);
    
    // Validate all requests
    const invalidRequests = requests.filter(req => 
      !req.title || !req.description || req.categories.length === 0
    );
    
    console.log('Invalid requests:', invalidRequests);
    
    if (invalidRequests.length > 0) {
      console.log('Validation failed');
      toast({
        title: isRTL ? "خطأ في البيانات" : "Validation Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة لجميع الطلبات" : "Please fill in all required fields for all requests",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Starting to create requests...');
      
      // Create all requests
      const createPromises = requests.map(async (request, index) => {
        console.log(`Processing request ${index + 1}:`, request);
        
        console.log('Creating request with data:', {
          title: request.title.trim(),
          description: request.description.trim(),
          category: request.categories[0],
          location: globalFormData.location?.trim() || null,
          budget_min: request.budget_min ? parseFloat(request.budget_min) : undefined,
          budget_max: request.budget_max ? parseFloat(request.budget_max) : undefined
        });
        
        const descriptionParts = [
          request.description.trim(),
          request.payment_terms ? `Payment terms: ${request.payment_terms}` : null,
          request.delivery_requirements ? `Delivery requirements: ${request.delivery_requirements}` : null,
          request.quality_standards ? `Quality standards: ${request.quality_standards}` : null,
          (Array.isArray(request.categories) && request.categories.length ? `Categories: ${request.categories.join(', ')}` : null),
          (request.boqItems?.length ? `BOQ items count: ${request.boqItems.length}` : null),
          (globalFormData.national_address?.trim() ? `Address: ${globalFormData.national_address.trim()}` : null)
        ].filter(Boolean).join('\n\n');
        
        const requestData = {
          title: request.title.trim(),
          description: descriptionParts,
          category: request.categories[0], // Primary category
          budget_min: request.budget_min ? parseFloat(request.budget_min) : undefined,
          budget_max: request.budget_max ? parseFloat(request.budget_max) : undefined,
          currency: globalFormData.currency,
          location: globalFormData.location?.trim() || null,
          deadline: request.deadline?.toISOString() || null,
          urgency: request.urgency
        };
        
        console.log(`Request data for request ${index + 1}:`, requestData);
        
        const result = await createRequest(requestData);
        console.log(`Result for request ${index + 1}:`, result);
        
        return result;
      });

      console.log('Waiting for all requests to complete...');
      const results = await Promise.all(createPromises);
      console.log('All results:', results);
      
      if (results.every(result => result)) {
        console.log('All requests created successfully');
        toast({
          title: isRTL ? "تم إنشاء الطلبات بنجاح" : "Requests Created Successfully",
          description: isRTL ? `تم إنشاء ${requests.length} طلب بنجاح` : `Successfully created ${requests.length} requests`
        });
        
        // Reset form
        setRequests([{
          id: '1',
          title: '',
          description: '',
          categories: [],
          budget_min: '',
          budget_max: '',
          urgency: 'medium',
          deadline: undefined,
          boqItems: [],
          payment_terms: '',
          delivery_requirements: '',
          quality_standards: ''
        }]);
        setActiveRequestIndex(0);
        setGlobalFormData({
          location: '',
          national_address: '',
          currency: 'SAR',
        });
      }
    } catch (error) {
      console.error('Error creating requests:', error);
      
      // Provide more specific error message based on error type
      let errorMessage = isRTL ? "حدث خطأ أثناء إنشاء الطلبات" : "Failed to create request. Please try again.";
      
      if (error.message?.includes('invalid input syntax for type json')) {
        errorMessage = isRTL ? "خطأ في تنسيق البيانات. يرجى المحاولة مرة أخرى." : "Data formatting error. Please try again.";
      } else if (error.message?.includes('Missing required fields')) {
        errorMessage = isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields";
      } else if (error.message?.includes('User not authenticated')) {
        errorMessage = isRTL ? "يرجى تسجيل الدخول أولاً" : "Please log in first";
      }
      
      toast({
        title: isRTL ? "خطأ في إنشاء الطلب" : "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const updatedRequests = [...requests];
    updatedRequests[activeRequestIndex].categories = updatedRequests[activeRequestIndex].categories.filter(cat => cat !== categoryToRemove);
    setRequests(updatedRequests);
  };

  const activeRequest = requests[activeRequestIndex];

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isRTL ? 'إنشاء طلبات توريد جديدة' : 'Create New Procurement Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? 'الإعدادات العامة' : 'Global Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'المدينة' : 'City'}</Label>
                    <Select 
                      value={globalFormData.location} 
                      onValueChange={(value) => setGlobalFormData({...globalFormData, location: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر المدينة' : 'Select city'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</SelectItem>
                        <SelectItem value="Jeddah">{isRTL ? 'جدة' : 'Jeddah'}</SelectItem>
                        <SelectItem value="Mecca">{isRTL ? 'مكة المكرمة' : 'Mecca'}</SelectItem>
                        <SelectItem value="Medina">{isRTL ? 'المدينة المنورة' : 'Medina'}</SelectItem>
                        <SelectItem value="Dammam">{isRTL ? 'الدمام' : 'Dammam'}</SelectItem>
                        <SelectItem value="Khobar">{isRTL ? 'الخبر' : 'Khobar'}</SelectItem>
                        <SelectItem value="Dhahran">{isRTL ? 'الظهران' : 'Dhahran'}</SelectItem>
                        <SelectItem value="Taif">{isRTL ? 'الطائف' : 'Taif'}</SelectItem>
                        <SelectItem value="Buraidah">{isRTL ? 'بريدة' : 'Buraidah'}</SelectItem>
                        <SelectItem value="Tabuk">{isRTL ? 'تبوك' : 'Tabuk'}</SelectItem>
                        <SelectItem value="Khamis_Mushait">{isRTL ? 'خميس مشيط' : 'Khamis Mushait'}</SelectItem>
                        <SelectItem value="Hail">{isRTL ? 'حائل' : 'Hail'}</SelectItem>
                        <SelectItem value="Jubail">{isRTL ? 'الجبيل' : 'Jubail'}</SelectItem>
                        <SelectItem value="Abha">{isRTL ? 'أبها' : 'Abha'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
                    <Select value={globalFormData.currency} onValueChange={(value) => setGlobalFormData({...globalFormData, currency: value})}>
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
                
                <div className="mt-4">
                  <Label>{isRTL ? 'العنوان الوطني أو العنوان المختصر' : 'National Address or Short Address'}</Label>
                  <Textarea
                    value={globalFormData.national_address}
                    onChange={(e) => setGlobalFormData({...globalFormData, national_address: e.target.value})}
                    placeholder={isRTL ? 'أدخل العنوان الوطني أو عنوان مختصر للتسليم' : 'Enter national address or short delivery address'}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Request Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {requests.map((request, index) => (
                <Button
                  key={request.id}
                  type="button"
                  variant={activeRequestIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveRequestIndex(index)}
                  className="relative"
                >
                  {isRTL ? `طلب ${index + 1}` : `Request ${index + 1}`}
                  {requests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-destructive text-destructive-foreground rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRequest(index);
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  )}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequest}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {isRTL ? 'إضافة طلب' : 'Add Request'}
              </Button>
            </div>

            {/* Active Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? `طلب ${activeRequestIndex + 1}` : `Request ${activeRequestIndex + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div>
                  <Label>{isRTL ? 'عنوان الطلب' : 'Request Title'}</Label>
                  <Input
                    value={activeRequest.title}
                    onChange={(e) => updateRequest(activeRequestIndex, { title: e.target.value })}
                    placeholder={isRTL ? 'أدخل عنوان الطلب' : 'Enter request title'}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>{isRTL ? 'وصف الطلب' : 'Request Description'}</Label>
                  <Textarea
                    value={activeRequest.description}
                    onChange={(e) => updateRequest(activeRequestIndex, { description: e.target.value })}
                    placeholder={isRTL ? 'وصف تفصيلي للطلب' : 'Detailed description of the request'}
                    className="min-h-32"
                    required
                  />
                </div>

                {/* Categories */}
                <div>
                  <Label>{isRTL ? 'الفئات المطلوبة' : 'Required Categories'}</Label>
                  <CategorySelector
                    value={''}
                    onValueChange={(category: string) => {
                      if (category && !activeRequest.categories.includes(category)) {
                        updateRequest(activeRequestIndex, { 
                          categories: [...activeRequest.categories, category] 
                        });
                      }
                    }}
                    includeSubcategories
                  />
                  
                  {/* Display selected categories */}
                  {activeRequest.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeRequest.categories.map((category) => (
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

                {/* Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}</Label>
                    <Input
                      type="number"
                      value={activeRequest.budget_min}
                      onChange={(e) => updateRequest(activeRequestIndex, { budget_min: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label>{isRTL ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}</Label>
                    <Input
                      type="number"
                      value={activeRequest.budget_max}
                      onChange={(e) => updateRequest(activeRequestIndex, { budget_max: e.target.value })}
                      placeholder="0"
                    />
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
                            !activeRequest.deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {activeRequest.deadline ? format(activeRequest.deadline, "PPP") : (isRTL ? 'اختر التاريخ' : 'Pick a date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={activeRequest.deadline}
                          onSelect={(date) => updateRequest(activeRequestIndex, { deadline: date })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>{isRTL ? 'الأولوية' : 'Urgency'}</Label>
                    <Select 
                      value={activeRequest.urgency} 
                      onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                        updateRequest(activeRequestIndex, { urgency: value })
                      }
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
                </div>
              </CardContent>
            </Card>

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
                {activeRequest.boqItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.category} • {item.quantity} {item.unit} • {item.estimatedPrice} {globalFormData.currency}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? 'متطلبات إضافية' : 'Additional Requirements'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{isRTL ? 'شروط الدفع' : 'Payment Terms'}</Label>
                  <Textarea
                    value={activeRequest.payment_terms}
                    onChange={(e) => updateRequest(activeRequestIndex, { payment_terms: e.target.value })}
                    placeholder={isRTL ? 'شروط الدفع المطلوبة' : 'Required payment terms'}
                  />
                </div>
                
                <div>
                  <Label>{isRTL ? 'متطلبات التسليم' : 'Delivery Requirements'}</Label>
                  <Textarea
                    value={activeRequest.delivery_requirements}
                    onChange={(e) => updateRequest(activeRequestIndex, { delivery_requirements: e.target.value })}
                    placeholder={isRTL ? 'متطلبات التسليم' : 'Delivery requirements'}
                  />
                </div>
                
                <div>
                  <Label>{isRTL ? 'معايير الجودة' : 'Quality Standards'}</Label>
                  <Textarea
                    value={activeRequest.quality_standards}
                    onChange={(e) => updateRequest(activeRequestIndex, { quality_standards: e.target.value })}
                    placeholder={isRTL ? 'معايير الجودة المطلوبة' : 'Required quality standards'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isRTL ? 'إنشاء طلبات التوريد' : 'Create Procurement Requests'} ({requests.length})
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
