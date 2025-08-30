import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

interface PendingVerification {
  id: string;
  user_id: string;
  full_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  verification_documents: any;
  verification_status: string;
  created_at: string;
  avatar_url?: string;
}

interface VerificationDocument {
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export const AdminVerificationWorkflow = () => {
  const { toast } = useToast();
  const { t } = useOptionalLanguage();
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingVerification | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('verification_status', ['pending', 'under_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPendingVerifications(data || []);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending verifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (
    userId: string, 
    status: 'approved' | 'rejected',
    notes?: string
  ) => {
    try {
      setActionLoading(userId);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          verification_status: status,
          verification_notes: notes,
          verified_at: status === 'approved' ? new Date().toISOString() : null,
          status: status === 'approved' ? 'approved' : 'pending'
        })
        .eq('id', userId);

      if (error) throw error;

      // Remove from pending list
      setPendingVerifications(prev => prev.filter(u => u.id !== userId));
      setSelectedUser(null);
      setReviewNotes('');

      toast({
        title: 'Success',
        description: `User verification ${status} successfully`,
        variant: 'default'
      });

    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const markUnderReview = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          verification_status: 'under_review'
        })
        .eq('id', userId);

      if (error) throw error;

      // Update in local state
      setPendingVerifications(prev => 
        prev.map(u => u.id === userId ? { ...u, verification_status: 'under_review' } : u)
      );

      toast({
        title: 'Status Updated',
        description: 'Verification marked as under review',
        variant: 'default'
      });

    } catch (error) {
      console.error('Error marking under review:', error);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="border-blue-200 text-blue-800"><Eye className="w-3 h-3 mr-1" /> Under Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'vendor':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Vendor</Badge>;
      case 'client':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Client</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.verification.title')}</h2>
          <p className="text-muted-foreground">
            {pendingVerifications.length} {t('admin.verification.usersAwaiting')}
          </p>
        </div>
        <Button onClick={fetchPendingVerifications} variant="outline">
          {t('admin.verification.refresh')}
        </Button>
      </div>

      {pendingVerifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
            <h3 className="text-lg font-semibold mb-2">{t('admin.verification.allCaughtUp')}</h3>
            <p className="text-muted-foreground">{t('admin.verification.noPendingVerifications')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Queue */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('admin.verification.verificationQueue')}</h3>
            {pendingVerifications.map((user) => (
              <Card 
                key={user.id} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedUser?.id === user.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedUser(user)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.full_name || 'Unnamed User'}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(user.verification_status)}
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Submitted {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">
                      {user.verification_documents?.length || 0} documents
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Verification Details */}
          <div>
            {selectedUser ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Verification Details
                  </CardTitle>
                  <CardDescription>
                    Review and approve user verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedUser.avatar_url} />
                        <AvatarFallback className="text-lg">
                          {selectedUser.full_name?.charAt(0) || selectedUser.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedUser.full_name || 'Unnamed User'}</h3>
                        <p className="text-muted-foreground">{selectedUser.email}</p>
                        <div className="flex gap-2 mt-2">
                          {getStatusBadge(selectedUser.verification_status)}
                          {getRoleBadge(selectedUser.role)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {selectedUser.company_name && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedUser.company_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedUser.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Registered {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Verification Documents ({selectedUser.verification_documents?.length || 0})
                    </h4>
                    {selectedUser.verification_documents?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.verification_documents.map((doc: VerificationDocument, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{doc.name || `Document ${index + 1}`}</span>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No documents uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Review Notes</label>
                      <Textarea
                        placeholder={t('common.placeholders.addNotes')}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      {selectedUser.verification_status === 'pending' && (
                        <Button 
                          variant="outline"
                          onClick={() => markUnderReview(selectedUser.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Mark Under Review
                        </Button>
                      )}
                      
                      <Button 
                        variant="default"
                        onClick={() => updateVerificationStatus(selectedUser.id, 'approved', reviewNotes)}
                        disabled={actionLoading === selectedUser.id}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        onClick={() => updateVerificationStatus(selectedUser.id, 'rejected', reviewNotes)}
                        disabled={actionLoading === selectedUser.id}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a User</h3>
                  <p className="text-muted-foreground">Choose a user from the queue to review their verification.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};