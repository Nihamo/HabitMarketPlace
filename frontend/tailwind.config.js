/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0B0E19",
          lighter: "#111526",
        },
        primary: {
          start: "#6A5AE0",
          mid: "#A874F0",
          end: "#F17CC7",
        },
        neon: {
          cyan: "#72F5FF",
          purple: "#C779FF",
          gold: "#FFD580",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px #72F5FF' },
          '50%': { opacity: '0.5', boxShadow: '0 0 20px #72F5FF' },
        },
      },
    },
  },
  plugins: [],
}
