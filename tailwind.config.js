/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js,css}",
    "./views/*.ejs",
  ],
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans'],
      },
      colors: {
        'primary': '#1fb6ff',
      },
    },
  },
  plugins: [],
}

