import React, { useState } from 'react'
import { TestResult } from '../contexts/TestContext'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

interface TestResultsProps {
  result: TestResult | null
  onRestart: () => void
}

const TestResults: React.FC<TestResultsProps> = ({ result, onRestart }) => {
  const { settings } = useSettings()
  const { user } = useAuth()
  const [showDetails, setShowDetails] = useState(false)

  if (!result) return null

  const getSpeedDisplay = () => {
    switch (settings.typingSpeedUnit) {
      case 'cpm':
        return { value: result.wpm * 5, unit: 'cpm' }
      case 'wps':
        return { value: Math.round(result.wpm / 60 * 100) / 100, unit: 'wps' }
      case 'cps':
        return { value: Math.round(result.wpm * 5 / 60 * 100) / 100, unit: 'cps' }
      default:
        return { value: result.wpm, unit: 'wpm' }
    }
  }

  const speed = getSpeedDisplay()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const getTestType = () => {
    let type = result.mode
    if (result.mode === 'time') {
      type += ` ${result.time}s`
    } else if (result.mode === 'words') {
      type += ` ${result.characters / 5}w` // Estimate words from characters
    }
    
    if (result.punctuation) type += ' punctuation'
    if (result.numbers) type += ' numbers'
    
    return type
  }

  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-value">{speed.value}</div>
          <div className="stat-label">{speed.unit}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{result.accuracy}%</div>
          <div className="stat-label">accuracy</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{result.rawWpm}</div>
          <div className="stat-label">raw</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{result.consistency}%</div>
          <div className="stat-label">consistency</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
        <div>
          <div className="text-sub">characters</div>
          <div className="text-text">
            {result.correctChars}/{result.incorrectChars}/{result.extraChars}/{result.missedChars}
          </div>
        </div>
        
        <div>
          <div className="text-sub">time</div>
          <div className="text-text">{formatTime(result.time)}</div>
        </div>
        
        <div>
          <div className="text-sub">test type</div>
          <div className="text-text">{getTestType()}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={onRestart}
          className="btn flex items-center space-x-2"
        >
          <span className="material-icons-outlined">refresh</span>
          <span>Next Test</span>
        </button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn flex items-center space-x-2"
        >
          <span className="material-icons-outlined">
            {showDetails ? 'expand_less' : 'expand_more'}
          </span>
          <span>Details</span>
        </button>
        
        {user && (
          <button className="btn flex items-center space-x-2">
            <span className="material-icons-outlined">save</span>
            <span>Save</span>
          </button>
        )}
        
        <button className="btn flex items-center space-x-2">
          <span className="material-icons-outlined">share</span>
          <span>Share</span>
        </button>
      </div>

      {/* Detailed Stats */}
      {showDetails && (
        <div className="bg-sub-alt rounded-lg p-6 text-left animate-slide-up">
          <h3 className="text-lg font-semibold mb-4 text-main">Detailed Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-2">
                <span className="text-sub">Test Duration:</span>
                <span className="ml-2 text-text">{formatTime(result.time)}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Language:</span>
                <span className="ml-2 text-text">{result.language}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Difficulty:</span>
                <span className="ml-2 text-text">{result.difficulty}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Date:</span>
                <span className="ml-2 text-text">
                  {result.date.toLocaleDateString()} {result.date.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div>
              <div className="mb-2">
                <span className="text-sub">Correct Characters:</span>
                <span className="ml-2 text-text">{result.correctChars}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Incorrect Characters:</span>
                <span className="ml-2 text-text">{result.incorrectChars}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Extra Characters:</span>
                <span className="ml-2 text-text">{result.extraChars}</span>
              </div>
              <div className="mb-2">
                <span className="text-sub">Missed Characters:</span>
                <span className="ml-2 text-text">{result.missedChars}</span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {result.tags.length > 0 && (
            <div className="mt-4">
              <div className="text-sub mb-2">Tags:</div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-main text-bg rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personal Best Notification */}
      {result.wpm > 0 && (
        <div className="mt-4 text-main text-sm">
          🎉 Great job! Keep practicing to improve your speed and accuracy.
        </div>
      )}
    </div>
  )
}

export default TestResults
