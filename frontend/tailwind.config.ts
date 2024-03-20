import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DDEDC9",
        secondary: "#438D3F",
        highlight: "#C5E1A5",
        border: "#245D23",
        borderLight: "#CCffCC",
      },
    },
  },
};
export default config;
