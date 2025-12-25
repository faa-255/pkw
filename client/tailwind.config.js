/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      },
      colors: {
        earth: {
          base: '#F5F5F0',
          light: '#E0D8D0',
          primary: '#8D7B68',
          hover: '#6D5B4B',
          dark: '#5C4033',
          accent: '#A4907C',
        }
      }
    },
  },
  plugins: [],
}