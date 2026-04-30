import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette — unchanged semantics, refined values
        background: "#F5F0E8",
        foreground: "#0F0D0B",
        muted: "#EDE7DC",
        surface: "#FFFFFF",
        "surface-warm": "#FAF7F2",
        border: "#E6E0D6",
        "border-strong": "#CAC4BA",
        primary: "#1A5C3E",
        "primary-dark": "#134830",
        "primary-light": "#E4F2EC",
        "primary-lighter": "#EFF9F4",
        "primary-foreground": "#ffffff",
        accent: "#C4621A",
        "accent-light": "#FFF0E0",
        "accent-subtle": "#FEF7EE",
        success: "#187A48",
        danger: "#B03020",
        warning: "#985416",
        urgent: "#A24014",
        neutral: "#68625C",
        "text-secondary": "#564E48",
        "text-tertiary": "#887F78"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15,13,11,0.05)",
        sm: "0 2px 8px rgba(15,13,11,0.07), 0 1px 2px rgba(15,13,11,0.04)",
        md: "0 4px 16px rgba(15,13,11,0.09), 0 2px 4px rgba(15,13,11,0.05)",
        lg: "0 8px 32px rgba(15,13,11,0.11), 0 2px 8px rgba(15,13,11,0.05)",
        xl: "0 16px 48px rgba(15,13,11,0.13), 0 4px 12px rgba(15,13,11,0.06)",
        "2xl": "0 24px 72px rgba(15,13,11,0.15), 0 8px 20px rgba(15,13,11,0.07)",
        "green-sm": "0 4px 16px rgba(26,92,62,0.18), 0 1px 4px rgba(26,92,62,0.12)",
        "green-md": "0 8px 32px rgba(26,92,62,0.22), 0 2px 8px rgba(26,92,62,0.14)",
        "green-lg": "0 20px 60px rgba(26,92,62,0.26), 0 4px 16px rgba(26,92,62,0.16)",
        phone: "0 40px 100px rgba(15,13,11,0.25), 0 12px 32px rgba(15,13,11,0.14)",
        soft: "0 4px 16px rgba(15,13,11,0.09), 0 2px 4px rgba(15,13,11,0.05)",
        card: "0 4px 16px rgba(15,13,11,0.09), 0 2px 4px rgba(15,13,11,0.05)",
        lift: "0 16px 48px rgba(26,92,62,0.20), 0 4px 12px rgba(26,92,62,0.12)"
      },
      borderRadius: {
        xs: "0.375rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
        "4xl": "3rem",
        phone: "2.5rem"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(26,92,62,0.12) 0%, transparent 60%)",
        "accent-glow":
          "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(196,98,26,0.08) 0%, transparent 70%)",
        "green-section":
          "linear-gradient(135deg, #1A5C3E 0%, #134830 100%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards"
      }
    }
  },
  plugins: []
};

export default config;
