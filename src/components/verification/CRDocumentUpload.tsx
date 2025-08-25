
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [retrying, setRetrying] = useState(false);
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

  const verifyFileExists = async (filePath: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.storage
        .from('chat-files')
        .list(filePath.substring(0, filePath.lastIndexOf('/')), {
          search: filePath.substring(filePath.lastIndexOf('/') + 1)
        });
      
      if (error) {
        console.error('Error verifying file:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error during file verification:', error);
      return false;
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
      const fileName = `${user.id}/cr-documents/${Date.now()}.${fileExt}`;

      console.log('Starting upload to:', fileName);

      // Upload file to storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful, file path:', data.path);

      // Verify the file actually exists
      const fileExists = await verifyFileExists(data.path);
      if (!fileExists) {
        throw new Error('File upload completed but file verification failed');
      }

      console.log('File verification successful');

      // Store the file path (not public URL) in verification_requests
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          document_type: 'commercial_registration',
          document_url: data.path, // Store file path for private bucket
          status: 'pending'
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        // If database insert fails, try to clean up the uploaded file
        await supabase.storage.from('chat-files').remove([data.path]);
        throw new Error(`Failed to save verification request: ${insertError.message}`);
      }

      showSuccess('Commercial Registration uploaded successfully');
      onUploadSuccess?.(data.path);
      setFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload process error:', error);
      showError(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleRetryUpload = async () => {
    if (!existingDocument) return;
    
    setRetrying(true);
    try {
      // Create a file input to allow re-upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.jpg,.jpeg,.png';
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const selectedFile = target.files?.[0];
        if (selectedFile) {
          setFile(selectedFile);
        }
      };
      input.click();
    } finally {
      setRetrying(false);
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
            <AlertDescription className="flex items-center justify-between">
              <span>Commercial Registration document has been uploaded and is under review.</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetryUpload}
                disabled={retrying}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Re-upload
              </Button>
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
