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
        'patriots-navy': '#002244',
        'patriots-red': '#C60C30',
        'patriots-silver': '#B0B7BC',
      },
      fontFamily: {
        'display': ['var(--font-cormorant)', 'Georgia', 'serif'],
        'ui': ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

