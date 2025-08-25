
import { supabase } from '@/integrations/supabase/client';

export interface DocumentUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface SignedUrlResult {
  success: boolean;
  signedUrl?: string;
  error?: string;
}

/**
 * Uploads a document to the chat-files bucket and verifies it exists
 */
export const uploadDocument = async (
  file: File,
  userId: string,
  documentType: string = 'commercial_registration'
): Promise<DocumentUploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${documentType}/${Date.now()}.${fileExt}`;

    console.log('Starting document upload:', fileName);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    console.log('Upload successful, verifying file exists:', data.path);

    // Verify the file actually exists
    const verificationResult = await verifyFileExists(data.path);
    if (!verificationResult.success) {
      console.error('File verification failed:', verificationResult.error);
      // Clean up the potentially failed upload
      await supabase.storage.from('chat-files').remove([data.path]);
      return { success: false, error: 'File upload verification failed' };
    }

    console.log('File verified successfully');
    return { success: true, filePath: data.path };

  } catch (error: any) {
    console.error('Document upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};

/**
 * Verifies that a file exists in storage
 */
export const verifyFileExists = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const pathParts = filePath.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');

    const { data, error } = await supabase.storage
      .from('chat-files')
      .list(folderPath, {
        search: fileName
      });

    if (error) {
      console.error('Error verifying file:', error);
      return { success: false, error: error.message };
    }

    const fileExists = data && data.length > 0;
    return { success: fileExists, error: fileExists ? undefined : 'File not found in storage' };

  } catch (error: any) {
    console.error('Error during file verification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generates a signed URL for accessing a document
 */
export const generateDocumentSignedUrl = async (
  filePath: string,
  expiresIn: number = 3600
): Promise<SignedUrlResult> => {
  try {
    let actualFilePath = filePath;

    // Handle legacy public URLs - extract file path
    if (filePath.startsWith('http')) {
      const urlParts = filePath.split('/storage/v1/object/public/chat-files/');
      if (urlParts.length === 2) {
        actualFilePath = urlParts[1];
        console.log('Extracted file path from public URL:', actualFilePath);
      } else {
        console.error('Unable to extract file path from URL:', filePath);
        return { success: false, error: 'Invalid document URL format' };
      }
    }

    // First verify the file exists
    const verificationResult = await verifyFileExists(actualFilePath);
    if (!verificationResult.success) {
      console.error('File does not exist:', actualFilePath);
      return { 
        success: false, 
        error: 'Document not found in storage. The file may have been deleted or corrupted.' 
      };
    }

    // Generate signed URL
    const { data, error } = await supabase.storage
      .from('chat-files')
      .createSignedUrl(actualFilePath, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return { success: false, error: `Failed to generate document access URL: ${error.message}` };
    }

    return { success: true, signedUrl: data.signedUrl };

  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Extracts the actual file path from various URL formats
 */
export const extractFilePath = (url: string): string => {
  if (!url.startsWith('http')) {
    return url; // Already a file path
  }

  // Handle public URL format
  const publicUrlParts = url.split('/storage/v1/object/public/chat-files/');
  if (publicUrlParts.length === 2) {
    return publicUrlParts[1];
  }

  // Handle signed URL format (extract from the path)
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/object/');
    if (pathParts.length === 2) {
      return pathParts[1].replace('chat-files/', '');
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }

  return url; // Return as-is if can't parse
};
