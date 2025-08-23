# Monkeytype Clone

A complete clone of the popular [Monkeytype](https://monkeytype.com/) typing test website, built with modern web technologies.

## Features

### 🎯 Core Functionality
- **Multiple Test Modes**: Time-based (15s, 30s, 60s, 120s) and word-based (10, 25, 50, 100 words)
- **Real-time Statistics**: Live WPM, accuracy, and consistency tracking
- **Multiple Languages**: English, Spanish, French, German, and more
- **Customizable Options**: Punctuation, numbers, difficulty levels

### 🎨 Customization
- **Multiple Themes**: Serika Dark, Dracula, Monokai, Nord, Terminal, and more
- **Theme Randomization**: Automatic theme switching after tests
- **Custom Fonts**: Multiple font families and sizes
- **Flexible Layout**: Responsive design for all devices

### ⚙️ Advanced Features
- **Command Line Interface**: Quick access to all settings (Esc or Ctrl+Shift+P)
- **Comprehensive Settings**: Behavior, input, sound, caret, and appearance options
- **User Accounts**: Profile management and statistics tracking
- **Leaderboards**: Global rankings and personal bests
- **Test History**: Detailed statistics and progress tracking

### 🚀 Performance Features
- **Smooth Animations**: Configurable caret movement and transitions
- **Live Stats Display**: Customizable real-time performance indicators
- **Quick Restart**: Multiple restart options (Tab, Esc, Enter)
- **Keyboard Shortcuts**: Full keyboard navigation support

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: React Router v6
- **Build Tool**: Vite
- **State Management**: React Context API
- **Icons**: Material Icons Outlined

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kiladi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer with shortcuts
│   ├── TypingTest.tsx  # Main typing test interface
│   ├── TestControls.tsx # Test mode and options
│   ├── TestDisplay.tsx # Word display and caret
│   ├── TestResults.tsx # Results page
│   ├── LiveStats.tsx   # Real-time statistics
│   ├── CommandLine.tsx # Command palette
│   ├── Settings.tsx    # Settings page
│   ├── Leaderboards.tsx # Leaderboards page
│   ├── About.tsx       # About page
│   ├── Login.tsx       # Authentication
│   └── Profile.tsx     # User profiles
├── contexts/           # React contexts for state management
│   ├── AuthContext.tsx    # User authentication
│   ├── SettingsContext.tsx # User preferences
│   ├── TestContext.tsx    # Typing test state
│   └── ThemeContext.tsx   # Theme management
├── App.tsx            # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles and theme variables
```

## Key Features Implementation

### Typing Engine
- Real-time character validation
- Smooth caret positioning
- Error highlighting and correction
- Live statistics calculation

### Theme System
- CSS custom properties for dynamic theming
- Multiple built-in themes
- Theme randomization after test completion
- Auto theme switching based on system preference

### Settings Management
- Comprehensive settings with localStorage persistence
- Import/export functionality
- Real-time setting application
- Settings validation and defaults

### Command Line Interface
- Fuzzy search for commands
- Keyboard navigation
- Grouped commands by category
- Quick access to all features

## Customization

### Adding New Themes
Themes are defined in `src/contexts/ThemeContext.tsx`. Each theme includes:
- Background, text, and accent colors
- Error and highlight colors
- Caret and UI element colors

### Adding New Languages
Language support can be extended by:
1. Adding word lists to the test context
2. Updating language options in settings
3. Implementing language-specific features

### Extending Test Modes
New test modes can be added by:
1. Updating the test context with new mode logic
2. Adding UI controls in TestControls component
3. Implementing mode-specific word generation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original [Monkeytype](https://monkeytype.com/) by Miodec
- Material Icons by Google
- Font families: Inter and Roboto Mono
- All the contributors who made this possible

## Demo

Visit the live demo at [your-deployment-url] to try out all the features!

---

**Note**: This is a clone/recreation of Monkeytype for educational purposes. All credit for the original design and concept goes to the Monkeytype team.
