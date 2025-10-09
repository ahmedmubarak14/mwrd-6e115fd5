import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://jpxqywtitjjphkiuokov.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpweHF5d3RpdGpqcGhraXVva292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Nzc5MjgsImV4cCI6MjA3MTU1MzkyOH0.2867pqseQHwJKM4648nIDqfwL3SQiBw3Lf2qgA-i0vI";

export const createTestClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const createTestUser = async (email: string, password: string) => {
  const client = createTestClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInTestUser = async (email: string, password: string) => {
  const client = createTestClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const cleanupTestUser = async (userId: string) => {
  const client = createTestClient();
  await client.auth.admin.deleteUser(userId);
};
