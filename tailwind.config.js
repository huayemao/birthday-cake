/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    'app/**/*.{js,ts,jsx,tsx,mdx}',
    'components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}