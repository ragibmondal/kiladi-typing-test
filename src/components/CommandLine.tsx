import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { useTheme } from '../contexts/ThemeContext'
import { useTest } from '../contexts/TestContext'

interface CommandLineProps {
  onClose: () => void
}

interface Command {
  name: string
  description: string
  action: () => void
  category: string
}

const CommandLine: React.FC<CommandLineProps> = ({ onClose }) => {
  const [input, setInput] = useState('')
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { updateSettings } = useSettings()
  const { setTheme, themes } = useTheme()
  const { resetTest } = useTest()

  const commands: Command[] = [
    // Navigation
    { name: 'Home', description: 'Go to typing test', action: () => navigate('/'), category: 'Navigation' },
    { name: 'Settings', description: 'Open settings', action: () => navigate('/settings'), category: 'Navigation' },
    { name: 'Leaderboards', description: 'View leaderboards', action: () => navigate('/leaderboards'), category: 'Navigation' },
    { name: 'About', description: 'About page', action: () => navigate('/about'), category: 'Navigation' },
    
    // Test controls
    { name: 'Restart Test', description: 'Restart the current test', action: () => resetTest(), category: 'Test' },
    { name: 'Time 15', description: 'Set test to 15 seconds', action: () => updateSettings({ testMode: 'time', testTime: 15 }), category: 'Test' },
    { name: 'Time 30', description: 'Set test to 30 seconds', action: () => updateSettings({ testMode: 'time', testTime: 30 }), category: 'Test' },
    { name: 'Time 60', description: 'Set test to 60 seconds', action: () => updateSettings({ testMode: 'time', testTime: 60 }), category: 'Test' },
    { name: 'Time 120', description: 'Set test to 120 seconds', action: () => updateSettings({ testMode: 'time', testTime: 120 }), category: 'Test' },
    { name: 'Words 10', description: 'Set test to 10 words', action: () => updateSettings({ testMode: 'words', testWords: 10 }), category: 'Test' },
    { name: 'Words 25', description: 'Set test to 25 words', action: () => updateSettings({ testMode: 'words', testWords: 25 }), category: 'Test' },
    { name: 'Words 50', description: 'Set test to 50 words', action: () => updateSettings({ testMode: 'words', testWords: 50 }), category: 'Test' },
    { name: 'Words 100', description: 'Set test to 100 words', action: () => updateSettings({ testMode: 'words', testWords: 100 }), category: 'Test' },
    
    // Settings toggles
    { name: 'Toggle Punctuation', description: 'Toggle punctuation on/off', action: () => updateSettings({ punctuation: undefined }), category: 'Settings' },
    { name: 'Toggle Numbers', description: 'Toggle numbers on/off', action: () => updateSettings({ numbers: undefined }), category: 'Settings' },
    { name: 'Toggle Blind Mode', description: 'Toggle blind mode', action: () => updateSettings({ blindMode: undefined }), category: 'Settings' },
    { name: 'Toggle Freedom Mode', description: 'Toggle freedom mode', action: () => updateSettings({ freedomMode: undefined }), category: 'Settings' },
    
    // Themes
    ...themes.map(theme => ({
      name: `Theme ${theme.name}`,
      description: `Switch to ${theme.name} theme`,
      action: () => setTheme(theme.id),
      category: 'Themes'
    })),
    
    // Languages
    { name: 'Language English', description: 'Switch to English', action: () => updateSettings({ language: 'english' }), category: 'Languages' },
    { name: 'Language Spanish', description: 'Switch to Spanish', action: () => updateSettings({ language: 'spanish' }), category: 'Languages' },
    { name: 'Language French', description: 'Switch to French', action: () => updateSettings({ language: 'french' }), category: 'Languages' },
    { name: 'Language German', description: 'Switch to German', action: () => updateSettings({ language: 'german' }), category: 'Languages' },
  ]

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (input.trim() === '') {
      setFilteredCommands(commands)
    } else {
      const filtered = commands.filter(cmd =>
        cmd.name.toLowerCase().includes(input.toLowerCase()) ||
        cmd.description.toLowerCase().includes(input.toLowerCase())
      )
      setFilteredCommands(filtered)
    }
    setSelectedIndex(0)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        onClose()
      }
    }
  }

  const executeCommand = (command: Command) => {
    command.action()
    onClose()
  }

  const groupedCommands = filteredCommands.reduce((acc, cmd, index) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push({ ...cmd, originalIndex: index })
    return acc
  }, {} as Record<string, Array<Command & { originalIndex: number }>>)

  return (
    <div className="command-line" onClick={onClose}>
      <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="command-input"
        />

        {/* Commands list */}
        <div className="mt-4 max-h-96 overflow-y-auto bg-bg border-2 border-main rounded-lg">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-sub-alt text-sub text-sm font-semibold">
                {category}
              </div>
              {commands.map((cmd) => (
                <div
                  key={cmd.name}
                  onClick={() => executeCommand(cmd)}
                  className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                    cmd.originalIndex === selectedIndex
                      ? 'bg-main text-bg border-main'
                      : 'border-transparent hover:bg-sub-alt'
                  }`}
                >
                  <div className="font-medium">{cmd.name}</div>
                  <div className={`text-sm ${
                    cmd.originalIndex === selectedIndex ? 'text-bg opacity-80' : 'text-sub'
                  }`}>
                    {cmd.description}
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sub">
              No commands found
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-4 text-center text-sub text-sm">
          <div className="mb-1">
            Use ↑↓ to navigate, Enter to select, Esc to close
          </div>
          <div>
            Type to search commands
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandLine
