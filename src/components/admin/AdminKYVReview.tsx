import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Eye, Download, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateDocumentSignedUrl, extractFilePath } from '@/utils/documentStorage';

interface KYVSubmission {
  id: string;
  user_id: string;
  trade_name: string | null;
  number_of_employees: string;
  zakat_certificate_url: string | null;
  chamber_commerce_certificate_url: string | null;
  company_logo_url: string | null;
  bank_name: string;
  account_holder_name: string;
  iban_number: string;
  bank_branch: string | null;
  bank_confirmation_letter_url: string;
  product_catalog_url: string | null;
  price_list_url: string | null;
  minimum_order_value: number | null;
  delivery_sla_days: number;
  payment_terms: string;
  quality_certificates_urls: string[] | null;
  safety_certificates_urls: string[] | null;
  insurance_license_urls: string[] | null;
  vendor_signature_url: string | null;
  company_stamp_url: string | null;
  declaration_accepted: boolean;
  submission_status: string;
  submitted_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  user_profiles: {
    full_name: string;
    company_name: string;
    email: string;
  };
}

export const AdminKYVReview = () => {
  const [submissions, setSubmissions] = useState<KYVSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<KYVSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('kyv_submissions')
        .select('*')
        .in('submission_status', ['submitted', 'under_review'])
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Fetch user profiles separately
      const submissionsWithProfiles = await Promise.all(
        (data || []).map(async (submission) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, company_name, email')
            .eq('user_id', submission.user_id)
            .single();

          return {
            ...submission,
            user_profiles: profile || { full_name: '', company_name: '', email: '' },
          };
        })
      );

      setSubmissions(submissionsWithProfiles as KYVSubmission[]);
    } catch (error) {
      console.error('Error fetching KYV submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load KYV submissions',
        variant: 'destructive',
      });
    }
  };

  const checkDocumentExists = async (url: string | null): Promise<boolean> => {
    if (!url) return false;
    try {
      const filePath = extractFilePath(url);
      const result = await generateDocumentSignedUrl(filePath, 60);
      return result.success;
    } catch {
      return false;
    }
  };

  const verifySubmissionDocuments = async (submission: KYVSubmission) => {
    const status: Record<string, boolean> = {};
    
    // Required documents
    status.bank_confirmation = await checkDocumentExists(submission.bank_confirmation_letter_url);
    
    // Optional documents
    if (submission.zakat_certificate_url) {
      status.zakat = await checkDocumentExists(submission.zakat_certificate_url);
    }
    if (submission.chamber_commerce_certificate_url) {
      status.chamber = await checkDocumentExists(submission.chamber_commerce_certificate_url);
    }
    if (submission.product_catalog_url) {
      status.catalog = await checkDocumentExists(submission.product_catalog_url);
    }
    if (submission.price_list_url) {
      status.price_list = await checkDocumentExists(submission.price_list_url);
    }
    if (submission.vendor_signature_url) {
      status.signature = await checkDocumentExists(submission.vendor_signature_url);
    }
    if (submission.company_stamp_url) {
      status.stamp = await checkDocumentExists(submission.company_stamp_url);
    }

    setDocumentStatus(status);
  };

  const handleSelectSubmission = async (submission: KYVSubmission) => {
    setSelectedSubmission(submission);
    setReviewNotes(submission.reviewer_notes || '');
    await verifySubmissionDocuments(submission);
    
    // Update status to under_review
    if (submission.submission_status === 'submitted') {
      await supabase
        .from('kyv_submissions')
        .update({ submission_status: 'under_review' })
        .eq('id', submission.id);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    try {
      setProcessing(true);

      // Update KYV submission
      const { error: kyvError } = await supabase
        .from('kyv_submissions')
        .update({
          submission_status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes,
        })
        .eq('id', selectedSubmission.id);

      if (kyvError) throw kyvError;

      // Update user profile verification status
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          verification_status: 'approved',
          status: 'approved',
        })
        .eq('user_id', selectedSubmission.user_id);

      if (profileError) throw profileError;

      toast({
        title: 'Success',
        description: 'Vendor verification approved successfully',
      });

      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving KYV:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve vendor verification',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !reviewNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide review notes for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);

      // Update KYV submission
      const { error: kyvError } = await supabase
        .from('kyv_submissions')
        .update({
          submission_status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes,
        })
        .eq('id', selectedSubmission.id);

      if (kyvError) throw kyvError;

      // Update user profile verification status
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          verification_status: 'rejected',
        })
        .eq('user_id', selectedSubmission.user_id);

      if (profileError) throw profileError;

      toast({
        title: 'Success',
        description: 'Vendor verification rejected',
      });

      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting KYV:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject vendor verification',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const viewDocument = async (url: string | null, filename: string) => {
    if (!url) return;
    
    // Pre-open tab synchronously to avoid popup blockers
    const newWindow = window.open('about:blank', '_blank');
    if (!newWindow) {
      toast({
        title: 'Error',
        description: 'Failed to open new tab. Please allow popups for this site.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const filePath = extractFilePath(url);
      console.log('Viewing document:', filePath);
      const result = await generateDocumentSignedUrl(filePath, 3600);

      if (result.success && result.signedUrl) {
        console.log('Opening signed URL:', result.signedUrl);
        newWindow.location.href = result.signedUrl;
        toast({
          title: 'Success',
          description: `Opening ${filename}`,
        });
      } else {
        newWindow.close();
        toast({
          title: 'Error',
          description: result.error || `Failed to view ${filename}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      newWindow.close();
      toast({
        title: 'Error',
        description: `Failed to view ${filename}`,
        variant: 'destructive',
      });
    }
  };

  const downloadDocument = async (url: string | null, filename: string) => {
    if (!url) return;
    
    try {
      const filePath = extractFilePath(url);
      const result = await generateDocumentSignedUrl(filePath, 60);

      if (result.success && result.signedUrl) {
        const link = document.createElement('a');
        link.href = result.signedUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Success',
          description: `Downloading ${filename}`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || `Failed to download ${filename}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Error',
        description: `Failed to download ${filename}`,
        variant: 'destructive',
      });
    }
  };

  if (selectedSubmission) {
    const missingDocs = documentStatus.bank_confirmation === false;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('admin.kyv.review.title')}</h2>
            <p className="text-muted-foreground">
              {selectedSubmission.user_profiles.company_name} - {selectedSubmission.user_profiles.full_name}
            </p>
          </div>
          <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
            Back to List
          </Button>
        </div>

        {missingDocs && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Missing required documents. Cannot approve until all required documents are uploaded.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                    <p className="text-base">{selectedSubmission.user_profiles.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trade Name</p>
                    <p className="text-base">{selectedSubmission.trade_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number of Employees</p>
                    <p className="text-base">{selectedSubmission.number_of_employees}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-base">{selectedSubmission.user_profiles.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Documents</p>
                  {selectedSubmission.zakat_certificate_url && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Zakat Certificate</span>
                        {documentStatus.zakat === false && (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.zakat_certificate_url, 'zakat-certificate')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.zakat_certificate_url, 'zakat-certificate')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSubmission.chamber_commerce_certificate_url && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Chamber of Commerce Certificate</span>
                        {documentStatus.chamber === false && (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.chamber_commerce_certificate_url, 'chamber-certificate')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.chamber_commerce_certificate_url, 'chamber-certificate')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Banking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                    <p className="text-base">{selectedSubmission.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Holder Name</p>
                    <p className="text-base">{selectedSubmission.account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">IBAN Number</p>
                    <p className="text-base font-mono">{selectedSubmission.iban_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bank Branch</p>
                    <p className="text-base">{selectedSubmission.bank_branch || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Bank Confirmation Letter *</p>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Bank Confirmation Letter</span>
                      {documentStatus.bank_confirmation === false && (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDocument(selectedSubmission.bank_confirmation_letter_url, 'bank-confirmation')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadDocument(selectedSubmission.bank_confirmation_letter_url, 'bank-confirmation')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product & Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Minimum Order Value</p>
                    <p className="text-base">{selectedSubmission.minimum_order_value ? `${selectedSubmission.minimum_order_value} SAR` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery SLA</p>
                    <p className="text-base">{selectedSubmission.delivery_sla_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                    <p className="text-base">{selectedSubmission.payment_terms}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Documents</p>
                  {selectedSubmission.product_catalog_url && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Product Catalog</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.product_catalog_url, 'product-catalog')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.product_catalog_url, 'product-catalog')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectedSubmission.price_list_url && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Price List</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.price_list_url, 'price-list')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.price_list_url, 'price-list')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Certification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSubmission.quality_certificates_urls && selectedSubmission.quality_certificates_urls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quality Certificates</p>
                    {selectedSubmission.quality_certificates_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Quality Certificate {idx + 1}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDocument(url, `quality-cert-${idx + 1}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(url, `quality-cert-${idx + 1}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSubmission.safety_certificates_urls && selectedSubmission.safety_certificates_urls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Safety Certificates</p>
                    {selectedSubmission.safety_certificates_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Safety Certificate {idx + 1}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDocument(url, `safety-cert-${idx + 1}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(url, `safety-cert-${idx + 1}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSubmission.insurance_license_urls && selectedSubmission.insurance_license_urls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Insurance & Licenses</p>
                    {selectedSubmission.insurance_license_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Insurance/License {idx + 1}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDocument(url, `insurance-${idx + 1}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(url, `insurance-${idx + 1}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!selectedSubmission.quality_certificates_urls?.length && 
                 !selectedSubmission.safety_certificates_urls?.length && 
                 !selectedSubmission.insurance_license_urls?.length && (
                  <p className="text-sm text-muted-foreground">No compliance documents uploaded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="declaration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Declaration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Declaration Status</p>
                  <p className="text-base">
                    {selectedSubmission.declaration_accepted ? (
                      <Badge variant="default">Accepted</Badge>
                    ) : (
                      <Badge variant="destructive">Not Accepted</Badge>
                    )}
                  </p>
                </div>

                {selectedSubmission.vendor_signature_url && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Vendor Signature</p>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Signature Document</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.vendor_signature_url, 'signature')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.vendor_signature_url, 'signature')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubmission.company_stamp_url && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Company Stamp</p>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Company Stamp</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedSubmission.company_stamp_url, 'stamp')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(selectedSubmission.company_stamp_url, 'stamp')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Review Notes</CardTitle>
            <CardDescription>
              Provide feedback for the vendor regarding their submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter review notes here..."
              rows={4}
            />

            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={processing || missingDocs}
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Approve KYV
              </Button>
              <Button
                onClick={handleReject}
                disabled={processing}
                variant="destructive"
                className="flex-1"
              >
                {processing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject KYV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending KYV Submissions</CardTitle>
        <CardDescription>
          Review and approve vendor verification submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pending KYV submissions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleSelectSubmission(submission)}
              >
                <div className="flex-1">
                  <p className="font-medium">{submission.user_profiles.company_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.user_profiles.full_name} • {submission.user_profiles.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={submission.submission_status === 'submitted' ? 'default' : 'secondary'}>
                    {submission.submission_status}
                  </Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
