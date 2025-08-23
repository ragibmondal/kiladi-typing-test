import React, { useState, useEffect, useRef } from 'react'
import { useTest } from '../contexts/TestContext'
import { useSettings } from '../contexts/SettingsContext'
import TestControls from './TestControls'
import TestDisplay from './TestDisplay'
import TestResults from './TestResults'
import LiveStats from './LiveStats'

// SVG Filter for glass effect
const GlassFilter: React.FC = () => (
  <svg style={{ display: 'none' }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="20"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
)

const TypingTest: React.FC = () => {
  const {
    isTestActive,
    isTestComplete,
    testResult,
    processInput,
    resetTest,
    startTest,
    timeElapsed,
    wpm,
    rawWpm,
    accuracy
  } = useTest()
  
  const { settings } = useSettings()
  const [inputValue, setInputValue] = useState('')
  const [showOutOfFocus, setShowOutOfFocus] = useState(false)
  const [showCapsLock, setShowCapsLock] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for most keys during test
      if (isTestActive && !isTestComplete) {
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
          e.preventDefault()
        }
      }

      // Handle quick restart
      if (settings.quickRestart !== 'off') {
        if (
          (settings.quickRestart === 'tab' && e.key === 'Tab') ||
          (settings.quickRestart === 'esc' && e.key === 'Escape') ||
          (settings.quickRestart === 'enter' && e.key === 'Enter')
        ) {
          e.preventDefault()
          resetTest()
          return
        }
      }

      // Handle caps lock warning
      if (settings.showCapsLockWarning && e.getModifierState('CapsLock')) {
        setShowCapsLock(true)
      } else {
        setShowCapsLock(false)
      }

      // Process input during test
      if (isTestActive && !isTestComplete) {
        if (e.key === 'Backspace') {
          processInput('Backspace')
          setInputValue(prev => prev.slice(0, -1))
        } else if (e.key === ' ') {
          processInput(' ')
          setInputValue('')
        } else if (e.key.length === 1) {
          processInput(e.key)
          setInputValue(prev => prev + e.key)
        }
      }

      // Start test on first keypress
      if (!isTestActive && !isTestComplete && e.key.length === 1) {
        startTest()
        processInput(e.key)
        setInputValue(e.key)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isTestActive, isTestComplete, settings.quickRestart, settings.showCapsLockWarning, processInput, resetTest, startTest])

  // Handle focus/blur for out of focus warning
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleFocus = () => {
      setShowOutOfFocus(false)
      clearTimeout(timeout)
    }

    const handleBlur = () => {
      if (isTestActive && settings.showOutOfFocusWarning) {
        timeout = setTimeout(() => {
          setShowOutOfFocus(true)
        }, 1000)
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      clearTimeout(timeout)
    }
  }, [isTestActive, settings.showOutOfFocusWarning])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-focus after test completion
  useEffect(() => {
    if (isTestComplete && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isTestComplete])

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" ref={containerRef}>
      <GlassFilter />
      
      {/* Test Controls */}
      <div className="mb-6">
        <TestControls />
      </div>

      {/* Live Stats */}
      {isTestActive && (
        <div className="mb-6 transition-all duration-300 ease-in-out">
          <div className="bg-sub-alt/80 backdrop-blur-sm border border-sub/50 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <LiveStats
                wpm={wpm}
                rawWpm={rawWpm}
                accuracy={accuracy}
                timeElapsed={timeElapsed}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Test Area */}
      <div 
        className={`relative min-h-[300px] flex items-center justify-center cursor-text overflow-hidden transition-all duration-300 ease-in-out rounded-lg border ${
          isTestActive ? 'shadow-xl border-main/20 bg-sub-alt/50' : 'shadow-md border-sub bg-sub-alt/30'
        }`}
        onClick={handleContainerClick}
      >
        <div 
          className="absolute inset-0 z-0 rounded-lg overflow-hidden backdrop-blur-sm"
          style={{
            filter: isTestActive ? 'url(#glass-distortion)' : 'none',
            transition: 'filter 0.5s ease-in-out'
          }}
        />
        
        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={() => {}} // Controlled by keydown events
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Test Display */}
        <div className="w-full h-full p-6 z-10">
          {!isTestComplete ? (
            <TestDisplay />
          ) : (
            <TestResults result={testResult} onRestart={resetTest} />
          )}
        </div>

        {/* Overlays */}
        {showOutOfFocus && (
          <div className="absolute inset-0 bg-bg/95 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity duration-300">
            <div className="text-center p-6 rounded-lg">
              <div className="w-12 h-12 text-main mx-auto mb-4 flex items-center justify-center">
                <span className="material-icons-outlined text-3xl">warning</span>
              </div>
              <div className="text-2xl font-semibold text-text mb-2">Click here to focus</div>
              <div className="text-sub">You need to focus on the typing test</div>
            </div>
          </div>
        )}

        {showCapsLock && (
          <div className="absolute top-4 right-4 bg-error text-white px-3 py-2 rounded-md shadow-lg flex items-center gap-2 z-20 animate-pulse">
            <span className="material-icons-outlined text-sm">keyboard_capslock</span>
            <span>Caps Lock is on</span>
          </div>
        )}

        {!isTestActive && !isTestComplete && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sub text-center z-20 transition-opacity duration-300">
            <div className="w-6 h-6 mx-auto mb-2">
              <span className="material-icons-outlined animate-bounce">keyboard</span>
            </div>
            <div className="mb-2 font-medium">Click here or press any key to focus</div>
            <div className="text-sm">Then start typing to begin the test</div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isTestActive && !isTestComplete && (
        <div className="mt-6 text-center text-sub">
          <div className="flex items-center justify-center gap-2 mb-2">
            <button 
              className="btn flex items-center gap-2 text-sm"
              onClick={resetTest}
            >
              <span className="material-icons-outlined text-base">refresh</span>
              <span>Reset Test</span>
            </button>
          </div>
          <p className="text-sm mt-4">
            Use <kbd className="px-2 py-1 bg-sub-alt rounded text-xs border border-sub">{settings.quickRestart}</kbd> to restart the test quickly
          </p>
        </div>
      )}

      {/* Floating Stats Indicator */}
      {isTestActive && !isTestComplete && (
        <div className="fixed bottom-6 right-6 bg-sub-alt/90 backdrop-blur-sm border border-sub/50 rounded-full shadow-lg p-3 z-50 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <div className={`text-lg font-mono font-bold ${wpm > 60 ? 'text-main' : wpm > 30 ? 'text-main' : 'text-sub'}`}>
              {wpm}
            </div>
            <div className="text-xs text-sub">WPM</div>
            {wpm > 0 && (
              <div className={`flex items-center ${wpm > accuracy ? 'text-error' : 'text-main'}`}>
                <span className="material-icons-outlined text-sm">
                  {wpm > accuracy ? 'trending_down' : 'trending_up'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingTest
