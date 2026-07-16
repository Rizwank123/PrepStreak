/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec1ff',
          400: '#599dff',
          500: '#3479fb',
          600: '#1f5af0',
          700: '#1746dc',
          800: '#193ab2',
          900: '#1a358c',
        },
        ember: {
          400: '#ff9d4d',
          500: '#ff7a1a',
          600: '#e85d04',
        },
      },
    },
  },
  plugins: [],
};
