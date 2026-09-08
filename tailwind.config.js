/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f4ebd7',
          300: '#ebdcb9',
          400: '#dec495',
          500: '#cca973',
          600: '#ba905c',
          700: '#9b7149',
          800: '#7e5b3f',
          900: '#674a36',
        },
        ink: {
          black: '#1a1715',
          faded: '#2c2523',
          warm: '#352924',
          blue: '#1e2430',
        },
        wax: {
          dark: '#631010',
          base: '#871a1a',
          light: '#a92828',
          highlight: '#cf4444',
        }
      },
      fontFamily: {
        handwriting: ['var(--font-handwriting)', 'cursive'],
        calligraphy: ['var(--font-calligraphy)', 'cursive'],
        serif: ['var(--font-serif)', 'serif'],
        signature: ['var(--font-signature)', 'cursive'],
      },
      boxShadow: {
        'envelope': '0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
        'letter': '0 25px 60px -12px rgba(18, 12, 8, 0.45), 0 0 15px rgba(0,0,0,0.1)',
        'crease': 'inset 0 1px 2px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(255,255,255,0.4)',
        'wax': '0 6px 16px rgba(0, 0, 0, 0.45), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
