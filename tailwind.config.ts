import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        cream: "#F5F0E8",
        ink: "#1A1814",
        gold: "#C9A96E",
        muted: "#8A8278",
        border: "#DDD8CE",
      },
    },
  },
  plugins: [],
};

export default config;
