import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { getAuthState } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "LembraVenda — A agenda de quem vende pelo WhatsApp",
  description:
    "Não deixe dinheiro esquecido no WhatsApp. Veja todo dia quem cobrar, o que entregar e quem chamar de novo."
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

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

function PhoneMockup({ size = "lg" }: { size?: "lg" | "sm" }) {
  const isLg = size === "lg";
  const cards = [
    {
      tipo: "Cobrar",
      nome: "Camila Rosa",
      detalhe: "R$ 89,90 · 3 dias",
      cardClass: "lv-card lv-card-urgent",
      badgeClass: "bg-accent-light text-accent"
    },
    {
      tipo: "Entregar",
      nome: "Juliana Lima",
      detalhe: "Kit revenda pronto",
      cardClass: "lv-card lv-card-success",
      badgeClass: "bg-primary-light text-primary"
    },
    {
      tipo: "Chamar de novo",
      nome: "Bruna Melo",
      detalhe: "Hidratante · 30 dias",
      cardClass: "lv-card",
      badgeClass: "bg-muted text-text-secondary"
    }
  ];
  const tabs = ["Hoje", "Clientes", "Pedidos", "Recompra", "Config"];

  return (
    <div className={`relative mx-auto ${isLg ? "w-full max-w-[300px]" : "w-full max-w-[265px]"}`}>
      <div className="absolute -inset-8 rounded-[3.5rem] bg-primary/12 blur-3xl pointer-events-none" />
      <div
        className={`relative overflow-hidden bg-background border border-border/60 ${isLg ? "rounded-[2.5rem] shadow-phone" : "rounded-[2.2rem] shadow-lg"}`}
      >
        {isLg && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-6 w-20 rounded-b-2xl bg-foreground/8" />
        )}
        <div className={`bg-primary px-5 ${isLg ? "pb-5 pt-8" : "pb-4 pt-6"}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
                Hoje · qui, 30 abr
              </p>
              <h3 className={`font-semibold text-primary-foreground ${isLg ? "mt-1.5 text-base" : "mt-1 text-sm"}`}>
                O que fazer agora
              </h3>
              <p className={`text-primary-foreground/75 ${isLg ? "mt-0.5 text-xs" : "text-[10px]"}`}>
                3 prioridades para hoje
              </p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-primary-foreground">
              3
            </span>
          </div>
        </div>
        <div className={`space-y-2 bg-background ${isLg ? "p-4" : "p-3"}`}>
          {cards.map((c) => (
            <div
              className={`${c.cardClass} flex items-center justify-between ${isLg ? "px-4 py-3" : "px-3 py-2.5"}`}
              key={c.tipo}
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  {c.tipo}
                </p>
                <p className={`font-semibold text-foreground ${isLg ? "mt-0.5 text-sm" : "mt-0.5 text-xs"}`}>
                  {c.nome}
                </p>
                <p className={`text-text-secondary ${isLg ? "mt-0.5 text-xs" : "text-[10px]"}`}>
                  {c.detalhe}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${c.badgeClass}`}>
                Hoje
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 border-t border-border bg-surface px-1 py-2">
          {tabs.map((tab, i) => (
            <div
              className={`flex flex-col items-center gap-0.5 py-1 ${i === 0 ? "text-primary" : "text-text-tertiary"}`}
              key={tab}
            >
              <div className={`h-1 w-1 rounded-full ${i === 0 ? "bg-primary" : "bg-transparent"}`} />
              <span className="text-[8px] font-medium">{tab}</span>
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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/88 backdrop-blur-md">
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
          <Link className="lv-button-primary px-5 py-2 text-sm" href="/login">
            Criar conta grátis
          </Link>
        </div>
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section aria-label="Apresentação" className="lv-hero-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 md:grid-cols-[1.15fr_0.85fr] md:gap-20 md:px-10 md:pb-32 md:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-subtle px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Agenda de vendas para WhatsApp
              </span>
            </div>
            <h1 className="mt-6 max-w-xl text-[2.5rem] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground md:text-[3.5rem] md:leading-[1.09] lg:text-[4rem]">
              Não perca mais venda, cobrança ou cliente.
            </h1>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.75] text-text-secondary md:text-lg">
              O LembraVenda mostra todo dia quem cobrar, o que entregar e quem está no momento certo para comprar de novo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link className="lv-button-cta" href="/login">
                Criar conta grátis
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link className="lv-button-secondary h-14 rounded-2xl px-7 text-sm font-semibold" href="#como-funciona">
                Ver como funciona
              </Link>
            </div>
            <ul className="mt-8 flex flex-col gap-2.5" aria-label="Destaques">
              {[
                "Sem cartão de crédito",
                "Funciona no celular, pelo navegador",
                "Pronto em menos de 2 minutos"
              ].map((item) => (
                <li className="flex items-center gap-2.5" key={item}>
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lv-phone-wrap">
            <PhoneMockup size="lg" />
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF STRIP ────────────────────────────────────────── */}
      <div className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-10">
          <p className="text-center text-sm text-text-secondary">
            Usado por vendedoras de{" "}
            <strong className="font-semibold text-foreground">cosméticos</strong>,{" "}
            <strong className="font-semibold text-foreground">semijoias</strong>,{" "}
            <strong className="font-semibold text-foreground">moda</strong>,{" "}
            <strong className="font-semibold text-foreground">alimentação artesanal</strong>{" "}
            e muito mais
          </p>
        </div>
      </div>

      {/* ── 3. O PROBLEMA ───────────────────────────────────────────────── */}
      <section aria-labelledby="problema-title" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">O problema</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]" id="problema-title">
            A venda acontece. O controle fica pra depois.
          </h2>
          <p className="mt-4 text-base leading-[1.8] text-text-secondary">
            Quem vende pelo WhatsApp não falta em vontade. O problema é que a gestão mora na cabeça, no caderninho ou em áudio não respondido.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: (<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M12 6v6l4 2M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
              title: "Cobrança que some",
              body: "Você sabe que alguém devia, mas não lembra quanto, quando, e se já pediu. A dívida fica no ar — e o dinheiro também."
            },
            {
              icon: (<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>),
              title: "Entrega esquecida",
              body: "O pedido está pronto, mas quem vai avisar a cliente? Você, quando lembrar — e se lembrar antes dela se aborrecer."
            },
            {
              icon: (<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeLinecap="round" strokeLinejoin="round" /></svg>),
              title: "Recompra perdida",
              body: "Ela adorou o produto. Mas faz 40 dias e você não voltou a oferecer nada. A oportunidade foi embora quieta."
            }
          ].map(({ icon, title, body }) => (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md" key={title}>
              <div className="lv-icon-wrap text-accent" style={{ background: "var(--lv-accent-light)" }}>
                {icon}
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. A SOLUÇÃO ────────────────────────────────────────────────── */}
      <section aria-labelledby="solucao-title" className="bg-green-section">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">A tela que resolve</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[2.5rem]" id="solucao-title">
              Sua agenda do dia, sempre pronta.
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
            <Link className="mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-sm font-bold text-primary transition hover:bg-primary-lighter" href="/login">
              Criar conta grátis
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <PhoneMockup size="sm" />
          </div>
        </div>
      </section>

      {/* ── 5. COMO FUNCIONA ────────────────────────────────────────────── */}
      <section aria-labelledby="como-funciona-title" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32" id="como-funciona">
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">Como funciona</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]" id="como-funciona-title">
            Pronto em 3 passos.
          </h2>
          <p className="mt-4 text-base leading-[1.8] text-text-secondary">
            Sem onboarding longo, sem treinamento. Você configura uma vez e começa a usar no mesmo dia.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { num: "01", title: "Cadastre clientes e produtos", body: "Coloque os contatos e os produtos que você mais vende. Leva menos de 5 minutos." },
            { num: "02", title: "Registre cada pedido", body: "Cliente, item, valor e status em um só lugar. Sem planilha, sem caderninho, sem áudio perdido." },
            { num: "03", title: "Abra e veja o que fazer hoje", body: "A tela Hoje organiza cobranças, entregas e recompras automaticamente. É só executar." }
          ].map((step) => (
            <div className="group relative rounded-2xl bg-surface p-7 shadow-card transition hover:shadow-md" key={step.num}>
              <span className="text-4xl font-bold tracking-tighter text-primary/12 select-none">{step.num}</span>
              <h3 className="mt-3 text-base font-semibold tracking-[-0.01em] text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. PARA QUEM É ──────────────────────────────────────────────── */}
      <section aria-labelledby="segmentos-title" className="border-t border-border bg-surface" id="para-quem-e">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
          <div className="mb-14 max-w-lg">
            <p className="lv-section-label">Para quem é</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]" id="segmentos-title">
              Feito para quem vende pelo WhatsApp.
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
              <div className="rounded-xl border border-border bg-background p-5 transition hover:border-primary/30 hover:bg-primary-lighter/40" key={label}>
                <p className="text-sm font-semibold tracking-[-0.005em] text-foreground">{label}</p>
                <p className="mt-1.5 text-xs leading-[1.65] text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. DEPOIMENTOS ──────────────────────────────────────────────── */}
      <section aria-labelledby="depoimentos-title" className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
        <div className="mb-14 max-w-lg">
          <p className="lv-section-label">O que dizem</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]" id="depoimentos-title">
            Quem começou, ficou.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { quote: "Parei de perder cobrança no meio da semana. Abro o app e já sei exatamente quem chamar.", name: "Juliana M.", role: "Revendedora de cosméticos" },
            { quote: "Sempre esquecia de voltar para clientes que sumiram. O lembrete de recompra mudou minha rotina.", name: "Carla S.", role: "Vendedora de semijoias" },
            { quote: "App simples e direto. Abri, cadastrei, já entendi o que precisava fazer no dia.", name: "Fernanda R.", role: "Moda e achadinhos" }
          ].map(({ quote, name, role }) => (
            <div className="flex flex-col justify-between rounded-2xl bg-surface p-7 shadow-card" key={name}>
              <div>
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (<StarIcon key={i} className="h-3.5 w-3.5" />))}
                </div>
                <p className="mt-4 text-sm leading-[1.8] text-foreground">&ldquo;{quote}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div aria-hidden="true" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {name.charAt(0)}
                </div>
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
      <section aria-labelledby="preco-title" className="mx-auto max-w-6xl px-5 pb-20 md:px-10 md:pb-32" id="preco">
        <div className="overflow-hidden rounded-3xl bg-green-section px-8 py-12 md:px-14 md:py-16">
          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Preço</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[2.5rem]" id="preco-title">
                Grátis para começar.
              </h2>
              <p className="mt-4 text-base leading-[1.8] text-white/80">
                Sem cartão de crédito. Sem compromisso. Organize as primeiras vendas e veja se o LembraVenda funciona para você.
              </p>
              <ul className="mt-7 space-y-3.5" aria-label="O que está incluído">
                {[
                  "Clientes, pedidos e cobranças na fase de testes",
                  "Tela Hoje sempre atualizada e pronta",
                  "Funciona no celular, sem instalar nada"
                ].map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                      <CheckIcon className="h-3 w-3 text-white" />
                    </span>
                    <span className="text-sm leading-[1.7] text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-5 md:items-center">
              <div className="text-center">
                <p className="text-4xl font-bold tracking-[-0.02em] text-white">Grátis</p>
                <p className="mt-1 text-sm text-white/60">durante o período de testes</p>
              </div>
              <Link className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-white px-9 text-sm font-bold text-primary transition hover:bg-primary-lighter" href="/login">
                Criar conta grátis
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-32">
          <div className="mb-14 max-w-lg">
            <p className="lv-section-label">Perguntas frequentes</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]" id="faq-title">
              Tirou a dúvida?
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { q: "Preciso instalar algum aplicativo?", a: "Não. O LembraVenda funciona direto no navegador do celular. Nada para baixar ou instalar." },
              { q: "O app envia mensagem automática pelo WhatsApp?", a: "Não. O LembraVenda deixa a mensagem pronta para você copiar e enviar quando quiser — você controla o contato." },
              { q: "Preciso conectar meu WhatsApp?", a: "Não precisa. O app organiza sua rotina e, quando quiser, abre diretamente a conversa com a cliente." },
              { q: "O LembraVenda recebe pagamento?", a: "Não. Você combina o pagamento diretamente com o cliente — Pix, dinheiro, como preferir." },
              { q: "Funciona para qualquer produto?", a: "Sim. Você adapta os produtos e o fluxo ao seu jeito de vender — é flexível por design." },
              { q: "Quando vai começar a cobrar?", a: "Agora está grátis no período de testes. Você será avisado com antecedência antes de qualquer mudança." }
            ].map(({ q, a }) => (
              <div className="rounded-xl border border-border bg-background p-5 transition hover:border-border-strong" key={q}>
                <h3 className="text-sm font-semibold tracking-[-0.005em] text-foreground">{q}</h3>
                <p className="mt-2 text-sm leading-[1.75] text-text-secondary">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA FINAL + FOOTER ───────────────────────────────────────── */}
      <footer className="bg-background">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
          <div className="rounded-3xl bg-surface px-8 py-14 text-center shadow-md md:px-16 md:py-20">
            <p className="lv-section-label">Comece hoje</p>
            <h2 className="mx-auto mt-4 max-w-md text-3xl font-semibold leading-[1.22] tracking-[-0.02em] text-foreground md:text-[2.5rem]">
              A agenda de quem vende.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base leading-[1.8] text-text-secondary">
              Não perca venda, cobrança ou cliente por esquecer. É grátis para começar.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link className="lv-button-cta" href="/login">
                Criar conta grátis
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link className="lv-button-secondary h-14 rounded-2xl px-7 text-sm font-semibold" href="#como-funciona">
                Ver como funciona
              </Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-border pt-8 sm:flex-row">
            <BrandLogo href="/" />
            <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">
              <Link className="transition hover:text-foreground" href="#como-funciona">Como funciona</Link>
              <Link className="transition hover:text-foreground" href="#para-quem-e">Para quem é</Link>
              <Link className="transition hover:text-foreground" href="#preco">Preço</Link>
              <Link className="transition hover:text-foreground" href="/login">Entrar</Link>
            </nav>
            <p className="text-xs text-text-tertiary">© {new Date().getFullYear()} LembraVenda</p>
          </div>
        </div>
      </footer>

    </main>
  );
      }
