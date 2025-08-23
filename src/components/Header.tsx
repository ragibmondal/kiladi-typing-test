import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Header: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { currentTheme, setTheme, themes } = useTheme()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleThemeChange = () => {
    // Cycle through themes
    const currentIndex = themes.findIndex(t => t.id === currentTheme.id)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].id)
  }

  return (
    <header className="border-b border-sub-alt bg-bg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-main hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-main rounded flex items-center justify-center text-bg font-bold">
            M
          </div>
          <span className="text-xl font-semibold">monkeytype</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`transition-colors ${
              isActive('/') ? 'text-main' : 'text-sub hover:text-text'
            }`}
          >
            <span className="material-icons-outlined mr-1">keyboard</span>
            Test
          </Link>
          <Link
            to="/leaderboards"
            className={`transition-colors ${
              isActive('/leaderboards') ? 'text-main' : 'text-sub hover:text-text'
            }`}
          >
            <span className="material-icons-outlined mr-1">leaderboard</span>
            Leaderboards
          </Link>
          <Link
            to="/about"
            className={`transition-colors ${
              isActive('/about') ? 'text-main' : 'text-sub hover:text-text'
            }`}
          >
            <span className="material-icons-outlined mr-1">info</span>
            About
          </Link>
          <Link
            to="/settings"
            className={`transition-colors ${
              isActive('/settings') ? 'text-main' : 'text-sub hover:text-text'
            }`}
          >
            <span className="material-icons-outlined mr-1">settings</span>
            Settings
          </Link>
        </nav>

        {/* User section */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={handleThemeChange}
            className="text-sub hover:text-main transition-colors"
            title={`Current theme: ${currentTheme.name}`}
          >
            <span className="material-icons-outlined">palette</span>
          </button>

          {/* User menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={`/profile/${user.username}`}
                className="text-sub hover:text-main transition-colors"
              >
                <span className="material-icons-outlined">account_circle</span>
              </Link>
              <button
                onClick={logout}
                className="text-sub hover:text-main transition-colors"
                title="Logout"
              >
                <span className="material-icons-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-sub-alt">
        <nav className="container mx-auto px-4 py-2 flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 text-xs transition-colors ${
              isActive('/') ? 'text-main' : 'text-sub'
            }`}
          >
            <span className="material-icons-outlined text-lg">keyboard</span>
            Test
          </Link>
          <Link
            to="/leaderboards"
            className={`flex flex-col items-center py-2 text-xs transition-colors ${
              isActive('/leaderboards') ? 'text-main' : 'text-sub'
            }`}
          >
            <span className="material-icons-outlined text-lg">leaderboard</span>
            Leaderboards
          </Link>
          <Link
            to="/about"
            className={`flex flex-col items-center py-2 text-xs transition-colors ${
              isActive('/about') ? 'text-main' : 'text-sub'
            }`}
          >
            <span className="material-icons-outlined text-lg">info</span>
            About
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center py-2 text-xs transition-colors ${
              isActive('/settings') ? 'text-main' : 'text-sub'
            }`}
          >
            <span className="material-icons-outlined text-lg">settings</span>
            Settings
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
