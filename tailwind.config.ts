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
          accent: "#06b6d4",
          muted: "#94a3b8",
        },
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(250%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
