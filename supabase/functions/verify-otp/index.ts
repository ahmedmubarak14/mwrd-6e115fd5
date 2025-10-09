import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_ATTEMPTS = 3;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, otpCode } = await req.json();

    console.log('OTP verification request for phone:', phoneNumber);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Get latest OTP for this phone
    const { data: verification, error: fetchError } = await supabaseClient
      .from('phone_verifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('phone_number', phoneNumber)
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verification) {
      console.error('Verification fetch error:', fetchError);
      throw new Error('No pending verification found');
    }

    console.log('Verification found:', verification.id);

    // Check expiry
    if (new Date(verification.otp_expires_at) < new Date()) {
      console.log('OTP expired');
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Check attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      console.log('Max attempts exceeded');
      throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // Verify OTP using secure database function
    const { data: isValid, error: verifyError } = await supabaseClient
      .rpc('verify_otp_code', { 
        stored_hash: verification.hashed_code,
        otp_input: otpCode 
      });

    if (verifyError || !isValid) {
      console.log('Invalid OTP provided');
      // Increment attempts
      await supabaseClient
        .from('phone_verifications')
        .update({ attempts: verification.attempts + 1 })
        .eq('id', verification.id);

      throw new Error(`Invalid OTP. ${MAX_ATTEMPTS - verification.attempts - 1} attempts remaining.`);
    }

    console.log('OTP verified successfully');

    // Mark as verified
    await supabaseClient
      .from('phone_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verification.id);

    // Update user profile with verified phone
    await supabaseClient
      .from('user_profiles')
      .update({ phone: phoneNumber })
      .eq('user_id', user.id);

    console.log('Phone number updated in profile');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Phone number verified successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
