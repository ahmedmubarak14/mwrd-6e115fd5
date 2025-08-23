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
  force?: boolean;
}

Deno.serve(async (req) => {
  console.log('=== Edge Function Started ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Environment Check ===');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('SUPABASE_URL exists:', !!supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseServiceKey);
    console.log('SUPABASE_URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Missing required environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('=== Request Body Parsing ===');
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      requestBody = JSON.parse(rawBody);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('=== Field Validation ===');
    const { email, password, role, full_name, force = false } = requestBody as CreateUserRequest;
    
    console.log('Extracted fields:', { email, password: password ? '[REDACTED]' : undefined, role, full_name, force });
    
    // Create admin client using service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Supabase client created successfully');

    if (!email || !password || !role || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, role, full_name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating user:', { email, role, full_name, force });

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('user_id, email')
      .eq('email', email)
      .maybeSingle();

    console.log('Existing profile check:', existingProfile);

    // Check if auth user exists
    const { data: { users: existingAuthUsers } } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.find(user => user.email === email);
    
    console.log('Existing auth user check:', !!existingAuthUser);

    if (existingProfile || existingAuthUser) {
      if (!force) {
        return new Response(
          JSON.stringify({ 
            error: 'User already exists',
            details: {
              profileExists: !!existingProfile,
              authUserExists: !!existingAuthUser,
              message: 'Use force=true to recreate the user'
            }
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Force cleanup of existing user
      console.log('Force cleanup requested - removing existing user');
      
      if (existingProfile) {
        console.log('Deleting existing profile:', existingProfile.user_id);
        await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', existingProfile.user_id);
      }

      if (existingAuthUser) {
        console.log('Deleting existing auth user:', existingAuthUser.id);
        await supabase.auth.admin.deleteUser(existingAuthUser.id);
      }
      
      console.log('Cleanup completed');
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

    // Create user profile with minimal required data, let schema defaults handle the rest
    console.log('Creating user profile with minimal data:', {
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
        status: 'approved'
        // Let schema defaults handle: categories, verification_documents, subscription_plan, subscription_status
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