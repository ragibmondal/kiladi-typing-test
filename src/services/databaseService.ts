import { supabase, Profile, TestResult, UserSettings } from '../lib/supabase'

export class DatabaseService {
  // Profile operations
  static async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting current profile:', error)
      return null
    }
  }

  static async updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  static async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  // Test results operations
  static async saveTestResult(testResult: Omit<TestResult, 'id' | 'date'>): Promise<TestResult | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const resultData = {
        ...testResult,
        user_id: user?.id,
        date: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('test_results')
        .insert([resultData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving test result:', error)
      return null
    }
  }

  static async getTestResults(username?: string, limit = 50): Promise<TestResult[]> {
    try {
      let query = supabase
        .from('test_results')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit)

      if (username) {
        query = query.eq('username', username)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting test results:', error)
      return []
    }
  }

  static async getLeaderboard(mode: string, language: string, limit = 10): Promise<TestResult[]> {
    try {
      const [modeType, modeValue] = mode.split('-')
      
      let query = supabase
        .from('test_results')
        .select('*')
        .eq('language', language)
        .order('wpm', { ascending: false })
        .limit(limit)

      if (modeType === 'time') {
        query = query.eq('test_mode', 'time').eq('test_time', parseInt(modeValue))
      } else if (modeType === 'words') {
        query = query.eq('test_mode', 'words').eq('test_words', parseInt(modeValue))
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting leaderboard:', error)
      return []
    }
  }

  // User settings operations
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user settings:', error)
      return null
    }
  }

  static async saveUserSettings(settings: Partial<UserSettings>): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert([{ ...settings, updated_at: new Date().toISOString() }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving user settings:', error)
      return null
    }
  }

  // Utility methods
  static async getTopPerformers(limit = 10): Promise<TestResult[]> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('wpm', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting top performers:', error)
      return []
    }
  }

  static async getUserStats(username: string): Promise<{
    totalTests: number
    averageWpm: number
    bestWpm: number
    averageAccuracy: number
  }> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('wpm, accuracy')
        .eq('username', username)

      if (error) throw error

      const results = data || []
      const totalTests = results.length
      const averageWpm = totalTests > 0 ? results.reduce((sum, r) => sum + r.wpm, 0) / totalTests : 0
      const bestWpm = totalTests > 0 ? Math.max(...results.map(r => r.wpm)) : 0
      const averageAccuracy = totalTests > 0 ? results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests : 0

      return {
        totalTests,
        averageWpm: Math.round(averageWpm * 100) / 100,
        bestWpm,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      return {
        totalTests: 0,
        averageWpm: 0,
        bestWpm: 0,
        averageAccuracy: 0
      }
    }
  }
}
