/** @type {import('tailwindcss').Config} */

// npx tailwindcss -i ./public/styles/tailwind.css -o ./public/styles/styles.css --watch

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

