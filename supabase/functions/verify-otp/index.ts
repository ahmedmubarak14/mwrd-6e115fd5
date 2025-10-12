import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, otpCode } = await req.json();

    if (!phoneNumber || !otpCode) {
      throw new Error('Phone number and OTP code are required');
    }

    console.log('Verifying OTP for phone:', phoneNumber);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Retrieve most recent OTP for this phone number
    const { data: otpRecord, error: fetchError } = await supabaseClient
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching OTP:', fetchError);
      throw new Error('Failed to verify OTP');
    }

    if (!otpRecord) {
      throw new Error('OTP not found or expired. Please request a new code.');
    }

    // Check attempt limit (max 3 attempts per OTP)
    if (otpRecord.attempts >= 3) {
      throw new Error('Maximum verification attempts exceeded. Please request a new code.');
    }

    // Verify OTP
    if (otpRecord.otp_code !== otpCode) {
      // Increment attempts
      await supabaseClient
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      throw new Error('Invalid OTP code. Please try again.');
    }

    // Mark OTP as verified
    await supabaseClient
      .from('otp_verifications')
      .update({ 
        verified: true, 
        verified_at: new Date().toISOString() 
      })
      .eq('id', otpRecord.id);

    console.log('OTP verified successfully for:', phoneNumber);

    // Optional: Mark phone as verified in user profile
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      
      if (user) {
        // Update user metadata with verified phone
        await supabaseClient.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            phone_verified: true,
            phone_number: phoneNumber
          }
        });
        console.log('User metadata updated with verified phone');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Phone number verified successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
