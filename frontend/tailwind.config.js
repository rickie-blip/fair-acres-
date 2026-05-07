export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8B1A4A",
          50: "#fdf2f6",
          100: "#fbe8f0",
          200: "#f7d1e2",
          300: "#f0aac9",
          400: "#e47aaa",
          500: "#d4518c",
          600: "#be3070",
          700: "#a12059",
          800: "#8B1A4A",
          900: "#701539",
        },
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif","Inter"],
      },
    },
  },
  plugins: [],
};
