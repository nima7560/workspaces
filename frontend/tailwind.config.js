// module.exports = {
//   content: [
//     "./src/**/*.{html,js,jsx,ts,tsx}", // This ensures Tailwind CSS will be applied to JSX files
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'hammer-slow': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-15deg)' },
          '30%': { transform: 'rotate(5deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '70%': { transform: 'rotate(2deg)' },
          '90%': { transform: 'rotate(-5deg)' },
        },
        'weighing': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'clock-hands': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }, // Continuous rotation
        },
      },
      animation: {
        'hammer-slow': 'hammer-slow 2s ease-in-out infinite',
        'weighing': 'weighing 1.5s ease-in-out infinite',
        'clock-hands': 'clock-hands 5s linear infinite',
      },
    },
  },
  plugins: [],
};