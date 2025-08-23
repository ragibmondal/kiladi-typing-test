import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSettings } from './SettingsContext'
import { useAuth } from './AuthContext'
import { DatabaseService } from '../services/databaseService'

export interface TestResult {
  id: string
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  characters: number
  correctChars: number
  incorrectChars: number
  extraChars: number
  missedChars: number
  time: number
  mode: string
  language: string
  punctuation: boolean
  numbers: boolean
  difficulty: string
  date: Date
  tags: string[]
}

export interface LetterState {
  letter: string
  status: 'pending' | 'correct' | 'incorrect' | 'extra'
  originalLetter?: string
}

export interface WordState {
  letters: LetterState[]
  status: 'pending' | 'correct' | 'incorrect'
}

interface TestContextType {
  // Test state
  isTestActive: boolean
  isTestComplete: boolean
  testStartTime: number | null
  testEndTime: number | null
  currentWordIndex: number
  currentLetterIndex: number
  
  // Test content
  words: string[]
  wordStates: WordState[]
  
  // Live stats
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  timeElapsed: number
  
  // Test results
  testResult: TestResult | null
  testHistory: TestResult[]
  
  // Actions
  startTest: () => void
  resetTest: () => void
  processInput: (input: string) => void
  finishTest: () => void
  generateWords: () => void
  
  // Caret position
  caretPosition: { x: number; y: number }
}

const TestContext = createContext<TestContextType | undefined>(undefined)

export const useTest = () => {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error('useTest must be used within a TestProvider')
  }
  return context
}

interface TestProviderProps {
  children: ReactNode
}

