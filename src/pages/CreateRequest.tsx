import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategorySelector } from "@/components/enhanced/CategorySelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Clock, 
  DollarSign,
  Calendar,
  AlertCircle,
  Package,
  CheckCircle,
  Plus,
  X
} from "lucide-react";

interface RequestItem {
  id: string;
  title: string;
  description: string;
  categories: string[];
  budget_min: string;
  budget_max: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
}

const URGENCY_LEVELS = [
  { value: "low", label: "Low Priority", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High Priority", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" }
];

export default function CreateRequest() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [globalFormData, setGlobalFormData] = useState({
    location: '',
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
    deadline: '',
  }]);

  const [activeRequestIndex, setActiveRequestIndex] = useState(0);

  const addRequest = () => {
    const newRequest: RequestItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      categories: [],
      budget_min: '',
      budget_max: '',
      urgency: 'medium',
      deadline: '',
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

  const removeCategory = (categoryToRemove: string) => {
    const updatedRequests = [...requests];
    updatedRequests[activeRequestIndex].categories = updatedRequests[activeRequestIndex].categories.filter(cat => cat !== categoryToRemove);
    setRequests(updatedRequests);
  };

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      showError("Please log in to create a request");
      return;
    }

    // Validate all requests
    const invalidRequests = requests.filter(req => 
      !req.title || !req.description || req.categories.length === 0
    );
    
    if (invalidRequests.length > 0) {
      showError("Please fill in all required fields for all requests");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create all requests
      const createPromises = requests.map(async (request) => {
        const requestData = {
          title: request.title,
          description: request.description,
          category: request.categories[0], // Primary category
          location: globalFormData.location || null,
          urgency: request.urgency,
          budget_min: request.budget_min ? parseFloat(request.budget_min) : null,
          budget_max: request.budget_max ? parseFloat(request.budget_max) : null,
          currency: globalFormData.currency,
          deadline: request.deadline || null,
          requirements: {
            categories: request.categories
          },
          client_id: userProfile.user_id,
          admin_approval_status: "pending"
        };

        const { error } = await supabase
          .from("requests")
          .insert([requestData]);

        if (error) throw error;
        return true;
      });

      const results = await Promise.all(createPromises);
      
      if (results.every(result => result)) {
        showSuccess(`Successfully created ${requests.length} request${requests.length > 1 ? 's' : ''}!`);
        navigate("/requests");
      }
    } catch (error) {
      console.error("Error creating requests:", error);
      showError("Failed to create requests. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRequest = requests[activeRequestIndex];

  return (
    <ClientPageContainer className="max-w-none">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-start md:space-y-0 mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/requests")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 leading-tight">
              {isRTL ? 'إنشاء طلبات جديدة' : 'Create New Requests'}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base">
              {isRTL ? 'أرسل طلبات توريد جديدة للعثور على الموردين' : 'Submit new procurement requests to find vendors'}
            </p>
          </div>
        </div>
      </div>

      {/* Global Settings Card */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {isRTL ? 'الإعدادات العامة' : 'Global Settings'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'إعدادات مشتركة لجميع الطلبات' : 'Shared settings for all requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="global-location">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  {isRTL ? 'الموقع' : 'Location'}
                </Label>
                <Input
                  id="global-location"
                  value={globalFormData.location}
                  onChange={(e) => setGlobalFormData({...globalFormData, location: e.target.value})}
                  placeholder={isRTL ? 'مثال: الرياض، المملكة العربية السعودية' : 'e.g., Riyadh, Saudi Arabia'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="global-currency">
                  <DollarSign className="inline mr-2 h-4 w-4" />
                  {isRTL ? 'العملة' : 'Currency'}
                </Label>
                <Select value={globalFormData.currency} onValueChange={(value) => setGlobalFormData({...globalFormData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر العملة' : 'Select currency'} />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border-border shadow-lg">
                    <SelectItem value="SAR">{isRTL ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}</SelectItem>
                    <SelectItem value="USD">{isRTL ? 'دولار أمريكي (USD)' : 'US Dollar (USD)'}</SelectItem>
                    <SelectItem value="EUR">{isRTL ? 'يورو (EUR)' : 'Euro (EUR)'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
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

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isRTL ? `تفاصيل الطلب ${activeRequestIndex + 1}` : `Request ${activeRequestIndex + 1} Details`}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'قدم معلومات تفصيلية عن احتياجاتك' : 'Provide detailed information about your procurement needs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {isRTL ? 'عنوان الطلب *' : 'Request Title *'}
                  </Label>
                  <Input
                    id="title"
                    value={activeRequest.title}
                    onChange={(e) => updateRequest(activeRequestIndex, { title: e.target.value })}
                    placeholder={isRTL ? 'مثال: مشروع تجديد المكتب' : 'e.g., Office renovation project'}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {isRTL ? 'الوصف *' : 'Description *'}
                  </Label>
                  <Textarea
                    id="description"
                    value={activeRequest.description}
                    onChange={(e) => updateRequest(activeRequestIndex, { description: e.target.value })}
                    placeholder={isRTL ? 'قدم وصفاً تفصيلياً لمتطلباتك...' : 'Provide a detailed description of your requirements...'}
                    rows={4}
                    required
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label>
                    {isRTL ? 'الفئات *' : 'Categories *'}
                  </Label>
                  <CategorySelector
                    selectedCategory={activeRequest.categories[0] || ""}
                    onCategoryChange={(category: string) => {
                      if (category && !activeRequest.categories.includes(category)) {
                        updateRequest(activeRequestIndex, { 
                          categories: [category] // Replace with single category for now
                        });
                      }
                    }}
                  />
                  
                  {/* Display selected category */}
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

                {/* Urgency and Deadline */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">
                      <Clock className="inline mr-2 h-4 w-4" />
                      {isRTL ? 'مستوى الأولوية' : 'Urgency Level'}
                    </Label>
                    <Select 
                      value={activeRequest.urgency} 
                      onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                        updateRequest(activeRequestIndex, { urgency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر مستوى الأولوية' : 'Select urgency level'} />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-background border-border shadow-lg">
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={level.color}>
                                {level.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      <Calendar className="inline mr-2 h-4 w-4" />
                      {isRTL ? 'الموعد النهائي (اختياري)' : 'Deadline (Optional)'}
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={activeRequest.deadline}
                      onChange={(e) => updateRequest(activeRequestIndex, { deadline: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {isRTL ? 'نطاق الميزانية (اختياري)' : 'Budget Range (Optional)'}
                  </Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget_min" className="text-sm">
                        {isRTL ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}
                      </Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={activeRequest.budget_min}
                        onChange={(e) => updateRequest(activeRequestIndex, { budget_min: e.target.value })}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_max" className="text-sm">
                        {isRTL ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}
                      </Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={activeRequest.budget_max}
                        onChange={(e) => updateRequest(activeRequestIndex, { budget_max: e.target.value })}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse gap-3 pt-6 border-t sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/requests")}
                    disabled={isSubmitting}
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || requests.some(req => !req.title || !req.description || req.categories.length === 0)}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {isRTL ? 'إنشاء الطلبات...' : 'Creating Requests...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isRTL ? 'إنشاء الطلبات' : 'Create Requests'} ({requests.length})
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Process Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submit Request</p>
                    <p className="text-xs text-muted-foreground">Provide detailed requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Vendor Matching</p>
                    <p className="text-xs text-muted-foreground">Qualified vendors submit offers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Select Winner</p>
                    <p className="text-xs text-muted-foreground">Review and choose the best offer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Be specific about your requirements
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Include technical specifications if needed
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Set realistic budget ranges
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Provide clear deadlines
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientPageContainer>
  );
}