
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase configuration
const supabaseUrl = 'https://oafjzglwgovmalykvfpp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZmp6Z2x3Z292bWFseWt2ZnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODQwNzYsImV4cCI6MjA3ODg2MDA3Nn0.IWKNHA0icJjQADgJ8ghFSPEAeG7FG5CmNJBMMX2D1HY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
};
