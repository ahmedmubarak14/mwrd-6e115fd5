import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from './useToastFeedback';

export interface FileUpload {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  upload_status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const { user } = useAuth();
  const { showSuccess, showError } = useToastFeedback();

  const uploadFile = async (
    file: File,
    entityType?: 'request' | 'offer' | 'message',
    entityId?: string
  ): Promise<FileUpload | null> => {
    if (!user) {
      showError('You must be logged in to upload files');
      return null;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('File size must be less than 10MB');
      return null;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      showError('File type not supported. Please upload images, PDFs, or document files.');
      return null;
    }

    setUploading(true);

    try {
      // Create file upload record
      const { data: uploadRecord, error: recordError } = await supabase
        .from('file_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: `${user.id}/${Date.now()}-${file.name}`,
          upload_status: 'uploading'
        })
        .select()
        .single();

      if (recordError) throw recordError;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(uploadRecord.storage_path, file);

      if (uploadError) throw uploadError;

      // Update upload status
      const { data: updatedRecord, error: updateError } = await supabase
        .from('file_uploads')
        .update({ upload_status: 'completed' })
        .eq('id', uploadRecord.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Create attachment if entity info provided
      if (entityType && entityId) {
        const { error: attachmentError } = await supabase
          .from('file_attachments')
          .insert({
            file_upload_id: uploadRecord.id,
            entity_type: entityType,
            entity_id: entityId
          });

        if (attachmentError) {
          console.error('Error creating attachment:', attachmentError);
        }
      }

      showSuccess('File uploaded successfully');
      setUploads(prev => [...prev, updatedRecord]);
      return updatedRecord;

    } catch (error: any) {
      console.error('Upload error:', error);
      showError(error.message || 'Failed to upload file');
      
      // Update status to failed if record was created
      if (uploads.length > 0) {
        const lastUpload = uploads[uploads.length - 1];
        await supabase
          .from('file_uploads')
          .update({ upload_status: 'failed' })
          .eq('id', lastUpload.id);
      }
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      // Get file info
      const { data: fileData, error: fetchError } = await supabase
        .from('file_uploads')
        .select('storage_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([fileData.storage_path]);

      if (storageError) throw storageError;

      // Delete record (cascades to attachments)
      const { error: deleteError } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);

      if (deleteError) throw deleteError;

      showSuccess('File deleted successfully');
      setUploads(prev => prev.filter(upload => upload.id !== fileId));
      return true;

    } catch (error: any) {
      console.error('Delete error:', error);
      showError(error.message || 'Failed to delete file');
      return false;
    }
  };

  const getFileUrl = async (storagePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const fetchUserUploads = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  return {
    uploading,
    uploads,
    uploadFile,
    deleteFile,
    getFileUrl,
    fetchUserUploads
  };
};