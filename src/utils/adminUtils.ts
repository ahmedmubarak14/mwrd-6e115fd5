
import { supabase } from '@/integrations/supabase/client';

export const getAvailableAdmins = async () => {
  try {
    const { data: admins, error } = await supabase
      .from('user_profiles')
      .select('user_id, full_name, email')
      .eq('role', 'admin')
      .eq('status', 'approved')
      .limit(10);

    if (error) {
      console.error('Error fetching admins:', error);
      return [];
    }

    return admins || [];
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export const selectRandomAdmin = (admins: any[]) => {
  if (!admins || admins.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * admins.length);
  return admins[randomIndex];
};
