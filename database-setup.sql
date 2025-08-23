-- Database Setup Script for Monkeytype Clone
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  wpm INTEGER NOT NULL,
  raw_wpm INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  consistency DECIMAL(5,2),
  test_mode VARCHAR(20) NOT NULL,
  test_time INTEGER,
  test_words INTEGER,
  language VARCHAR(20) DEFAULT 'english',
  punctuation BOOLEAN DEFAULT false,
  numbers BOOLEAN DEFAULT false,
  difficulty VARCHAR(20) DEFAULT 'normal',
  characters INTEGER NOT NULL,
  errors INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark',
  font_size DECIMAL(3,1) DEFAULT 1.5,
  font_family VARCHAR(50) DEFAULT 'Roboto Mono',
  test_mode VARCHAR(20) DEFAULT 'time',
  test_time INTEGER DEFAULT 60,
  test_words INTEGER DEFAULT 25,
  language VARCHAR(20) DEFAULT 'english',
  punctuation BOOLEAN DEFAULT false,
  numbers BOOLEAN DEFAULT false,
  difficulty VARCHAR(20) DEFAULT 'normal',
  live_speed_style VARCHAR(20) DEFAULT 'default',
  live_accuracy_style VARCHAR(20) DEFAULT 'default',
  live_burst_style VARCHAR(20) DEFAULT 'default',
  live_progress_style VARCHAR(20) DEFAULT 'bar',
  live_stats_opacity DECIMAL(3,2) DEFAULT 1.0,
  live_stats_color VARCHAR(20) DEFAULT 'sub',
  typing_speed_unit VARCHAR(10) DEFAULT 'wpm',
  max_line_width INTEGER DEFAULT 0,
  quick_restart VARCHAR(20) DEFAULT 'tab',
  show_caps_lock_warning BOOLEAN DEFAULT true,
  show_out_of_focus_warning BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_username ON test_results(username);
CREATE INDEX IF NOT EXISTS idx_test_results_date ON test_results(date);
CREATE INDEX IF NOT EXISTS idx_test_results_wpm ON test_results(wpm);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (since we're not using auth yet)
CREATE POLICY "Public read access for test results" ON test_results
  FOR SELECT USING (true);

CREATE POLICY "Public insert access for test results" ON test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Public insert access for users" ON users
  FOR INSERT WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO users (username, email) VALUES 
  ('speedtyper123', 'speed@example.com'),
  ('fastfingers', 'fast@example.com'),
  ('typingpro', 'pro@example.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO test_results (username, wpm, raw_wpm, accuracy, consistency, test_mode, test_time, language, punctuation, numbers, difficulty, characters, errors) VALUES
  ('speedtyper123', 150, 155, 98.5, 92.1, 'time', 60, 'english', true, true, 'normal', 750, 8),
  ('fastfingers', 145, 149, 97.8, 89.5, 'time', 60, 'english', true, false, 'normal', 725, 12),
  ('typingpro', 142, 144, 99.2, 94.3, 'time', 60, 'english', false, true, 'expert', 710, 4),
  ('speedtyper123', 148, 152, 97.5, 90.2, 'words', 25, 'english', true, true, 'normal', 625, 10),
  ('fastfingers', 143, 147, 98.1, 91.8, 'words', 25, 'english', true, false, 'normal', 615, 7)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON users TO anon;
GRANT ALL ON test_results TO anon;
GRANT ALL ON user_settings TO anon;
GRANT USAGE ON SCHEMA public TO anon;