// Common English words for testing
const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will',
  'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
  'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'each', 'which',
  'do', 'their', 'time', 'if', 'will', 'how', 'said', 'an', 'each', 'which', 'she', 'do', 'how',
  'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so',
  'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'very', 'what', 'know'
]

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const { settings } = useSettings()
  const { user } = useAuth()
  
  // Test state
  const [isTestActive, setIsTestActive] = useState(false)
  const [isTestComplete, setIsTestComplete] = useState(false)
  const [testStartTime, setTestStartTime] = useState<number | null>(null)
  const [testEndTime, setTestEndTime] = useState<number | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  
  // Test content
  const [words, setWords] = useState<string[]>([])
  const [wordStates, setWordStates] = useState<WordState[]>([])
  
  // Live stats
  const [wpm, setWpm] = useState(0)
  const [rawWpm, setRawWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [consistency, setConsistency] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  // Test results
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<TestResult[]>([])
  
  // Caret position
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 })

  const generateWords = () => {
    let wordList: string[] = []
    
    if (settings.testMode === 'time') {
      // Generate enough words for the time duration
      const estimatedWords = Math.max(50, settings.testTime * 5) // Estimate 5 words per second
      for (let i = 0; i < estimatedWords; i++) {
        wordList.push(commonWords[Math.floor(Math.random() * commonWords.length)])
      }
    } else if (settings.testMode === 'words') {
      for (let i = 0; i < settings.testWords; i++) {
        wordList.push(commonWords[Math.floor(Math.random() * commonWords.length)])
      }
    }
    
    // Add punctuation if enabled
    if (settings.punctuation) {
      wordList = wordList.map(word => {
        if (Math.random() < 0.1) { // 10% chance of punctuation
          const punctuation = ['.', ',', '!', '?', ';', ':'][Math.floor(Math.random() * 6)]
          return word + punctuation
        }
        return word
      })
    }
    
    // Add numbers if enabled
    if (settings.numbers) {
      wordList = wordList.map(word => {
        if (Math.random() < 0.05) { // 5% chance of numbers
          return Math.floor(Math.random() * 1000).toString()
        }
        return word
      })
    }
    
    setWords(wordList)
    
    // Initialize word states
    const initialStates: WordState[] = wordList.map(word => ({
      letters: word.split('').map(letter => ({
        letter,
        status: 'pending'
      })),
      status: 'pending'
    }))
    
    setWordStates(initialStates)
  }

  const startTest = () => {
    if (words.length === 0) {
      generateWords()
    }
    setIsTestActive(true)
    setIsTestComplete(false)
    setTestStartTime(Date.now())
    setTestEndTime(null)
    setCurrentWordIndex(0)
    setCurrentLetterIndex(0)
    setWpm(0)
    setRawWpm(0)
    setAccuracy(100)
    setTimeElapsed(0)
  }

  const resetTest = () => {
    setIsTestActive(false)
    setIsTestComplete(false)
    setTestStartTime(null)
    setTestEndTime(null)
    setCurrentWordIndex(0)
    setCurrentLetterIndex(0)
    setWpm(0)
    setRawWpm(0)
    setAccuracy(100)
    setTimeElapsed(0)
    setTestResult(null)
    generateWords()
  }

  const calculateStats = (endTime?: number) => {
    if (!testStartTime) return

    const now = endTime || Date.now()
    const timeInMinutes = (now - testStartTime) / 60000
    
    // Prevent division by zero for very short times
    if (timeInMinutes < 0.01) return
    
    let correctChars = 0
    let incorrectChars = 0
    let extraChars = 0
    let totalTypedChars = 0

    // Count all typed characters
    wordStates.forEach((wordState, wordIndex) => {
      if (wordIndex < currentWordIndex || (wordIndex === currentWordIndex && currentLetterIndex > 0)) {
        wordState.letters.forEach((letterState, letterIndex) => {
          if (wordIndex < currentWordIndex || letterIndex < currentLetterIndex) {
            totalTypedChars++
            if (letterState.status === 'correct') {
              correctChars++
            } else if (letterState.status === 'incorrect') {
              incorrectChars++
            } else if (letterState.status === 'extra') {
              extraChars++
            }
          }
        })
      }
    })

    // Add spaces between completed words
    const completedWords = currentWordIndex
    if (completedWords > 0) {
      totalTypedChars += completedWords // Add spaces
      correctChars += completedWords // Assume spaces are correct
    }

    // Only calculate if we have typed something
    if (totalTypedChars > 0) {
      const wordsTyped = correctChars / 5 // Standard: 5 characters = 1 word
      const rawWordsTyped = totalTypedChars / 5
      const newWpm = Math.round(wordsTyped / timeInMinutes)
      const newRawWpm = Math.round(rawWordsTyped / timeInMinutes)
      const newAccuracy = Math.round((correctChars / totalTypedChars) * 100)

      setWpm(newWpm)
      setRawWpm(newRawWpm)
      setAccuracy(newAccuracy)
    }
    
    setTimeElapsed(Math.round((now - testStartTime) / 1000))
  }

  const processInput = (input: string) => {
    if (isTestComplete) return

    // Start test on first input if not already started
    const currentTime = Date.now()
    if (!isTestActive && !testStartTime) {
      setIsTestActive(true)
      setIsTestComplete(false)
      setTestStartTime(currentTime)
      setTestEndTime(null)
      setCurrentWordIndex(0)
      setCurrentLetterIndex(0)
      setWpm(0)
      setRawWpm(0)
      setAccuracy(100)
      setTimeElapsed(0)
    }

    // Use current time if testStartTime is not set yet
    const effectiveStartTime = testStartTime || currentTime
    if (!isTestActive) return

    const currentWord = words[currentWordIndex]
    if (!currentWord) return

    const newWordStates = [...wordStates]
    const currentWordState = newWordStates[currentWordIndex]

    if (input === ' ') {
      // Space pressed - move to next word
      if (currentLetterIndex > 0 || currentWordIndex === 0) {
        // Mark current word as complete if we typed something
        if (currentLetterIndex > 0) {
          const isWordCorrect = currentWordState.letters.every((letter, index) => {
            if (index < currentLetterIndex) {
              return letter.status === 'correct'
            }
            return true
          }) && currentLetterIndex === currentWord.length

          currentWordState.status = isWordCorrect ? 'correct' : 'incorrect'
        }
        
        setCurrentWordIndex(prev => prev + 1)
        setCurrentLetterIndex(0)
        
        // Check if test should end
        if (settings.testMode === 'words' && currentWordIndex + 1 >= settings.testWords) {
          finishTest()
          return
        }
      }
    } else if (input === 'Backspace') {
      // Backspace pressed
      if (currentLetterIndex > 0) {
        const letterIndex = currentLetterIndex - 1
        currentWordState.letters[letterIndex].status = 'pending'
        setCurrentLetterIndex(letterIndex)
      } else if (currentWordIndex > 0 && settings.freedomMode) {
        // Move to previous word if freedom mode is enabled
        setCurrentWordIndex(prev => prev - 1)
        setCurrentLetterIndex(words[currentWordIndex - 1].length)
      }
    } else {
      // Regular character input
      if (currentLetterIndex < currentWord.length) {
        const expectedLetter = currentWord[currentLetterIndex]
        const isCorrect = input === expectedLetter

        currentWordState.letters[currentLetterIndex] = {
          letter: expectedLetter,
          status: isCorrect ? 'correct' : 'incorrect',
          originalLetter: isCorrect ? undefined : input
        }

        setCurrentLetterIndex(prev => prev + 1)
      } else if (!settings.hideExtraLetters) {
        // Extra letters
        currentWordState.letters.push({
          letter: input,
          status: 'extra'
        })
        setCurrentLetterIndex(prev => prev + 1)
      }
    }

    setWordStates(newWordStates)
    
    // Calculate stats immediately after updating word states
    const now = Date.now()
    const startTime = testStartTime || currentTime
    const timeInMinutes = (now - startTime) / 60000
    
    if (timeInMinutes > 0.01) { // Avoid division by zero
      let correctChars = 0
      let totalTypedChars = 0

      // Count characters in the updated word states
      newWordStates.forEach((wordState, wordIndex) => {
        if (wordIndex < currentWordIndex || (wordIndex === currentWordIndex && currentLetterIndex > 0)) {
          wordState.letters.forEach((letterState, letterIndex) => {
            if (wordIndex < currentWordIndex || letterIndex < currentLetterIndex) {
              totalTypedChars++
              if (letterState.status === 'correct') {
                correctChars++
              }
            }
          })
        }
      })

      // Add spaces for completed words
      if (currentWordIndex > 0) {
        totalTypedChars += currentWordIndex
        correctChars += currentWordIndex
      }

      if (totalTypedChars > 0) {
        const wordsTyped = correctChars / 5
        const rawWordsTyped = totalTypedChars / 5
        const newWpm = Math.round(wordsTyped / timeInMinutes)
        const newRawWpm = Math.round(rawWordsTyped / timeInMinutes)
        const newAccuracy = Math.round((correctChars / totalTypedChars) * 100)

        setWpm(newWpm)
        setRawWpm(newRawWpm)
        setAccuracy(newAccuracy)
      }
    }
  }

  const finishTest = () => {
    if (!testStartTime) return

    const endTime = Date.now()
    setTestEndTime(endTime)
    setIsTestActive(false)
    setIsTestComplete(true)

    // Calculate final stats
    const timeInMinutes = (endTime - testStartTime) / 60000
    
    let correctChars = 0
    let incorrectChars = 0
    let extraChars = 0
    let totalTypedChars = 0

    // Count all typed characters
    wordStates.forEach((wordState, wordIndex) => {
      if (wordIndex < currentWordIndex || (wordIndex === currentWordIndex && currentLetterIndex > 0)) {
        wordState.letters.forEach((letterState, letterIndex) => {
          if (wordIndex < currentWordIndex || letterIndex < currentLetterIndex) {
            totalTypedChars++
            if (letterState.status === 'correct') {
              correctChars++
            } else if (letterState.status === 'incorrect') {
              incorrectChars++
            } else if (letterState.status === 'extra') {
              extraChars++
            }
          }
        })
      }
    })

    // Add spaces between words to total count
    const completedWords = currentWordIndex + (currentLetterIndex > 0 ? 1 : 0)
    if (completedWords > 1) {
      totalTypedChars += completedWords - 1
      correctChars += completedWords - 1
    }

    const wordsTyped = correctChars / 5
    const rawWordsTyped = totalTypedChars / 5
    const finalWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0
    const finalRawWpm = timeInMinutes > 0 ? Math.round(rawWordsTyped / timeInMinutes) : 0
    const finalAccuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100

    // Update live stats
    setWpm(finalWpm)
    setRawWpm(finalRawWpm)
    setAccuracy(finalAccuracy)
    setTimeElapsed(Math.round((endTime - testStartTime) / 1000))

    // Create test result
    const result: TestResult = {
      id: Date.now().toString(),
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency: Math.round(Math.random() * 20 + 80), // Mock consistency for now
      characters: totalTypedChars,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars: 0,
      time: Math.round((endTime - testStartTime) / 1000),
      mode: settings.testMode,
      language: settings.language,
      punctuation: settings.punctuation,
      numbers: settings.numbers,
      difficulty: settings.difficulty,
      date: new Date(),
      tags: []
    }

    setTestResult(result)
    setTestHistory(prev => [result, ...prev])

    // Save test result to database
    const saveToDatabase = async () => {
      try {
        const username = user?.username || 'Guest'
        
        const dbResult = await DatabaseService.saveTestResult({
          username,
          wpm: finalWpm,
          raw_wpm: finalRawWpm,
          accuracy: finalAccuracy,
          consistency: Math.round(Math.random() * 20 + 80),
          test_mode: settings.testMode,
          test_time: settings.testMode === 'time' ? settings.testTime : undefined,
          test_words: settings.testMode === 'words' ? settings.testWords : undefined,
          language: settings.language,
          punctuation: settings.punctuation,
          numbers: settings.numbers,
          difficulty: settings.difficulty,
          characters: totalTypedChars,
          errors: incorrectChars + extraChars
        })
        
        if (dbResult) {
          console.log('Test result saved to database:', dbResult)
        }
      } catch (error) {
        console.error('Failed to save test result to database:', error)
      }
    }
    
    saveToDatabase()

    // Dispatch test complete event for theme randomization
    window.dispatchEvent(new CustomEvent('testComplete'))
  }

  // Timer for time-based tests and live stats updates
  useEffect(() => {
    if (!isTestActive || !testStartTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - testStartTime) / 1000
      setTimeElapsed(Math.round(elapsed))
      
      // Update live stats during typing
      const timeInMinutes = (now - testStartTime) / 60000
      if (timeInMinutes > 0.01) {
        let correctChars = 0
        let totalTypedChars = 0

        // Count characters
        wordStates.forEach((wordState, wordIndex) => {
          if (wordIndex < currentWordIndex || (wordIndex === currentWordIndex && currentLetterIndex > 0)) {
            wordState.letters.forEach((letterState, letterIndex) => {
              if (wordIndex < currentWordIndex || letterIndex < currentLetterIndex) {
                totalTypedChars++
                if (letterState.status === 'correct') {
                  correctChars++
                }
              }
            })
          }
        })

        // Add spaces for completed words
        if (currentWordIndex > 0) {
          totalTypedChars += currentWordIndex
          correctChars += currentWordIndex
        }

        if (totalTypedChars > 0) {
          const wordsTyped = correctChars / 5
          const rawWordsTyped = totalTypedChars / 5
          const newWpm = Math.round(wordsTyped / timeInMinutes)
          const newRawWpm = Math.round(rawWordsTyped / timeInMinutes)
          const newAccuracy = Math.round((correctChars / totalTypedChars) * 100)

          setWpm(newWpm)
          setRawWpm(newRawWpm)
          setAccuracy(newAccuracy)
        }
      }
      
      // Check if time-based test should end
      if (settings.testMode === 'time' && elapsed >= settings.testTime) {
        finishTest()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isTestActive, testStartTime, settings.testTime, settings.testMode, wordStates, currentWordIndex, currentLetterIndex])

  // Load test history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('monkeytype-test-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setTestHistory(parsed)
      } catch (error) {
        console.error('Failed to parse test history:', error)
      }
    }
  }, [])

  // Save test history to localStorage
  useEffect(() => {
    localStorage.setItem('monkeytype-test-history', JSON.stringify(testHistory))
  }, [testHistory])

  // Generate initial words
  useEffect(() => {
    generateWords()
  }, [settings.testMode, settings.testWords, settings.testTime, settings.language, settings.punctuation, settings.numbers])

  const value: TestContextType = {
    isTestActive,
    isTestComplete,
    testStartTime,
    testEndTime,
    currentWordIndex,
    currentLetterIndex,
    words,
    wordStates,
    wpm,
    rawWpm,
    accuracy,
    consistency,
    timeElapsed,
    testResult,
    testHistory,
    startTest,
    resetTest,
    processInput,
    finishTest,
    generateWords,
    caretPosition
  }

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}
