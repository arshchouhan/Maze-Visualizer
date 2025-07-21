/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'matrix-bg': '#0f0f23',
        'matrix-cell': '#1e1e3f',
        'matrix-hover': '#2a2a5a',
        'start-node': '#10b981',
        'target-node': '#f59e0b',
        'path': '#3b82f6',
        'wall': '#374151'
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1s infinite',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
