import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "sans-serif"],
        display: ["system-ui", "Segoe UI", "sans-serif"],
      },
      colors: {
        rilo: {
          bg: "#0f0f0f",
          card: "#1a1a1a",
          border: "#2a2a2a",
          accent: "#d4a574",
          muted: "#78716c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
