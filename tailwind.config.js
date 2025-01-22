/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0A0F1C',
          800: '#141B2D',
          700: '#1F2937',
          600: '#374151',
        },
        accent: {
          primary: '#6366F1',
          secondary: '#818CF8',
          success: '#10B981',
          danger: '#EF4444',
        },
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 0 rgba(99, 102, 241, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};