// Single shared Supabase client for the whole app.
// Every hook (useGuestSession, useTasks, useTeamMembers) imports this same
// instance rather than creating its own, so auth state and API calls stay
// consistent across the app.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail fast and loud at startup if the env vars are missing, instead of
// letting every later Supabase call fail with a confusing network error.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.',
  )
}

// Only the public "anon" key is used here (never the service role key).
// Data access is actually secured by Postgres Row Level Security policies
// (see supabase/schema.sql), not by keeping this key secret.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
