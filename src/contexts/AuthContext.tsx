import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  keyboard?: string
  github?: string
  twitter?: string
  website?: string
  joinDate: Date
  totalTests: number
  completedTests: number
  timeTyping: number
  highestWpm: number
  averageWpm: number
  highestAccuracy: number
  averageAccuracy: number
  personalBests: Record<string, any>
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a login
      const mockUser: User = {
        id: '1',
        username,
        email: `${username}@example.com`,
        joinDate: new Date(),
        totalTests: 0,
        completedTests: 0,
        timeTyping: 0,
        highestWpm: 0,
        averageWpm: 0,
        highestAccuracy: 0,
        averageAccuracy: 0,
        personalBests: {}
      }
      
      setUser(mockUser)
      localStorage.setItem('monkeytype-user', JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        joinDate: new Date(),
        totalTests: 0,
        completedTests: 0,
        timeTyping: 0,
        highestWpm: 0,
        averageWpm: 0,
        highestAccuracy: 0,
        averageAccuracy: 0,
        personalBests: {}
      }
      
      setUser(mockUser)
      localStorage.setItem('monkeytype-user', JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('monkeytype-user')
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false
      
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('monkeytype-user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Profile update failed:', error)
      return false
    }
  }

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('monkeytype-user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
