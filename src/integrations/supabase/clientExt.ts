
// Re-export the main supabase client to avoid creating multiple GoTrueClient instances
// This prevents the "Multiple GoTrueClient instances detected" warning
import { supabase } from './client';

// Import the supabase client like this:
// import { supabaseExt } from "@/integrations/supabase/clientExt";

// Re-export the same client instance with a different name for backward compatibility
// This ensures only one GoTrueClient instance is created, preventing the warning
export const supabaseExt = supabase;
