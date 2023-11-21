/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js,css}",
    "./views/*.ejs",
    "./views/**/*.ejs",
  ],
  theme: {
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans'],
      },
      colors: {
        'primary': '#d81f27',
      },
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ],
}

