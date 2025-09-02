
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { supabase } from '@/integrations/supabase/client';
import { uploadDocument } from '@/utils/documentStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
  const { t, isRTL } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        showError(t('verification.invalidFileTypePDFJPGPNG'));
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showError(t('verification.maxSize10MB'));
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
        showError(t('verification.loginRequired'));
        return;
      }

      console.log('Starting upload process for user:', user.id);

      // Use the new document storage utility
      const uploadResult = await uploadDocument(file, user.id, 'cr-documents');
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      console.log('Upload successful, saving to database:', uploadResult.filePath);

      // Store the verification request in database
      const { error: insertError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          document_type: 'commercial_registration',
          document_url: uploadResult.filePath!, // Store file path for private bucket
          status: 'pending'
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        // Clean up the uploaded file if database insert fails
        await supabase.storage.from('chat-files').remove([uploadResult.filePath!]);
        throw new Error(`Failed to save verification request: ${insertError.message}`);
      }

      showSuccess(t('verification.uploadSuccess'));
      onUploadSuccess?.(uploadResult.filePath!);
      setFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload process error:', error);
      showError(error.message || t('verification.uploadFailed'));
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
        <CardTitle className={cn(
          "flex items-center gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <FileText className="h-5 w-5" />
          {t('verification.crDocumentTitle')}
          {isRequired && <span className="text-destructive">*</span>}
        </CardTitle>
        <CardDescription className={cn(isRTL && "text-right")}>
          {t('verification.crDocumentDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingDocument && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse text-right"
            )}>
              <span>{t('verification.documentUploaded')}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetryUpload}
                disabled={retrying}
                className={cn(isRTL ? "mr-2 ml-0" : "ml-2 mr-0")}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isRTL ? "ml-1 mr-0" : "mr-1 ml-0"
                )} />
                {t('verification.reupload')}
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
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          
          {file && (
            <div className={cn(
              "flex items-center gap-2 p-3 bg-muted rounded-md",
              isRTL && "flex-row-reverse"
            )}>
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
            <Upload className={cn(
              "h-4 w-4",
              isRTL ? "ml-2 mr-0" : "mr-2 ml-0"
            )} />
            {uploading ? t('verification.uploading') : t('verification.uploadCRButton')}
          </Button>
        </div>

        {isRequired && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={cn(isRTL && "text-right")}>
              {t('verification.crVerificationRequired')}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
