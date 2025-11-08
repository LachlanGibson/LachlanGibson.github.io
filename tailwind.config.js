/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        md2: "740px",
        sm2: "500px",
      },
    },
  },
  plugins: [],
};
