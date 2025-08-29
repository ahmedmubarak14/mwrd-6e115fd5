import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, FileText, Image, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface SmartFileUploadProps {
  rfqId?: string;
  uploadedFiles: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

export const SmartFileUpload = ({
  rfqId,
  uploadedFiles,
  onFilesChange,
  maxFiles = 10,
  maxSizePerFile = 10, // 10MB default
  acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.zip'],
  disabled = false
}: SmartFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';

  const maxSizeBytes = maxSizePerFile * 1024 * 1024;

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('rfq-attachments')
        .upload(filePath, file, {
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('rfq-attachments')
        .getPublicUrl(filePath);

      // If we have an RFQ ID, save to database
      if (rfqId) {
        const { error: dbError } = await (supabase as any)
          .from('rfq_attachments')
          .insert({
            rfq_id: rfqId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: filePath,
            uploaded_by: user.id,
            description: `Attachment for RFQ: ${file.name}`
          });

        if (dbError) {
          console.error('Database error:', dbError);
          // Still return the file info even if DB insert fails
        }
      }

      return {
        id: fileName,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || uploading) return;

    // Check file count limit
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast({
        title: language === 'ar' ? 'تجاوز حد الملفات' : 'File Limit Exceeded',
        description: language === 'ar' 
          ? `يمكنك رفع حد أقصى ${maxFiles} ملف`
          : `You can upload a maximum of ${maxFiles} files`,
        variant: 'destructive'
      });
      return;
    }

    // Check file sizes
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      toast({
        title: language === 'ar' ? 'حجم ملف كبير جداً' : 'File Too Large',
        description: language === 'ar'
          ? `الحد الأقصى لحجم الملف ${maxSizePerFile}MB`
          : `Maximum file size is ${maxSizePerFile}MB`,
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const result = await uploadFile(file);
        // Update progress
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100);
        return result;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];

      if (successfulUploads.length > 0) {
        onFilesChange([...uploadedFiles, ...successfulUploads]);
        toast({
          title: language === 'ar' ? 'تم رفع الملفات' : 'Files Uploaded',
          description: language === 'ar'
            ? `تم رفع ${successfulUploads.length} ملف بنجاح`
            : `Successfully uploaded ${successfulUploads.length} files`
        });
      }

      if (results.some(result => !result)) {
        toast({
          title: language === 'ar' ? 'خطأ في بعض الملفات' : 'Some Files Failed',
          description: language === 'ar'
            ? 'فشل في رفع بعض الملفات'
            : 'Some files failed to upload',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: language === 'ar' ? 'خطأ في الرفع' : 'Upload Error',
        description: language === 'ar'
          ? 'حدث خطأ أثناء رفع الملفات'
          : 'An error occurred while uploading files',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [uploadedFiles, maxFiles, maxSizeBytes, disabled, uploading, user, rfqId, onFilesChange, toast, language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/zip': ['.zip']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: maxSizeBytes,
    disabled: disabled || uploading
  });

  const removeFile = async (file: UploadedFile) => {
    if (disabled) return;

    try {
      // Remove from storage
      const { error } = await supabase.storage
        .from('rfq-attachments')
        .remove([file.path]);

      if (error) {
        console.error('Error removing file:', error);
      }

      // Remove from database if we have RFQ ID
      if (rfqId) {
        await (supabase as any)
          .from('rfq_attachments')
          .delete()
          .eq('storage_path', file.path);
      }

      // Update local state
      onFilesChange(uploadedFiles.filter(f => f.id !== file.id));
      
      toast({
        title: language === 'ar' ? 'تم حذف الملف' : 'File Removed',
        description: language === 'ar' ? 'تم حذف الملف بنجاح' : 'File removed successfully'
      });
    } catch (error) {
      console.error('Error removing file:', error);
      toast({
        title: language === 'ar' ? 'خطأ في الحذف' : 'Removal Error',
        description: language === 'ar' ? 'فشل في حذف الملف' : 'Failed to remove file',
        variant: 'destructive'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2">
          {language === 'ar' ? 'المرفقات' : 'Attachments'}
          <span className="text-sm text-muted-foreground">
            ({uploadedFiles.length}/{maxFiles})
          </span>
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'ar' 
            ? `حد أقصى ${maxSizePerFile}MB لكل ملف. الأنواع المدعومة: PDF, Word, Excel, الصور, ZIP`
            : `Maximum ${maxSizePerFile}MB per file. Supported: PDF, Word, Excel, Images, ZIP`
          }
        </p>
      </div>

      {/* Upload Area */}
      <Card className={`transition-colors ${isDragActive ? 'border-primary bg-primary/5' : ''} ${disabled ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? (language === 'ar' ? 'اسحب الملفات هنا...' : 'Drop files here...')
                    : (language === 'ar' ? 'اسحب الملفات أو انقر للتحديد' : 'Drag files here or click to select')
                  }
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? `يمكنك رفع ${maxFiles - uploadedFiles.length} ملف إضافي`
                    : `You can upload ${maxFiles - uploadedFiles.length} more files`
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            {language === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {uploadedFiles.length === maxFiles && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>
            {language === 'ar' 
              ? `تم الوصول للحد الأقصى من الملفات (${maxFiles})`
              : `Maximum file limit reached (${maxFiles})`
            }
          </span>
        </div>
      )}
    </div>
  );
};