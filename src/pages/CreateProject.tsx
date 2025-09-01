
import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { VendorBreadcrumbs } from '@/components/vendor/VendorBreadcrumbs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  FileText, 
  MapPin, 
  Plus, 
  Tag,
  Upload,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Project categories for selection
const PROJECT_CATEGORIES = [
  'Construction & Building',
  'Electrical Services', 
  'Plumbing & HVAC',
  'Interior Design',
  'Landscaping',
  'Cleaning Services',
  'Security Services',
  'IT & Technology',
  'Catering & Food Services',
  'Transportation & Logistics',
  'Professional Services',
  'Marketing & Advertising'
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
  { value: 'AED', label: 'UAE Dirham (AED)' },
  { value: 'EUR', label: 'Euro (EUR)' }
];

const CreateProjectPage = memo(() => {
  const { t, isRTL } = useOptionalLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    location: '',
    tags: '',
    attachments: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('createProject.requiredField');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('createProject.requiredField');
    }
    
    if (!formData.category) {
      newErrors.category = t('createProject.requiredField');
    }
    
    if (!formData.priority) {
      newErrors.priority = t('createProject.requiredField');
    }
    
    if (formData.budgetMin && formData.budgetMax) {
      if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) {
        newErrors.budgetMax = t('createProject.invalidBudget');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate project creation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t('createProject.projectCreated'),
        description: t('createProject.projectCreatedDesc'),
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        priority: '',
        budgetMin: '',
        budgetMax: '',
        currency: 'USD',
        startDate: '',
        endDate: '',
        location: '',
        tags: '',
        attachments: []
      });
      
    } catch (error) {
      toast({
        title: t('createProject.createError'),
        description: t('createProject.createErrorDesc'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back or close modal
    window.history.back();
  };

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <VendorBreadcrumbs />
        
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('createProject.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('createProject.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Building className="h-5 w-5" />
                {t('createProject.projectDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectName">{t('createProject.projectName')} *</Label>
                  <Input
                    id="projectName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('createProject.projectNamePlaceholder')}
                    className={cn(
                      isRTL && "text-right",
                      errors.name && "border-destructive"
                    )}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">{t('createProject.category')} *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className={cn(errors.category && "border-destructive")}>
                      <SelectValue placeholder={t('createProject.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      {PROJECT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('createProject.projectDescription')} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('createProject.projectDescriptionPlaceholder')}
                  rows={4}
                  className={cn(
                    isRTL && "text-right",
                    errors.description && "border-destructive"
                  )}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">{t('createProject.priority')} *</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className={cn(errors.priority && "border-destructive")}>
                      <SelectValue placeholder={t('createProject.selectPriority')} />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      {PRIORITY_LEVELS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">{t('createProject.location')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t('createProject.locationPlaceholder')}
                    className={cn(isRTL && "text-right")}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <DollarSign className="h-5 w-5" />
                {t('createProject.budget')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">{t('createProject.budgetMin')}</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="0"
                    className={cn(isRTL && "text-right")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">{t('createProject.budgetMax')}</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="0"
                    className={cn(
                      isRTL && "text-right",
                      errors.budgetMax && "border-destructive"
                    )}
                  />
                  {errors.budgetMax && (
                    <p className="text-sm text-destructive">{errors.budgetMax}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('createProject.currency')}</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Calendar className="h-5 w-5" />
                {t('createProject.timeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('createProject.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('createProject.endDate')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <FileText className="h-5 w-5" />
                {t('createProject.additionalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tags">{t('createProject.tags')}</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder={t('createProject.tagsPlaceholder')}
                  className={cn(isRTL && "text-right")}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachments">{t('createProject.attachments')}</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {t('createProject.dragDropFiles')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className={cn(
            "flex gap-4 pt-6",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 md:flex-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('common.creating')}
                </>
              ) : (
                <>
                  <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {t('createProject.createProject')}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('createProject.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
});

CreateProjectPage.displayName = 'CreateProjectPage';

export default CreateProjectPage;
