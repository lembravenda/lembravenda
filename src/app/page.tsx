import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AppCard, FeatureCard } from "@/components/ui";
import { getAuthState } from "@/lib/auth/server";

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute inset-x-10 top-6 h-24 rounded-full bg-accent/25 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-4 shadow-lift">
        <div className="rounded-[1.4rem] bg-primary px-4 py-4 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
            Hoje
          </p>
          <h3 className="mt-2 text-lg font-semibold">O que fazer agora</h3>
          <p className="mt-1 text-sm text-primary-foreground/85">
            Cobrar, entregar e chamar de novo sem perder tempo.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {[
            {
              label: "Cobrar",
              detail: "Camila · R$ 89,90",
              tone: "bg-accent-light text-amber-700"
            },
            {
              label: "Entregar",
              detail: "Juliana · pedido pronto",
              tone: "bg-primary-light text-primary"
            },
            {
              label: "Chamar de novo",
              detail: "Bruna · hidratante em 30 dias",
              tone: "bg-emerald-50 text-emerald-700"
            }
          ].map((item) => (
            <div
              className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4"
              key={item.label}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.detail}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
              >
                Hoje
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-12 pt-6 md:px-8">
        <nav className="flex items-center justify-between gap-4 py-3">
          <BrandLogo href="/" showTagline />
          <div className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex">
            <Link href="#como-funciona">Como funciona</Link>
            <Link href="#para-quem-e">Para quem é</Link>
            <Link href="#preco">Preço</Link>
          </div>
          <Link className="lv-button-primary px-5" href="/login">
            Começar grátis
          </Link>
        </nav>

        <section className="grid flex-1 items-center gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-16">
          <div>
            <p className="lv-section-label">Agenda de vendas para WhatsApp</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Lembre quem cobrar, entregar e chamar para comprar de novo.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-text-secondary md:text-lg">
              O LembraVenda é a agenda de vendas para quem vende pelo WhatsApp.
              Cadastre clientes, pedidos e cobranças e saiba o que fazer hoje.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="lv-button-primary px-6" href="/login">
                Começar grátis
              </Link>
              <Link className="lv-button-secondary px-6" href="#como-funciona">
                Ver como funciona
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Clientes e pedidos em poucos toques",
                "Cobranças prontas para WhatsApp",
                "Tela Hoje com prioridades do dia"
              ].map((item) => (
                <AppCard className="p-4" key={item}>
                  <p className="text-sm font-medium leading-6 text-foreground">
                    {item}
                  </p>
                </AppCard>
              ))}
            </div>
          </div>

          <HeroMockup />
        </section>

        <section className="space-y-4 py-8 md:py-12">
          <p className="lv-section-label">Onde costuma travar</p>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              description="Centralize seus pedidos pendentes e não dependa mais da memória."
              title="Esquece quem ainda não pagou?"
            />
            <FeatureCard
              description="Veja o que precisa sair primeiro e ganhe clareza para o dia."
              title="Não sabe o que precisa entregar hoje?"
            />
            <FeatureCard
              description="Registre o ciclo dos produtos e volte a falar com a pessoa certa na hora certa."
              title="Deixa a recompra passar sem oferecer?"
            />
          </div>
        </section>

        <section className="space-y-5 py-8 md:py-12" id="como-funciona">
          <div className="max-w-lg">
            <p className="lv-section-label">Como funciona</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
              Organize a venda em três passos simples.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Cadastre clientes e produtos",
                description:
                  "Deixe seus contatos e os produtos principais sempre à mão."
              },
              {
                step: "2",
                title: "Registre pedidos",
                description:
                  "Junte cliente, itens, valor e status em um só lugar."
              },
              {
                step: "3",
                title: "Veja o que fazer hoje",
                description:
                  "Priorize cobranças, entregas e novas oportunidades sem improviso."
              }
            ].map((item) => (
              <AppCard className="p-5" key={item.step}>
                <p className="lv-section-label">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {item.description}
                </p>
              </AppCard>
            ))}
          </div>
        </section>

        <section className="space-y-4 py-8 md:py-12">
          <p className="lv-section-label">O que ajuda no dia a dia</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              description="Textos prontos para cobrar sem perder seu jeito de atender."
              title="Mensagem pronta para WhatsApp"
            />
            <FeatureCard
              description="Seu resumo diário com o que merece atenção agora."
              title="Tela Hoje"
            />
            <FeatureCard
              description="Lembretes para voltar a oferecer produtos que costumam acabar."
              title="Lembretes de recompra"
            />
            <FeatureCard
              description="Acompanhe pagamento e entrega em cada pedido."
              title="Pedidos com status"
            />
          </div>
        </section>

        <section className="space-y-4 py-8 md:py-12" id="para-quem-e">
          <div className="max-w-xl">
            <p className="lv-section-label">Para quem é</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
              Feito para quem vende pelo WhatsApp e se organiza no improviso.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Revendedores de cosméticos e beleza.",
              "Vendedores de semijoias e acessórios.",
              "Social sellers de moda e achadinhos.",
              "Pequenos produtores locais.",
              "Quem vende pelo WhatsApp e se organiza no improviso."
            ].map((item) => (
              <AppCard className="p-5" key={item}>
                <p className="text-sm leading-7 text-foreground">{item}</p>
              </AppCard>
            ))}
          </div>
        </section>

        <section className="py-8 md:py-12" id="preco">
          <AppCard className="overflow-hidden bg-primary p-6 text-primary-foreground md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
                  Preço
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-normal">
                  Comece grátis durante o período de testes.
                </h2>
                <p className="mt-3 text-sm leading-7 text-primary-foreground/85">
                  Sem cartão de crédito. Entre, organize suas primeiras vendas e
                  veja se o LembraVenda encaixa no seu jeito de trabalhar.
                </p>
              </div>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-[0.95rem] bg-surface px-5 py-3 text-sm font-semibold text-primary"
                href="/login"
              >
                Criar minha conta
              </Link>
            </div>
          </AppCard>
        </section>

        <section className="space-y-4 py-8 md:py-12">
          <p className="lv-section-label">Perguntas frequentes</p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Preciso instalar aplicativo?",
                a: "Não. Você pode usar o LembraVenda direto no navegador do celular."
              },
              {
                q: "O app envia mensagem automática?",
                a: "Não. O LembraVenda deixa a mensagem pronta para você copiar e enviar."
              },
              {
                q: "Preciso conectar meu WhatsApp?",
                a: "Não precisa. O app só organiza sua rotina e abre a conversa quando você quiser."
              },
              {
                q: "O LembraVenda recebe pagamento?",
                a: "Não. Você combina o pagamento diretamente com a cliente."
              },
              {
                q: "Serve para qualquer tipo de produto?",
                a: "Sim. Você pode adaptar categorias e mensagens ao seu jeito de vender."
              },
              {
                q: "Posso usar pelo celular?",
                a: "Sim. O app foi pensado primeiro para o uso no celular."
              }
            ].map((item) => (
              <AppCard className="p-5" key={item.q}>
                <h3 className="text-base font-semibold text-foreground">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {item.a}
                </p>
              </AppCard>
            ))}
          </div>
        </section>

        <section className="py-8 md:py-12">
          <AppCard className="bg-surface p-6 md:p-8">
            <p className="lv-section-label">Comece hoje</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
              Organize sua próxima venda.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-text-secondary">
              Clientes, pedidos, cobranças e recompra em um fluxo simples para
              você não depender do improviso.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="lv-button-primary px-6" href="/login">
                Criar minha agenda grátis
              </Link>
              <Link className="lv-button-secondary px-6" href="#como-funciona">
                Ver como funciona
              </Link>
            </div>
          </AppCard>
        </section>
      </section>
    </main>
  );
}
