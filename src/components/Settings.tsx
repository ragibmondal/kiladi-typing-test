import React, { useState } from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { useTheme } from '../contexts/ThemeContext'

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings()
  const { themes, setTheme, currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('behavior')
  const [importData, setImportData] = useState('')

  const tabs = [
    { id: 'behavior', name: 'Behavior', icon: 'psychology' },
    { id: 'input', name: 'Input', icon: 'keyboard' },
    { id: 'sound', name: 'Sound', icon: 'volume_up' },
    { id: 'caret', name: 'Caret', icon: 'text_fields' },
    { id: 'appearance', name: 'Appearance', icon: 'visibility' },
    { id: 'theme', name: 'Theme', icon: 'palette' },
    { id: 'danger', name: 'Danger Zone', icon: 'warning' }
  ]

  const handleImport = () => {
    if (importSettings(importData)) {
      alert('Settings imported successfully!')
      setImportData('')
    } else {
      alert('Failed to import settings. Please check the format.')
    }
  }

  const handleExport = () => {
    const data = exportSettings()
    navigator.clipboard.writeText(data).then(() => {
      alert('Settings copied to clipboard!')
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-main mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-main text-bg'
                    : 'text-sub hover:text-text hover:bg-sub-alt'
                }`}
              >
                <span className="material-icons-outlined">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'behavior' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-main">Behavior</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-text mb-2">Test Difficulty</label>
                  <div className="flex gap-2">
                    {['normal', 'expert', 'master'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => updateSettings({ difficulty: diff as any })}
                        className={`btn ${settings.difficulty === diff ? 'active' : ''}`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                  <p className="text-sub text-sm mt-1">
                    Normal: Classic typing test. Expert: Fails on incorrect word. Master: Fails on any incorrect key.
                  </p>
                </div>

                <div>
                  <label className="block text-text mb-2">Quick Restart</label>
                  <div className="flex gap-2">
                    {['off', 'tab', 'esc', 'enter'].map((key) => (
                      <button
                        key={key}
                        onClick={() => updateSettings({ quickRestart: key as any })}
                        className={`btn ${settings.quickRestart === key ? 'active' : ''}`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.blindMode}
                      onChange={(e) => updateSettings({ blindMode: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-text">Blind Mode</span>
                  </label>
                  <p className="text-sub text-sm mt-1">
                    No errors or incorrect words are highlighted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-main">Theme</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`theme-card ${currentTheme.id === theme.id ? 'active' : ''}`}
                  >
                    <div className="flex items-center justify-center h-16 rounded mb-2"
                         style={{ backgroundColor: theme.colors.bg }}>
                      <div className="w-8 h-8 rounded"
                           style={{ backgroundColor: theme.colors.main }}></div>
                    </div>
                    <div className="text-center text-sm">{theme.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-error">Danger Zone</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Import/Export Settings</h3>
                  <div className="flex gap-2 mb-4">
                    <button onClick={handleExport} className="btn">
                      Export Settings
                    </button>
                  </div>
                  <div>
                    <textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste settings JSON here..."
                      className="input w-full h-32 mb-2"
                    />
                    <button onClick={handleImport} className="btn">
                      Import Settings
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-error mb-2">Reset Settings</h3>
                  <p className="text-sub mb-4">
                    This will reset all settings to default values. This action cannot be undone!
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all settings?')) {
                        resetSettings()
                      }
                    }}
                    className="btn bg-error hover:bg-error-extra text-white"
                  >
                    Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {!['behavior', 'theme', 'danger'].includes(activeTab) && (
            <div className="text-center py-12">
              <div className="text-sub text-lg mb-4">
                {tabs.find(t => t.id === activeTab)?.name} settings coming soon!
              </div>
              <p className="text-sub">
                This section is under development and will include comprehensive options for customizing your typing experience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
