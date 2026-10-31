/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#101114',
          surface: '#181A20',
          card: '#1D2028',
          hover: '#252934',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.15)',
        },
        accent: {
          navy: '#1E3A8A',
          blue: '#38BDF8',
          cinematic: '#0284C7',
          orange: '#F97316',
          amber: '#F59E0B',
          purple: '#A855F7',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Lato', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
