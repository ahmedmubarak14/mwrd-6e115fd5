import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  MapPin, 
  DollarSign, 
  Clock, 
  FileText,
  Loader2,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { CommonValidations } from './form-validation-utils';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { InlineLoading } from '@/components/ui/enhanced-loading-states';
import { MobileFormSection } from '@/components/ui/mobile-optimized-components';
import { cn } from '@/lib/utils';

// Enhanced request form validation schema
const requestFormSchema = z.object({
  title: CommonValidations.requiredString(5, 150, 'Title must be between 5-150 characters'),
  description: CommonValidations.requiredString(20, 2000, 'Description must be between 20-2000 characters'),
  category: z.string().min(1, 'Please select a category'),
  budgetMin: CommonValidations.optionalPositiveNumber,
  budgetMax: CommonValidations.optionalPositiveNumber,
  currency: z.string().default('SAR'),
  deadline: z.coerce.date().optional(),
  location: CommonValidations.optionalString(200),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  attachments: z.array(z.string()).optional().default([])
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMin <= data.budgetMax;
  }
  return true;
}, {
  message: "Maximum budget must be greater than minimum budget",
  path: ["budgetMax"]
});

export type RequestFormData = z.infer<typeof requestFormSchema>;

interface EnhancedRequestFormProps {
  initialData?: Partial<RequestFormData>;
  onSubmit: (data: RequestFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  className?: string;
}

export const EnhancedRequestForm: React.FC<EnhancedRequestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  className
}) => {
  const { t, isRTL } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      budgetMin: initialData?.budgetMin,
      budgetMax: initialData?.budgetMax,
      currency: initialData?.currency || 'SAR',
      deadline: initialData?.deadline,
      location: initialData?.location || '',
      urgency: initialData?.urgency || 'medium',
      attachments: initialData?.attachments || []
    },
    mode: 'onChange'
  });

  const handleSubmit = async (data: RequestFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Request submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  // Character counters
  const titleLength = form.watch('title')?.length || 0;
  const descriptionLength = form.watch('description')?.length || 0;

  if (!categoriesLoading && categories.length === 0) {
    return (
      <ErrorRecovery
        error="No categories available"
        variant="inline"
        title="Failed to load categories"
        description="Unable to load categories for request creation."
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <MobileFormSection
            title={t('request.basicInformation')}
            description={t('request.basicInformationDesc')}
            icon={FileText}
            required
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel className="required">{t('request.title')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={t('request.titlePlaceholder')}
                      className={cn(isRTL && "text-right")}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span className={cn(
                      "ml-auto",
                      titleLength > 120 && "text-warning",
                      titleLength > 140 && "text-destructive"
                    )}>
                      {titleLength}/150
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel className="required">{t('request.category')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(isRTL && "text-right")}>
                        <SelectValue placeholder={t('request.selectCategory')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <InlineLoading text="Loading categories..." size="sm" />
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {isRTL ? category.name_ar : category.name_en}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel className="required">{t('request.description')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder={t('request.descriptionPlaceholder')}
                      rows={6}
                      className={cn("resize-none", isRTL && "text-right")}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormDescription>
                      {t('request.descriptionHint')}
                    </FormDescription>
                    <span className={cn(
                      "ml-auto",
                      descriptionLength > 1600 && "text-warning",
                      descriptionLength > 1900 && "text-destructive"
                    )}>
                      {descriptionLength}/2000
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>

          {/* Budget & Timeline */}
          <MobileFormSection
            title={t('request.budgetTimeline')}
            description={t('request.budgetTimelineDesc')}
            icon={DollarSign}
            collapsible
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Budget Min */}
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel>{t('request.budgetMin')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="0"
                        className={cn(isRTL && "text-right")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget Max */}
              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel>{t('request.budgetMax')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="0"
                        className={cn(isRTL && "text-right")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel>{t('request.currency')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('request.deadline')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                            isRTL && "text-right"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('request.selectDeadline')}</span>
                          )}
                          <CalendarIcon className={cn("ml-auto h-4 w-4 opacity-50", isRTL && "mr-auto ml-0")} />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {t('request.deadlineHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Urgency */}
            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel>{t('request.urgency')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {t('request.urgencyLow')}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            {t('request.urgencyMedium')}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            {t('request.urgencyHigh')}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">
                            {t('request.urgencyUrgent')}
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>

          {/* Location & Additional Details */}
          <MobileFormSection
            title={t('request.additionalDetails')}
            description={t('request.additionalDetailsDesc')}
            icon={MapPin}
            collapsible
            defaultExpanded={false}
          >
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('request.location')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={t('request.locationPlaceholder')}
                      className={cn(isRTL && "text-right")}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('request.locationHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </MobileFormSection>

          {/* Action Buttons */}
          <div className={cn(
            "flex gap-3 pt-4 border-t",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="flex-1 sm:flex-none min-w-32"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('common.submitting')}
                </>
              ) : (
                <>
                  <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {isEditing ? t('common.update') : t('request.submitRequest')}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none min-w-32"
              >
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};