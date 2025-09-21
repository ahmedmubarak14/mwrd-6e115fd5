import { supabase } from '@/integrations/supabase/client';

const RATE_LIMIT_DELAY = 60000; // 1 minute between requests
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Exponential backoff delays

export const resendConfirmationEmail = async (email: string) => {
  let lastError: any = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        lastError = error;
        console.error(`Resend attempt ${attempt + 1} failed:`, error);
        
        // If it's a rate limit error, don't retry immediately
        if (error.message.includes('rate limit') || 
            error.message.includes('429') || 
            error.message.includes('security purposes')) {
          return { success: false, error: error.message };
        }
        
        // If not the last attempt, wait before retrying
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
          continue;
        }
        
        return { success: false, error: error.message };
      }

      console.log('Confirmation email sent successfully to:', email);
      return { success: true };
      
    } catch (error) {
      lastError = error;
      console.error(`Unexpected error on attempt ${attempt + 1}:`, error);
      
      // If not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
        continue;
      }
    }
  }
  
  return { 
    success: false, 
    error: lastError?.message || 'Failed to resend confirmation email after multiple attempts'
  };
};