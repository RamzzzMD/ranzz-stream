import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist Dark Palette
        background: '#09090b',
        surface: {
          DEFAULT: '#121215',
          subtle: '#18181b',
          elevated: '#202024',
          high: '#27272a',
        },
        brand: {
          DEFAULT: '#e50914',
          hover: '#dc2626',
          subtle: 'rgba(229, 9, 20, 0.12)',
        },
        primary: {
          DEFAULT: '#e50914',
          hover: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        minimal: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        elevated: '0 10px 30px -4px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};

export default config;