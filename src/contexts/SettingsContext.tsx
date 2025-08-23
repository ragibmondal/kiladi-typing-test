import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Settings {
  // Test settings
  testMode: 'time' | 'words' | 'quote' | 'zen' | 'custom'
  testTime: number
  testWords: number
  language: string
  difficulty: 'normal' | 'expert' | 'master'
  punctuation: boolean
  numbers: boolean
  
  // Behavior settings
  quickRestart: 'off' | 'tab' | 'esc' | 'enter'
  blindMode: boolean
  minSpeed: number
  minAccuracy: number
  minBurst: number
  britishEnglish: boolean
  
  // Input settings
  freedomMode: boolean
  strictSpace: boolean
  oppositeShiftMode: 'off' | 'on' | 'keymap'
  stopOnError: 'off' | 'word' | 'letter'
  confidenceMode: 'off' | 'on' | 'max'
  quickEnd: boolean
  indicateTypos: 'off' | 'below' | 'replace'
  hideExtraLetters: boolean
  lazyMode: boolean
  
  // Sound settings
  soundVolume: number
  playSoundOnClick: string
  playSoundOnError: string
  playTimeWarning: 'off' | '1' | '3' | '5' | '10'
  
  // Caret settings
  smoothCaret: 'off' | 'slow' | 'medium' | 'fast'
  caretStyle: 'off' | 'line' | 'block' | 'outline' | 'underline'
  paceCaret: 'off' | 'avg' | 'pb' | 'tag-pb' | 'last' | 'daily' | 'custom'
  paceCaretCustomSpeed: number
  repeatedPace: boolean
  paceCaretStyle: 'off' | 'line' | 'block' | 'outline' | 'underline'
  
  // Appearance settings
  liveProgressStyle: 'off' | 'bar' | 'text' | 'mini'
  liveSpeedStyle: 'off' | 'text' | 'mini'
  liveAccuracyStyle: 'off' | 'text' | 'mini'
  liveBurstStyle: 'off' | 'text' | 'mini'
  liveStatsColor: 'black' | 'sub' | 'text' | 'main'
  liveStatsOpacity: number
  highlightMode: 'off' | 'letter' | 'word' | 'next-word' | 'next-two-words' | 'next-three-words'
  tapeMode: 'off' | 'letter' | 'word'
  tapeMargin: number
  smoothLineScroll: boolean
  showAllLines: boolean
  alwaysShowDecimalPlaces: boolean
  typingSpeedUnit: 'wpm' | 'cpm' | 'wps' | 'cps'
  startGraphsAtZero: boolean
  maxLineWidth: number
  fontSize: number
  fontFamily: string
  keymap: 'off' | 'static' | 'react' | 'next'
  
  // Theme settings
  flipTestColors: boolean
  colorfulMode: boolean
  customBackground: string
  customBackgroundSize: 'cover' | 'contain' | 'max'
  customBackgroundFilter: {
    blur: number
    brightness: number
    saturate: number
    opacity: number
  }
  
  // UI settings
  showKeyTips: boolean
  showOutOfFocusWarning: boolean
  showCapsLockWarning: boolean
  showAverage: 'off' | 'speed' | 'acc' | 'both'
}

const defaultSettings: Settings = {
  // Test settings
  testMode: 'time',
  testTime: 15,
  testWords: 10,
  language: 'english',
  difficulty: 'normal',
  punctuation: false,
  numbers: false,
  
  // Behavior settings
  quickRestart: 'tab',
  blindMode: false,
  minSpeed: 0,
  minAccuracy: 0,
  minBurst: 0,
  britishEnglish: false,
  
  // Input settings
  freedomMode: false,
  strictSpace: false,
  oppositeShiftMode: 'off',
  stopOnError: 'off',
  confidenceMode: 'off',
  quickEnd: false,
  indicateTypos: 'off',
  hideExtraLetters: false,
  lazyMode: false,
  
  // Sound settings
  soundVolume: 0.5,
  playSoundOnClick: 'off',
  playSoundOnError: 'off',
  playTimeWarning: 'off',
  
  // Caret settings
  smoothCaret: 'off',
  caretStyle: 'line',
  paceCaret: 'off',
  paceCaretCustomSpeed: 100,
  repeatedPace: false,
  paceCaretStyle: 'line',
  
  // Appearance settings
  liveProgressStyle: 'bar',
  liveSpeedStyle: 'text',
  liveAccuracyStyle: 'text',
  liveBurstStyle: 'off',
  liveStatsColor: 'sub',
  liveStatsOpacity: 0.75,
  highlightMode: 'letter',
  tapeMode: 'off',
  tapeMargin: 50,
  smoothLineScroll: false,
  showAllLines: false,
  alwaysShowDecimalPlaces: false,
  typingSpeedUnit: 'wpm',
  startGraphsAtZero: false,
  maxLineWidth: 0,
  fontSize: 2,
  fontFamily: 'Roboto Mono',
  keymap: 'off',
  
  // Theme settings
  flipTestColors: false,
  colorfulMode: false,
  customBackground: '',
  customBackgroundSize: 'cover',
  customBackgroundFilter: {
    blur: 0,
    brightness: 100,
    saturate: 100,
    opacity: 100
  },
  
  // UI settings
  showKeyTips: true,
  showOutOfFocusWarning: true,
  showCapsLockWarning: true,
  showAverage: 'both'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('monkeytype-settings', JSON.stringify(updated))
      return updated
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem('monkeytype-settings', JSON.stringify(defaultSettings))
  }

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2)
  }

  const importSettings = (settingsJson: string): boolean => {
    try {
      const imported = JSON.parse(settingsJson)
      // Validate imported settings
      const validatedSettings = { ...defaultSettings, ...imported }
      setSettings(validatedSettings)
      localStorage.setItem('monkeytype-settings', JSON.stringify(validatedSettings))
      return true
    } catch (error) {
      console.error('Failed to import settings:', error)
      return false
    }
  }

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('monkeytype-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
