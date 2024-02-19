/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./blocks/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        tan: '#FFF9ED',
        'c4m-yellow': {
          200: '#fff0cb',
          300: '#fed862',
          400: '#eab940',
        },
        'c4m-blue': {
          100: '#deebf9',
          400: '#9ac3e5',
          700: '#2d73b5',
        },
      },
    },
  },
  plugins: [],
  important: '.c4m-lookup',
};
