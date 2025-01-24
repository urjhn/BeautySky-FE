/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color:{
        primary: "#6BBCFE",
        secondary: "#248ce0",
      },
      container:{
        center: true,
        padding:{
          default: "10rem",
          sm: "20rem",
        }
      },
    },
  },
  plugins: [],
}