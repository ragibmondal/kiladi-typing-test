import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()

  // Mock profile data - in a real app, this would be fetched based on username
  const profileData = {
    username: username || 'user',
    joinDate: new Date('2023-01-15'),
    testsStarted: 1250,
    testsCompleted: 1180,
    timeTyping: 45.5, // hours
    highestWpm: 125,
    averageWpm: 85,
    highestAccuracy: 99.2,
    averageAccuracy: 96.8,
    bio: 'Passionate about improving typing speed and accuracy. Love mechanical keyboards!',
    keyboard: 'Keychron K2 with Cherry MX Brown switches',
    github: 'github.com/typingpro',
    twitter: '@typingmaster',
    website: 'typingblog.com'
  }

  const isOwnProfile = user?.username === username

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    const days = Math.floor(hours / 24)
    const remainingHours = Math.round(hours % 24)
    return `${days}d ${remainingHours}h`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-sub-alt rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-main rounded-full flex items-center justify-center text-bg text-2xl font-bold">
            {profileData.username.charAt(0).toUpperCase()}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-main mb-2">{profileData.username}</h1>
            <div className="text-sub space-y-1">
              <p>Joined {profileData.joinDate.toLocaleDateString()}</p>
              <p>{profileData.testsCompleted} tests completed</p>
              <p>{formatTime(profileData.timeTyping)} time typing</p>
            </div>
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div className="flex space-x-2">
              <button className="btn">
                <span className="material-icons-outlined mr-2">edit</span>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        {profileData.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-text mb-2">Bio</h3>
            <p className="text-text">{profileData.bio}</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.keyboard && (
            <div>
              <h4 className="text-text font-medium">Keyboard</h4>
              <p className="text-sub">{profileData.keyboard}</p>
            </div>
          )}
          
          <div className="space-y-2">
            {profileData.github && (
              <a
                href={`https://${profileData.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sub hover:text-main transition-colors"
              >
                <span className="material-icons-outlined mr-2">code</span>
                {profileData.github}
              </a>
            )}
            
            {profileData.twitter && (
              <a
                href={`https://twitter.com/${profileData.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sub hover:text-main transition-colors"
              >
                <span className="material-icons-outlined mr-2">alternate_email</span>
                {profileData.twitter}
              </a>
            )}
            
            {profileData.website && (
              <a
                href={`https://${profileData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sub hover:text-main transition-colors"
              >
                <span className="material-icons-outlined mr-2">language</span>
                {profileData.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-value">{profileData.testsStarted}</div>
          <div className="stat-label">tests started</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{profileData.testsCompleted}</div>
          <div className="stat-label">tests completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{formatTime(profileData.timeTyping)}</div>
          <div className="stat-label">time typing</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{profileData.highestWpm}</div>
          <div className="stat-label">highest wpm</div>
        </div>
      </div>

      {/* Personal Bests */}
      <div className="bg-sub-alt rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-main mb-4">Personal Bests</h2>
        
        <div className="space-y-6">
          {/* Time Tests */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-3">Time Tests</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[15, 30, 60, 120].map((time) => (
                <div key={time} className="text-center p-3 bg-bg rounded">
                  <div className="text-main font-bold text-xl">
                    {Math.floor(Math.random() * 50) + 80}
                  </div>
                  <div className="text-sub text-sm">{time} seconds</div>
                </div>
              ))}
            </div>
          </div>

          {/* Word Tests */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-3">Word Tests</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[10, 25, 50, 100].map((words) => (
                <div key={words} className="text-center p-3 bg-bg rounded">
                  <div className="text-main font-bold text-xl">
                    {Math.floor(Math.random() * 40) + 85}
                  </div>
                  <div className="text-sub text-sm">{words} words</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Graph Placeholder */}
      <div className="bg-sub-alt rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-main mb-4">Activity</h2>
        <div className="h-32 bg-bg rounded flex items-center justify-center text-sub">
          Activity graph coming soon...
        </div>
      </div>
    </div>
  )
}

export default Profile
