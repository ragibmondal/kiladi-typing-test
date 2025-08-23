import React from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { useTest } from '../contexts/TestContext'

const TestControls: React.FC = () => {
  const { settings, updateSettings } = useSettings()
  const { resetTest, generateWords } = useTest()

  const handleModeChange = (mode: 'time' | 'words' | 'quote' | 'zen' | 'custom') => {
    updateSettings({ testMode: mode })
    resetTest()
  }

  const handleTimeChange = (time: number) => {
    updateSettings({ testTime: time })
    resetTest()
  }

  const handleWordsChange = (words: number) => {
    updateSettings({ testWords: words })
    resetTest()
  }

  const handleLanguageChange = (language: string) => {
    updateSettings({ language })
    generateWords()
  }

  const handlePunctuationToggle = () => {
    updateSettings({ punctuation: !settings.punctuation })
    generateWords()
  }

  const handleNumbersToggle = () => {
    updateSettings({ numbers: !settings.numbers })
    generateWords()
  }

  const timeOptions = [15, 30, 60, 120]
  const wordOptions = [10, 25, 50, 100]
  const languages = [
    { id: 'english', name: 'English' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'italian', name: 'Italian' },
    { id: 'portuguese', name: 'Portuguese' }
  ]

  // Map mode to icon
  const getModeIcon = (mode: string) => {
    switch(mode) {
      case 'time': return 'schedule'
      case 'words': return 'text_fields'
      case 'quote': return 'format_quote'
      case 'zen': return 'self_improvement'
      case 'custom': return 'edit'
      default: return 'text_fields'
    }
  }

  return (
    <div className="mb-8 space-y-6 w-full max-w-4xl mx-auto">
      {/* Mode Selection */}
      <div className="flex justify-center">
        <div className="bg-sub-alt/50 backdrop-blur-sm rounded-lg p-1 border border-sub/30 shadow-sm">
          <div className="flex gap-1">
            {(['time', 'words', 'quote', 'zen', 'custom'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 capitalize font-medium ${
                  settings.testMode === mode 
                    ? 'bg-main text-bg shadow-md transform scale-105' 
                    : 'text-sub hover:text-text hover:bg-sub-alt/70'
                }`}
              >
                <span className="material-icons-outlined text-sm">{getModeIcon(mode)}</span>
                <span className="hidden sm:inline">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Selection */}
      {settings.testMode === 'time' && (
        <div className="flex justify-center animate-slide-up">
          <div className="bg-sub-alt/30 backdrop-blur-sm rounded-lg p-1 border border-sub/20 shadow-sm">
            <div className="flex gap-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeChange(time)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 font-mono font-medium ${
                    settings.testTime === time 
                      ? 'bg-main text-bg shadow-md' 
                      : 'text-sub hover:text-text hover:bg-sub-alt/50'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Words Selection */}
      {settings.testMode === 'words' && (
        <div className="flex justify-center animate-slide-up">
          <div className="bg-sub-alt/30 backdrop-blur-sm rounded-lg p-1 border border-sub/20 shadow-sm">
            <div className="flex gap-1">
              {wordOptions.map((words) => (
                <button
                  key={words}
                  onClick={() => handleWordsChange(words)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 font-mono font-medium ${
                    settings.testWords === words 
                      ? 'bg-main text-bg shadow-md' 
                      : 'text-sub hover:text-text hover:bg-sub-alt/50'
                  }`}
                >
                  {words}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        {/* Punctuation */}
        <div 
          onClick={handlePunctuationToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            settings.punctuation 
              ? 'bg-main/20 text-main border border-main/30' 
              : 'text-sub hover:text-text hover:bg-sub-alt/30'
          }`}
        >
          <span className="material-icons-outlined text-base">
            {settings.punctuation ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span className="font-medium">punctuation</span>
        </div>

        {/* Numbers */}
        <div
          onClick={handleNumbersToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            settings.numbers 
              ? 'bg-main/20 text-main border border-main/30' 
              : 'text-sub hover:text-text hover:bg-sub-alt/30'
          }`}
        >
          <span className="material-icons-outlined text-base">
            {settings.numbers ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span className="font-medium">numbers</span>
        </div>

        {/* Language */}
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-sub-alt/30 border border-sub/20 transition-all duration-200 hover:bg-sub-alt/50">
          <span className="material-icons-outlined text-base text-main">language</span>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent border-none text-text focus:text-main outline-none cursor-pointer font-medium"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-bg text-text">
                {lang.name}
              </option>
            ))}
          </select>
          <span className="material-icons-outlined text-sm text-sub">expand_more</span>
        </div>

        {/* Difficulty */}
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-sub-alt/30 border border-sub/20 transition-all duration-200 hover:bg-sub-alt/50">
          <span className="material-icons-outlined text-base text-main">speed</span>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
            className="bg-transparent border-none text-text focus:text-main outline-none cursor-pointer font-medium"
          >
            <option value="normal" className="bg-bg text-text">Normal</option>
            <option value="expert" className="bg-bg text-text">Expert</option>
            <option value="master" className="bg-bg text-text">Master</option>
          </select>
          <span className="material-icons-outlined text-sm text-sub">expand_more</span>
        </div>
      </div>
    </div>
  )
}

export default TestControls
