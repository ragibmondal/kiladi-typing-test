import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)

    const newErrors: string[] = []

    // Validation
    if (!formData.username.trim()) {
      newErrors.push('Username is required')
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.push('Email is required')
    }

    if (!formData.password) {
      newErrors.push('Password is required')
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match')
    }

    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      let success = false
      
      if (isLogin) {
        success = await login(formData.username, formData.password)
      } else {
        success = await register(formData.username, formData.email, formData.password)
      }

      if (success) {
        navigate('/')
      } else {
        setErrors([isLogin ? 'Invalid credentials' : 'Registration failed'])
      }
    } catch (error) {
      setErrors(['An error occurred. Please try again.'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-sub-alt rounded-lg p-8">
        <h1 className="text-2xl font-bold text-main mb-6 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>

        {/* Toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg transition-colors ${
              isLogin ? 'bg-main text-bg' : 'bg-sub text-text'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg transition-colors ${
              !isLogin ? 'bg-main text-bg' : 'bg-sub text-text'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-error bg-opacity-20 border border-error rounded">
            {errors.map((error, index) => (
              <div key={index} className="text-error text-sm">
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-text mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter your username"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-text mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-text mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-text mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full bg-main text-bg hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-spinner"></div>
                <span>Loading...</span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Additional options */}
        <div className="mt-6 text-center">
          {isLogin && (
            <button className="text-sub hover:text-main transition-colors text-sm">
              Forgot password?
            </button>
          )}
        </div>

        {/* Demo notice */}
        <div className="mt-6 p-3 bg-main bg-opacity-20 border border-main rounded">
          <p className="text-main text-sm text-center">
            <strong>Demo Mode:</strong> This is a demonstration. 
            Any username/password combination will work for testing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
