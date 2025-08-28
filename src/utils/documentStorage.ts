
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
 * Verifies that a file exists in storage with enhanced admin diagnostics
 */
export const verifyFileExists = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const pathParts = filePath.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');

    // Enhanced logging for debugging
    console.log('Verifying file existence:', { filePath, folderPath, fileName });

    const { data, error } = await supabase.storage
      .from('chat-files')
      .list(folderPath, {
        search: fileName
      });

    if (error) {
      console.error('Error verifying file:', error);
      return { success: false, error: `Storage error: ${error.message}` };
    }

    const fileExists = data && data.length > 0;
    
    if (!fileExists) {
      console.warn('File not found in storage:', { filePath, folderPath, fileName, availableFiles: data?.map(f => f.name) });
    } else {
      console.log('File verification successful:', fileName);
    }
    
    return { 
      success: fileExists, 
      error: fileExists ? undefined : `File not found in storage at path: ${folderPath}/${fileName}` 
    };

  } catch (error: any) {
    console.error('Error during file verification:', error);
    return { success: false, error: `Verification failed: ${error.message}` };
  }
};

/**
 * Generates a signed URL for accessing a document with admin support
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
        await logDocumentAccessAttempt(filePath, false, 'Invalid document URL format');
        return { success: false, error: 'Invalid document URL format' };
      }
    }

    // Check if current user is admin for better error handling
    const { data: { user } } = await supabase.auth.getUser();
    let userRole = 'unknown';
    
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      userRole = profile?.role || 'unknown';
    }

    // First verify the file exists (with enhanced logging for admins)
    const verificationResult = await verifyFileExists(actualFilePath);
    if (!verificationResult.success) {
      console.error('File does not exist:', actualFilePath);
      const errorMsg = userRole === 'admin' 
        ? `Admin access: Document not found in storage at path: ${actualFilePath}. File may have been deleted or path is incorrect.`
        : 'Document not found in storage. The file may have been deleted or corrupted.';
      
      await logDocumentAccessAttempt(actualFilePath, false, errorMsg);
      return { success: false, error: errorMsg };
    }

    // Generate signed URL with longer expiry for admins
    const adminExpiresIn = userRole === 'admin' ? Math.max(expiresIn, 7200) : expiresIn; // Min 2 hours for admins
    
    const { data, error } = await supabase.storage
      .from('chat-files')
      .createSignedUrl(actualFilePath, adminExpiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      const errorMsg = userRole === 'admin'
        ? `Admin access failed: ${error.message}. Check storage policies and file permissions.`
        : `Failed to generate document access URL: ${error.message}`;
      
      await logDocumentAccessAttempt(actualFilePath, false, errorMsg);
      return { success: false, error: errorMsg };
    }

    // Log successful access
    await logDocumentAccessAttempt(actualFilePath, true);
    console.log(`Document access granted for ${userRole}:`, actualFilePath);
    
    return { success: true, signedUrl: data.signedUrl };

  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    await logDocumentAccessAttempt(filePath, false, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Helper function to log document access attempts
 */
const logDocumentAccessAttempt = async (
  filePath: string, 
  success: boolean, 
  errorMessage?: string
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    await supabase.rpc('log_document_access_attempt', {
      file_path: filePath,
      user_role: profile?.role || 'unknown',
      success: success,
      error_message: errorMessage || null
    });
  } catch (error) {
    console.error('Failed to log document access attempt:', error);
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
