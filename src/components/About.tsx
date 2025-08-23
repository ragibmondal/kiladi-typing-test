import React from 'react'

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-main mb-8">About Monkeytype</h1>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-sub-alt rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-main mb-4">What is Monkeytype?</h2>
          <p className="text-text leading-relaxed mb-4">
            Monkeytype is a minimalistic and customizable typing test. It features many test modes, 
            an account system to save your typing speed history, and user-configurable features 
            such as themes, sounds, a smooth caret, and more.
          </p>
          <p className="text-text leading-relaxed">
            This is a complete clone implementation featuring all the core functionality of the 
            original Monkeytype website, built with modern web technologies.
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold text-main mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-sub-alt rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text mb-2">Test Modes</h3>
              <ul className="text-sub space-y-1">
                <li>• Time-based tests (15s, 30s, 60s, 120s)</li>
                <li>• Word count tests (10, 25, 50, 100 words)</li>
                <li>• Quote mode</li>
                <li>• Zen mode</li>
                <li>• Custom text mode</li>
              </ul>
            </div>

            <div className="bg-sub-alt rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text mb-2">Customization</h3>
              <ul className="text-sub space-y-1">
                <li>• Multiple themes and color schemes</li>
                <li>• Configurable fonts and sizes</li>
                <li>• Sound effects</li>
                <li>• Caret customization</li>
                <li>• Live statistics display</li>
              </ul>
            </div>

            <div className="bg-sub-alt rounded-lg p-4">
              <h3 className="text-lg font-semibent text-text mb-2">Languages</h3>
              <ul className="text-sub space-y-1">
                <li>• English (multiple variants)</li>
                <li>• Spanish</li>
                <li>• French</li>
                <li>• German</li>
                <li>• And many more...</li>
              </ul>
            </div>

            <div className="bg-sub-alt rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text mb-2">Advanced Features</h3>
              <ul className="text-sub space-y-1">
                <li>• Command line interface</li>
                <li>• Detailed statistics</li>
                <li>• Progress tracking</li>
                <li>• Leaderboards</li>
                <li>• Account system</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-sub-alt rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-main mb-4">Understanding Your Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">WPM (Words Per Minute)</h3>
              <p className="text-sub">
                The standard measure of typing speed. Calculated as (characters typed / 5) / time in minutes.
                One "word" is considered to be 5 characters.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Raw WPM</h3>
              <p className="text-sub">
                Your typing speed including errors. This shows how fast you're actually typing 
                before accuracy is taken into account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Accuracy</h3>
              <p className="text-sub">
                The percentage of characters you typed correctly. Higher accuracy generally 
                leads to better overall performance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Consistency</h3>
              <p className="text-sub">
                Measures how consistent your typing speed is throughout the test. 
                Lower variation means higher consistency.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-semibold text-main mb-4">Typing Tips</h2>
          <div className="bg-sub-alt rounded-lg p-6">
            <ul className="space-y-3 text-text">
              <li className="flex items-start space-x-2">
                <span className="text-main mt-1">•</span>
                <span>Focus on accuracy first, speed will come naturally with practice</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-main mt-1">•</span>
                <span>Use proper finger placement and touch typing techniques</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-main mt-1">•</span>
                <span>Take regular breaks to avoid fatigue and maintain performance</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-main mt-1">•</span>
                <span>Practice consistently rather than in long sessions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-main mt-1">•</span>
                <span>Don't look at the keyboard - trust your muscle memory</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-main mb-4">Get in Touch</h2>
          <p className="text-sub mb-4">
            Have questions, suggestions, or found a bug? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/monkeytypegame/monkeytype"
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex items-center space-x-2"
            >
              <span className="material-icons-outlined">code</span>
              <span>GitHub</span>
            </a>
            <a
              href="https://discord.gg/monkeytype"
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex items-center space-x-2"
            >
              <span className="material-icons-outlined">chat</span>
              <span>Discord</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
