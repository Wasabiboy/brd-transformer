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
      },
      colors: {
        slate: {
          850: "#172033",
          950: "#0d1321",
        },
      },
    },
  },
  plugins: [],
};
export default config;
