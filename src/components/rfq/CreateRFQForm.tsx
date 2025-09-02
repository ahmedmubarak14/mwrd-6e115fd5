import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, AlertCircle, FileText, DollarSign, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmartCategorySelector } from './SmartCategorySelector';
import { SmartFileUpload } from './SmartFileUpload';
import { useRFQs, CreateRFQData } from '@/hooks/useRFQs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

export const CreateRFQForm = () => {
  const navigate = useNavigate();
  const { createRFQ } = useRFQs();
  const { toast } = useToast();
  const { language } = useLanguage();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    selectedCategories: string[];
    budget_min: string;
    budget_max: string;
    currency: string;
    delivery_location: string;
    submission_deadline: Date | undefined;
    project_start_date: Date | undefined;
    project_end_date: Date | undefined;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    is_public: boolean;
    terms_and_conditions: string;
    requirements: string;
    evaluation_criteria: string;
  }>({
    title: '',
    description: '',
    selectedCategories: [],
    budget_min: '',
    budget_max: '',
    currency: 'SAR',
    delivery_location: '',
    submission_deadline: undefined,
    project_start_date: undefined,
    project_end_date: undefined,
    priority: 'medium',
    is_public: true,
    terms_and_conditions: '',
    requirements: '',
    evaluation_criteria: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.selectedCategories.length > 0);
      case 2:
        return !!(formData.submission_deadline);
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: language === 'ar' ? 'بيانات مفقودة' : 'Missing Information',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    try {
      const rfqData: CreateRFQData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.selectedCategories[0], // Primary category
        subcategory_id: formData.selectedCategories[1], // Secondary category if exists
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        currency: formData.currency,
        delivery_location: formData.delivery_location || undefined,
        submission_deadline: formData.submission_deadline!.toISOString(),
        project_start_date: formData.project_start_date?.toISOString(),
        project_end_date: formData.project_end_date?.toISOString(),
        priority: formData.priority,
        is_public: formData.is_public,
        requirements: {
          description: formData.requirements,
          categories: formData.selectedCategories,
          attachments: uploadedFiles.map(f => ({ name: f.name, path: f.path }))
        },
        evaluation_criteria: {
          description: formData.evaluation_criteria
        },
        terms_and_conditions: formData.terms_and_conditions || undefined
      };

      const result = await createRFQ(rfqData);
      if (result) {
        toast({
          title: language === 'ar' ? 'تم إنشاء الطلب' : 'RFQ Created',
          description: language === 'ar' ? 'تم إنشاء طلب التسعير بنجاح' : 'Your RFQ has been created successfully'
        });
        navigate('/requests');
      }
    } catch (error) {
      console.error('Error creating RFQ:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'An error occurred while creating the RFQ',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
            index + 1 <= currentStep 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={cn(
              "w-16 h-0.5 mx-2 transition-colors",
              index + 1 < currentStep ? "bg-primary" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'أدخل التفاصيل الأساسية لطلب التسعير الخاص بك'
            : 'Enter the basic details for your RFQ'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="title" className="flex items-center gap-2">
            {language === 'ar' ? 'عنوان الطلب' : 'RFQ Title'}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder={language === 'ar' ? 'أدخل عنوان واضح ومختصر' : 'Enter a clear and concise title'}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="flex items-center gap-2">
            {language === 'ar' ? 'وصف تفصيلي' : 'Detailed Description'}
            <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder={language === 'ar' 
              ? 'اشرح متطلباتك بالتفصيل، المواصفات، والتوقعات'
              : 'Explain your requirements in detail, specifications, and expectations'}
            className="mt-1 min-h-32"
          />
        </div>

        <SmartCategorySelector
          selectedCategories={formData.selectedCategories}
          onCategoriesChange={(categories) => updateFormData('selectedCategories', categories)}
          required={true}
        />

        <div>
          <Label className="flex items-center gap-2">
            {language === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
          </Label>
          <Textarea
            value={formData.requirements}
            onChange={(e) => updateFormData('requirements', e.target.value)}
            placeholder={language === 'ar' 
              ? 'أضف أي متطلبات خاصة، معايير الجودة، أو شروط فنية'
              : 'Add any special requirements, quality standards, or technical conditions'}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {language === 'ar' ? 'الميزانية والمواعيد' : 'Budget & Timeline'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'حدد الميزانية والمواعيد الزمنية المطلوبة'
            : 'Set your budget range and required timeline'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="budget_min">
              {language === 'ar' ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}
            </Label>
            <Input
              id="budget_min"
              type="number"
              value={formData.budget_min}
              onChange={(e) => updateFormData('budget_min', e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="budget_max">
              {language === 'ar' ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}
            </Label>
            <Input
              id="budget_max"
              type="number"
              value={formData.budget_max}
              onChange={(e) => updateFormData('budget_max', e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="currency">
              {language === 'ar' ? 'العملة' : 'Currency'}
            </Label>
            <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAR">{language === 'ar' ? 'ريال سعودي' : 'Saudi Riyal (SAR)'}</SelectItem>
                <SelectItem value="USD">{language === 'ar' ? 'دولار أمريكي' : 'US Dollar (USD)'}</SelectItem>
                <SelectItem value="EUR">{language === 'ar' ? 'يورو' : 'Euro (EUR)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2">
              {language === 'ar' ? 'الموعد النهائي للعروض' : 'Submission Deadline'}
              <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.submission_deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.submission_deadline 
                    ? format(formData.submission_deadline, "PPP") 
                    : (language === 'ar' ? 'اختر التاريخ' : 'Select date')
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.submission_deadline}
                  onSelect={(date) => updateFormData('submission_deadline', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>
              {language === 'ar' ? 'أولوية الطلب' : 'Priority Level'}
            </Label>
            <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</SelectItem>
                <SelectItem value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</SelectItem>
                <SelectItem value="high">{language === 'ar' ? 'عالية' : 'High'}</SelectItem>
                <SelectItem value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              {language === 'ar' ? 'تاريخ بداية المشروع' : 'Project Start Date'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.project_start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.project_start_date 
                    ? format(formData.project_start_date, "PPP") 
                    : (language === 'ar' ? 'تاريخ اختياري' : 'Optional date')
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.project_start_date}
                  onSelect={(date) => updateFormData('project_start_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>
              {language === 'ar' ? 'تاريخ انتهاء المشروع' : 'Project End Date'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.project_end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.project_end_date 
                    ? format(formData.project_end_date, "PPP") 
                    : (language === 'ar' ? 'تاريخ اختياري' : 'Optional date')
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.project_end_date}
                  onSelect={(date) => updateFormData('project_end_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="delivery_location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {language === 'ar' ? 'موقع التسليم' : 'Delivery Location'}
          </Label>
          <Input
            id="delivery_location"
            value={formData.delivery_location}
            onChange={(e) => updateFormData('delivery_location', e.target.value)}
            placeholder={language === 'ar' ? 'أدخل موقع التسليم المطلوب' : 'Enter required delivery location'}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {language === 'ar' ? 'الشروط والمرفقات' : 'Terms & Attachments'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'أضف الشروط والأحكام والملفات المطلوبة'
            : 'Add terms & conditions and required documents'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Label>
              {language === 'ar' ? 'طلب عام' : 'Public RFQ'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'سيكون الطلب مرئي لجميع الموردين المؤهلين'
                : 'RFQ will be visible to all qualified vendors'}
            </p>
          </div>
          <Switch
            checked={formData.is_public}
            onCheckedChange={(checked) => updateFormData('is_public', checked)}
          />
        </div>

        <div>
          <Label>
            {language === 'ar' ? 'معايير التقييم' : 'Evaluation Criteria'}
          </Label>
          <Textarea
            value={formData.evaluation_criteria}
            onChange={(e) => updateFormData('evaluation_criteria', e.target.value)}
            placeholder={language === 'ar' 
              ? 'اشرح كيف ستقوم بتقييم العروض المقدمة (السعر، الجودة، الخبرة، إلخ)'
              : 'Explain how you will evaluate submissions (price, quality, experience, etc.)'}
            className="mt-1"
          />
        </div>

        <div>
          <Label>
            {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Label>
          <Textarea
            value={formData.terms_and_conditions}
            onChange={(e) => updateFormData('terms_and_conditions', e.target.value)}
            placeholder={language === 'ar' 
              ? 'أدخل أي شروط وأحكام خاصة بهذا الطلب'
              : 'Enter any specific terms and conditions for this RFQ'}
            className="mt-1"
          />
        </div>

        <SmartFileUpload
          uploadedFiles={uploadedFiles}
          onFilesChange={setUploadedFiles}
          maxFiles={10}
          maxSizePerFile={10}
        />
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {language === 'ar' ? 'مراجعة وإرسال' : 'Review & Submit'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'راجع جميع المعلومات قبل إرسال طلب التسعير'
            : 'Review all information before submitting your RFQ'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">{language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">{language === 'ar' ? 'العنوان:' : 'Title:'}</span> {formData.title}</p>
              <p><span className="font-medium">{language === 'ar' ? 'الفئات:' : 'Categories:'}</span> {formData.selectedCategories.length} {language === 'ar' ? 'فئات مختارة' : 'selected'}</p>
              <p><span className="font-medium">{language === 'ar' ? 'الوصف:' : 'Description:'}</span> {formData.description.substring(0, 100)}...</p>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">{language === 'ar' ? 'الميزانية والمواعيد' : 'Budget & Timeline'}</h3>
            <div className="space-y-1 text-sm">
              {formData.budget_min && formData.budget_max && (
                <p><span className="font-medium">{language === 'ar' ? 'الميزانية:' : 'Budget:'}</span> {formData.budget_min} - {formData.budget_max} {formData.currency}</p>
              )}
              <p><span className="font-medium">{language === 'ar' ? 'الموعد النهائي:' : 'Deadline:'}</span> {formData.submission_deadline ? format(formData.submission_deadline, "PPP") : 'Not set'}</p>
              <p><span className="font-medium">{language === 'ar' ? 'الأولوية:' : 'Priority:'}</span> {formData.priority}</p>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">{language === 'ar' ? 'إضافات' : 'Additional Details'}</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">{language === 'ar' ? 'نوع الطلب:' : 'Visibility:'}</span> {formData.is_public ? (language === 'ar' ? 'عام' : 'Public') : (language === 'ar' ? 'خاص' : 'Private')}</p>
              <p><span className="font-medium">{language === 'ar' ? 'المرفقات:' : 'Attachments:'}</span> {uploadedFiles.length} {language === 'ar' ? 'ملف' : 'files'}</p>
              {formData.delivery_location && (
                <p><span className="font-medium">{language === 'ar' ? 'موقع التسليم:' : 'Delivery:'}</span> {formData.delivery_location}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'ar' ? 'إنشاء طلب تسعير ذكي' : 'Create Smart RFQ'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'أنشئ طلب تسعير احترافي واحصل على أفضل العروض من الموردين المؤهلين'
            : 'Create a professional RFQ and get the best proposals from qualified vendors'}
        </p>
      </div>

      {renderStepIndicator()}
      {renderCurrentStep()}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          {language === 'ar' ? 'السابق' : 'Previous'}
        </Button>
        
        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              {language === 'ar' ? 'التالي' : 'Next'}
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="min-w-32"
            >
              {submitting 
                ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                : (language === 'ar' ? 'إرسال الطلب' : 'Submit RFQ')
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};