/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { mono: ["JetBrains Mono", "monospace"], sans: ["Inter", "sans-serif"] },
      boxShadow: { neon: "0 0 35px rgba(38, 240, 255, .16)" },
    },
  },
  plugins: [],
};
