/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"], 
  theme: {
    extend: {
      colors :{
        'primary' : '#242c58',
      }
    },
  },
  plugins: [],
  corePlugins:{
    preflight: false,
  },
}