import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmxtvnzcqekpikchkvda.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teHR2bnpjcWVrcGlrY2hrdmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzU0OTIsImV4cCI6MjA3MTM1MTQ5Mn0.lL-dSqS48CeV_OW7rZbxllHxYs9ZYFooKOpPTvssX00'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  username: string
  email: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface TestResult {
  id: string
  user_id?: string
  username: string
  wpm: number
  raw_wpm: number
  accuracy: number
  consistency?: number
  test_mode: string
  test_time?: number
  test_words?: number
  language: string
  punctuation: boolean
  numbers: boolean
  difficulty: string
  characters: number
  errors: number
  date: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: string
  font_size: number
  font_family: string
  test_mode: string
  test_time: number
  test_words: number
  language: string
  punctuation: boolean
  numbers: boolean
  difficulty: string
  live_speed_style: string
  live_accuracy_style: string
  live_burst_style: string
  live_progress_style: string
  live_stats_opacity: number
  live_stats_color: string
  typing_speed_unit: string
  max_line_width: number
  quick_restart: string
  show_caps_lock_warning: boolean
  show_out_of_focus_warning: boolean
  created_at: string
  updated_at: string
}
