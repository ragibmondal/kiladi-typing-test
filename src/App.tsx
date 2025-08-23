import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import TypingTest from './components/TypingTest'
import Settings from './components/Settings'
import Leaderboards from './components/Leaderboards'
import About from './components/About'
import Profile from './components/Profile'
import Login from './components/Login'
import CommandLine from './components/CommandLine'
import { SettingsProvider } from './contexts/SettingsContext'
import { AuthProvider } from './contexts/AuthContext'
import { TestProvider } from './contexts/TestContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [showCommandLine, setShowCommandLine] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command line toggle (Esc or Ctrl+Shift+P)
      if (e.key === 'Escape' || (e.ctrlKey && e.shiftKey && e.key === 'P')) {
        e.preventDefault()
        setShowCommandLine(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <TestProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Header />
                
                <main className="flex-1 container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<TypingTest />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/leaderboards" element={<Leaderboards />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </main>
                
                <Footer />
                
                {showCommandLine && (
                  <CommandLine onClose={() => setShowCommandLine(false)} />
                )}
              </div>
            </Router>
          </TestProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
