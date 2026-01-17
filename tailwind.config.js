/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./views/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // I recommend naming it 'primary' or 'seedica'
        // This is the green-600 hex code:
        seedica: {
          DEFAULT: "#16a34a",
          dark: "#15803d", // This is green-700 (for hovers)
          light: "#dcfce7", // This is green-100 (for backgrounds/accents)
        },
      },
    },
  },
  plugins: [],
};
