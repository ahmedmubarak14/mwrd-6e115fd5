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

    if (!phoneNumber || !phoneNumber.match(/^\+966[0-9]{9}$/)) {
      throw new Error('Invalid Saudi phone number format. Expected +966XXXXXXXXX');
    }

    console.log('Generating OTP for phone:', phoneNumber);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check rate limiting - max 3 OTPs per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentOtps, error: countError } = await supabaseClient
      .from('otp_verifications')
      .select('id')
      .eq('phone_number', phoneNumber)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
    }

    if (recentOtps && recentOtps.length >= 3) {
      throw new Error('Too many OTP requests. Please try again later.');
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    const { error: insertError } = await supabaseClient
      .from('otp_verifications')
      .insert({
        phone_number: phoneNumber,
        otp_code: otpCode,
        expires_at: expiresAt
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      throw new Error('Failed to generate OTP');
    }

    console.log('OTP generated and stored:', otpCode);

    // TODO: In production, integrate with SMS provider
    // Example providers:
    // - Twilio: https://www.twilio.com/docs/sms
    // - Unifonic (Saudi-based): https://www.unifonic.com/
    // - AWS SNS: https://aws.amazon.com/sns/
    
    // For now, we'll simulate sending (DEV mode)
    console.log(`[DEV] OTP ${otpCode} would be sent to ${phoneNumber}`);

    // In production, uncomment and configure your SMS provider:
    /*
    const smsResponse = await fetch('https://api.sms-provider.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SMS_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: `Your verification code is: ${otpCode}. Valid for 5 minutes.`
      })
    });

    if (!smsResponse.ok) {
      throw new Error('Failed to send SMS');
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'OTP sent successfully',
        // Only include devOtp in development
        devOtp: Deno.env.get('ENVIRONMENT') === 'production' ? undefined : otpCode
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
