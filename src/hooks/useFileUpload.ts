import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from './useToastFeedback';

export interface FileUpload {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_url: string;
  user_id: string;
  created_at: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const { showError, showSuccess } = useToastFeedback();

  const getBucketForFileType = (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'chat-images';
    if (fileType.startsWith('audio/')) return 'voice-messages';
    return 'chat-files';
  };

  const uploadFile = async (
    file: File, 
    bucketOverride?: 'chat-files' | 'chat-images' | 'voice-messages' | 'kyv-documents'
  ): Promise<{ id: string; url: string; metadata: any } | null> => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('You must be logged in to upload files');
        return null;
      }

      const bucket = bucketOverride || getBucketForFileType(file.type);
      const fileExt = file.name.split('.').pop();
      const fileName = bucketOverride === 'kyv-documents' 
        ? `${user.id}/kyv/${Date.now()}.${fileExt}`
        : `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        showError(`Upload failed: ${error.message}`);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const fileUpload: FileUpload = {
        id: data.path,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        upload_url: publicUrl,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      setUploads(prev => [...prev, fileUpload]);
      showSuccess('File uploaded successfully');
      
      return { 
        id: data.path, 
        url: publicUrl,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          bucket
        }
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      showError('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('You must be logged in to delete files');
        return false;
      }

      // Delete from storage
      const { error } = await supabase.storage
        .from('chat-files') // Try each bucket
        .remove([fileId]);

      if (error) {
        const { error: error2 } = await supabase.storage
          .from('chat-images')
          .remove([fileId]);
        
        if (error2) {
          const { error: error3 } = await supabase.storage
            .from('voice-messages')
            .remove([fileId]);
          
          if (error3) {
            showError('Failed to delete file');
            return false;
          }
        }
      }

      setUploads(prev => prev.filter(upload => upload.id !== fileId));
      showSuccess('File deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      showError('Failed to delete file');
      return false;
    }
  };

  return {
    uploading,
    uploads,
    uploadFile,
    deleteFile
  };
};