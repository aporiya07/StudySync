/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ss: {
          bg: '#0c1220',
          card: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          accent: '#5eead4',
          accent2: '#818cf8',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
};
