/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hockey: {
          'verde-oscuro': '#1B5E20',
          'verde-medio': '#2E7D32',
          'verde-claro': '#4CAF50',
          'amarillo': '#FFC107',
          'rojo': '#D32F2F',
          'gris-claro': '#FAFAFA',
          'gris-oscuro': '#424242',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2' }],
        'h2': ['24px', { lineHeight: '1.2' }],
        'h3': ['18px', { lineHeight: '1.2' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'button': ['14px', { lineHeight: '1.4' }],
        'caption': ['12px', { lineHeight: '1.4' }],
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.4',
        relaxed: '1.5',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      }
    },
  },
  plugins: [],
}
