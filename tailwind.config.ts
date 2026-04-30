import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F4EFE6",
        foreground: "#1A1714",
        muted: "#F7F2EA",
        surface: "#FFFFFF",
        border: "#E2DDD6",
        "border-strong": "#C8C2BA",
        primary: "#1D6348",
        "primary-dark": "#165438",
        "primary-light": "#E8F5EE",
        "primary-lighter": "#F0FAF4",
        "primary-foreground": "#ffffff",
        accent: "#C96B1A",
        "accent-light": "#FFF0E0",
        "accent-subtle": "#FEF7EE",
        success: "#1F8A57",
        danger: "#B9382A",
        warning: "#A15B18",
        urgent: "#AD4B17",
        neutral: "#6C655F",
        "text-secondary": "#5C5650",
        "text-tertiary": "#8C8680"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(17, 24, 39, 0.08)",
        card: "0 16px 40px rgba(17, 24, 39, 0.08)",
        lift: "0 20px 60px rgba(26, 92, 64, 0.14)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
