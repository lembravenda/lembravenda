# Design System v2 — Brief Concreto (Abril 2026)

> Pesquisa realizada em abril de 2026. Fontes: análise de concorrentes reais, NN/G, Muzli, DesignMonks, tendências iOS 26 Liquid Glass, Linear, Revolut.

---

## 1. Contexto crítico de abril 2026

### iOS 26 Liquid Glass (Apple, junho 2025 → lançado 2026)
Apple introduziu um novo sistema de design chamado **Liquid Glass**: elementos translúcidos que flutuam sobre o conteúdo, refrações, blur adaptativo em navbars, modals e tab bars. Está influenciando toda a indústria mobile agora.

**O que adotar do Liquid Glass:**
- `backdrop-blur` em navbar, header, modais — elementos flutuam sobre o conteúdo
- Tab bar com fundo translúcido (já temos, precisa refinamento)
- Cards com leve elevação visual, não flat

**O que NÃO adotar (fonte: NN/G, abril 2026):**
- Blur excessivo em conteúdo primário — prejudica legibilidade
- Efeitos de refração — distrai em app de produtividade
- Skeuomorphismo full — não é o objetivo

### Tipografia 2026
- **Inter Variable** domina SaaS/produtividade — padrão confirmado
- **Variable fonts** são infraestrutura obrigatória em 2026 (um arquivo, não 12)
- **Pesos extremos** são o diferencial tipográfico: `font-weight: 700–800` nos headings com `letter-spacing: -0.03em`
- `font-optical-sizing: auto` para ajuste automático por tamanho

### Padrões visuais consolidados em 2026
- Fundo branco puro ou off-white neutro (não warm/amarelado)
- Bold typography como "hero image" — tipografia é identidade
- Glassmorphism cirúrgico: só em elementos flutuantes
- Micro-interações semânticas (confirmam estado, não decoram)
- Bottom nav com ícones sólidos no estado ativo

### Referência Revolut (gold standard 2026 para fintech/micro negócios)
- Fundo branco limpo, zero warm tone
- Headlines numéricas em `font-weight: 700+`, tamanho grande
- Color-coded por categoria com animações suaves
- Navegação layered com profundidade real
- Densidade controlada: muito dado, sem sensação de lotação

---

## 2. Diagnóstico do design atual

| Problema | Causa | Impacto |
|---|---|---|
| Background `#F5F0E8` warm | Parece artesanato/kraft, não SaaS | Alto |
| Tipografia uniforme | Sem hierarquia de peso | Alto |
| Raios inconsistentes | 8 valores sem critério claro | Médio |
| Ícones nav outline finos | `strokeWidth 1.6` em 18px é frágil | Médio |
| Botões 44px | Limite mínimo iOS HIG | Médio |
| Zero skeleton/loading | Transições abruptas | Médio |
| Cards sem camada visual | Todos no mesmo peso visual | Médio |

---

## 3. Spec Técnica — Design System v2

### 3.1 Paleta de Cores

```css
/* BACKGROUND — neutro quase branco, levíssimo warm (não kraft) */
--background:     #F8F7F5;   /* off-white warm neutro — 2026 standard */
--surface:        #FFFFFF;
--surface-raised: #FAFAF9;   /* cards, inputs sobre background */
--muted:          #F1F0EE;   /* áreas de contraste suave */

/* TEXTO — contraste forte, clean */
--foreground:     #111110;   /* quase preto warm — não puro #000 */
--text-secondary: #6B6560;   /* cinza warm legível */
--text-tertiary:  #9B9590;   /* placeholders, meta */

/* BORDERS */
--border:         #E2E0DD;
--border-strong:  #C8C5C0;

/* PRIMARY — verde mantido, levemente ajustado */
--primary:        #1A5C3E;
--primary-dark:   #134830;
--primary-light:  #EBF5F0;
--primary-lighter: #F3FAF6;

/* ACCENT */
--accent:         #C4621A;
--accent-subtle:  #FEF7EE;

/* SEMÂNTICOS */
--success:        #16A34A;   /* verde mais vivo */
--warning:        #B45309;
--danger:         #DC2626;   /* vermelho padrão */
--urgent:         #C2410C;
--neutral:        #71717A;
```

### 3.2 Tipografia — Inter Variable

```css
/* Font setup */
font-family: 'Inter var', 'Inter', system-ui, sans-serif;
font-optical-sizing: auto;
-webkit-font-smoothing: antialiased;

/* Scale */
--text-xs:   0.75rem;    /* 12px — caption, eyebrow */
--text-sm:   0.8125rem;  /* 13px — body small */
--text-base: 0.875rem;   /* 14px — body padrão */
--text-md:   0.9375rem;  /* 15px — item title */
--text-lg:   1.0625rem;  /* 17px — section heading */
--text-xl:   1.25rem;    /* 20px — page heading */
--text-2xl:  1.5rem;     /* 24px — hero heading */
--text-3xl:  1.875rem;   /* 30px — display */

/* Pesos usados */
400 — corpo de texto longo
500 — body medium
600 — item title, botões, labels importantes
700 — page heading, section heading
800 — números de destaque, hero numbers

/* Tracking */
headings 20px+:   -0.025em a -0.035em
body 14-16px:     -0.01em
uppercase labels: 0.08em a 0.12em
```

