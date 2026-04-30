import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { getAuthState } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "LembraVenda — A agenda de quem vende",
  description:
    "Não deixe dinheiro esquecido no WhatsApp. Veja todo dia quem cobrar, o que entregar e quem chamar de novo."
};

// ─── Ícone de check ──────────────────────────────────────────────────────────
function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      viewBox="0 0 24 24"
    >
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Ícone de problema (amber) ───────────────────────────────────────────────
function ProblemIcon({ path }: { path: string }) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-light">
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path d={path} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Mockup da tela Hoje (hero) ──────────────────────────────────────────────
function HeroMockup() {
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

  const tabs = ["Hoje", "Clientes", "Pedidos", "Recompra", "Ajustes"];

  return (
    <div className="relative mx-auto w-full max-w-[310px]">
      {/* glow ambiental */}
      <div className="absolute -inset-6 rounded-[3rem] bg-primary/10 blur-3xl" />
      {/* frame do celular */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-background shadow-lift">
        {/* header verde */}
        <div className="bg-primary px-5 pb-5 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Hoje · qui, 30 abr
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-primary-foreground">
                O que fazer agora
              </h3>
              <p className="mt-0.5 text-xs text-primary-foreground/80">
                3 prioridades para hoje
              </p>
            </div>
            <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-bold text-primary-foreground">
              3
            </span>
          </div>
        </div>
        {/* cards */}
        <div className="space-y-2.5 bg-background p-4">
          {cards.map((c) => (
            <div
              className={`${c.cardClass} flex items-center justify-between px-4 py-3`}
              key={c.tipo}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  {c.tipo}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {c.nome}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {c.detalhe}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${c.badgeClass}`}
              >
                Hoje
              </span>
            </div>
          ))}
        </div>
        {/* bottom nav */}
        <div className="grid grid-cols-5 border-t border-border bg-surface px-1 py-2">
          {tabs.map((tab, i) => (
            <div
              className={`flex flex-col items-center gap-0.5 py-1 ${
                i === 0 ? "text-primary" : "text-text-tertiary"
              }`}
              key={tab}
            >
              <div
                className={`h-1 w-1 rounded-full ${
                  i === 0 ? "bg-primary" : "bg-transparent"
                }`}
              />
              <span className="text-[9px] font-medium">{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Checkmark inline para listas ───────────────────────────────────────────
function CheckListItem({
  children,
  muted = false
}: {
  children: string;
  muted?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
          muted ? "bg-primary-foreground/20" : "bg-primary-light"
        }`}
      >
        <CheckIcon
          className={`h-3 w-3 ${muted ? "text-primary-foreground" : "text-primary"}`}
        />
      </span>
      <span
        className={`text-sm leading-[1.7] ${
          muted ? "text-primary-foreground/90" : "text-text-secondary"
        }`}
      >
        {children}
      </span>
    </li>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="overflow-x-hidden">
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <BrandLogo href="/" />
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex"
          >
            <Link href="#como-funciona">Como funciona</Link>
            <Link href="#para-quem-e">Para quem é</Link>
            <Link href="#preco">Preço</Link>
          </nav>
          <Link className="lv-button-primary px-5 text-sm" href="/login">
            Criar conta gratuita
          </Link>
        </div>
      </header>

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Apresentação"
        className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-8 md:pb-24 md:pt-20"
      >
        <div>
          <p className="lv-section-label text-accent">
            Agenda de vendas para WhatsApp
          </p>
          <h1 className="mt-4 max-w-xl text-[2.25rem] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground md:text-5xl md:leading-[1.12]">
            Não deixe dinheiro esquecido no WhatsApp.
          </h1>
          <p className="mt-5 max-w-md text-base leading-[1.8] text-text-secondary md:text-lg">
            Veja todo dia quem cobrar, o que entregar e quem chamar de novo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="lv-button-primary px-7 text-sm" href="/login">
              Criar conta gratuita
            </Link>
            <Link
              className="lv-button-secondary px-7 text-sm"
              href="#como-funciona"
            >
              Ver como funciona
            </Link>
          </div>
          <ul className="mt-7 space-y-2.5" aria-label="Destaques">
            {[
              "Sem cartão de crédito",
              "Funciona no celular, pelo navegador",
              "Pronto em menos de 2 minutos"
            ].map((item) => (
              <li className="flex items-center gap-2.5" key={item}>
                <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm text-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroMockup />
      </section>

      {/* ── 2. MINI SOCIAL PROOF ─────────────────────────────────────────── */}
      <section
        aria-label="Quem usa"
        className="border-y border-border bg-surface"
      >
        <div className="mx-auto max-w-6xl px-5 py-5 md:px-8">
          <p className="text-center text-sm text-text-secondary">
            Usado por vendedores de{" "}
            <span className="font-semibold text-foreground">cosméticos</span>,{" "}
            <span className="font-semibold text-foreground">semijoias</span>,{" "}
            <span className="font-semibold text-foreground">moda</span>,{" "}
            <span className="font-semibold text-foreground">achadinhos</span> e
            muito mais
          </p>
        </div>
      </section>

      {/* ── 3. O PROBLEMA ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="problema-title"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
      >
        <div className="max-w-lg">
          <p className="lv-section-label">
            Onde trava quem vende pelo WhatsApp
          </p>
          <h2
            className="mt-4 text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground md:text-4xl"
            id="problema-title"
          >
            A venda acontece. O controle fica pra depois.
          </h2>
          <p className="mt-4 text-base leading-[1.8] text-text-secondary">
            Quem vende pelo WhatsApp não falta em vontade. O problema é que a
            gestão mora na cabeça, no caderninho ou em áudio não respondido.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              path: "M12 6v6l4 2M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z",
              title: "Cobrança que some",
              body: "Você sabe que alguém devia, mas não lembra quanto, quando, e se já pediu. A dívida fica no ar."
            },
            {
              path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
              title: "Entrega esquecida",
              body: "O pedido está pronto, mas quem vai avisar a cliente? Você, quando lembrar — se lembrar."
            },
            {
              path: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
              title: "Recompra perdida",
              body: "Ela adorou o produto. Mas faz 40 dias e você não voltou a oferecer nada. A oportunidade foi embora."
            }
          ].map(({ path, title, body }) => (
            <div className="lv-card p-6" key={title}>
              <ProblemIcon path={path} />
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-[1.7] text-text-secondary">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. A SOLUÇÃO — Tela Hoje ─────────────────────────────────────── */}
      <section aria-labelledby="solucao-title" className="bg-primary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:gap-20 md:px-8 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              A tela que resolve
            </p>
            <h2
              className="mt-4 text-3xl font-semibold leading-[1.25] text-primary-foreground md:text-4xl"
              id="solucao-title"
            >
              Sua agenda do dia,
              <br className="hidden sm:block" /> sempre pronta.
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-primary-foreground/85">
              A tela Hoje mostra o que precisa ser feito — cobrar, entregar ou
              chamar de novo. Sem esforço, sem adivinhação.
            </p>
            <ul className="mt-8 space-y-4" aria-label="Benefícios">
              {[
                "Cobranças em aberto com valor e dias de atraso",
                "Pedidos prontos para entregar",
                "Clientes no momento certo para recomprar"
              ].map((item) => (
                <CheckListItem key={item} muted>
                  {item}
                </CheckListItem>
              ))}
            </ul>
            <Link
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[0.9rem] bg-surface px-7 text-sm font-semibold text-primary hover:bg-primary-lighter"
              href="/login"
            >
              Criar conta gratuita
            </Link>
          </div>

          {/* mockup secundário — menor, para a seção verde */}
          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="absolute -inset-4 rounded-3xl bg-primary-foreground/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-primary-foreground/20 bg-background shadow-lift">
              <div className="bg-primary-dark px-5 pb-4 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                  Hoje · 30 abr
                </p>
                <h3 className="mt-1 text-sm font-semibold text-primary-foreground">
                  O que fazer agora
                </h3>
              </div>
              <div className="space-y-2 bg-background p-3">
                {[
                  {
                    tipo: "Cobrar",
                    nome: "Camila Rosa",
                    val: "R$ 89,90",
                    cls: "lv-card lv-card-urgent",
                    badge: "bg-accent-light text-accent"
                  },
                  {
                    tipo: "Entregar",
                    nome: "Juliana Lima",
                    val: "Kit pronto",
                    cls: "lv-card lv-card-success",
                    badge: "bg-primary-light text-primary"
                  },
                  {
                    tipo: "Chamar",
                    nome: "Bruna Melo",
                    val: "30 dias",
                    cls: "lv-card",
                    badge: "bg-muted text-text-secondary"
                  }
                ].map((c) => (
                  <div
                    className={`${c.cls} flex items-center justify-between px-3 py-2.5`}
                    key={c.tipo}
                  >
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-text-tertiary">
                        {c.tipo}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-foreground">
                        {c.nome}
                      </p>
                      <p className="text-[10px] text-text-secondary">{c.val}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${c.badge}`}
                    >
                      Hoje
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMO FUNCIONA ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="como-funciona-title"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
        id="como-funciona"
      >
        <div className="max-w-lg">
          <p className="lv-section-label">Como funciona</p>
          <h2
            className="mt-4 text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground md:text-4xl"
            id="como-funciona-title"
          >
            Pronto em 3 passos.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              num: "1",
              title: "Cadastre clientes e produtos",
              body: "Coloque os contatos e os produtos que você mais vende. Leva menos de 5 minutos."
            },
            {
              num: "2",
              title: "Registre cada pedido",
              body: "Cliente, item, valor e status em um só lugar. Sem planilha, sem caderninho."
            },
            {
              num: "3",
              title: "Abra e veja o que fazer hoje",
              body: "A tela Hoje organiza cobranças, entregas e recompras por você. É só executar."
            }
          ].map((step) => (
            <div className="lv-card p-6" key={step.num}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                {step.num}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.7] text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. SEGMENTOS ─────────────────────────────────────────────────── */}
      <section
        aria-labelledby="segmentos-title"
        className="border-t border-border bg-surface"
        id="para-quem-e"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-lg">
            <p className="lv-section-label">Para quem é</p>
            <h2
              className="mt-4 text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground md:text-4xl"
              id="segmentos-title"
            >
              Feito para quem vende pelo WhatsApp.
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-text-secondary">
              Não importa o que você vende. O problema é sempre o mesmo:
              organização, cobrança e acompanhamento ficam na memória.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                label: "Cosméticos e beleza",
                desc: "Revenda de perfumes, cremes, maquiagem e cuidados pessoais."
              },
              {
                label: "Semijoias e acessórios",
                desc: "Colares, brincos, pulseiras e kits vendidos por catálogo ou stories."
              },
              {
                label: "Moda e achadinhos",
                desc: "Roupas, lingerie, calçados e produtos de social commerce."
              },
              {
                label: "Alimentação artesanal",
                desc: "Bolos, marmitas, doces, quitutes e encomendas semanais."
              },
              {
                label: "Produtos naturais",
                desc: "Suplementos, chás, cosméticos naturais e orgânicos."
              },
              {
                label: "Qualquer coisa pelo WhatsApp",
                desc: "Se você vende pelo zap e se organiza no improviso, é para você."
              }
            ].map(({ label, desc }) => (
              <div className="lv-card p-5" key={label}>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1.5 text-xs leading-[1.6] text-text-secondary">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. DEPOIMENTOS ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="depoimentos-title"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
      >
        <div className="max-w-lg">
          <p className="lv-section-label">O que dizem os primeiros usuários</p>
          <h2
            className="mt-4 text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground md:text-4xl"
            id="depoimentos-title"
          >
            Quem começou, ficou.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              quote:
                "Parei de perder cobrança no meio da semana. Abro o app e já sei quem chamar.",
              name: "Juliana M.",
              role: "Revendedora de cosméticos"
            },
            {
              quote:
                "Sempre esquecia de voltar para clientes que sumiram. O lembrete de recompra mudou isso.",
              name: "Carla S.",
              role: "Vendedora de semijoias"
            },
            {
              quote:
                "App simples e direto. Abri, cadastrei, já entendi o que precisava fazer hoje.",
              name: "Fernanda R.",
              role: "Moda e achadinhos"
            }
          ].map(({ quote, name, role }) => (
            <div className="lv-card p-6" key={name}>
              <p className="text-sm leading-[1.8] text-foreground">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary"
                >
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="text-xs text-text-secondary">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. PREÇO ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="preco-title"
        className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24"
        id="preco"
      >
        <div className="overflow-hidden rounded-2xl bg-primary p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                Preço
              </p>
              <h2
                className="mt-4 text-3xl font-semibold leading-[1.25] text-primary-foreground md:text-4xl"
                id="preco-title"
              >
                Grátis para começar.
              </h2>
              <p className="mt-4 text-base leading-[1.8] text-primary-foreground/85">
                Sem cartão de crédito. Sem compromisso. Organize as primeiras
                vendas e veja se o LembraVenda funciona para você.
              </p>
              <ul className="mt-7 space-y-3" aria-label="O que está incluído">
                {[
                  "Clientes, pedidos e cobranças na fase de testes",
                  "Tela Hoje sempre atualizada",
                  "Funciona no celular, sem instalar nada"
                ].map((item) => (
                  <CheckListItem key={item} muted>
                    {item}
                  </CheckListItem>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-center">
              <div>
                <p className="text-3xl font-bold text-primary-foreground">
                  Grátis
                </p>
                <p className="mt-0.5 text-sm text-primary-foreground/70">
                  durante o período de testes
                </p>
              </div>
              <Link
                className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[0.9rem] bg-surface px-8 text-sm font-semibold text-primary hover:bg-primary-lighter"
                href="/login"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="faq-title"
        className="border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="lv-section-label">Perguntas frequentes</p>
          <h2
            className="mt-4 max-w-xs text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground"
            id="faq-title"
          >
            Tirou a dúvida?
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Preciso instalar algum aplicativo?",
                a: "Não. O LembraVenda funciona direto no navegador do celular. Nada para baixar."
              },
              {
                q: "O app envia mensagem automática pelo WhatsApp?",
                a: "Não. O LembraVenda deixa a mensagem pronta para você copiar e enviar quando quiser."
              },
              {
                q: "Preciso conectar meu WhatsApp?",
                a: "Não precisa. O app organiza sua rotina e abre a conversa quando você quiser."
              },
              {
                q: "O LembraVenda recebe pagamento?",
                a: "Não. Você combina o pagamento diretamente com o cliente — Pix, dinheiro, como preferir."
              },
              {
                q: "Funciona para qualquer produto?",
                a: "Sim. Você adapta as categorias e mensagens ao seu jeito de vender."
              },
              {
                q: "Quando vai começar a cobrar?",
                a: "Agora está grátis no período de testes. Você será avisado com antecedência antes de qualquer mudança."
              }
            ].map(({ q, a }) => (
              <div className="lv-card p-5" key={q}>
                <h3 className="text-base font-semibold text-foreground">{q}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-text-secondary">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. RODAPÉ + CTA FINAL ───────────────────────────────────────── */}
      <footer className="bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          {/* CTA card */}
          <div className="rounded-2xl bg-surface p-8 text-center md:p-12">
            <p className="lv-section-label">Comece hoje</p>
            <h2 className="mx-auto mt-4 max-w-md text-3xl font-semibold leading-[1.25] tracking-[-0.01em] text-foreground md:text-4xl">
              A agenda de quem vende.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base leading-[1.8] text-text-secondary">
              Não perca venda, cobrança ou cliente por esquecer.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link className="lv-button-primary px-8 text-sm" href="/login">
                Criar conta gratuita
              </Link>
              <Link
                className="lv-button-secondary px-8 text-sm"
                href="#como-funciona"
              >
                Ver como funciona
              </Link>
            </div>
          </div>

          {/* rodapé inferior */}
          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-border pt-8 sm:flex-row">
            <BrandLogo href="/" />
            <nav
              aria-label="Links do rodapé"
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-secondary"
            >
              <Link href="#como-funciona">Como funciona</Link>
              <Link href="#para-quem-e">Para quem é</Link>
              <Link href="#preco">Preço</Link>
              <Link href="/login">Entrar</Link>
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
