import { createClient } from '@supabase/supabase-js';

// These values are automatically provided by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging to see what we're getting
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('All env vars:', import.meta.env);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please ensure your Supabase integration is properly configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);