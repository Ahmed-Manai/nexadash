/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where to find class names — it tree-shakes unused utilities at build time
  content: ['./src/**/*.{html,ts}'],

  // darkMode: 'class' means dark mode is toggled by adding class="dark" to <html>
  // This is the manual strategy — we control the toggle ourselves (vs 'media' which follows OS preference)
  darkMode: 'class',

  theme: {
    extend: {
      // Custom design tokens that match our Material theme palette
      colors: {
        primary: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',  // base primary
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
        sidebar: {
          DEFAULT: '#1e293b',  // slate-800
          hover: '#334155',    // slate-700
          active: '#3f51b5',   // primary
          text: '#94a3b8',     // slate-400
          'text-active': '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
