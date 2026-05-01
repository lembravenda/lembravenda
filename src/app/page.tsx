import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { getAuthState } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "LembraVenda — Para quem vende de verdade.",
  description:
    "Organize clientes, pedidos e cobranças pelo WhatsApp. A agenda de vendas que avisa você antes de perder dinheiro."
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Phone Mockup — Cobranças screen ─────────────────────────────────────────

function PhoneMockupCobrancas() {
  const cobrancas = [
    { nome: "Marcos Oliveira", valor: "R$ 98,00", dias: "39 dias em atraso", initials: "MO", cor: "#C2410C", bgCor: "#FEF7EE" },
    { nome: "Patrícia Lima", valor: "R$ 45,00", dias: "12 dias em atraso", initials: "PL", cor: "#D97706", bgCor: "#FFFBEB" },
    { nome: "Renata Souza", valor: "R$ 122,00", dias: "5 dias em atraso", initials: "RS", cor: "#2E7D57", bgCor: "#F3FAF6" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[290px]">
      {/* ambient glow */}
      <div className="absolute -inset-10 rounded-[3.5rem] bg-primary/10 blur-3xl pointer-events-none" />
      {/* phone frame */}
      <div className="relative overflow-hidden bg-background border border-border/60 rounded-[2.5rem] shadow-phone">
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-6 w-20 rounded-b-2xl bg-foreground/8" />

        {/* header verde */}
        <div className="bg-primary px-5 pb-5 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Cobranças em aberto
          </p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-primary-foreground/70">Total em aberto</p>
              <p className="text-xl font-bold text-primary-foreground tracking-tight">R$ 682,00</p>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-primary-foreground">
              7 clientes
            </span>
          </div>
        </div>

        {/* lista */}
        <div className="space-y-2 bg-background p-3.5">
          {cobrancas.map((c) => (
            <div
              key={c.nome}
              className="rounded-xl border border-border bg-surface p-3"
              style={{ borderLeftWidth: 3, borderLeftColor: c.cor, background: c.bgCor }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: c.cor }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight truncate">{c.nome}</p>
                  <p className="text-[10px] text-text-tertiary">{c.dias}</p>
                </div>
                <span className="text-xs font-bold text-foreground whitespace-nowrap">{c.valor}</span>
              </div>
              {c.nome === "Marcos Oliveira" && (
                <button className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-[10px] font-bold text-white">
                  <WhatsAppIcon className="h-3 w-3" />
                  Cobrar no WhatsApp
                </button>
              )}
            </div>
          ))}
        </div>

        {/* bottom nav */}
        <div className="grid grid-cols-5 border-t border-border bg-surface px-1 py-2">
          {["Hoje", "Clientes", "Pedidos", "Cobranças", "Conta"].map((tab, i) => (
            <div
              className={`flex flex-col items-center gap-0.5 py-1 ${i === 3 ? "text-primary" : "text-text-tertiary"}`}
              key={tab}
            >
              <div className={`h-1 w-1 rounded-full ${i === 3 ? "bg-primary" : "bg-transparent"}`} />
              <span className="text-[7px] font-medium leading-tight text-center">{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Phone Mockup — Hoje screen (for Solution section) ───────────────────────

function PhoneMockupHoje() {
  const cards = [
    { tipo: "Cobrar", nome: "Camila Rosa", detalhe: "R$ 89,90 · 3 dias", urgente: true },
    { tipo: "Entregar", nome: "Juliana Lima", detalhe: "Kit revenda pronto", success: true },
    { tipo: "Chamar de novo", nome: "Bruna Melo", detalhe: "Hidratante · 30 dias", neutral: true },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[265px]">
      <div className="absolute -inset-8 rounded-[3.5rem] bg-white/10 blur-3xl pointer-events-none" />
      <div className="relative overflow-hidden bg-[#F5F0E8] border border-white/20 rounded-[2.2rem] shadow-lg">
        <div className="bg-primary/90 px-5 pb-4 pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Hoje · qui, 30 abr
          </p>
          <div className="mt-1.5 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-primary-foreground">O que fazer agora</h3>
              <p className="text-[10px] text-primary-foreground/75">3 prioridades para hoje</p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-primary-foreground">3</span>
          </div>
        </div>

        <div className="space-y-2 bg-[#F5F0E8] p-3">
          {cards.map((c) => (
            <div
              key={c.tipo}
              className={`flex items-center justify-between rounded-[10px] border px-3 py-2.5 ${
                c.urgente ? "border-l-[3px] border-l-urgent border-border bg-[#FEF7EE]"
                : c.success ? "border-l-[3px] border-l-success border-border bg-[#F3FAF6]"
                : "border-border bg-surface"
              }`}
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">{c.tipo}</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{c.nome}</p>
                <p className="text-[10px] text-text-secondary">{c.detalhe}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                c.urgente ? "bg-amber-light text-amber" : c.success ? "bg-primary-light text-primary" : "bg-muted text-text-secondary"
              }`}>Hoje</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 border-t border-border bg-surface px-1 py-2">
          {["Hoje", "Clientes", "Pedidos", "Cobranças", "Conta"].map((tab, i) => (
            <div
              className={`flex flex-col items-center gap-0.5 py-1 ${i === 0 ? "text-primary" : "text-text-tertiary"}`}
              key={tab}
            >
              <div className={`h-1 w-1 rounded-full ${i === 0 ? "bg-primary" : "bg-transparent"}`} />
              <span className="text-[7px] font-medium leading-tight text-center">{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-10">
          <BrandLogo href="/" />
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 text-sm font-medium text-text-secondary md:flex"
          >
            <Link className="transition hover:text-foreground" href="#como-funciona">Como funciona</Link>
            <Link className="transition hover:text-foreground" href="#para-quem-e">Para quem é</Link>
            <Link className="transition hover:text-foreground" href="#preco">Preço</Link>
          </nav>
          <Link
            className="lv-button-primary px-5 py-2 text-sm"
            href="/login"
          >
            Entrar / Criar conta
          </Link>
        </div>
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section aria-label="Apresentação" className="lv-hero-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 md:grid-cols-[1.15fr_0.85fr] md:gap-20 md:px-10 md:pb-32 md:pt-24">

          {/* copy */}
          <div>
            {/* badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-lighter px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary">
                Novo · Cobrança automática no WhatsApp
              </span>
            </div>

            {/* headline — Instrument Serif com acento italic */}
            <h1 className="mt-6 max-w-xl text-[2.5rem] leading-[1.1] tracking-[-0.025em] text-foreground md:text-[3.5rem] md:leading-[1.08]">
              <span className="font-display font-normal">Não perca mais </span>
              <span className="font-display italic text-primary">venda, cobrança</span>
              <span className="font-display font-normal"> ou cliente.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-[1.8] text-text-secondary md:text-[1.0625rem]">
              O LembraVenda mostra todo dia quem cobrar, o que entregar e quem está no momento certo para comprar de novo — pelo WhatsApp.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link className="lv-button-cta" href="/login">
                Começar grátis — sem cartão
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                className="lv-button-secondary h-[3.25rem] rounded-xl px-7 text-sm font-semibold"
                href="#como-funciona"
              >
                Ver como funciona
              </Link>
            </div>

            {/* trust signals */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Destaques">
              {[
                "Pronto em 2 minutos",
                "Sem cartão de crédito",
                "100% no celular"
              ].map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <CheckIcon className="h-2.5 w-2.5 text-primary" />
                  </span>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* hero visual — persona + mockup */}
          <div className="lv-phone-wrap flex flex-col items-center gap-6">
            <div className="relative w-[280px] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/hero.webp"
                alt="Empreendedor usando o LembraVenda no celular"
                width={280}
                height={320}
                className="w-full object-cover"
                priority
              />
            </div>
            <PhoneMockupCobrancas />
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF ──────────────────────────────────────────────── */}
      <div className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-5 md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <span className="text-xs font-medium text-text-tertiary">Usado por quem vende</span>
            {[
              { nome: "Bruna C.", cat: "Cosméticos", initials: "BC" },
              { nome: "Larissa M.", cat: "Semijoias", initials: "LM" },
              { nome: "Fernanda R.", cat: "Moda", initials: "FR" },
              { nome: "Tatiane S.", cat: "Marmitas", initials: "TS" },
              { nome: "Camila O.", cat: "Naturais", initials: "CO" },
            ].map(({ nome, cat, initials }) => (
              <div
                key={nome}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white flex-shrink-0">
                  {initials}
                </div>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{nome}</span>
                <span className="text-[10px] text-text-tertiary whitespace-nowrap">· {cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. O PROBLEMA ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="problema-title"
        className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32"
      >
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">O problema</p>
          <h2
            className="mt-4 text-3xl leading-[1.2] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
            id="problema-title"
          >
            <span className="font-display font-normal">A venda acontece. </span>
            <span className="font-display italic text-primary">O controle fica pra depois.</span>
          </h2>
          <p className="mt-4 text-base leading-[1.8] text-text-secondary">
            Quem vende pelo WhatsApp não falta em vontade. O problema é que a gestão mora na cabeça, no caderninho ou em áudio não respondido.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              eyebrow: "Clientes esquecidos",
              title: "Clientes sumidos",
              body: "Você atendeu, entregou, e a cliente desapareceu. Quem vai oferecer o próximo produto? Você, quando lembrar."
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M12 6v6l4 2M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              eyebrow: "Cobranças atrasadas",
              title: "Cobrança que some",
              body: "Você sabe que alguém devia, mas não lembra quanto, quando, e se já pediu. A dívida fica no ar — e o dinheiro também."
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              eyebrow: "Pedidos sem controle",
              title: "Entrega esquecida",
              body: "O pedido está pronto, mas quem vai avisar a cliente? Você, quando lembrar — e se lembrar antes dela se aborrecer."
            }
          ].map(({ icon, eyebrow, title, body }) => (
            <div
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md hover:border-border-strong"
              key={title}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary mb-3">{eyebrow}</p>
              <div className="lv-icon-wrap text-amber" style={{ background: "var(--lv-accent-light)" }}>
                {icon}
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-[1.75] text-text-secondary">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. A SOLUÇÃO — Tela Hoje ────────────────────────────────────── */}
      <section aria-labelledby="solucao-title" className="bg-green-section">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">

          {/* copy */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              A tela que resolve
            </p>
            <h2
              className="mt-4 text-3xl leading-[1.2] tracking-[-0.02em] text-white md:text-[2.5rem]"
              id="solucao-title"
            >
              <span className="font-display font-normal">Sua agenda do dia, </span>
              <span className="font-display italic">sempre pronta.</span>
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-white/80">
              A tela Hoje mostra exatamente o que precisa ser feito — cobrar, entregar ou chamar de novo. Sem esforço, sem adivinhação.
            </p>

            <ul className="mt-8 space-y-4" aria-label="Benefícios">
              {[
                "Cobranças em aberto com valor e dias de atraso",
                "Pedidos prontos para entregar com um toque",
                "Clientes no momento certo para recomprar"
              ].map((item) => (
                <li className="flex items-start gap-3" key={item}>
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-sm leading-[1.7] text-white/90">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              className="mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-sm font-bold text-primary transition hover:bg-primary-lighter"
              href="/login"
            >
              Criar conta grátis
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* feature image — produto em contexto real */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[300px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              <Image
                src="/images/feature.webp"
                alt="Mão segurando celular com o app LembraVenda em feira de orgânicos"
                width={300}
                height={360}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMO FUNCIONA ────────────────────────────────────────────── */}
      <section
        aria-labelledby="como-funciona-title"
        className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32"
        id="como-funciona"
      >
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">Como funciona</p>
          <h2
            className="mt-4 text-3xl leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
            id="como-funciona-title"
          >
            <span className="font-display font-normal">Pronto em </span>
            <span className="font-display italic text-primary">3 passos.</span>
          </h2>
          <p className="mt-4 text-base leading-[1.8] text-text-secondary">
            Sem onboarding longo, sem treinamento. Você configura uma vez e começa a usar no mesmo dia.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Cadastre clientes e produtos",
              body: "Coloque os contatos e os produtos que você mais vende. Leva menos de 5 minutos."
            },
            {
              num: "02",
              title: "Registre cada pedido",
              body: "Cliente, item, valor e status em um só lugar. Sem planilha, sem caderninho, sem áudio perdido."
            },
            {
              num: "03",
              title: "Abra e veja o que fazer hoje",
              body: "A tela Hoje organiza cobranças, entregas e recompras automaticamente. É só executar."
            }
          ].map((step) => (
            <div
              className="group relative rounded-2xl bg-surface border border-border p-7 shadow-sm transition hover:shadow-md hover:border-primary/20"
              key={step.num}
            >
              <span className="block text-4xl font-bold tracking-tighter text-primary/15 select-none font-display">
                {step.num}
              </span>
              <h3 className="mt-3 text-base font-semibold tracking-[-0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.75] text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. PARA QUEM É ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="segmentos-title"
        className="border-t border-border bg-surface"
        id="para-quem-e"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
          <div className="mb-14 max-w-lg">
            <p className="lv-section-label">Para quem é</p>
            <h2
              className="mt-4 text-3xl leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
              id="segmentos-title"
            >
              <span className="font-display font-normal">Feito para quem </span>
              <span className="font-display italic text-primary">vende pelo WhatsApp.</span>
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-text-secondary">
              Não importa o que você vende. O problema é sempre o mesmo: organização, cobrança e acompanhamento ficam na memória.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {[
              { label: "Cosméticos e beleza", desc: "Revenda de perfumes, cremes, maquiagem e cuidados pessoais." },
              { label: "Semijoias e acessórios", desc: "Colares, brincos, pulseiras e kits vendidos por catálogo ou stories." },
              { label: "Moda e achadinhos", desc: "Roupas, lingerie, calçados e produtos de social commerce." },
              { label: "Alimentação artesanal", desc: "Bolos, marmitas, doces, quitutes e encomendas semanais." },
              { label: "Produtos naturais", desc: "Suplementos, chás, cosméticos naturais e orgânicos." },
              { label: "Qualquer coisa pelo WhatsApp", desc: "Se você vende pelo zap e se organiza no improviso, é para você." }
            ].map(({ label, desc }) => (
              <div
                className="rounded-xl border border-border bg-background p-5 transition hover:border-primary/30 hover:bg-primary-lighter/40"
                key={label}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-sm font-semibold tracking-[-0.005em] text-foreground">
                    {label}
                  </p>
                </div>
                <p className="text-xs leading-[1.65] text-text-secondary pl-3.5">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. DEPOIMENTOS ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="depoimentos-title"
        className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32"
      >
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">O que dizem</p>
          <h2
            className="mt-4 text-3xl leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
            id="depoimentos-title"
          >
            <span className="font-display font-normal">Quem começou, </span>
            <span className="font-display italic text-primary">ficou.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              quote: "Parei de perder cobrança no meio da semana. Abro o app e já sei exatamente quem chamar.",
              name: "Carlos M.",
              role: "Cosméticos e cuidados",
              avatar: "/images/avatar-1.webp"
            },
            {
              quote: "Sempre esquecia de voltar para clientes que sumiram. O lembrete de recompra mudou minha rotina.",
              name: "Carla S.",
              role: "Semijoias",
              avatar: "/images/avatar-2.webp"
            },
            {
              quote: "App simples e direto. Abri, cadastrei, já entendi o que precisava fazer no dia.",
              name: "Fernanda R.",
              role: "Moda e achadinhos",
              avatar: "/images/avatar-3.webp"
            }
          ].map(({ quote, name, role, avatar }) => (
            <div
              className="flex flex-col justify-between rounded-2xl bg-surface border border-border p-7 shadow-sm"
              key={name}
            >
              <div>
                <div className="flex gap-0.5 text-amber mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <p className="font-display italic text-lg leading-[1.6] text-foreground">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={avatar}
                  alt={`Foto de ${name}`}
                  width={36}
                  height={36}
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-text-secondary">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. PREÇO ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="preco-title"
        className="bg-surface border-t border-border"
        id="preco"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
          <div className="mb-14 text-center max-w-lg mx-auto">
            <p className="lv-section-label">Preço</p>
            <h2
              className="mt-4 text-3xl leading-[1.2] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
              id="preco-title"
            >
              <span className="font-display font-normal">Grátis para começar. </span>
              <span className="font-display italic text-primary">Simples para crescer.</span>
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-text-secondary">
              Sem cartão de crédito. Sem compromisso. Organize as primeiras vendas e veja se funciona para você.
            </p>
          </div>

          <div className="mx-auto max-w-3xl grid gap-5 md:grid-cols-2">

            {/* Plano Grátis */}
            <div className="rounded-2xl border border-border bg-background p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Grátis</p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-[-0.02em] text-foreground">R$ 0</span>
                <span className="text-sm text-text-secondary mb-1">/mês</span>
              </div>
              <p className="mt-1 text-xs text-text-tertiary">Durante o período de testes</p>

              <ul className="mt-7 space-y-3">
                {[
                  "Até 30 clientes",
                  "Pedidos e cobranças",
                  "Tela Hoje sempre atualizada",
                  "Funciona no celular"
                ].map((item) => (
                  <li className="flex items-center gap-2.5" key={item}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 flex-shrink-0">
                      <CheckIcon className="h-2.5 w-2.5 text-primary" />
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                className="mt-8 flex h-12 items-center justify-center rounded-xl border border-primary text-sm font-semibold text-primary transition hover:bg-primary-lighter"
                href="/login"
              >
                Começar grátis
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="relative rounded-2xl bg-green-section p-8 overflow-hidden">
              {/* badge mais popular */}
              <div className="absolute top-5 right-5 rounded-full bg-amber px-3 py-1 text-[10px] font-bold text-amber-foreground">
                Mais popular
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Pro</p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-[-0.02em] text-white">R$ 19,90</span>
                <span className="text-sm text-white/60 mb-1">/mês</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Tudo do Grátis, mais:</p>

              <ul className="mt-7 space-y-3">
                {[
                  "Clientes ilimitados",
                  "Cobrança automática no WhatsApp",
                  "Lembrete de recompra inteligente",
                  "Relatório de receita mensal",
                  "Suporte prioritário"
                ].map((item) => (
                  <li className="flex items-center gap-2.5" key={item}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                      <CheckIcon className="h-2.5 w-2.5 text-white" />
                    </span>
                    <span className="text-sm text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-primary transition hover:bg-primary-lighter"
                href="/login"
              >
                Começar grátis
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="faq-title"
        className="border-t border-border bg-background"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
          <div className="mb-14 max-w-lg">
            <p className="lv-section-label">Perguntas frequentes</p>
            <h2
              className="mt-4 text-3xl leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]"
              id="faq-title"
            >
              <span className="font-display font-normal">Tirou a </span>
              <span className="font-display italic text-primary">dúvida?</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Preciso instalar algum aplicativo?",
                a: "Não. O LembraVenda funciona direto no navegador do celular. Nada para baixar ou instalar."
              },
              {
                q: "O app envia mensagem automática pelo WhatsApp?",
                a: "O LembraVenda prepara a mensagem e abre diretamente no WhatsApp da sua cliente — você só confirma o envio."
              },
              {
                q: "Preciso conectar meu WhatsApp?",
                a: "Não precisa. O app organiza sua rotina e, quando quiser, abre diretamente a conversa com a cliente."
              },
              {
                q: "O LembraVenda recebe pagamento?",
                a: "Não. Você combina o pagamento diretamente com o cliente — Pix, dinheiro, como preferir."
              },
              {
                q: "Funciona para qualquer produto?",
                a: "Sim. Você adapta os produtos e o fluxo ao seu jeito de vender — é flexível por design."
              },
              {
                q: "Quando vai começar a cobrar?",
                a: "Agora está grátis no período de testes. Você será avisado com antecedência antes de qualquer mudança."
              }
            ].map(({ q, a }) => (
              <div
                className="rounded-xl border border-border bg-surface p-5 transition hover:border-border-strong"
                key={q}
              >
                <h3 className="text-sm font-semibold tracking-[-0.005em] text-foreground">
                  {q}
                </h3>
                <p className="mt-2 text-sm leading-[1.75] text-text-secondary">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA FINAL ───────────────────────────────────────────────── */}
      <section className="bg-green-section">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-10 md:py-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            Comece hoje
          </p>
          <h2 className="mx-auto mt-4 max-w-lg text-3xl leading-[1.2] tracking-[-0.02em] text-white md:text-[2.75rem]">
            <span className="font-display font-normal">Não perca mais </span>
            <span className="font-display italic">venda, cobrança</span>
            <span className="font-display font-normal"> ou cliente.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-base leading-[1.8] text-white/75">
            É grátis para começar. Pronto em 2 minutos, direto no celular.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="lv-button-cta" href="/login">
              Começar grátis — sem cartão
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div className="flex flex-col items-center gap-1.5 md:items-start">
              <BrandLogo href="/" />
              <p className="font-display italic text-sm text-text-tertiary">
                Para quem vende de verdade.
              </p>
            </div>

            <nav
              aria-label="Links do rodapé"
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-secondary"
            >
              <Link className="transition hover:text-foreground" href="#como-funciona">Como funciona</Link>
              <Link className="transition hover:text-foreground" href="#para-quem-e">Para quem é</Link>
              <Link className="transition hover:text-foreground" href="#preco">Preço</Link>
              <Link className="transition hover:text-foreground" href="/login">Entrar</Link>
            </nav>

            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} LembraVenda
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
