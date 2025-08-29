import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBids, CreateBidData } from "@/hooks/useBids";
import { useToast } from "@/hooks/use-toast";
import { RFQ } from "@/hooks/useRFQs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Shield, 
  CreditCard, 
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface BidSubmissionModalProps {
  rfq: RFQ;
  children: React.ReactNode;
}

export const BidSubmissionModal = ({ rfq, children }: BidSubmissionModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateBidData>>({
    rfq_id: rfq.id,
    currency: rfq.currency || 'SAR',
    delivery_timeline_days: 30,
    warranty_period_months: 12,
    payment_terms: '30% advance, 70% on completion'
  });
  const [submitting, setSubmitting] = useState(false);
  const { createBid } = useBids();
  const { toast } = useToast();

  const handleInputChange = (field: keyof CreateBidData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.total_price || !formData.delivery_timeline_days || !formData.proposal) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const bid = await createBid(formData as CreateBidData);
      if (bid) {
        setOpen(false);
        setFormData({
          rfq_id: rfq.id,
          currency: rfq.currency || 'SAR',
          delivery_timeline_days: 30,
          warranty_period_months: 12,
          payment_terms: '30% advance, 70% on completion'
        });
        toast({
          title: 'Success',
          description: 'Your bid has been submitted successfully!',
        });
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if submission deadline has passed
  const isExpired = new Date() > new Date(rfq.submission_deadline);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit Bid - {rfq.title}
          </DialogTitle>
        </DialogHeader>

        {isExpired ? (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Submission Deadline Passed
              </h3>
              <p className="text-muted-foreground">
                The submission deadline for this RFQ was {new Date(rfq.submission_deadline).toLocaleDateString()}.
                You can no longer submit bids for this request.
              </p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RFQ Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RFQ Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Budget Range:</span>
                    <span className="ml-2">
                      {rfq.budget_min && rfq.budget_max 
                        ? `${rfq.budget_min.toLocaleString()} - ${rfq.budget_max.toLocaleString()}`
                        : 'Budget negotiable'
                      } {rfq.currency}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Submission Deadline:</span>
                    <span className="ml-2">{new Date(rfq.submission_deadline).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Project Start:</span>
                    <span className="ml-2">
                      {rfq.project_start_date 
                        ? new Date(rfq.project_start_date).toLocaleDateString()
                        : 'TBD'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Delivery Location:</span>
                    <span className="ml-2">{rfq.delivery_location || 'Not specified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5" />
                    Price Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="total_price">Total Price *</Label>
                    <Input
                      id="total_price"
                      type="number"
                      step="0.01"
                      placeholder="Enter your total bid amount"
                      value={formData.total_price || ''}
                      onChange={(e) => handleInputChange('total_price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Timeline & Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="delivery_timeline">Delivery Timeline (Days) *</Label>
                    <Input
                      id="delivery_timeline"
                      type="number"
                      placeholder="Number of days for completion"
                      value={formData.delivery_timeline_days || ''}
                      onChange={(e) => handleInputChange('delivery_timeline_days', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty_period">Warranty Period (Months)</Label>
                    <Input
                      id="warranty_period"
                      type="number"
                      placeholder="Warranty period in months"
                      value={formData.warranty_period_months || ''}
                      onChange={(e) => handleInputChange('warranty_period_months', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Proposal & Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Proposal & Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="proposal">Detailed Proposal *</Label>
                  <Textarea
                    id="proposal"
                    placeholder="Describe your approach, methodology, deliverables, and value proposition..."
                    rows={6}
                    value={formData.proposal || ''}
                    onChange={(e) => handleInputChange('proposal', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide a comprehensive description of how you will fulfill the RFQ requirements
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Select
                    value={formData.payment_terms}
                    onValueChange={(value) => handleInputChange('payment_terms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100% advance">100% Advance Payment</SelectItem>
                      <SelectItem value="50% advance, 50% on completion">50% Advance, 50% on Completion</SelectItem>
                      <SelectItem value="30% advance, 70% on completion">30% Advance, 70% on Completion</SelectItem>
                      <SelectItem value="Net 30">Net 30 Days</SelectItem>
                      <SelectItem value="Net 60">Net 60 Days</SelectItem>
                      <SelectItem value="Custom">Custom Terms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 gap-2"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Bid
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};