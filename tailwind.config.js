/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
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
        // Human-readable names mapping to centralized font variables
        sans: ['var(--font-body)', 'sans-serif'],    // Default for body text (Inter)
        heading: ['var(--font-header)', 'sans-serif'], // For headers (Inter Tight)
        main: ['var(--font-body)', 'sans-serif'],      // Alias for main content
        admin: ['var(--font-body)', 'sans-serif'],     // Consistent admin font

        // Semantic Application Aliases (Requested Methods)
        'product-title': ['var(--font-header)', 'sans-serif'], // Impactful for product names
        'price': ['var(--font-body)', 'sans-serif'],           // Clean, readable numbers
        'hero': ['var(--font-header)', 'sans-serif'],          // Large hero section text
        'nav': ['var(--font-header)', 'sans-serif'],           // Navigation links
        'button': ['var(--font-header)', 'sans-serif'],        // Buttons and CTAs
        'caption': ['var(--font-body)', 'sans-serif'],         // Small labels and captions
        'section-title': ['var(--font-header)', 'sans-serif'], // Section headers (h2, h3)
        'input': ['var(--font-body)', 'sans-serif'],           // Form inputs
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

