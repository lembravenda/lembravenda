"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/ui";

// ─── Nav icons — outline (inativo) + solid fill (ativo) ──────────
const navigationItems = [
  {
    href: "/app/hoje",
    label: "Hoje",
    iconOutline: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 4.5 4.5 10v8a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 18v-8L12 4.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M9.5 19.5v-5h5v5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    iconSolid: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3.5 4 9.25V18.5A1.5 1.5 0 0 0 5.5 20H9v-5.5h6V20h3.5A1.5 1.5 0 0 0 20 18.5V9.25L12 3.5Z" />
      </svg>
    )
  },
  {
    href: "/app/clientes",
    label: "Clientes",
    iconOutline: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4 19a4.5 4.5 0 0 1 9 0M16.5 10a2.5 2.5 0 1 0 0-5M15.5 19a3.5 3.5 0 0 1 4.5 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    iconSolid: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="8.5" cy="7.5" r="3.5" />
        <path d="M2 19c0-3.038 2.91-5.5 6.5-5.5S15 15.962 15 19H2ZM16.5 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM15.5 15c1.083 0 2.084.265 2.923.72C20.05 16.42 21 17.61 21 19h-6c0-1.454-.538-2.775-1.42-3.774A6.3 6.3 0 0 1 15.5 15Z" />
      </svg>
    )
  },
  {
    href: "/app/pedidos",
    label: "Pedidos",
    iconOutline: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8.5 9.5h7M8.5 13h7M8.5 16.5H13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    iconSolid: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Zm3.5 2a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Zm0 3.5a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5h-7Zm0 3.5a.75.75 0 0 0 0 1.5H13a.75.75 0 0 0 0-1.5H8.5Z"
          clipRule="evenodd"
        />
      </svg>
    )
  },
  {
    href: "/app/recompra",
    label: "Recompra",
    iconOutline: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 12a7 7 0 1 1 2.05 4.95M5 12V7m0 5h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    iconSolid: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 4a8 8 0 1 0 5.657 13.657.75.75 0 1 1 1.06 1.06A9.5 9.5 0 1 1 21.5 12c0 .414-.336.75-.75.75H12a.75.75 0 0 1-.75-.75V7a.75.75 0 0 1 1.5 0v4.25H20a8 8 0 0 0-8-7.25Z"
          clipRule="evenodd"
        />
      </svg>
    )
  },
  {
    href: "/app/configuracoes",
    label: "Ajustes",
    iconOutline: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm7 2.5-.95-.55.1-1.1a1 1 0 0 0-.63-1l-1.08-.42-.42-1.08a1 1 0 0 0-1-.63l-1.1.1L12 6l-1.92.32-1.1-.1a1 1 0 0 0-1 .63l-.42 1.08-1.08.42a1 1 0 0 0-.63 1l.1 1.1L5 12l.55.95-.1 1.1a1 1 0 0 0 .63 1l1.08.42.42 1.08a1 1 0 0 0 1 .63l1.1-.1L12 18l1.92-.32 1.1.1a1 1 0 0 0 1-.63l.42-1.08 1.08-.42a1 1 0 0 0 .63-1l-.1-1.1L19 12Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
        />
      </svg>
    ),
    iconSolid: (
      <svg aria-hidden="true" className="h-[20px] w-[20px]" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
] as const;

type AppShellProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export function AppShell({ title, action, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <AppHeader action={action} title={title} />

      <main className="flex-1 px-4 py-5 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {/* Bottom Navigation — Liquid Glass */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(0,0,0,0.07)"
        }}
      >
        <div
          className="mx-auto grid max-w-md grid-cols-5 items-stretch px-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/app/hoje"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={`group relative flex min-h-[4rem] flex-col items-center justify-center gap-1 px-1 transition-colors ${
                  isActive ? "text-primary" : "text-text-tertiary hover:text-text-secondary"
                }`}
                href={item.href}
                key={item.href}
              >
                {/* Pill indicator — Liquid Glass style */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2.5 top-0 h-[2.5px] rounded-b-full transition-all duration-300 ${
                    isActive ? "bg-primary opacity-100" : "opacity-0"
                  }`}
                />

                {/* Icon container — solid quando ativo */}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary scale-100"
                      : "text-text-tertiary group-hover:text-text-secondary group-hover:bg-muted"
                  }`}
                >
                  {isActive ? item.iconSolid : item.iconOutline}
                </span>

                {/* Label */}
                <span
                  className={`text-[9.5px] leading-none transition-all ${
                    isActive
                      ? "font-semibold text-primary"
                      : "font-medium text-text-tertiary group-hover:text-text-secondary"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
