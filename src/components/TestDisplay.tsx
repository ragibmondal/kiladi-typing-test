import React, { useEffect, useRef } from 'react'
import { useTest } from '../contexts/TestContext'
import { useSettings } from '../contexts/SettingsContext'

const TestDisplay: React.FC = () => {
  const {
    words,
    wordStates,
    currentWordIndex,
    currentLetterIndex,
    isTestActive,
    timeElapsed
  } = useTest()
  
  const { settings } = useSettings()
  const caretRef = useRef<HTMLDivElement>(null)
  const currentLetterRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update caret position
  useEffect(() => {
    if (caretRef.current && currentLetterRef.current) {
      const letterRect = currentLetterRef.current.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()
      
      if (containerRect) {
        const x = letterRect.left - containerRect.left
        const y = letterRect.top - containerRect.top
        
        caretRef.current.style.left = `${x}px`
        caretRef.current.style.top = `${y}px`
      }
    }
  }, [currentWordIndex, currentLetterIndex, words])

  // Auto-scroll to current word
  useEffect(() => {
    if (currentLetterRef.current && containerRef.current) {
      const letterRect = currentLetterRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      
      if (letterRect.bottom > containerRect.bottom - 50) {
        currentLetterRef.current.scrollIntoView({
          behavior: settings.smoothLineScroll ? 'smooth' : 'auto',
          block: 'center'
        })
      }
    }
  }, [currentWordIndex, settings.smoothLineScroll])

  const renderWord = (word: string, wordIndex: number) => {
    const wordState = wordStates[wordIndex]
    if (!wordState) return null

    const isCurrentWord = wordIndex === currentWordIndex
    const isCompletedWord = wordIndex < currentWordIndex

    return (
      <div
        key={wordIndex}
        className={`word inline-block mr-2 relative ${
          isCurrentWord ? 'current-word' : ''
        } ${isCompletedWord && wordState.status === 'incorrect' ? 'bg-error-extra' : ''}`}
      >
        {wordState.letters.map((letterState, letterIndex) => {
          const isCurrentLetter = isCurrentWord && letterIndex === currentLetterIndex
          const isTyped = isCurrentWord ? letterIndex < currentLetterIndex : isCompletedWord
          
          let className = 'letter relative'
          
          if (isCurrentLetter) {
            className += ' current'
          }
          
          if (isTyped) {
            if (letterState.status === 'correct') {
              className += ' correct text-text'
            } else if (letterState.status === 'incorrect') {
              className += ' incorrect text-error bg-error-extra'
            } else if (letterState.status === 'extra') {
              className += ' extra text-error-extra bg-error'
            }
          } else {
            className += ' text-sub'
          }

          return (
            <span
              key={letterIndex}
              ref={isCurrentLetter ? currentLetterRef : undefined}
              className={className}
            >
              {letterState.originalLetter || letterState.letter}
              {settings.indicateTypos === 'below' && letterState.originalLetter && (
                <span className="absolute top-full left-0 text-xs text-error">
                  {letterState.originalLetter}
                </span>
              )}
            </span>
          )
        })}
      </div>
    )
  }

  const getVisibleWords = () => {
    if (settings.showAllLines) {
      return words.map((word, index) => renderWord(word, index))
    }
    
    // Show 3 lines worth of words
    const wordsPerLine = Math.floor(containerRef.current?.clientWidth || 800 / 100) // Estimate
    const startIndex = Math.max(0, currentWordIndex - wordsPerLine)
    const endIndex = Math.min(words.length, currentWordIndex + wordsPerLine * 2)
    
    return words.slice(startIndex, endIndex).map((word, index) => 
      renderWord(word, startIndex + index)
    )
  }

  return (
    <div
      ref={containerRef}
      className={`typing-test relative p-8 rounded-lg max-w-4xl mx-auto transition-all duration-300 ${
        settings.maxLineWidth > 0 ? `max-w-[${settings.maxLineWidth}ch]` : ''
      } ${isTestActive ? 'bg-sub-alt/10' : ''}`}
      style={{
        fontSize: `${settings.fontSize}rem`,
        fontFamily: settings.fontFamily,
        lineHeight: 1.8
      }}
    >
      {/* Timer for time-based tests */}
      {settings.testMode === 'time' && settings.liveProgressStyle !== 'off' && (
        <div className="absolute top-0 left-0 right-0">
          {settings.liveProgressStyle === 'bar' && (
            <div className="h-1 bg-sub-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-main transition-all duration-1000"
                style={{
                  width: `${(timeElapsed / settings.testTime) * 100}%`
                }}
              />
            </div>
          )}
          {(settings.liveProgressStyle === 'text' || settings.liveProgressStyle === 'mini') && (
            <div className={`text-center text-sub ${
              settings.liveProgressStyle === 'mini' ? 'text-sm' : ''
            }`}>
              {Math.max(0, settings.testTime - timeElapsed)}s
            </div>
          )}
        </div>
      )}

      {/* Words display */}
      <div className="relative leading-relaxed">
        {getVisibleWords()}
        
        {/* Caret */}
        {isTestActive && (
          <div
            ref={caretRef}
            className={`caret ${settings.smoothCaret !== 'off' ? 'smooth' : ''}`}
            style={{
              animationDuration: settings.smoothCaret === 'slow' ? '2s' : 
                              settings.smoothCaret === 'medium' ? '1.5s' : 
                              settings.smoothCaret === 'fast' ? '0.5s' : '1s'
            }}
          />
        )}
      </div>

      {/* Pace caret */}
      {settings.paceCaret !== 'off' && isTestActive && (
        <div className="absolute top-0 left-0 w-1 h-8 bg-sub opacity-50" />
      )}
    </div>
  )
}

export default TestDisplay
