import React from 'react'
import { useSettings } from '../contexts/SettingsContext'

const Footer: React.FC = () => {
  const { settings } = useSettings()

  return (
    <footer className="border-t border-sub-alt bg-bg py-4">
      <div className="container mx-auto px-4">
        {/* Keyboard shortcuts */}
        {settings.showKeyTips && (
          <div className="text-center text-sub text-sm mb-4">
            <span className="mr-4">tab + enter - restart test</span>
            <span>esc or ctrl + shift + p - command line</span>
          </div>
        )}

        {/* Footer links */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sub text-sm">
          <button className="hover:text-main transition-colors">
            <span className="material-icons-outlined text-base mr-1">email</span>
            contact
          </button>
          <button className="hover:text-main transition-colors">
            <span className="material-icons-outlined text-base mr-1">support</span>
            support
          </button>
          <a
            href="https://github.com/monkeytypegame/monkeytype"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-main transition-colors"
          >
            <span className="material-icons-outlined text-base mr-1">code</span>
            github
          </a>
          <a
            href="https://discord.gg/monkeytype"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-main transition-colors"
          >
            <span className="material-icons-outlined text-base mr-1">chat</span>
            discord
          </a>
          <a
            href="https://twitter.com/monkeytype"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-main transition-colors"
          >
            <span className="material-icons-outlined text-base mr-1">alternate_email</span>
            twitter
          </a>
          <button className="hover:text-main transition-colors">
            terms
          </button>
          <button className="hover:text-main transition-colors">
            security
          </button>
          <button className="hover:text-main transition-colors">
            privacy
          </button>
        </div>

        {/* Theme and version */}
        <div className="flex justify-center items-center mt-4 gap-4 text-sub text-sm">
          <button
            className="hover:text-main transition-colors"
            title="Shift-click to toggle custom theme"
          >
            serika dark
          </button>
          <span>v1.0.0</span>
        </div>

        {/* Credits */}
        <div className="text-center text-sub text-xs mt-4">
          <p>Created with love by Miodec.</p>
          <p>Supported and expanded by many awesome people.</p>
          <p>Launched on 15th of May, 2020.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
