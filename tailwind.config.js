module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2D6A4F',
        accent: '#FFD166', 
        secondary: '#8B5E3C',
        background: '#F8F5E4',
        white: '#FFFFFF',
        gray: {
          100: '#F7FAFC',
          200: '#EDF2F7',
          300: '#E2E8F0',
          400: '#CBD5E0',
          500: '#A0AEC0',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
        }
      },
      fontFamily: {
        'poppins': ['Poppins'],
        'nunito': ['Nunito Sans'],
      }
    },
  },
  plugins: [],
}