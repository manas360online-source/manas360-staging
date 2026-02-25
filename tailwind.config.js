/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './frontend/main-app/index.html',
    './frontend/main-app/{components,src}/**/*.{js,ts,jsx,tsx}',
    './frontend/apps/**/*.{js,ts,jsx,tsx}',
  ],
  // Use 'class' strategy for manual theme control
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'wellness-bg': '#FDFCF8',
        'wellness-slate': '#000000',
        'wellness-text': '#1A1A1A',
        'wellness-blue': '#1FA2DE',
        'wellness-highlight': '#0A4E89',
        'wellness-light-blue': '#E0F2FE',
        'wellness-accent': '#38BDF8',
      },
      fontFamily: {
        serif: ['"Crimson Pro"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 8s infinite ease-in-out',
        'float': 'float 20s infinite ease-in-out',
        'fade-in': 'fadeIn 1.5s ease-out',
        'fade-in-down': 'fadeInDown 1.2s ease-out',
        'fade-in-up': 'fadeInUp 1.2s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.01)', opacity: '0.95' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -15px)' },
          '50%': { transform: 'translate(-5px, -25px)' },
          '75%': { transform: 'translate(-10px, -10px)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
