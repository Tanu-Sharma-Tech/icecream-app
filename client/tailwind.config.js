/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#F97316',
        secondary: '#FBBF24',
        accent:    '#EC4899',
        dark:      '#1F2937',
        light:     '#FFF8F0',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'bounce-slow':'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        }
      },
      boxShadow: {
        'soft':   '0 2px 15px rgba(0,0,0,0.06)',
        'medium': '0 4px 25px rgba(0,0,0,0.10)',
        'hard':   '0 8px 40px rgba(0,0,0,0.15)',
        'glow':   '0 0 20px rgba(249,115,22,0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}