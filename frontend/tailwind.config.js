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
          bg: '#10112a',
          card: 'rgba(255,255,255,0.06)',
          border: 'rgba(139,92,246,0.18)',
          accent: '#a78bfa',
          accent2: '#f59e0b',
          muted: '#9ca3af',
          input: '#1e1f3a',
          select: '#1e1f3a',
        },
      },
    },
  },
  plugins: [],
};
