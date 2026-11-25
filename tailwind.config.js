/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: '#F7E4E1',
          50: '#FDF7F6',
          100: '#F7E4E1',
          200: '#ECCBC6',
        },
        cream: {
          DEFAULT: '#FFF8F3',
          50: '#FFFFFF',
          100: '#FFF8F3',
          200: '#FAECE1',
        },
        rose: {
          DEFAULT: '#E8B4B8',
          light: '#F4D4D7',
          dark: '#CF8E94',
        },
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E7CB84',
          shimmer: '#F1D98B',
          metallic: '#B8913A',
          dark: '#78550E',
        },
        lavender: {
          DEFAULT: '#CFC3DD',
          light: '#E5DEF0',
          dark: '#B0A0C4',
        },
        sky: {
          DEFAULT: '#BFD3EA',
          light: '#DEE9F5',
          dark: '#93B3D9',
        },
        taupe: {
          DEFAULT: '#8A7468',
          light: '#A89489',
          dark: '#58463D',
        },
      },
      fontFamily: {
        cairo: ['"Cairo"', 'sans-serif'],
        amiri: ['"Amiri"', 'serif', '"Traditional Arabic"'],
        ruqaa: ['"Aref Ruqaa"', '"Amiri"', 'serif'],
        script: ['"Pinyon Script"', '"Great Vibes"', 'cursive'],
        vibes: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif', 'Georgia'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        'tracked': '0.3em',
        'loose-tracked': '0.35em',
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #B8913A 0%, #F1D98B 50%, #B8913A 100%)',
        'gold-metallic-soft': 'linear-gradient(135deg, #C9A24B 0%, #F1D98B 45%, #C9A24B 100%)',
        'blush-glow': 'radial-gradient(circle at 50% 50%, #FFF8F3 0%, #F7E4E1 60%, #E8B4B8 100%)',
      },
      borderRadius: {
        'arch': '180px 180px 12px 12px',
        'arch-top': '180px 180px 0 0',
        'arch-sm': '120px 120px 8px 8px',
      },
      boxShadow: {
        'paper': '0 10px 30px -10px rgba(138, 116, 104, 0.12), 0 2px 8px -2px rgba(138, 116, 104, 0.08)',
        'gold-glow': '0 0 25px rgba(201, 162, 75, 0.22)',
        'soft-float': '0 20px 40px -15px rgba(138, 116, 104, 0.18)',
      },
      transitionTimingFunction: {
        'reveal': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
