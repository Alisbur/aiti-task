/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "button-bg": "#242EDB",
        checked: "#3C538E",
        "page-bg": "#F9F9F9",
        "section-bg": "#FFF",
        "pagination-active": "#F9F9F9",
        "pagination-border": "#B2B3B9",
        "text-primary": "#000",
        "text-secondary": "#C4C4C4",
        // "text-secondary": "#D9D9D9",
        "text-accent": "#F11010",
      },
    },
  },
  plugins: [],
};
