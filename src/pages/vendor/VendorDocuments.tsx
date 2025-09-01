import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorState } from "@/components/ui/ErrorState";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";
import { 
  Upload, FileText, Download, Search, Filter, Folder, 
  Image, FileCode, Archive, Eye, Trash2, Share2 
} from "lucide-react";

export const VendorDocuments = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (userProfile) {
      fetchDocuments();
    }
  }, [userProfile]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch RFQ attachments
      const { data: rfqAttachments, error: rfqError } = await supabase
        .from('rfq_attachments')
        .select(`
          *,
          rfqs(title, client_id)
        `)
        .eq('uploaded_by', userProfile?.user_id);

      if (rfqError) throw rfqError;

      // Fetch bid attachments
      const { data: bidAttachments, error: bidError } = await supabase
        .from('bid_attachments')
        .select(`
          *,
          bids(
            rfq_id,
            rfqs(title, client_id)
          )
        `)
        .eq('bids.vendor_id', userProfile?.user_id);

      if (bidError) throw bidError;

      // Combine and format documents
      const allDocs = [
        ...(rfqAttachments || []).map(doc => ({
          ...doc,
          category: 'rfq',
          source: t('vendor.documents.rfqAttachments'),
          project: doc.rfqs?.title || t('common.unknown')
        })),
        ...(bidAttachments || []).map(doc => ({
          ...doc,
          category: 'bid',
          source: t('vendor.documents.bidAttachments'),
          project: doc.bids?.rfqs?.title || t('common.unknown')
        }))
      ];

      setDocuments(allDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(t('vendor.documents.fetchFailed'));
      toast({
        title: t('common.error'),
        description: t('vendor.documents.fetchFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.project?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesType = typeFilter === "all" || doc.file_type.startsWith(typeFilter);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-4 w-4 text-blue-600" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileCode className="h-4 w-4 text-green-600" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-4 w-4 text-orange-500" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.storage_path);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('vendor.documents.downloadFailed'),
        variant: "destructive"
      });
    }
  };

  const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const rfqDocs = documents.filter(d => d.category === 'rfq').length;
  const bidDocs = documents.filter(d => d.category === 'bid').length;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title={t('common.error')}
        description={error}
        onRetry={() => fetchDocuments()}
      />
    );
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('vendor.documents.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendor.documents.description')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.documents.totalDocuments')}</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('vendor.documents.allFiles')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.documents.rfqDocuments')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rfqDocs}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('vendor.documents.rfqAttachments')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.documents.bidDocuments')}</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bidDocs}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('vendor.documents.bidAttachments')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.documents.storageUsed')}</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('vendor.documents.totalSize')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{t('common.all')} {t('vendor.documents.documents')}</TabsTrigger>
            <TabsTrigger value="rfq">{t('vendor.documents.rfqDocs')} ({rfqDocs})</TabsTrigger>
            <TabsTrigger value="bid">{t('vendor.documents.bidDocs')} ({bidDocs})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t('vendor.documents.documentLibrary')}</CardTitle>
                    <CardDescription>{t('vendor.documents.documentLibraryDesc')}</CardDescription>
                  </div>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('vendor.documents.uploadDocument')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder={t('vendor.documents.searchDocuments')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('common.category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('vendor.documents.allCategories')}</SelectItem>
                      <SelectItem value="rfq">RFQ</SelectItem>
                      <SelectItem value="bid">Bid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('common.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('vendor.documents.allTypes')}</SelectItem>
                      <SelectItem value="image">{t('vendor.documents.images')}</SelectItem>
                      <SelectItem value="application/pdf">PDF</SelectItem>
                      <SelectItem value="application">{t('vendor.documents.documents')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div>
                          <h4 className="font-medium text-sm">{doc.file_name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{doc.source}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.file_size || 0)}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          </div>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {doc.category.toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            aria-label={t('common.download')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" aria-label={t('common.view')}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" aria-label={t('common.share')}>
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? t('vendor.documents.noDocumentsSearch') : t('vendor.documents.noDocumentsYet')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.documents.rfqDocsTitle')}</CardTitle>
                <CardDescription>{t('vendor.documents.rfqDocsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.filter(d => d.category === 'rfq').map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div>
                          <h4 className="font-medium text-sm">{doc.file_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {t('vendor.documents.projectLabel')} {doc.project}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        aria-label={t('common.download')}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bid" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.documents.bidDocsTitle')}</CardTitle>
                <CardDescription>{t('vendor.documents.bidDocsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.filter(d => d.category === 'bid').map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div>
                          <h4 className="font-medium text-sm">{doc.file_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {t('vendor.documents.bidForLabel')} {doc.project}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        aria-label={t('common.download')}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  );
};