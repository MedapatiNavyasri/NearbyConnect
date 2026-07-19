/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#232019',
        paper: '#F7F3E9',
        card: '#FFFFFF',
        line: '#E7DEC6',
        primary: {
          DEFAULT: '#1F4F46',
          dark: '#123531',
          light: '#2E6B5F',
        },
        accent: {
          DEFAULT: '#E8A33D',
          dark: '#C67F1E',
          light: '#F4C374',
        },
        terracotta: {
          DEFAULT: '#C1502E',
          dark: '#9C3D21',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(35, 32, 25, 0.08)',
        card: '0 2px 12px rgba(35, 32, 25, 0.10)',
        lift: '0 12px 30px rgba(35, 32, 25, 0.16)',
      },
      backgroundImage: {
        'grain': "radial-gradient(rgba(35,32,25,0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grain-size': '18px 18px',
      },
    },
  },
  plugins: [],
}
