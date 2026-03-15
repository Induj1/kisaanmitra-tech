-- ============================================
-- SQL Queries to Check Database Triggers
-- Run these in Supabase SQL Editor
-- ============================================

-- Method 1: List ALL triggers in the database
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing,
    action_orientation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Method 2: Check triggers specifically on signin_credentials table
SELECT 
    trigger_name,
    event_manipulation AS event_type,  -- INSERT, UPDATE, DELETE
    action_timing AS when_triggered,   -- BEFORE, AFTER
    action_statement AS trigger_function
FROM information_schema.triggers
WHERE event_object_table = 'signin_credentials'
AND trigger_schema = 'public';

-- Method 3: Check triggers on user_credentials table
SELECT 
    trigger_name,
    event_manipulation AS event_type,
    action_timing AS when_triggered,
    action_statement AS trigger_function
FROM information_schema.triggers
WHERE event_object_table = 'user_credentials'
AND trigger_schema = 'public';

-- Method 4: Check triggers on auth.users table (Supabase's auth table)
SELECT 
    trigger_name,
    event_manipulation AS event_type,
    action_timing AS when_triggered,
    action_statement AS trigger_function
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- Method 5: Get detailed trigger information including the function code
SELECT 
    t.trigger_name,
    t.event_object_table,
    t.event_manipulation,
    t.action_timing,
    t.action_orientation,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM information_schema.triggers t
JOIN pg_trigger pt ON pt.tgname = t.trigger_name
JOIN pg_proc p ON p.oid = pt.tgfoid
WHERE t.trigger_schema = 'public'
AND (t.event_object_table = 'signin_credentials' 
     OR t.event_object_table = 'user_credentials'
     OR t.event_object_table = 'farmer_profiles')
ORDER BY t.event_object_table, t.trigger_name;

-- Method 6: Check for triggers that might be inserting into signin_credentials
SELECT 
    t.trigger_name,
    t.event_object_table AS source_table,
    t.event_manipulation,
    t.action_timing,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_code
FROM information_schema.triggers t
JOIN pg_trigger pt ON pt.tgname = t.trigger_name
JOIN pg_proc p ON p.oid = pt.tgfoid
WHERE t.trigger_schema = 'public'
AND pg_get_functiondef(p.oid) ILIKE '%signin_credentials%'
ORDER BY t.trigger_name;

-- Method 7: List all trigger functions in the database
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND pg_get_functiondef(p.oid) ILIKE '%trigger%'
ORDER BY p.proname;

-- Method 8: Get the function definition for handle_new_user_credentials (the trigger function we found)
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user_credentials';

-- Method 9: Check triggers on auth.users and get their function definitions
SELECT 
    t.trigger_name,
    t.event_object_table,
    t.event_manipulation,
    t.action_timing,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM information_schema.triggers t
JOIN pg_trigger pt ON pt.tgname = t.trigger_name
JOIN pg_proc p ON p.oid = pt.tgfoid
WHERE t.event_object_schema = 'auth'
AND t.event_object_table = 'users';

-- Method 10: Get full function definition for handle_new_user_credentials (checking all schemas)
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS full_function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user_credentials'
ORDER BY n.nspname;

-- Method 11: Alternative way to see function code (might show better formatting)
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS function_body
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user_credentials';

