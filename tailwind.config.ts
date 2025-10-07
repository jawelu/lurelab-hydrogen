
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
      colors: {
        brand: {
          navy: '#1A2A3A',
          cream: '#F5F2EA',
          gold: '#C3A343',
          gray: '#8C8C8C'
        }
      },
      // fontFamily: {
      //   playfair: ['Playfair Display', 'serif'],
      //   source: ["Source Sans 3", "sans-serif"]
      // }
    
  }
}