### 3.3 Border Radius — 4 valores, não 8

```
sm:   6px    — badges, tags, chips
md:   10px   — inputs, botões, list items
lg:   14px   — cards principais
xl:   20px   — cards hero, modais
full: 9999px — pills, avatares, indicadores
```

Regra clara: componente pequeno → `sm/md`, card → `lg`, overlay → `xl`.

### 3.4 Sombras — Liquid Glass philosophy

```css
/* Sombras minimalistas + border define hierarquia */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
--shadow-lg: 0 8px 16px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);

/* Elemento flutuante (nav, header) — Liquid Glass inspired */
--shadow-float: 0 -1px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06);

/* Green glow — apenas para CTA hero */
--shadow-green: 0 8px 24px rgba(26,92,62,0.20), 0 2px 8px rgba(26,92,62,0.12);
```

### 3.5 Espaçamento — 4px grid

```
Gap entre cards:           12px (gap-3)
Padding interno de card:   20px (p-5)
Gap entre seções:          24px (space-y-6)
Padding lateral de página: 16px (px-4)
Altura de botão primário:  48px (h-12)
Altura de input:           48px (h-12)
Alvo mínimo de toque:      44px
```

### 3.6 Liquid Glass — Bottom Nav e Header

```css
/* Bottom Navigation — Liquid Glass inspired */
background: rgba(255,255,255,0.85);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border-top: 1px solid rgba(0,0,0,0.06);
box-shadow: 0 -1px 0 rgba(0,0,0,0.04);

/* Header */
background: rgba(248,247,245,0.9);
backdrop-filter: blur(16px) saturate(160%);
border-bottom: 1px solid rgba(0,0,0,0.06);
```

---

## 4. Componentes — Spec de Delta

### Bottom Navigation (maior impacto visual)
```
ANTES: ícones outline 18px, pill pequeno, bg solid
DEPOIS:
- Fundo: translúcido backdrop-blur (Liquid Glass)
- Ícone ATIVO: filled/solid, cor primary
- Ícone INATIVO: outline, cor text-tertiary
- Pill ativo: rounded-full, w-14 h-7, bg primary/10
- Label ativo: font-semibold text-primary text-[10px]
- strokeWidth: 2.0 (outline) / solid fill (ativo)
- Altura total: 64px + safe-area
```

### AppCard
```
ANTES: border + shadow-card + background warm
DEPOIS:
- background: #FFFFFF (surface)
- border: 1px solid #E2E0DD
- shadow: shadow-sm (sutil)
- radius: rounded-[14px]
- padding: p-5 (20px) único
```

### Botão Primário
```
ANTES: min-h-11 (44px), radius var(--lv-radius-button)
DEPOIS:
- height: h-12 (48px)
- radius: rounded-[10px]
- font: text-[0.9375rem] font-semibold tracking-[-0.01em]
- shadow: shadow-green (apenas primário)
- active: scale(0.98)
- hover: translateY(-1px) + shadow-green intensificada
```

### StatusBadge
```
MANTER estrutura com dot
AJUSTAR:
- min-height: 24px (não 28px)
- font-size: 11px
- dot: 5px
- padding: px-2 py-0.5
```

### AppHeader
```
ANTES: backdrop-blur-md, border-b border-border/70, bg-background/95
DEPOIS (Liquid Glass):
- bg: rgba(248,247,245,0.88)
- backdrop-filter: blur(20px) saturate(180%)
- border-b: 1px solid rgba(0,0,0,0.06)
- no shadow — border faz o trabalho
```

### Inputs / Forms
```
ANTES: rounded-xl misturado
DEPOIS:
- rounded-[10px] (md) — todos os inputs
- border: 1px solid #E2E0DD
- focus: border-primary + ring-2 ring-primary/10
- height: min-h-12 (48px) para input linha única
- background: surface (#FFFFFF) — não muted
```

---

## 5. O que NÃO muda

- Cor primary `#1A5C3E` — correta, mantida
- Accent `#C4621A` — funciona
- Estrutura de componentes e rotas
- Font Inter — mantida (Inter Variable é evolução)
- Semântica dos tokens (nomes mantidos, valores atualizados)

---

## 6. Ordem de implementação

1. `tailwind.config.ts` — tokens de cor, radius, sombra
2. `globals.css` — CSS vars + componentes `.lv-*` + Liquid Glass classes
3. `app-shell.tsx` — bottom nav Liquid Glass + ícones solid/outline
4. `ui.tsx` — todos os componentes com novos tokens
5. Páginas de app — aplicar tokens consistentemente
