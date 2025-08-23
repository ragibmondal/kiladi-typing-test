# 🗄️ Database Setup Guide for Monkeytype Clone

## 📋 Prerequisites

- Supabase account and project
- Access to Supabase Dashboard

## 🚀 Step-by-Step Setup

### 1. Access Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `mmxtvnzcqekpikchkvda`
3. Navigate to **SQL Editor** in the left sidebar

### 2. Create Database Tables

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `database-setup.sql`
3. Click **Run** to execute the script

### 3. Verify Table Creation

1. Go to **Table Editor** in the left sidebar
2. You should see three new tables:
   - `users`
   - `test_results`
   - `user_settings`

### 4. Check Sample Data

1. Click on the `test_results` table
2. You should see sample data with usernames like:
   - `speedtyper123` (150 WPM)
   - `fastfingers` (145 WPM)
   - `typingpro` (142 WPM)

## 🔧 Database Schema

### Users Table
- `id`: Unique identifier (UUID)
- `username`: Unique username
- `email`: Optional email address
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Test Results Table
- `id`: Unique identifier (UUID)
- `user_id`: Reference to users table
- `username`: Username who took the test
- `wpm`: Words per minute
- `raw_wpm`: Raw words per minute
- `accuracy`: Accuracy percentage
- `consistency`: Consistency score
- `test_mode`: Test type (time/words/quote/zen/custom)
- `test_time`: Duration for time-based tests
- `test_words`: Word count for word-based tests
- `language`: Test language
- `punctuation`: Whether punctuation was enabled
- `numbers`: Whether numbers were enabled
- `difficulty`: Test difficulty level
- `characters`: Total characters typed
- `errors`: Number of errors made
- `date`: Test completion timestamp

### User Settings Table
- `id`: Unique identifier (UUID)
- `user_id`: Reference to users table
- `theme`: User's preferred theme
- `font_size`: Font size preference
- `font_family`: Font family preference
- `test_mode`: Default test mode
- `test_time`: Default test duration
- `test_words`: Default word count
- `language`: Default language
- `punctuation`: Default punctuation setting
- `numbers`: Default numbers setting
- `difficulty`: Default difficulty level
- `live_speed_style`: Live speed display style
- `live_accuracy_style`: Live accuracy display style
- `live_burst_style`: Live burst display style
- `live_progress_style`: Live progress display style
- `live_stats_opacity`: Live stats opacity
- `live_stats_color`: Live stats color
- `typing_speed_unit`: Speed unit preference
- `max_line_width`: Maximum line width
- `quick_restart`: Quick restart key
- `show_caps_lock_warning`: Caps lock warning toggle
- `show_out_of_focus_warning`: Focus warning toggle

## 🔐 Row Level Security (RLS)

The database uses Row Level Security for data protection:

- **Public Read Access**: Anyone can view test results and leaderboards
- **Public Insert Access**: Anyone can save test results
- **User Isolation**: Users can only modify their own data (when auth is implemented)

## 📊 Sample Data

The setup script includes sample data to get you started:

- **3 sample users** with different skill levels
- **5 sample test results** across different modes and difficulties
- **Realistic WPM scores** ranging from 142-150 WPM

## 🧪 Testing the Integration

1. **Start the application**: `npm run dev` or serve the built version
2. **Take a typing test** - results will be saved to the database
3. **Check the leaderboards** - should show both local and database results
4. **View browser console** - should show database save confirmations

## 🔍 Troubleshooting

### Common Issues:

1. **"Table doesn't exist" error**
   - Make sure you ran the `database-setup.sql` script
   - Check that tables were created in Table Editor

2. **"Permission denied" error**
   - Verify RLS policies are set correctly
   - Check that `anon` role has proper permissions

3. **"Connection failed" error**
   - Verify your Supabase URL and anon key in `src/lib/supabase.ts`
   - Check your internet connection

### Debug Steps:

1. **Check browser console** for error messages
2. **Verify Supabase connection** in Network tab
3. **Test database queries** in Supabase SQL Editor
4. **Check RLS policies** in Authentication > Policies

## 🚀 Next Steps

After successful setup:

1. **Test the application** with real typing tests
2. **Monitor database** for new test results
3. **Implement user authentication** (optional)
4. **Add more features** like user profiles, achievements, etc.

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all tables and policies are created correctly
4. Test database connectivity in Supabase Dashboard

---

**🎉 Congratulations!** Your Monkeytype clone now has a fully functional database backend!
