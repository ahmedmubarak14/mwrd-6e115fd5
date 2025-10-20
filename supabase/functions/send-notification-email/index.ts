import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { emailTranslations, type EmailLanguage, type EmailType } from "./translations.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  type: EmailType;
  language?: EmailLanguage;
  data?: any;
}

const generateEmailTemplate = (
  type: EmailType, 
  message: string, 
  data?: any,
  language: EmailLanguage = 'en'
): string => {
  const t = emailTranslations[language];
  const isRTL = language === 'ar';
  const fontFamily = isRTL 
    ? "'Cairo', 'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  
  const baseStyle = `
    <style>
      body { 
        font-family: ${fontFamily}; 
        line-height: 1.6; 
        color: #333; 
        direction: ${isRTL ? 'rtl' : 'ltr'}; 
        text-align: ${isRTL ? 'right' : 'left'};
      }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px 20px; border: 1px solid #e1e5e9; }
      .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      .highlight { 
        background: #f8f9fa; 
        padding: 15px; 
        border-${isRTL ? 'right' : 'left'}: 4px solid #667eea; 
        margin: 20px 0; 
      }
    </style>
  `;

  switch (type) {
    case 'offer':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>${t.offer.title}</h1>
          </div>
          <div class="content">
            <p>${t.offer.message}</p>
            <div class="highlight">
              <p>${message}</p>
              ${data?.price ? `<p><strong>${t.offer.price}:</strong> ${data.price} ${data.currency || 'SAR'}</p>` : ''}
              ${data?.delivery_time_days ? `<p><strong>${t.offer.deliveryTime}:</strong> ${data.delivery_time_days} ${t.offer.days}</p>` : ''}
            </div>
            <a href="${data?.platform_url || '#'}" class="button">${t.offer.viewDetails}</a>
          </div>
          <div class="footer">
            <p>${t.offer.footer}</p>
          </div>
        </div>
      `;
    
    case 'request_approval':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>${t.request_approval.title}</h1>
          </div>
          <div class="content">
            <p>${t.request_approval.message}</p>
            <div class="highlight">
              <p>${message}</p>
              ${data?.request_title ? `<p><strong>${t.request_approval.request}:</strong> ${data.request_title}</p>` : ''}
              ${data?.status ? `<p><strong>${t.request_approval.status}:</strong> ${data.status}</p>` : ''}
            </div>
            <a href="${data?.platform_url || '#'}" class="button">${t.request_approval.viewRequest}</a>
          </div>
          <div class="footer">
            <p>${t.request_approval.footer}</p>
          </div>
        </div>
      `;
    
    case 'offer_status':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>${t.offer_status.title}</h1>
          </div>
          <div class="content">
            <p>${t.offer_status.message}</p>
            <div class="highlight">
              <p>${message}</p>
              ${data?.offer_title ? `<p><strong>${t.offer_status.offer}:</strong> ${data.offer_title}</p>` : ''}
              ${data?.status ? `<p><strong>${t.offer_status.newStatus}:</strong> ${data.status}</p>` : ''}
            </div>
            <a href="${data?.platform_url || '#'}" class="button">${t.offer_status.viewDetails}</a>
          </div>
          <div class="footer">
            <p>${t.offer_status.footer}</p>
          </div>
        </div>
      `;
    
    default:
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>${t.general.title}</h1>
          </div>
          <div class="content">
            <div class="highlight">
              <p>${message}</p>
            </div>
            <a href="${data?.platform_url || '#'}" class="button">${t.general.visitPlatform}</a>
          </div>
          <div class="footer">
            <p>${t.general.footer}</p>
          </div>
        </div>
      `;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, type, language = 'en', data }: EmailRequest = await req.json();

    console.log('Sending notification email:', { to, subject, type, language });

    // Generate email HTML based on type and language
    const emailHtml = generateEmailTemplate(type, message, data, language);

    const emailResponse = await resend.emails.send({
      from: "MWRD Platform <notifications@resend.dev>",
      to: [to],
      subject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification email sent successfully',
        emailId: emailResponse.data?.id || `email_${Date.now()}`
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