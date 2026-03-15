-- ============================================
-- Update handle_new_user_credentials function
-- to insert credentials into signin_credentials and user_credentials tables
-- ============================================

-- ⚠️ SECURITY WARNING: Storing plain text passwords is a security risk!
-- Consider using password hashing (bcrypt) or relying on Supabase Auth instead.
-- This implementation stores plain text passwords as requested.

-- First, let's check the table structures to understand what columns we need
-- Run these queries to see the table schemas:

-- Check signin_credentials table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'signin_credentials'
ORDER BY ordinal_position;

-- Check user_credentials table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_credentials'
ORDER BY ordinal_position;

-- ============================================
-- Updated function that inserts into credential tables
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_credentials()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert into signin_credentials table
  -- Note: NEW.raw_user_meta_data contains the password if passed during signup
  -- However, Supabase Auth doesn't expose passwords in triggers for security reasons
  -- You'll need to pass the password through metadata or use a different approach
  
  INSERT INTO public.signin_credentials (
    user_id,
    email,
    password,  -- ⚠️ This will be NULL unless password is passed via metadata
    signin_timestamp
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'password', NULL),  -- Try to get password from metadata
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    password = COALESCE(EXCLUDED.password, signin_credentials.password),
    signin_timestamp = NOW();

  -- Insert into user_credentials table (if it exists and has similar structure)
  -- Adjust columns based on your actual table structure
  INSERT INTO public.user_credentials (
    user_id,
    email,
    password,  -- ⚠️ This will be NULL unless password is passed via metadata
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'password', NULL),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    password = COALESCE(EXCLUDED.password, user_credentials.password),
    created_at = COALESCE(EXCLUDED.created_at, user_credentials.created_at);

  RETURN NEW;
END;
$function$;

-- ============================================
-- ALTERNATIVE APPROACH: Update application code instead
-- ============================================
-- Since Supabase Auth doesn't expose passwords in triggers,
-- you may need to update the SignUp.tsx code to insert credentials
-- after successful signup. See the updated SignUp.tsx code below.

