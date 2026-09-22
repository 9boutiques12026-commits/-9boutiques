import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef7f1",
          100: "#d9ebdf",
          200: "#bddcc7",
          300: "#9ec7ad",
          400: "#6aaa82",
          500: "#3f845f",
          600: "#2e6c4d",
          700: "#234c38",
          800: "#16392b",
          900: "#0d231b",
        },
        ivory: {
          50: "#fdfaf6",
          100: "#f7f0e8",
          200: "#f2e9dd",
          300: "#e6d6bf",
          400: "#d9b98d",
        },
        gold: {
          400: "#c9a86b",
          500: "#b8904a",
        },
        warm: {
          900: "#2b2018",
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 18px 48px rgba(15, 35, 28, 0.12)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
