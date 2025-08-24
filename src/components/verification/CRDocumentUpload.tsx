
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { supabase } from '@/integrations/supabase/client';

interface CRDocumentUploadProps {
  onUploadSuccess?: (documentUrl: string) => void;
  isRequired?: boolean;
  existingDocument?: string;
  disabled?: boolean;
}

export const CRDocumentUpload = ({ 
  onUploadSuccess, 
  isRequired = true,
  existingDocument,
  disabled = false
}: CRDocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError } = useToastFeedback();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        showError('Please upload a PDF or image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('You must be logged in to upload documents');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `cr-documents/${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(data.path);

      // Create verification request
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          document_type: 'commercial_registration',
          document_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      showSuccess('Commercial Registration uploaded successfully');
      onUploadSuccess?.(publicUrl);
      setFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      showError('Failed to upload document: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Commercial Registration Document
          {isRequired && <span className="text-destructive">*</span>}
        </CardTitle>
        <CardDescription>
          Upload your company's Commercial Registration (CR) certificate. 
          Accepted formats: PDF, JPEG, PNG (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingDocument && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Commercial Registration document has been uploaded and is under review.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="cursor-pointer"
          />
          
          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading || disabled}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Commercial Registration'}
          </Button>
        </div>

        {isRequired && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Commercial Registration verification is required to access RFQ creation, 
              order placement, and vendor interactions.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
