import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F0E8",
        foreground: "#111827",
        muted: "#F8F3EC",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        primary: "#2E7D57",
        "primary-dark": "#1A5C40",
        "primary-light": "#EAF4EF",
        "primary-foreground": "#ffffff",
        accent: "#F5A623",
        "accent-light": "#FFF9E6",
        success: "#16A34A",
        danger: "#DC2626",
        "text-secondary": "#6B7280"
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
