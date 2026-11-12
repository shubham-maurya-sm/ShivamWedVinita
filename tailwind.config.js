/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#9B111E',
          deep: '#4A0E17',
          light: '#BA1E2E',
          soft: '#FBF0F1'
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D77F',
          dark: '#9A7B1C',
          amber: '#EAA315',
          warm: '#FDF7E7'
        },
        ivory: {
          DEFAULT: '#FAF7F0',
          pure: '#FFFFFF',
          dark: '#F0EBE1'
        }
      },
      fontFamily: {
        devanagari: ['"Rozha One"', '"Martel"', 'serif'],
        yatra: ['"Yatra One"', 'cursive'],
        cinzel: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 10px 30px -5px rgba(155, 17, 30, 0.15), 0 0 20px 2px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #FAF7F0 0%, #FFFDF9 50%, #F5ECE0 100%)',
        'gold-shimmer': 'linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.1) 100%)',
      }
    },
  },
  plugins: [],
}
