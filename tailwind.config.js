/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        ink: '#1f2523',
        cream: '#f8f7f2',
        paper: '#fffefa',
        coral: '#ef6b5b',
        moss: '#557567',
        mustard: '#e6b84f',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(31, 37, 35, 0.09)',
        card: '0 8px 20px rgba(31, 37, 35, 0.08)',
      },
    },
  },
  plugins: [],
}
