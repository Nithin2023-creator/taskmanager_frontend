/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          gray: {
            900: '#121212',
            800: '#1a1a1a',
            700: '#2a2a2a',
            600: '#363636',
            500: '#424242',
            400: '#5c5c5c',
            300: '#757575',
            200: '#9e9e9e',
            100: '#bdbdbd',
            50: '#f5f5f5',
          }
        }
      }
    },
    plugins: [],
  }