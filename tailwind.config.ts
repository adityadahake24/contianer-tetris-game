import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        "terminal-green": "#00ff41",
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
