/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rq-blue': '#0a1a2e', // Deep blue for backgrounds
        'rq-red': '#d32f2f',  // Crimson red for accents
        'rq-black': '#121212', // Dark black for contrast
        'rq-light-blue': '#1e3a5f', // Lighter blue for light mode
        'rq-dark-red': '#b71c1c', // Darker red for dark mode
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};