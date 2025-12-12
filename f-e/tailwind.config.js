/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['font-dancing-script'], // Force include the class
  theme: {
    extend: {
      colors: {
        'rq-blue': '#0a1a2e',
        'rq-red': '#d32f2f',
        'rq-black': '#121212',
        'rq-light-blue': '#1e3a5f',
        'rq-dark-red': '#b71c1c',
      },
      fontFamily: {
        'jura': ['var(--font-jura)'],
        'dancing-script': ['var(--font-dancing_script)'],
        'fira-code': ['var(--font-fira-code)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};