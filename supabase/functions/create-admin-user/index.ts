import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  full_name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create admin client using service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, password, role, full_name }: CreateUserRequest = await req.json();

    if (!email || !password || !role || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, role, full_name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating user:', { email, role, full_name });

    // Check if user already exists in profiles (avoid auth.users query issues)
    const { data: existingProfiles } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingProfiles) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create the user with admin privileges
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        full_name
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: `Authentication error: ${authError.message}` }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!authUser.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create authentication user' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Auth user created:', authUser.user.id);

    // Create or update the user profile directly with proper PostgreSQL types
    console.log('Creating user profile with data:', {
      user_id: authUser.user.id,
      email: email,
      full_name: full_name,
      role: role
    });

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: authUser.user.id,
        email: email,
        full_name: full_name,
        role: role as 'admin' | 'client' | 'vendor',
        status: 'approved',
        // Use proper PostgreSQL array literals
        categories: '{}', // Empty PostgreSQL text array
        verification_documents: '[]', // Empty JSONB array
        subscription_plan: 'free', // Use default value from schema
        subscription_status: 'active'
      });

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // Try to clean up the auth user if profile creation failed
      try {
        await supabase.auth.admin.deleteUser(authUser.user.id);
        console.log('Cleaned up auth user due to profile creation failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Profile creation failed: ${profileError.message}`,
          details: profileError.details,
          code: profileError.code
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User profile created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: authUser.user.id,
        email: email,
        message: 'Admin user created successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});