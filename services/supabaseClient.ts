import { createClient } from '@supabase/supabase-js';

// Fallback values from .env to ensure connection works even if env vars aren't loaded correctly
const FALLBACK_URL = 'https://oejvltmdjdtfslgnefgd.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lanZsdG1kamR0ZnNsZ25lZmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODIyODIsImV4cCI6MjA4NDI1ODI4Mn0.etlaaEnFR2PXZFatmto7FR4qE2YYb4B7Jisq6ISl3Gs';

const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl = envUrl || FALLBACK_URL;
export const supabaseAnonKey = envKey || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
