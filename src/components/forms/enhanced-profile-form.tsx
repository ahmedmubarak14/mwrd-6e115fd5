import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText,
  Tags,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { InlineLoading } from '@/components/ui/enhanced-loading-states';
import { cn } from '@/lib/utils';

// Enhanced validation schema
const profileFormSchema = z.object({
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Full name can only contain letters and spaces'),
  
  company_name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(150, 'Company name must not exceed 150 characters')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters'),
  
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Saudi phone number validation (with optional country code)
      const phoneRegex = /^(\+966|0)?[5-9]\d{8}$/;
      return phoneRegex.test(val.replace(/[\s-]/g, ''));
    }, 'Please enter a valid Saudi phone number'),
  
  address: z.string()
    .max(500, 'Address must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  
  bio: z.string()
    .max(1000, 'Bio must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  portfolio_url: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'Please enter a valid URL (including https://)')
    .or(z.literal('')),
  
  categories: z.array(z.string()).optional().default([])
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

interface EnhancedProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  className?: string;
}

export const EnhancedProfileForm: React.FC<EnhancedProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  className
}) => {
  const { t, isRTL } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || []
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      company_name: initialData?.company_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      bio: initialData?.bio || '',
      portfolio_url: initialData?.portfolio_url || '',
      categories: initialData?.categories || []
    },
    mode: 'onChange' // Validate on change for better UX
  });

  // Update form when initial data changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        full_name: initialData.full_name || '',
        company_name: initialData.company_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        bio: initialData.bio || '',
        portfolio_url: initialData.portfolio_url || '',
        categories: initialData.categories || []
      });
      setSelectedCategories(initialData.categories || []);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({ ...data, categories: selectedCategories });
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const updated = checked 
        ? [...prev, categorySlug]
        : prev.filter(cat => cat !== categorySlug);
      
      form.setValue('categories', updated, { shouldValidate: true });
      return updated;
    });
  };

  const handleCancel = () => {
    form.reset();
    setSelectedCategories(initialData?.categories || []);
    onCancel?.();
  };

  // Character counters for long fields
  const bioLength = form.watch('bio')?.length || 0;
  const addressLength = form.watch('address')?.length || 0;

  if (!categoriesLoading && categories.length === 0) {
    return (
      <ErrorRecovery
        error="No categories available"
        variant="inline"
        title="Failed to load categories"
        description="Unable to load service categories for profile setup."
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <User className="h-5 w-5 text-primary" />
                {t('profile.personalInformation')}
              </CardTitle>
              <CardDescription>
                {t('profile.personalInformationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel className="required">{t('profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!isEditing}
                        placeholder={t('profile.fullNamePlaceholder')}
                        className={cn(
                          "transition-all",
                          !isEditing && "bg-muted cursor-not-allowed",
                          isRTL && "text-right"
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel className="required flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('profile.email')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        disabled={true} // Email usually shouldn't be editable
                        className="bg-muted cursor-not-allowed"
                        dir="ltr" // Email is always LTR
                      />
                    </FormControl>
                    <FormDescription>
                      {t('profile.emailDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('profile.phone')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        disabled={!isEditing}
                        placeholder="+966 5X XXX XXXX"
                        className={cn(
                          "transition-all",
                          !isEditing && "bg-muted cursor-not-allowed"
                        )}
                        dir="ltr" // Phone numbers are always LTR
                      />
                    </FormControl>
                    <FormDescription>
                      {t('profile.phoneDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Building className="h-5 w-5 text-primary" />
                {t('profile.companyInformation')}
              </CardTitle>
              <CardDescription>
                {t('profile.companyInformationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel>{t('profile.companyName')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!isEditing}
                        placeholder={t('profile.companyNamePlaceholder')}
                        className={cn(
                          "transition-all",
                          !isEditing && "bg-muted cursor-not-allowed",
                          isRTL && "text-right"
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('profile.address')}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        disabled={!isEditing}
                        placeholder={t('profile.addressPlaceholder')}
                        rows={3}
                        className={cn(
                          "transition-all resize-none",
                          !isEditing && "bg-muted cursor-not-allowed",
                          isRTL && "text-right"
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <FormMessage />
                      <span>{addressLength}/500</span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Portfolio URL */}
              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t('profile.portfolioUrl')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="url"
                        disabled={!isEditing}
                        placeholder="https://example.com"
                        className={cn(
                          "transition-all",
                          !isEditing && "bg-muted cursor-not-allowed"
                        )}
                        dir="ltr" // URLs are always LTR
                      />
                    </FormControl>
                    <FormDescription>
                      {t('profile.portfolioUrlDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Bio & Categories */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <FileText className="h-5 w-5 text-primary" />
                {t('profile.additionalInformation')}
              </CardTitle>
              <CardDescription>
                {t('profile.additionalInformationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2", isRTL && "text-right")}>
                    <FormLabel>{t('profile.bio')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        disabled={!isEditing}
                        placeholder={t('profile.bioPlaceholder')}
                        rows={4}
                        className={cn(
                          "transition-all resize-none",
                          !isEditing && "bg-muted cursor-not-allowed",
                          isRTL && "text-right"
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <FormDescription>
                        {t('profile.bioDescription')}
                      </FormDescription>
                      <span className={cn(
                        "ml-auto",
                        bioLength > 800 && "text-warning",
                        bioLength > 950 && "text-destructive"
                      )}>
                        {bioLength}/1000
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Categories */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  {t('profile.serviceCategories')}
                </Label>
                
                {categoriesLoading ? (
                  <InlineLoading text="Loading categories..." />
                ) : (
                  <div className={cn(
                    "space-y-2 max-h-64 overflow-y-auto border rounded-md p-3",
                    !isEditing && "bg-muted opacity-50"
                  )}>
                    {categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t('profile.noCategoriesAvailable')}
                      </p>
                    ) : (
                      categories.map((category) => (
                        <div 
                          key={category.id} 
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors",
                            isRTL && "flex-row-reverse space-x-reverse"
                          )}
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category.slug, checked as boolean)
                            }
                            disabled={!isEditing}
                          />
                          <Label 
                            htmlFor={`category-${category.id}`}
                            className={cn(
                              "text-sm font-normal cursor-pointer flex-1",
                              !isEditing && "cursor-not-allowed"
                            )}
                          >
                            {isRTL ? category.name_ar : category.name_en}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((categorySlug) => {
                      const category = categories.find(cat => cat.slug === categorySlug);
                      return category ? (
                        <Badge key={category.id} variant="secondary" className="text-xs">
                          {isRTL ? category.name_ar : category.name_en}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
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
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('common.save')}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none min-w-32"
              >
                <X className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t('common.cancel')}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};