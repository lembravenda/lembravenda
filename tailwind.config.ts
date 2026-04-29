import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fbfaf8",
        foreground: "#201f1d",
        muted: "#f0eeea",
        border: "#ded9d1",
        primary: "#0f766e",
        "primary-foreground": "#ffffff",
        accent: "#c2410c"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(32, 31, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
