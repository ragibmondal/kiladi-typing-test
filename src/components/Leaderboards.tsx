import React, { useState, useEffect } from 'react'
import { useTest } from '../contexts/TestContext'
import { useAuth } from '../contexts/AuthContext'
import { DatabaseService } from '../services/databaseService'

const Leaderboards: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState('time-15')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [timeframe, setTimeframe] = useState('all-time')
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  
  const { testHistory } = useTest()
  const { user } = useAuth()

  const modes = [
    { id: 'time-15', name: '15 seconds' },
    { id: 'time-30', name: '30 seconds' },
    { id: 'time-60', name: '60 seconds' },
    { id: 'time-120', name: '120 seconds' },
    { id: 'words-10', name: '10 words' },
    { id: 'words-25', name: '25 words' },
    { id: 'words-50', name: '50 words' },
    { id: 'words-100', name: '100 words' }
  ]

  const languages = [
    { id: 'english', name: 'English' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' }
  ]

  const timeframes = [
    { id: 'all-time', name: 'All Time' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' }
  ]

  // Fetch leaderboard data from database
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch data from database
        const dbResults = await DatabaseService.getLeaderboard(selectedMode, selectedLanguage, 20)
        
        // Filter local test history for current user
        const filteredTests = testHistory.filter(test => {
          const [modeType, modeValue] = selectedMode.split('-')
          if (modeType === 'time') {
            return test.mode === 'time' && test.time === parseInt(modeValue)
          } else if (modeType === 'words') {
            return test.mode === 'words' && Math.round(test.characters / 5) === parseInt(modeValue)
          }
          return false
        }).filter(test => test.language === selectedLanguage)

        // Add user's best results from local history
        const userBests = filteredTests.reduce((acc, test) => {
          const existing = acc.find(t => t.username === (user?.username || 'Guest'))
          if (!existing || test.wpm > existing.wpm) {
            return [...acc.filter(t => t.username !== (user?.username || 'Guest')), {
              username: user?.username || 'Guest',
              wpm: test.wpm,
              accuracy: test.accuracy,
              raw: test.rawWpm,
              consistency: test.consistency,
              date: new Date(test.date).toISOString().split('T')[0]
            }]
          }
          return acc
        }, [] as any[])

        // Transform database results to match our format
        const transformedDbResults = dbResults.map(result => ({
          username: result.username,
          wpm: result.wpm,
          accuracy: result.accuracy,
          raw: result.raw_wpm,
          consistency: result.consistency || 0,
          date: new Date(result.date).toISOString().split('T')[0]
        }))

        // Combine user data with database results
        const combinedData = [...userBests, ...transformedDbResults]
          .sort((a, b) => b.wpm - a.wpm)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))

        setLeaderboardData(combinedData)
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error)
        
        // Fallback to local data if database fails
        const filteredTests = testHistory.filter(test => {
          const [modeType, modeValue] = selectedMode.split('-')
          if (modeType === 'time') {
            return test.mode === 'time' && test.time === parseInt(modeValue)
          } else if (modeType === 'words') {
            return test.mode === 'words' && Math.round(test.characters / 5) === parseInt(modeValue)
          }
          return false
        }).filter(test => test.language === selectedLanguage)

        const userBests = filteredTests.reduce((acc, test) => {
          const existing = acc.find(t => t.username === (user?.username || 'Guest'))
          if (!existing || test.wpm > existing.wpm) {
            return [...acc.filter(t => t.username !== (user?.username || 'Guest')), {
              username: user?.username || 'Guest',
              wpm: test.wpm,
              accuracy: test.accuracy,
              raw: test.rawWpm,
              consistency: test.consistency,
              date: test.date.toISOString().split('T')[0]
            }]
          }
          return acc
        }, [] as any[])

        // Add demo data as fallback
        const demoData = [
          { username: 'speedtyper123', wpm: 150, accuracy: 98.5, raw: 155, consistency: 92.1, date: '2024-01-15' },
          { username: 'fastfingers', wpm: 145, accuracy: 97.8, raw: 149, consistency: 89.5, date: '2024-01-14' },
          { username: 'typingtyper', wpm: 142, accuracy: 99.2, raw: 144, consistency: 94.3, date: '2024-01-13' }
        ]

        const combinedData = [...userBests, ...demoData]
          .sort((a, b) => b.wpm - a.wpm)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))

        setLeaderboardData(combinedData)
      }
    }

    fetchLeaderboardData()
  }, [selectedMode, selectedLanguage, testHistory, user])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-main mb-8">All-Time English Leaderboards</h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Timeframe */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`btn ${timeframe === tf.id ? 'active' : ''}`}
              >
                {tf.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-2">Test Mode</h3>
          <div className="flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`btn ${selectedMode === mode.id ? 'active' : ''}`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-2">Language</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`btn ${selectedLanguage === lang.id ? 'active' : ''}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-sub-alt rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-main text-bg">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">WPM</th>
                <th className="px-4 py-3 text-left">Accuracy</th>
                <th className="px-4 py-3 text-left">Raw</th>
                <th className="px-4 py-3 text-left">Consistency</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr
                  key={entry.username}
                  className={`border-b border-sub ${
                    index % 2 === 0 ? 'bg-sub-alt' : 'bg-bg'
                  } hover:bg-sub transition-colors`}
                >
                  <td className="px-4 py-3 font-mono text-main font-bold">
                    {entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-text hover:text-main transition-colors">
                      {entry.username}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-main">
                    {entry.wpm}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {entry.accuracy}%
                  </td>
                  <td className="px-4 py-3 font-mono text-sub">
                    {entry.raw}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {entry.consistency}%
                  </td>
                  <td className="px-4 py-3 text-sub">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Info */}
      <div className="mt-4 text-center text-sub text-sm">
        <p>Next update in: --:--</p>
        <p className="mt-2">
          Leaderboards are updated regularly. Only verified scores are displayed.
        </p>
      </div>

      {/* No Results State */}
      {leaderboardData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-sub text-lg mb-4">No results found</div>
          <p className="text-sub">
            Be the first to set a record in this category!
          </p>
        </div>
      )}
    </div>
  )
}

export default Leaderboards
