import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  showTagline?: boolean;
  size?: "md" | "sm";
};

export function BrandLogo({
  href,
  showTagline = false,
  size = "md"
}: BrandLogoProps) {
  const content = (
    <div className="inline-flex items-center gap-3">
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect
            height="15"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
            width="14"
            x="5"
            y="6"
          />
          <path
            d="M8 3.8v4.2M16 3.8v4.2M8.5 11.5h7M8.5 15h5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-accent" />
      </span>
      <span>
        <span
          className={`block font-bold tracking-[-0.02em] text-foreground ${
            size === "sm" ? "text-base" : "text-lg"
          }`}
        >
          LembraVenda
        </span>
        {showTagline ? (
          <span className="block text-xs text-text-secondary">
            Agenda de vendas para quem vende pelo WhatsApp
          </span>
        ) : null}
      </span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className="inline-flex items-center" href={href}>
      {content}
    </Link>
  );
}
