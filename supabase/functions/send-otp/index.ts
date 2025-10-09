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
    const { phoneNumber } = await req.json();
    
    console.log('OTP request for phone:', phoneNumber);
    
    // Validate Saudi phone format
    if (!/^\+966[0-9]{9}$/.test(phoneNumber)) {
      throw new Error('Invalid Saudi phone number format. Must be +966XXXXXXXXX');
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Store OTP in database
    const { error: insertError } = await supabaseClient
      .from('phone_verifications')
      .insert({
        user_id: user.id,
        phone_number: phoneNumber,
        otp_code: otpCode,
        otp_expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('OTP stored successfully');

    // TODO: Integrate with SMS gateway (Twilio, AWS SNS, or local Saudi provider)
    // For now, log OTP (DEVELOPMENT ONLY - REMOVE IN PRODUCTION)
    console.log(`OTP for ${phoneNumber}: ${otpCode}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        expiresAt: expiresAt.toISOString(),
        // REMOVE IN PRODUCTION:
        devOtp: otpCode 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
