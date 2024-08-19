/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primarybg' : '#061127',
        'primarycolor' : '#cfe5ff',
        'secondarycolor' : '0e387a',
        'textcolor' : '#abc0da'
      },
      keyframes: {
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        wave: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 1.5s ease-in-out infinite',
        wave: 'wave 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}