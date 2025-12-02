import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  discord_tag: string | null;
  display_order: number;
  created_at: string;
}

export interface WhitelistApplication {
  id: string;
  discord_username: string;
  in_game_name: string;
  age: number;
  timezone: string;
  experience: string;
  character_story: string;
  why_join: string;
  rules_agreed: boolean;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface ServerUpdate {
  id: string;
  title: string;
  description: string;
  update_type: string;
  version: string | null;
  published_at: string;
  created_at: string;
}
