-- Fix PostgREST schema cache for profiles table
-- Run these commands in Supabase SQL Editor one by one

-- 1. First, verify the name column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. If name column is missing, add it
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- 3. Force PostgREST schema reload (try each method)
SELECT pg_notify('pgrst', 'reload schema');

-- 4. Alternative notification method
NOTIFY pgrst, 'reload schema';

-- 5. If above don't work, restart PostgREST connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE application_name LIKE '%postgrest%' OR application_name LIKE '%supabase%';