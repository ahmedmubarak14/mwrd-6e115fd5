
-- Add RLS policy to allow admins to access all files in chat-files bucket for verification
INSERT INTO storage.policies (id, bucket_id, name, definition, check_expression, command)
VALUES (
  'admin_access_chat_files',
  'chat-files',
  'Admins can access all files in chat-files bucket',
  '(SELECT role FROM public.user_profiles WHERE user_id = auth.uid()) = ''admin''',
  null,
  'SELECT'
);
