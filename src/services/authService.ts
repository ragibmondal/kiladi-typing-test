import { supabase } from '../lib/supabase'
import { Profile } from '../lib/supabase'

export interface AuthUser {
  id: string
  email: string
  username?: string
  full_name?: string
}

export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        // Get user profile
        const profile = await this.getProfile(data.user.id)
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            username: profile?.username,
            full_name: profile?.full_name
          },
          error: null
        }
      }

      return { user: null, error: 'No user data returned' }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { user: null, error: error.message || 'Sign in failed' }
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, username?: string, full_name?: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            full_name: full_name || ''
          }
        }
      })

      if (error) throw error

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            username: username || email.split('@')[0],
            full_name: full_name || ''
          },
          error: null
        }
      }

      return { user: null, error: 'No user data returned' }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { user: null, error: error.message || 'Sign up failed' }
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { error: error.message || 'Sign out failed' }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      // Get user profile
      const profile = await this.getProfile(user.id)
      
      return {
        id: user.id,
        email: user.email!,
        username: profile?.username,
        full_name: profile?.full_name
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Get user profile
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get profile error:', error)
      return null
    }
  }

  // Update user profile
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
      console.error('Update profile error:', error)
      return null
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await this.getProfile(session.user.id)
        callback({
          id: session.user.id,
          email: session.user.email!,
          username: profile?.username,
          full_name: profile?.full_name
        })
      } else if (event === 'SIGNED_OUT') {
        callback(null)
      }
    })
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return { error: error.message || 'Password reset failed' }
    }
  }

  // Update password
  static async updatePassword(password: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Update password error:', error)
      return { error: error.message || 'Password update failed' }
    }
  }
}
