/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },

        wiperLeft: {
          '0%, 100%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-10deg)' },
        },
        wiperRight: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
      animation: {
        slideInLeft: 'slideInLeft 1s ease forwards',
        slideInRight: 'slideInRight 1s ease forwards',
        'rotate-wiper-left': 'wiperLeft 1s ease-in-out infinite',
        'rotate-wiper-right': 'wiperRight 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
