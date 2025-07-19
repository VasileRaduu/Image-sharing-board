/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          bg: '#0f172a',
          'bg-secondary': '#1e293b',
          'bg-tertiary': '#334155',
          text: '#f8fafc',
          'text-secondary': '#cbd5e1',
          'text-tertiary': '#94a3b8',
          border: '#334155',
          'border-secondary': '#475569',
        }
      }
    },
  },
  plugins: [],
}