/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "bg-requirements": "url('/public/bg-requirements3.jpg')",
      },
    },
  },
  plugins: [],
};
