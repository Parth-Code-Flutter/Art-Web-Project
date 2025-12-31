/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        glass: 'var(--glass)',
        'glass-border': 'var(--glass-border)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        main: ['var(--font-jakarta)', 'sans-serif'],
        heading: ['var(--font-jakarta)', 'sans-serif'],
        admin: ['var(--font-jakarta)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

