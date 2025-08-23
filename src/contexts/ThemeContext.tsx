import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Theme {
  id: string
  name: string
  colors: {
    bg: string
    main: string
    caret: string
    sub: string
    subAlt: string
    text: string
    error: string
    errorExtra: string
    colorfulError: string
    colorfulErrorExtra: string
  }
}

export const themes: Theme[] = [
  {
    id: 'serika-dark',
    name: 'serika dark',
    colors: {
      bg: '#323437',
      main: '#e2b714',
      caret: '#e2b714',
      sub: '#646669',
      subAlt: '#2c2e31',
      text: '#d1d0c5',
      error: '#ca4754',
      errorExtra: '#7e2a33',
      colorfulError: '#ca4754',
      colorfulErrorExtra: '#7e2a33'
    }
  },
  {
    id: 'serika',
    name: 'serika',
    colors: {
      bg: '#e2b714',
      main: '#323437',
      caret: '#323437',
      sub: '#9b870c',
      subAlt: '#f1c232',
      text: '#323437',
      error: '#ca4754',
      errorExtra: '#7e2a33',
      colorfulError: '#ca4754',
      colorfulErrorExtra: '#7e2a33'
    }
  },
  {
    id: 'dracula',
    name: 'dracula',
    colors: {
      bg: '#282a36',
      main: '#8be9fd',
      caret: '#8be9fd',
      sub: '#6272a4',
      subAlt: '#44475a',
      text: '#f8f8f2',
      error: '#ff5555',
      errorExtra: '#ff6e6e',
      colorfulError: '#ff5555',
      colorfulErrorExtra: '#ff6e6e'
    }
  },
  {
    id: 'monokai',
    name: 'monokai',
    colors: {
      bg: '#272822',
      main: '#f92672',
      caret: '#f92672',
      sub: '#75715e',
      subAlt: '#3e3d32',
      text: '#f8f8f2',
      error: '#f92672',
      errorExtra: '#fd5ff0',
      colorfulError: '#f92672',
      colorfulErrorExtra: '#fd5ff0'
    }
  },
  {
    id: 'nord',
    name: 'nord',
    colors: {
      bg: '#2e3440',
      main: '#88c0d0',
      caret: '#88c0d0',
      sub: '#4c566a',
      subAlt: '#3b4252',
      text: '#d8dee9',
      error: '#bf616a',
      errorExtra: '#d08770',
      colorfulError: '#bf616a',
      colorfulErrorExtra: '#d08770'
    }
  },
  {
    id: 'terminal',
    name: 'terminal',
    colors: {
      bg: '#000000',
      main: '#00ff00',
      caret: '#00ff00',
      sub: '#008000',
      subAlt: '#1a1a1a',
      text: '#00ff00',
      error: '#ff0000',
      errorExtra: '#ff4444',
      colorfulError: '#ff0000',
      colorfulErrorExtra: '#ff4444'
    }
  },
  {
    id: 'modern-ink',
    name: 'modern ink',
    colors: {
      bg: '#f0f3f6',
      main: '#2d3748',
      caret: '#2d3748',
      sub: '#718096',
      subAlt: '#e2e8f0',
      text: '#2d3748',
      error: '#e53e3e',
      errorExtra: '#c53030',
      colorfulError: '#e53e3e',
      colorfulErrorExtra: '#c53030'
    }
  }
]

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  themes: Theme[]
  randomizeTheme: boolean
  setRandomizeTheme: (value: boolean) => void
  autoSwitchTheme: boolean
  setAutoSwitchTheme: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [randomizeTheme, setRandomizeTheme] = useState(false)
  const [autoSwitchTheme, setAutoSwitchTheme] = useState(false)

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      applyTheme(theme)
      localStorage.setItem('monkeytype-theme', themeId)
    }
  }

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    root.style.setProperty('--bg-color', theme.colors.bg)
    root.style.setProperty('--main-color', theme.colors.main)
    root.style.setProperty('--caret-color', theme.colors.caret)
    root.style.setProperty('--sub-color', theme.colors.sub)
    root.style.setProperty('--sub-alt-color', theme.colors.subAlt)
    root.style.setProperty('--text-color', theme.colors.text)
    root.style.setProperty('--error-color', theme.colors.error)
    root.style.setProperty('--error-extra-color', theme.colors.errorExtra)
    root.style.setProperty('--colorful-error-color', theme.colors.colorfulError)
    root.style.setProperty('--colorful-error-extra-color', theme.colors.colorfulErrorExtra)
    
    document.body.setAttribute('data-theme', theme.id)
  }

  const getRandomTheme = () => {
    const availableThemes = themes.filter(t => t.id !== currentTheme.id)
    return availableThemes[Math.floor(Math.random() * availableThemes.length)]
  }

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('monkeytype-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      applyTheme(currentTheme)
    }

    // Load theme settings
    const savedRandomize = localStorage.getItem('monkeytype-randomize-theme')
    if (savedRandomize) {
      setRandomizeTheme(savedRandomize === 'true')
    }

    const savedAutoSwitch = localStorage.getItem('monkeytype-auto-switch-theme')
    if (savedAutoSwitch) {
      setAutoSwitchTheme(savedAutoSwitch === 'true')
    }

    // Auto switch theme based on system preference
    if (autoSwitchTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setTheme('serika-dark')
        } else {
          setTheme('serika')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      handleChange(mediaQuery as any)
      
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [autoSwitchTheme])

  useEffect(() => {
    localStorage.setItem('monkeytype-randomize-theme', randomizeTheme.toString())
  }, [randomizeTheme])

  useEffect(() => {
    localStorage.setItem('monkeytype-auto-switch-theme', autoSwitchTheme.toString())
  }, [autoSwitchTheme])

  // Listen for test completion to randomize theme
  useEffect(() => {
    const handleTestComplete = () => {
      if (randomizeTheme) {
        const newTheme = getRandomTheme()
        setTheme(newTheme.id)
      }
    }

    window.addEventListener('testComplete', handleTestComplete)
    return () => window.removeEventListener('testComplete', handleTestComplete)
  }, [randomizeTheme, currentTheme])

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themes,
    randomizeTheme,
    setRandomizeTheme,
    autoSwitchTheme,
    setAutoSwitchTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
