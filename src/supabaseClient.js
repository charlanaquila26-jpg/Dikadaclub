import { createClient } from "@supabase/supabase-js";

// Vite reads env vars prefixed with VITE_ — set these in your .env.local
// and again in Vercel's Project Settings → Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
