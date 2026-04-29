import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";

export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between bg-background px-5 py-8">
      <section>
        <p className="text-sm font-medium text-primary">LembraVenda</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-foreground">
          Lembre quem cobrar, entregar e chamar para comprar de novo.
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          O LembraVenda ajuda quem vende pelo WhatsApp a organizar clientes,
          pedidos, cobranças e recompras em poucos minutos.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold tracking-normal">
          Comece organizando sua primeira venda
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Cadastre clientes, produtos e pedidos. Depois acompanhe tudo na tela
          Hoje.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Link
            className="min-h-12 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            href="/login"
          >
            Entrar ou criar conta
          </Link>
          <Link
            className="min-h-12 rounded-md border border-border px-4 py-3 text-center text-sm font-semibold text-foreground"
            href="#como-funciona"
          >
            Ver como funciona
          </Link>
        </div>
      </section>

      <section className="mt-8 space-y-3" id="como-funciona">
        <article className="rounded-lg border border-border bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-primary">1</p>
          <h2 className="mt-2 text-lg font-semibold tracking-normal text-foreground">
            Cadastre suas clientes
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Guarde nome, telefone e observações importantes sem depender da
            memória.
          </p>
        </article>

        <article className="rounded-lg border border-border bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-primary">2</p>
          <h2 className="mt-2 text-lg font-semibold tracking-normal text-foreground">
            Monte pedidos em poucos toques
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Junte cliente, produto, valor e status de pagamento em um só lugar.
          </p>
        </article>

        <article className="rounded-lg border border-border bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-primary">3</p>
          <h2 className="mt-2 text-lg font-semibold tracking-normal text-foreground">
            Saiba o que fazer hoje
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Veja quem cobrar, o que entregar e quando vale chamar uma cliente de
            novo.
          </p>
        </article>
      </section>
    </main>
  );
}
