import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        forest: "#1a2e1a",
        jungle: "#2d4a2d",
        leaf: "#4a7c4a",
        sage: "#8ab88a",
        mist: "#f0f5f0",
        cream: "#faf8f3",
        gold: "#c9922a",
        "gold-light": "#e8b84b",
        saffron: "#e85d04",
      },
    },
  },
  plugins: [],
};

export default config;
