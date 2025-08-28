-- Delete all existing messages and conversations to start fresh
DELETE FROM messages;
DELETE FROM conversations;

-- Reset the sequences if needed (this ensures clean IDs)
-- Note: Supabase uses UUIDs so no sequence reset needed