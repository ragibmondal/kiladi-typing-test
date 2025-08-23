import React, { useEffect, useState } from 'react'
import { useSettings } from '../contexts/SettingsContext'

interface LiveStatsProps {
  wpm: number
  rawWpm: number
  accuracy: number
  timeElapsed: number
}

const LiveStats: React.FC<LiveStatsProps> = ({ wpm, rawWpm, accuracy, timeElapsed }) => {
  const { settings } = useSettings()
  const [animatedValues, setAnimatedValues] = useState({
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    timeElapsed: 0
  })

  // Animate values for a smoother experience
  useEffect(() => {
    const animationDuration = 300 // ms
    const startTime = Date.now()
    const startValues = { ...animatedValues }
    const endValues = { wpm, rawWpm, accuracy, timeElapsed }
    
    const animateValues = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      
      if (progress < 1) {
        setAnimatedValues({
          wpm: Math.round(startValues.wpm + (endValues.wpm - startValues.wpm) * progress),
          rawWpm: Math.round(startValues.rawWpm + (endValues.rawWpm - startValues.rawWpm) * progress),
          accuracy: Math.round((startValues.accuracy + (endValues.accuracy - startValues.accuracy) * progress) * 10) / 10,
          timeElapsed: Math.round(startValues.timeElapsed + (endValues.timeElapsed - startValues.timeElapsed) * progress)
        })
        requestAnimationFrame(animateValues)
      } else {
        setAnimatedValues(endValues)
      }
    }
    
    requestAnimationFrame(animateValues)
  }, [wpm, rawWpm, accuracy, timeElapsed])

  const getSpeedUnit = () => {
    switch (settings.typingSpeedUnit) {
      case 'cpm':
        return { value: animatedValues.wpm * 5, unit: 'cpm' }
      case 'wps':
        return { value: Math.round(animatedValues.wpm / 60 * 100) / 100, unit: 'wps' }
      case 'cps':
        return { value: Math.round(animatedValues.wpm * 5 / 60 * 100) / 100, unit: 'cps' }
      default:
        return { value: animatedValues.wpm, unit: 'wpm' }
    }
  }

  const speed = getSpeedUnit()
  const opacity = settings.liveStatsOpacity
  const color = settings.liveStatsColor

  const getColorClass = () => {
    switch (color) {
      case 'black':
        return 'text-black'
      case 'sub':
        return 'text-sub'
      case 'text':
        return 'text-text'
      case 'main':
        return 'text-main'
      default:
        return 'text-sub'
    }
  }

  const colorClass = getColorClass()
  const showSpeed = settings.liveSpeedStyle !== 'off'
  const showAccuracy = settings.liveAccuracyStyle !== 'off'
  const showRaw = settings.liveBurstStyle !== 'off'
  const showTime = settings.testMode === 'words' && settings.liveProgressStyle !== 'off'

  // Count how many stats are visible to adjust layout
  const visibleStatsCount = [showSpeed, showAccuracy, showRaw, showTime].filter(Boolean).length

  const StatItem: React.FC<{
    icon: string
    value: string
    label: string
    mini: boolean
  }> = ({ icon, value, label, mini }) => (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <div className={`flex items-center gap-1.5 mb-1 ${mini ? 'opacity-70' : 'opacity-50'}`}>
        <span className="material-icons-outlined text-sm">{icon}</span>
      </div>
      <div className={`${colorClass} font-mono font-bold transition-all duration-300 ${
        mini ? 'text-base' : 'text-2xl'
      }`}>
        {value}
      </div>
      {!mini && (
        <div className={`text-xs uppercase tracking-wide mt-1 ${colorClass} opacity-70`}>
          {label}
        </div>
      )}
    </div>
  )

  return (
    <div 
      className={`grid gap-2 ${
        visibleStatsCount === 1 ? 'grid-cols-1 max-w-xs' : 
        visibleStatsCount === 2 ? 'grid-cols-2 max-w-md' : 
        visibleStatsCount === 3 ? 'grid-cols-3 max-w-lg' : 'grid-cols-4 max-w-2xl'
      } mx-auto divide-x divide-sub/30`}
      style={{ opacity }}
    >
      {/* Speed */}
      {showSpeed && (
        <StatItem
          icon="speed"
          value={speed.value.toString()}
          label={speed.unit}
          mini={settings.liveSpeedStyle === 'mini'}
        />
      )}

      {/* Accuracy */}
      {showAccuracy && (
        <StatItem
          icon="target"
          value={`${animatedValues.accuracy}%`}
          label="acc"
          mini={settings.liveAccuracyStyle === 'mini'}
        />
      )}

      {/* Raw Speed */}
      {showRaw && (
        <StatItem
          icon="trending_up"
          value={animatedValues.rawWpm.toString()}
          label="raw"
          mini={settings.liveBurstStyle === 'mini'}
        />
      )}

      {/* Time (for word tests) */}
      {showTime && (
        <StatItem
          icon="schedule"
          value={`${animatedValues.timeElapsed}s`}
          label="time"
          mini={settings.liveProgressStyle === 'mini'}
        />
      )}
    </div>
  )
}

export default LiveStats
