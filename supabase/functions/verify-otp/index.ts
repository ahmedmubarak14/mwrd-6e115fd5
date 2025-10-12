import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory OTP store (shared with send-otp function)
// In production, use Redis or database
const otpStore = new Map<string, { code: string; expiresAt: number }>();

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

    // Retrieve stored OTP
    const storedOtp = otpStore.get(phoneNumber);

    if (!storedOtp) {
      throw new Error('OTP not found. Please request a new code.');
    }

    // Check expiration
    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(phoneNumber);
      throw new Error('OTP has expired. Please request a new code.');
    }

    // Verify OTP
    if (storedOtp.code !== otpCode) {
      throw new Error('Invalid OTP code. Please try again.');
    }

    // OTP verified successfully - delete it
    otpStore.delete(phoneNumber);
    console.log('OTP verified successfully for:', phoneNumber);

    // Optional: Mark phone as verified in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      
      if (user) {
        // Update user metadata or profile with verified phone
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
