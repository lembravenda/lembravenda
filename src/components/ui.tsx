import type { ComponentPropsWithoutRef, ReactNode } from "react";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles(
  variant: "danger" | "ghost" | "primary" | "secondary" = "primary",
  fullWidth = true
) {
  return joinClasses(
    variant === "danger"    && "lv-button-danger",
    variant === "primary"   && "lv-button-primary",
    variant === "secondary" && "lv-button-secondary",
    variant === "ghost"     && "lv-button-ghost",
    fullWidth && "w-full"
  );
}

// ─── AppCard ──────────────────────────────────────────────────────
type AppCardProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function AppCard({ children, className, ...props }: AppCardProps) {
  return (
    <section
      className={joinClasses("lv-card p-5", className)}
      {...props}
    >
      {children}
    </section>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────
type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function EmptyState({
  title,
  description,
  action,
  eyebrow = "Tudo pronto para seguir"
}: EmptyStateProps) {
  return (
    <section className="rounded-[14px] border border-dashed border-border p-8 text-center">
      <p className="lv-eyebrow text-center">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────
type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm leading-5 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────
type StatusBadgeProps = {
  children: ReactNode;
  tone?: "danger" | "neutral" | "success" | "urgent" | "warning";
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  const toneMap = {
    success: {
      className: "bg-[#F0FBF4] text-[#15803D]",
      dotClass:  "bg-[#16A34A]"
    },
    warning: {
      className: "bg-[#FEF9EE] text-[#A16207]",
      dotClass:  "bg-[#B45309]"
    },
    urgent: {
      className: "bg-[#FEF6EE] text-[#B84217]",
      dotClass:  "bg-[#C2410C]"
    },
    danger: {
      className: "bg-[#FEF2F2] text-[#B91C1C]",
      dotClass:  "bg-[#DC2626]"
    },
    neutral: {
      className: "bg-[#F4F4F5] text-[#52525B]",
      dotClass:  "bg-[#71717A]"
    }
  } as const;

  const t = toneMap[tone] ?? toneMap.neutral;

  return (
    <span
      className={joinClasses(
        "inline-flex min-h-6 items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-[11px] font-semibold leading-none",
        t.className
      )}
    >
      <span
        aria-hidden="true"
        className={joinClasses(
          "inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full",
          t.dotClass
        )}
      />
      {children}
    </span>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────
type StepCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  done?: boolean;
  step: string;
};

export function StepCard({ title, description, action, done = false, step }: StepCardProps) {
  return (
    <article
      className={joinClasses(
        "rounded-[14px] border p-4",
        done
          ? "border-[#BBF0D4] bg-[#F3FAF6]"
          : "border-border bg-surface"
      )}
      style={done ? undefined : { boxShadow: "var(--lv-shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
            {step}
          </p>
          <h3 className="mt-2 text-md font-semibold tracking-[-0.015em] text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-1.5 text-sm leading-6 text-text-secondary">
              {description}
            </p>
          ) : null}
          <p
            className={joinClasses(
              "mt-2.5 text-sm font-medium",
              done ? "text-[#15803D]" : "text-text-tertiary"
            )}
          >
            {done ? "✓ Concluído" : "Próximo passo"}
          </p>
        </div>
        {action}
      </div>
    </article>
  );
}

// ─── FeatureCard ──────────────────────────────────────────────────
type FeatureCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <article
      className="rounded-[14px] border border-border bg-surface p-5"
      style={{ boxShadow: "var(--lv-shadow-sm)" }}
    >
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-primary-light text-primary">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-md font-semibold tracking-[-0.015em] text-foreground">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── AppHeader — Liquid Glass ─────────────────────────────────────
type AppHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function AppHeader({ title, action }: AppHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 px-4 pb-3 pt-4"
      style={{
        background: "rgba(248,247,245,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)"
      }}
    >
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-[-0.025em] text-foreground">
            {title}
          </h1>
          {action}
        </div>
      </div>
    </header>
  );
}
