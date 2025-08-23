/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Roboto Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // Serika Dark theme (default)
        'bg': 'var(--bg-color)',
        'main': 'var(--main-color)',
        'caret': 'var(--caret-color)',
        'sub': 'var(--sub-color)',
        'sub-alt': 'var(--sub-alt-color)',
        'text': 'var(--text-color)',
        'error': 'var(--error-color)',
        'error-extra': 'var(--error-extra-color)',
        'colorful-error': 'var(--colorful-error-color)',
        'colorful-error-extra': 'var(--colorful-error-extra-color)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
