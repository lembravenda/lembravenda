import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ─── Neutrals — off-white neutro, não warm-craft (abril 2026)
        background: "#F8F7F5",
        foreground: "#111110",
        muted: "#F1F0EE",
        surface: "#FFFFFF",
        "surface-raised": "#FAFAF9",
        border: "#E2E0DD",
        "border-strong": "#C8C5C0",

        // ─── Primary — verde mantido
        primary: "#1A5C3E",
        "primary-dark": "#134830",
        "primary-light": "#EBF5F0",
        "primary-lighter": "#F3FAF6",
        "primary-foreground": "#ffffff",

        // ─── Accent — laranja atenção
        accent: "#C4621A",
        "accent-light": "#FFF0E0",
        "accent-subtle": "#FEF7EE",

        // ─── Semânticos — valores 2026
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#B45309",
        urgent: "#C2410C",
        neutral: "#71717A",

        // ─── Texto
        "text-secondary": "#6B6560",
        "text-tertiary": "#9B9590"
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Inter var", "Inter", "system-ui", "sans-serif"]
      },

      fontSize: {
        // Escala precisa — cada tamanho tem propósito claro
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],           // 11px — eyebrow, badge
        xs:   ["0.75rem",   { lineHeight: "1.125rem" }],        // 12px — caption
        sm:   ["0.8125rem", { lineHeight: "1.25rem" }],         // 13px — body small
        base: ["0.875rem",  { lineHeight: "1.375rem" }],        // 14px — body padrão
        md:   ["0.9375rem", { lineHeight: "1.5rem" }],          // 15px — item title
        lg:   ["1.0625rem", { lineHeight: "1.625rem" }],        // 17px — section heading
        xl:   ["1.25rem",   { lineHeight: "1.75rem" }],         // 20px — page heading
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],            // 24px — hero small
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],         // 30px — hero
        "4xl": ["2.25rem",  { lineHeight: "2.625rem" }]         // 36px — display
      },

      boxShadow: {
        // ─── Sombras Liquid Glass philosophy — sutis, border faz o trabalho
        xs:  "0 1px 2px rgba(0,0,0,0.05)",
        sm:  "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        md:  "0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        lg:  "0 8px 16px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
        xl:  "0 16px 32px rgba(0,0,0,0.10), 0 8px 12px rgba(0,0,0,0.05)",

        // Elemento flutuante — nav, header (Liquid Glass)
        float: "0 -1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.05)",

        // Green glow — apenas CTAs hero
        "green-sm": "0 4px 12px rgba(26,92,62,0.16), 0 1px 4px rgba(26,92,62,0.10)",
        "green-md": "0 8px 24px rgba(26,92,62,0.20), 0 2px 8px rgba(26,92,62,0.12)",
        "green-lg": "0 16px 40px rgba(26,92,62,0.24), 0 4px 12px rgba(26,92,62,0.14)",

        // Phone mockup landing
        phone: "0 40px 80px rgba(0,0,0,0.20), 0 12px 28px rgba(0,0,0,0.12)",

        // Legacy aliases mantidos para compatibilidade
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        soft: "0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        lift: "0 16px 40px rgba(26,92,62,0.20), 0 4px 12px rgba(26,92,62,0.12)"
      },

      borderRadius: {
        // ─── 5 valores com regra clara — não 8 valores sem critério
        sm:   "0.375rem",  // 6px  — badges, tags, chips
        md:   "0.625rem",  // 10px — inputs, botões, list items
        lg:   "0.875rem",  // 14px — cards principais
        xl:   "1.25rem",   // 20px — cards hero, modais, drawers
        "2xl": "1.75rem",  // 28px — full sections
        "3xl": "2rem",     // 32px — elementos especiais
        phone: "2.5rem",   // 40px — mockup de celular
        full: "9999px"     // pills, avatares, indicadores
      },

      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26,92,62,0.10) 0%, transparent 60%)",
        "accent-glow":
          "radial-gradient(ellipse 50% 35% at 80% 15%, rgba(196,98,26,0.06) 0%, transparent 55%)",
        "green-section":
          "linear-gradient(135deg, #1A5C3E 0%, #134830 55%, #0E3525 100%)"
      },

      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },

      animation: {
        "fade-up":   "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":   "fade-in 0.3s ease forwards",
        "scale-in":  "scale-in 0.25s cubic-bezier(0.16,1,0.3,1) forwards"
      }
    }
  },
  plugins: []
};

export default config;
