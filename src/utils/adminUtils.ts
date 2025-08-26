
import { supabase } from '@/integrations/supabase/client';

export const getAvailableAdmins = async () => {
  try {
    console.log('Fetching available admins...');
    const { data: admins, error } = await supabase
      .from('user_profiles')
      .select('id, user_id, full_name, email')
      .eq('role', 'admin')
      .eq('status', 'approved')
      .limit(10);

    if (error) {
      console.error('Error fetching admins:', error);
      return [];
    }

    console.log('Found admins:', admins);
    return admins || [];
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export const selectRandomAdmin = (admins: any[]) => {
  if (!admins || admins.length === 0) {
    console.log('No admins available');
    return null;
  }
  const randomIndex = Math.floor(Math.random() * admins.length);
  const selectedAdmin = admins[randomIndex];
  console.log('Selected admin:', selectedAdmin);
  return selectedAdmin;
};
