/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
