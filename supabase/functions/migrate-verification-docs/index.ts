import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationResult {
  success: boolean;
  totalDocuments: number;
  migrated: number;
  failed: number;
  errors: Array<{ submissionId: string; documentType: string; error: string }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify admin access
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result: MigrationResult = {
      success: true,
      totalDocuments: 0,
      migrated: 0,
      failed: 0,
      errors: []
    };

    // Migrate KYV submissions
    const { data: kyvSubmissions, error: kyvError } = await supabaseClient
      .from('kyv_submissions')
      .select('*')
      .or('cr_document_url.like.*chat-files*,cr_document_url.like.*chat-images*,vat_certificate_url.like.*chat-files*,vat_certificate_url.like.*chat-images*,address_certificate_url.like.*chat-files*,address_certificate_url.like.*chat-images*');

    if (kyvError) {
      console.error('Error fetching KYV submissions:', kyvError);
    } else if (kyvSubmissions) {
      for (const submission of kyvSubmissions) {
        const documentsToMigrate = [
          { field: 'cr_document_url', url: submission.cr_document_url, type: 'cr' },
          { field: 'vat_certificate_url', url: submission.vat_certificate_url, type: 'vat' },
          { field: 'address_certificate_url', url: submission.address_certificate_url, type: 'address' }
        ];

        for (const doc of documentsToMigrate) {
          if (!doc.url || (!doc.url.includes('chat-files') && !doc.url.includes('chat-images'))) {
            continue;
          }

          result.totalDocuments++;

          try {
            // Extract file path from URL
            let filePath = doc.url;
            if (doc.url.includes('/storage/v1/object/public/chat-files/')) {
              filePath = doc.url.split('/storage/v1/object/public/chat-files/')[1];
            } else if (doc.url.includes('/storage/v1/object/public/chat-images/')) {
              filePath = doc.url.split('/storage/v1/object/public/chat-images/')[1];
            }

            const oldBucket = doc.url.includes('chat-images') ? 'chat-images' : 'chat-files';
            
            // Download from old bucket
            const { data: fileData, error: downloadError } = await supabaseClient.storage
              .from(oldBucket)
              .download(filePath);

            if (downloadError) {
              throw new Error(`Download failed: ${downloadError.message}`);
            }

            // Generate new file path
            const fileExt = filePath.split('.').pop();
            const newFileName = `${submission.user_id}/kyv/${doc.type}_${Date.now()}.${fileExt}`;

            // Upload to kyv-documents bucket
            const { error: uploadError } = await supabaseClient.storage
              .from('kyv-documents')
              .upload(newFileName, fileData, {
                contentType: fileData.type,
                upsert: false
              });

            if (uploadError) {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // Generate new URL
            const { data: { publicUrl } } = supabaseClient.storage
              .from('kyv-documents')
              .getPublicUrl(newFileName);

            // Update database with new URL
            const updateField = doc.field as 'cr_document_url' | 'vat_certificate_url' | 'address_certificate_url';
            const { error: updateError } = await supabaseClient
              .from('kyv_submissions')
              .update({ [updateField]: newFileName })
              .eq('id', submission.id);

            if (updateError) {
              throw new Error(`Database update failed: ${updateError.message}`);
            }

            // Log migration
            await supabaseClient.rpc('log_document_access_attempt', {
              file_path: newFileName,
              user_role: 'admin',
              success: true,
              error_message: `Migrated from ${oldBucket}: ${filePath}`
            });

            result.migrated++;
            console.log(`Migrated ${doc.type} for submission ${submission.id}`);

          } catch (error: any) {
            result.failed++;
            result.errors.push({
              submissionId: submission.id,
              documentType: doc.type,
              error: error.message
            });
            console.error(`Failed to migrate ${doc.type} for submission ${submission.id}:`, error);
          }
        }
      }
    }

    // Migrate KYC submissions (similar process)
    const { data: kycSubmissions, error: kycError } = await supabaseClient
      .from('kyc_submissions')
      .select('*')
      .or('cr_document_url.like.*chat-files*,cr_document_url.like.*chat-images*,vat_certificate_url.like.*chat-files*,vat_certificate_url.like.*chat-images*,address_certificate_url.like.*chat-files*,address_certificate_url.like.*chat-images*');

    if (!kycError && kycSubmissions) {
      for (const submission of kycSubmissions) {
        const documentsToMigrate = [
          { field: 'cr_document_url', url: submission.cr_document_url, type: 'cr' },
          { field: 'vat_certificate_url', url: submission.vat_certificate_url, type: 'vat' },
          { field: 'address_certificate_url', url: submission.address_certificate_url, type: 'address' }
        ];

        for (const doc of documentsToMigrate) {
          if (!doc.url || (!doc.url.includes('chat-files') && !doc.url.includes('chat-images'))) {
            continue;
          }

          result.totalDocuments++;

          try {
            let filePath = doc.url;
            if (doc.url.includes('/storage/v1/object/public/chat-files/')) {
              filePath = doc.url.split('/storage/v1/object/public/chat-files/')[1];
            } else if (doc.url.includes('/storage/v1/object/public/chat-images/')) {
              filePath = doc.url.split('/storage/v1/object/public/chat-images/')[1];
            }

            const oldBucket = doc.url.includes('chat-images') ? 'chat-images' : 'chat-files';
            
            const { data: fileData, error: downloadError } = await supabaseClient.storage
              .from(oldBucket)
              .download(filePath);

            if (downloadError) {
              throw new Error(`Download failed: ${downloadError.message}`);
            }

            const fileExt = filePath.split('.').pop();
            const newFileName = `${submission.user_id}/kyc/${doc.type}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabaseClient.storage
              .from('kyv-documents')
              .upload(newFileName, fileData, {
                contentType: fileData.type,
                upsert: false
              });

            if (uploadError) {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const updateField = doc.field as 'cr_document_url' | 'vat_certificate_url' | 'address_certificate_url';
            const { error: updateError } = await supabaseClient
              .from('kyc_submissions')
              .update({ [updateField]: newFileName })
              .eq('id', submission.id);

            if (updateError) {
              throw new Error(`Database update failed: ${updateError.message}`);
            }

            await supabaseClient.rpc('log_document_access_attempt', {
              file_path: newFileName,
              user_role: 'admin',
              success: true,
              error_message: `Migrated from ${oldBucket}: ${filePath}`
            });

            result.migrated++;
            console.log(`Migrated ${doc.type} for KYC submission ${submission.id}`);

          } catch (error: any) {
            result.failed++;
            result.errors.push({
              submissionId: submission.id,
              documentType: doc.type,
              error: error.message
            });
            console.error(`Failed to migrate ${doc.type} for KYC submission ${submission.id}:`, error);
          }
        }
      }
    }

    result.success = result.failed === 0;

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Migration function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
