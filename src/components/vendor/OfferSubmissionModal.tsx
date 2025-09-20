
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Clock, 
  MapPin,
  Send,
  AlertCircle
} from 'lucide-react';

interface OfferSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onSuccess?: () => void;
}

export const OfferSubmissionModal = ({ isOpen, onClose, request, onSuccess }: OfferSubmissionModalProps) => {
  const { user } = useAuth();
  const { t, formatNumber } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'SAR',
    delivery_time_days: '',
    delivery_time_unit: 'days',
    terms_and_conditions: '',
    warranty_period: '',
    payment_terms: 'full_upfront'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Offer title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Offer description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.delivery_time_days || parseInt(formData.delivery_time_days) <= 0) {
      newErrors.delivery_time_days = 'Valid delivery time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the form errors');
      return;
    }

    if (!user) {
      showError('You must be logged in to submit an offer');
      return;
    }

    if (!request?.id) {
      showError('Invalid request data');
      return;
    }

    setLoading(true);
    try {
      // Resolve vendor profile ID for correct linkage
      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id;
      if (!authUserId) throw new Error('Not authenticated');

      const { data: vendorProfile, error: vpError } = await supabase
        .from('user_profiles')
        .select('id, role, status')
        .eq('user_id', authUserId)
        .single();
      if (vpError || !vendorProfile) throw new Error(vpError?.message || 'Vendor profile not found');
      if (vendorProfile.role !== 'vendor' || vendorProfile.status !== 'approved') throw new Error('Vendor not approved');

      const priceNum = parseFloat(formData.price);
      const deliveryDaysNum = parseInt(formData.delivery_time_days);
      if (Number.isNaN(priceNum) || Number.isNaN(deliveryDaysNum)) {
        throw new Error('Invalid numeric values for price or delivery time');
      }

      const { data: offer, error } = await supabase
        .from('offers')
        .insert({
          request_id: request.id,
          vendor_id: authUserId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: priceNum,
          currency: formData.currency || 'SAR',
          delivery_time_days: deliveryDaysNum,
          status: 'pending',
          client_approval_status: 'pending',
          admin_approval_status: 'approved'
        })
        .select()
        .single();

      if (error) throw error;
      if (!offer) throw new Error('Offer creation did not return a row');

      // Best-effort notification (non-blocking)
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: request.client_id,
          type: 'new_offer',
          title: 'New Offer Received',
          message: `You have received a new offer for "${request.title}"`,
          category: 'offers',
          priority: 'medium',
          data: {
            offer_id: offer.id,
            request_id: request.id,
            vendor_id: authUserId
          }
        });
      if (notifError) {
        console.warn('Notification insert failed (continuing):', notifError);
      }

      showSuccess('Offer submitted successfully!');
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'SAR',
        delivery_time_days: '',
        delivery_time_unit: 'days',
        terms_and_conditions: '',
        warranty_period: '',
        payment_terms: 'full_upfront'
      });
    } catch (error: any) {
      console.error('Error submitting offer:', error);
      const msg = error?.message || t('common.failedToSubmit');
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (request: any) => {
    // Add null safety check
    if (!request) return 'Budget: Not available';
    
    if (!request.budget_min && !request.budget_max) return 'Budget: Negotiable';
    if (request.budget_min && request.budget_max) {
      return `Budget: ${formatNumber(request.budget_min)} - ${formatNumber(request.budget_max)} ${request.currency || 'SAR'}`;
    }
    return 'Budget: Negotiable';
  };

  // Add early return if request is null
  if (!request) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Invalid Request
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              {t('common.unableToLoadDetails')}
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit Offer for "{request?.title}"
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{request?.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {request?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>{formatBudget(request)}</span>
                  </div>
                  
                  {request?.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {request?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span>{request.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Posted: {new Date(request?.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Badge variant="outline" className="w-fit">
                  {request?.category}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Offer Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Offer Details
                  </CardTitle>
                  <CardDescription>
                    Provide compelling details about your offer to increase your chances of success
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Offer Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t('forms.professionalServiceExample')}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t('forms.describeApproach')}
                      rows={4}
                      className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={errors.price ? 'border-destructive' : ''}
                        />
                        <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAR">SAR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.price && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="delivery_time">Delivery Time *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="delivery_time"
                          type="number"
                          value={formData.delivery_time_days}
                          onChange={(e) => setFormData({ ...formData, delivery_time_days: e.target.value })}
                          placeholder="7"
                          min="1"
                          className={errors.delivery_time_days ? 'border-destructive' : ''}
                        />
                        <Select value={formData.delivery_time_unit} onValueChange={(value) => setFormData({ ...formData, delivery_time_unit: value })}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.delivery_time_days && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.delivery_time_days}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment_terms">Payment Terms</Label>
                    <Select value={formData.payment_terms} onValueChange={(value) => setFormData({ ...formData, payment_terms: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_upfront">Full Payment Upfront</SelectItem>
                        <SelectItem value="50_50">50% Upfront, 50% on Completion</SelectItem>
                        <SelectItem value="milestone_based">Milestone-based Payments</SelectItem>
                        <SelectItem value="on_completion">Payment on Completion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="warranty">Warranty/Support Period</Label>
                    <Input
                      id="warranty"
                      value={formData.warranty_period}
                      onChange={(e) => setFormData({ ...formData, warranty_period: e.target.value })}
                      placeholder={t('forms.warrantyExample')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms">Terms and Conditions</Label>
                    <Textarea
                      id="terms"
                      value={formData.terms_and_conditions}
                      onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                      placeholder={t('forms.termsConditions')}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Offer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
