import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategorySelector } from '@/components/forms/CategorySelector';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { useRequests } from '@/hooks/useRequests';
import { Calendar, MapPin, DollarSign, Clock, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrivateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  vendorName: string;
}

export const PrivateRequestModal: React.FC<PrivateRequestModalProps> = ({
  open,
  onOpenChange,
  vendorId,
  vendorName
}) => {
  const languageContext = useOptionalLanguage();
  const isArabic = languageContext?.language === 'ar';
  const { createRequest } = useRequests();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'SAR',
    deadline: '',
    location: '',
    urgency: 'medium' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
        budget_max: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
        location: formData.location,
        deadline: formData.deadline,
        urgency: formData.urgency
      });

      toast({
        title: isArabic ? "تم الإرسال" : "Request Sent",
        description: isArabic ? 
          `تم إرسال الطلب الخاص إلى ${vendorName}` : 
          `Private request sent to ${vendorName}`,
      });

      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budgetMin: '',
        budgetMax: '',
        currency: 'SAR',
        deadline: '',
        location: '',
        urgency: 'medium'
      });
      
    } catch (error) {
      console.error('Error creating private request:', error);
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "فشل في إرسال الطلب" : "Failed to send request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isArabic ? `طلب خاص إلى ${vendorName}` : `Private Request to ${vendorName}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">
                  {isArabic ? 'عنوان الطلب' : 'Request Title'} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={isArabic ? 'أدخل عنوان الطلب' : 'Enter request title'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">
                  {isArabic ? 'الفئة' : 'Category'} *
                </Label>
                <CategorySelector
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder={isArabic ? 'اختر فئة' : 'Select a category'}
                />
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {isArabic ? 'الموقع' : 'Location'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={isArabic ? 'أدخل الموقع' : 'Enter location'}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="budgetMin" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {isArabic ? 'الحد الأدنى' : 'Min Budget'}
                  </Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="budgetMax">
                    {isArabic ? 'الحد الأقصى' : 'Max Budget'}
                  </Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deadline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {isArabic ? 'الموعد النهائي' : 'Deadline'}
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="urgency" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {isArabic ? 'مستوى الأولوية' : 'Urgency Level'}
                </Label>
                <select
                  id="urgency"
                  className="w-full p-2 border rounded-md"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                >
                  <option value="low">{isArabic ? 'منخفض' : 'Low'}</option>
                  <option value="medium">{isArabic ? 'متوسط' : 'Medium'}</option>
                  <option value="high">{isArabic ? 'عالي' : 'High'}</option>
                  <option value="urgent">{isArabic ? 'عاجل' : 'Urgent'}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              {isArabic ? 'وصف الطلب' : 'Request Description'} *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isArabic ? 'اوصف متطلباتك بالتفصيل...' : 'Describe your requirements in detail...'}
              className="min-h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 
                (isArabic ? 'جاري الإرسال...' : 'Sending...') : 
                (isArabic ? 'إرسال الطلب الخاص' : 'Send Private Request')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};