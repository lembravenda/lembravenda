import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ─── Neutrals — Pedra Quente (Calor Profissional 2026)
        background: "#F5F0E8",
        foreground: "#1A1A1A",
        muted: "#EDE8DF",
        surface: "#FFFFFF",
        "surface-raised": "#FAF8F4",
        border: "#DDD8CE",
        "border-strong": "#C4BEAF",

        // ─── Primary — Verde Floresta #2E7D57
        primary: "#2E7D57",
        "primary-dark": "#1A5C3E",
        "primary-light": "#EAF4EF",
        "primary-lighter": "#F3FAF6",
        "primary-foreground": "#ffffff",

        // ─── Amber — Âmbar #F5A623 (CTA principal)
        amber: "#F5A623",
        "amber-dark": "#D4881A",
        "amber-light": "#FFF8E7",
        "amber-foreground": "#1A1A1A",

        // ─── Accent — legado mantido (alias amber)
        accent: "#F5A623",
        "accent-light": "#FFF8E7",
        "accent-subtle": "#FEFAF0",

        // ─── Semânticos — 2026
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#D97706",
        urgent: "#C2410C",
        neutral: "#71717A",

        // ─── Texto
        "text-secondary": "#6B7280",
        "text-tertiary": "#9CA3AF"
      },

      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
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
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(46,125,87,0.10) 0%, transparent 60%)",
        "accent-glow":
          "radial-gradient(ellipse 50% 35% at 80% 15%, rgba(245,166,35,0.08) 0%, transparent 55%)",
        "green-section":
          "linear-gradient(135deg, #2E7D57 0%, #1A5C3E 55%, #134830 100%)",
        "amber-section":
          "linear-gradient(135deg, #F5A623 0%, #D4881A 100%)"
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
