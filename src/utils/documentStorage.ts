
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
  documentType: string = 'commercial_registration',
  bucket: string = 'chat-files'
): Promise<DocumentUploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${documentType}/${Date.now()}.${fileExt}`;

    console.log('Starting document upload:', fileName, 'to bucket:', bucket);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    console.log('Upload successful, verifying file exists:', data.path);

    // Verify the file actually exists (with retries for race condition)
    let verificationResult: { success: boolean; error?: string } = { success: false, error: '' };
    for (let attempt = 1; attempt <= 3; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 500 * attempt)); // 500ms, 1s, 1.5s delays
      verificationResult = await verifyFileExists(data.path);
      if (verificationResult.success) break;
      console.log(`Verification attempt ${attempt} failed, retrying...`);
    }
    
    if (!verificationResult.success) {
      console.error('File verification failed after 3 attempts:', verificationResult.error);
      // Clean up the potentially failed upload (use the correct bucket variable)
      await supabase.storage.from(bucket).remove([data.path]);
      return { success: false, error: 'File upload verification failed after multiple attempts' };
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
 * Auto-detects bucket from file path prefix
 */
export const verifyFileExists = async (filePath: string, bucket: string = 'chat-files'): Promise<{ success: boolean; error?: string }> => {
  try {
    let actualFilePath = filePath;
    let detectedBucket = bucket;

    // Auto-detect bucket from path prefix and strip it
    if (filePath.startsWith('chat-files/')) {
      detectedBucket = 'chat-files';
      actualFilePath = filePath.replace(/^chat-files\//, '');
    } else if (filePath.startsWith('chat-images/')) {
      detectedBucket = 'chat-images';
      actualFilePath = filePath.replace(/^chat-images\//, '');
    } else if (filePath.startsWith('kyv-documents/')) {
      detectedBucket = 'kyv-documents';
      actualFilePath = filePath.replace(/^kyv-documents\//, '');
    } else if (filePath.includes('/kyv/')) {
      detectedBucket = 'kyv-documents';
    }

    const pathParts = actualFilePath.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');

    console.log('Document verification check:', { 
      originalPath: filePath, 
      actualFilePath, 
      folderPath, 
      fileName, 
      bucket: detectedBucket 
    });

    const { data, error } = await supabase.storage
      .from(detectedBucket)
      .list(folderPath, {
        search: fileName
      });

    if (error) {
      console.error('Error verifying file:', error);
      return { success: false, error: `Storage error: ${error.message}` };
    }

    const fileExists = data && data.length > 0;
    
    if (!fileExists) {
      console.warn('File not found in bucket:', { 
        bucket: detectedBucket, 
        filePath: actualFilePath, 
        folderPath, 
        fileName, 
        availableFiles: data?.map(f => f.name) 
      });
    } else {
      console.log('File verification successful:', fileName, 'in bucket:', detectedBucket);
    }
    
    return { 
      success: fileExists, 
      error: fileExists ? undefined : `File not found in ${detectedBucket} at path: ${folderPath}/${fileName}` 
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
    let bucket = 'chat-files'; // default

    // Handle legacy public URLs - extract file path and determine bucket
    if (filePath.startsWith('http')) {
      // Try chat-files bucket
      let urlParts = filePath.split('/storage/v1/object/public/chat-files/');
      if (urlParts.length === 2) {
        actualFilePath = urlParts[1];
        bucket = 'chat-files';
        console.log('Extracted file path from chat-files URL:', actualFilePath);
      } else {
        // Try chat-images bucket
        urlParts = filePath.split('/storage/v1/object/public/chat-images/');
        if (urlParts.length === 2) {
          actualFilePath = urlParts[1];
          bucket = 'chat-images';
          console.log('Extracted file path from chat-images URL:', actualFilePath);
        } else {
          // Try kyv-documents bucket (signed URLs)
          urlParts = filePath.split('/storage/v1/object/sign/kyv-documents/');
          if (urlParts.length === 2) {
            actualFilePath = urlParts[1].split('?')[0]; // Remove query params
            bucket = 'kyv-documents';
            console.log('Extracted file path from kyv-documents URL:', actualFilePath);
          } else {
            console.error('Unable to extract file path from URL:', filePath);
            await logDocumentAccessAttempt(filePath, false, 'Invalid document URL format');
            return { success: false, error: 'Invalid document URL format' };
          }
        }
      }
    } else {
      // Detect bucket from path prefix and strip it
      if (filePath.startsWith('chat-files/')) {
        bucket = 'chat-files';
        actualFilePath = filePath.replace(/^chat-files\//, '');
      } else if (filePath.startsWith('chat-images/')) {
        bucket = 'chat-images';
        actualFilePath = filePath.replace(/^chat-images\//, '');
      } else if (filePath.startsWith('kyv-documents/')) {
        bucket = 'kyv-documents';
        actualFilePath = filePath.replace(/^kyv-documents\//, '');
      } else if (filePath.includes('/kyv/')) {
        bucket = 'kyv-documents';
      }
    }

    // Check if current user is admin for better error handling
    const { data: { user } } = await supabase.auth.getUser();
    let userRole = 'unknown';
    
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles_with_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      userRole = profile?.role || 'unknown';
    }

    // Generate signed URL with longer expiry for admins (skip verification for faster access)
    const adminExpiresIn = userRole === 'admin' ? Math.max(expiresIn, 7200) : expiresIn; // Min 2 hours for admins
    
    console.log(`Generating signed URL for ${userRole}:`, actualFilePath, 'from bucket:', bucket);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(actualFilePath, adminExpiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      const errorMsg = userRole === 'admin'
        ? `Admin access failed: ${error.message}. Check storage policies and file permissions.`
        : `Failed to generate document access URL: ${error.message}`;
      
      await logDocumentAccessAttempt(actualFilePath, false, errorMsg);
      return { success: false, error: errorMsg };
    }

    // Convert relative signed URL to absolute URL
    const baseUrl = 'https://jpxqywtitjjphkiuokov.supabase.co';
    const absoluteSignedUrl = data.signedUrl.startsWith('http') 
      ? data.signedUrl 
      : `${baseUrl}/storage/v1${data.signedUrl}`;

    console.log('Generated absolute signed URL:', absoluteSignedUrl);

    // Log successful access
    await logDocumentAccessAttempt(actualFilePath, true);
    console.log(`Document access granted for ${userRole}:`, actualFilePath, 'from bucket:', bucket);
    
    return { success: true, signedUrl: absoluteSignedUrl };

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
      .from('user_profiles_with_roles')
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
 * Handles all buckets: chat-files, chat-images, kyv-documents
 */
export const extractFilePath = (url: string): string => {
  if (!url.startsWith('http')) {
    return url; // Already a file path
  }

  // Handle public URL formats for all buckets
  const buckets = ['chat-files', 'chat-images', 'kyv-documents'];
  for (const bucket of buckets) {
    const publicUrlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (publicUrlParts.length === 2) {
      return publicUrlParts[1];
    }
  }

  // Handle signed URL formats for all buckets
  for (const bucket of buckets) {
    const signedUrlParts = url.split(`/storage/v1/object/sign/${bucket}/`);
    if (signedUrlParts.length === 2) {
      // Remove query parameters (token)
      return signedUrlParts[1].split('?')[0];
    }
  }

  // Fallback: try to parse as URL and extract path
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/object/');
    if (pathParts.length === 2) {
      // Remove any bucket prefix from the path
      let path = pathParts[1];
      for (const bucket of buckets) {
        if (path.startsWith(`${bucket}/`)) {
          path = path.replace(`${bucket}/`, '');
          break;
        }
      }
      return path;
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }

  return url; // Return as-is if can't parse
};
