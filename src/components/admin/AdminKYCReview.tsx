import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Download, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateDocumentSignedUrl } from '@/utils/documentStorage';

interface KYCSubmission {
  id: string;
  user_id: string;
  company_legal_name: string;
  cr_number: string;
  vat_number: string;
  submission_status: string;
  submitted_at: string;
  cr_document_url: string;
  vat_certificate_url: string;
  address_certificate_url: string;
  account_type: string;
  credit_ceiling?: number;
  payment_period_days?: number;
  [key: string]: any;
}

export const AdminKYCReview = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('kyc_submissions')
      .select('*')
      .in('submission_status', ['submitted', 'under_review'])
      .order('submitted_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch KYC submissions",
        variant: "destructive"
      });
      return;
    }
    setSubmissions(data || []);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    setProcessing(true);
    try {
      // Update KYC submission
      const { error: kycError } = await supabase
        .from('kyc_submissions')
        .update({
          submission_status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewer_notes: reviewNotes
        })
        .eq('id', selectedSubmission.id);

      if (kycError) throw kycError;

      // Update user profile verification status
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          verification_status: 'approved',
          status: 'approved',
          verified_at: new Date().toISOString()
        })
        .eq('user_id', selectedSubmission.user_id);

      if (profileError) throw profileError;

      // Create credit account if account type is credit
      if (selectedSubmission.account_type === 'credit') {
        const { error: creditError } = await supabase
          .from('client_credit_accounts')
          .insert({
            user_id: selectedSubmission.user_id,
            kyc_submission_id: selectedSubmission.id,
            credit_ceiling: selectedSubmission.credit_ceiling,
            payment_period_days: selectedSubmission.payment_period_days,
            account_status: 'active',
            activated_at: new Date().toISOString()
          });

        if (creditError) throw creditError;
      }

      toast({
        title: "Success",
        description: "KYC approved successfully!"
      });
      
      fetchSubmissions();
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to approve KYC',
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !reviewNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide rejection reason",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { error: kycError } = await supabase
        .from('kyc_submissions')
        .update({
          submission_status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewer_notes: reviewNotes
        })
        .eq('id', selectedSubmission.id);

      if (kycError) throw kycError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          verification_status: 'rejected',
          verification_notes: reviewNotes
        })
        .eq('user_id', selectedSubmission.user_id);

      if (profileError) throw profileError;

      toast({
        title: "KYC Rejected",
        description: "KYC submission has been rejected"
      });
      
      fetchSubmissions();
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to reject KYC',
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadDocument = async (documentUrl: string, fileName: string) => {
    try {
      const result = await generateDocumentSignedUrl(documentUrl);
      
      if (!result.success || !result.signedUrl) {
        throw new Error('Failed to generate download URL');
      }

      // Create download link
      const a = document.createElement('a');
      a.href = result.signedUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document download started"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Submissions Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>CR Number</TableHead>
                <TableHead>VAT Number</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.company_legal_name}</TableCell>
                  <TableCell>{submission.cr_number}</TableCell>
                  <TableCell>{submission.vat_number}</TableCell>
                  <TableCell>
                    <Badge variant={submission.account_type === 'credit' ? 'default' : 'outline'}>
                      {submission.account_type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(submission.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      submission.submission_status === 'submitted' ? 'warning' :
                      submission.submission_status === 'under_review' ? 'default' : 'secondary'
                    }>
                      {submission.submission_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSubmission && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Review KYC Submission: {selectedSubmission.company_legal_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="company">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="tax">Tax</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="signatory">Signatory</TabsTrigger>
                <TabsTrigger value="credit">Credit</TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Legal Name</p>
                    <p className="font-semibold">{selectedSubmission.company_legal_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CR Number</p>
                    <p className="font-semibold">{selectedSubmission.cr_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CR Issuing Date</p>
                    <p className="font-semibold">{selectedSubmission.cr_issuing_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CR Validity</p>
                    <p className="font-semibold">{selectedSubmission.cr_validity_date}</p>
                  </div>
                </div>
                <Button onClick={() => downloadDocument(selectedSubmission.cr_document_url, 'CR-Certificate.pdf')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download CR Certificate
                </Button>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">VAT Number</p>
                  <p className="font-semibold">{selectedSubmission.vat_number}</p>
                </div>
                <Button onClick={() => downloadDocument(selectedSubmission.vat_certificate_url, 'VAT-Certificate.pdf')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download VAT Certificate
                </Button>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-semibold">{selectedSubmission.address_city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold">{selectedSubmission.address_area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Postal Code</p>
                    <p className="font-semibold">{selectedSubmission.address_postal_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Building Number</p>
                    <p className="font-semibold">{selectedSubmission.address_building_number}</p>
                  </div>
                </div>
                <Button onClick={() => downloadDocument(selectedSubmission.address_certificate_url, 'Address-Certificate.pdf')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Address Certificate
                </Button>
              </TabsContent>

              <TabsContent value="signatory" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedSubmission.signatory_first_name} {selectedSubmission.signatory_last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-semibold">{selectedSubmission.signatory_designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedSubmission.signatory_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedSubmission.signatory_phone}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credit" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <Badge>{selectedSubmission.account_type.toUpperCase()}</Badge>
                  </div>
                  {selectedSubmission.account_type === 'credit' && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Credit Ceiling</p>
                        <p className="font-semibold">SAR {selectedSubmission.credit_ceiling?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Period</p>
                        <p className="font-semibold">{selectedSubmission.payment_period_days} days</p>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Review Actions */}
            <div className="space-y-4 pt-6 border-t">
              <Textarea
                placeholder="Review notes (required for rejection)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve KYC
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject KYC
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
