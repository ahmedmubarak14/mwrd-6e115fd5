import { supabase } from '@/integrations/supabase/client';

export const resendConfirmationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });

    if (error) {
      console.error('Error resending confirmation:', error);
      return { success: false, error: error.message };
    }

    console.log('Confirmation email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Failed to resend confirmation email' };
  }
};