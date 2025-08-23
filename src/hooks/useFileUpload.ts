import { useState } from 'react';

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

  const uploadFile = async (file: File): Promise<{ id: string; url: string } | null> => {
    setUploading(true);
    try {
      // Mock file upload - in a real app, you'd upload to Supabase Storage
      const mockUpload: FileUpload = {
        id: Date.now().toString(),
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        upload_url: URL.createObjectURL(file),
        user_id: 'current-user',
        created_at: new Date().toISOString()
      };

      setUploads(prev => [...prev, mockUpload]);
      return { id: mockUpload.id, url: mockUpload.upload_url };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      setUploads(prev => prev.filter(upload => upload.id !== fileId));
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
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