import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const navigationItems = [
  { href: "/app/hoje", label: "Hoje" },
  { href: "/app/clientes", label: "Clientes" },
  { href: "/app/produtos", label: "Produtos" },
  { href: "/app/pedidos", label: "Pedidos" },
  { href: "/app/recompra", label: "Recompra" },
  { href: "/app/configuracoes", label: "Configurações" }
];

type AppShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="border-b border-border px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">
              Agenda Inteligente
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">
              {title}
            </h1>
          </div>
          <LogoutButton />
        </div>
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      </header>
      <main className="flex-1 px-5 py-5 pb-[calc(11rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navigationItems.map((item) => (
            <Link
              className="flex min-h-12 items-center justify-center rounded-md px-3 py-3 text-center text-sm font-medium leading-tight text-stone-700 transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
