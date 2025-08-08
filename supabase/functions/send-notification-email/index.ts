import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  type: 'offer' | 'request_approval' | 'offer_status' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, type }: EmailRequest = await req.json();

    console.log('Sending notification email:', { to, subject, type });

    // For now, we'll just log the email
    // In production, you would integrate with a service like Resend
    const emailLog = {
      timestamp: new Date().toISOString(),
      to,
      subject,
      message,
      type,
      status: 'sent'
    };

    console.log('Email notification logged:', emailLog);

    // Simulate email sending success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification email sent successfully',
        emailId: `email_${Date.now()}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);