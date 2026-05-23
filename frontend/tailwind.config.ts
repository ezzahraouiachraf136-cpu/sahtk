import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7A3E5C",
          dark: "#5E2F47",
          light: "#F3E8EE",
          muted: "#6B6565",
          gold: "#C9A962",
          alert: "#B84C3A",
          bg: "#FBF8F5",
        },
      },
      fontFamily: {
        heading: ["var(--font-tajawal)", "sans-serif"],
        body: ["var(--font-cairo)", "sans-serif"],
        latin: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
