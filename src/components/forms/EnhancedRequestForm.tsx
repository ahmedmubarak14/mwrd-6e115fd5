
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CategorySelector } from './CategorySelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

const requestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  currency: z.string().default('SAR'),
  deadline: z.string().optional(),
  location: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface EnhancedRequestFormProps {
  onSubmit: (data: RequestFormData) => Promise<void>;
}

export const EnhancedRequestForm: React.FC<EnhancedRequestFormProps> = ({ onSubmit }) => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      budgetMin: '',
      budgetMax: '',
      currency: 'SAR',
      deadline: '',
      location: '',
      urgency: 'medium',
    },
  });

  const handleSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t('createRequest.title') || 'Create New Request'}
        </CardTitle>
        <CardDescription>
          {t('createRequest.subtitle') || 'Fill out the details for your procurement request'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createRequest.titleLabel') || 'Request Title'} *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('createRequest.titlePlaceholder') || 'Enter request title'}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createRequest.categoryLabel') || 'Category'} *</FormLabel>
                      <FormControl>
                        <CategorySelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={t('createRequest.categoryPlaceholder') || 'Select a category'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('createRequest.locationLabel') || 'Location'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('createRequest.locationPlaceholder') || 'Enter location'}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('createRequest.urgencyLabel') || 'Urgency Level'}
                      </FormLabel>
                      <FormControl>
                        <select 
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="low">{t('createRequest.urgencyLow') || 'Low'}</option>
                          <option value="medium">{t('createRequest.urgencyMedium') || 'Medium'}</option>
                          <option value="high">{t('createRequest.urgencyHigh') || 'High'}</option>
                          <option value="urgent">{t('createRequest.urgencyUrgent') || 'Urgent'}</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {t('createRequest.budgetMinLabel') || 'Min Budget'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('createRequest.budgetMaxLabel') || 'Max Budget'}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createRequest.currencyLabel') || 'Currency'}</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="SAR">SAR - Saudi Riyal</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('createRequest.deadlineLabel') || 'Deadline'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createRequest.descriptionLabel') || 'Description'} *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('createRequest.descriptionPlaceholder') || 'Describe your requirements in detail...'}
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                {t('createRequest.cancel') || 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (t('createRequest.submitting') || 'Submitting...') : (t('createRequest.submit') || 'Submit Request')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
