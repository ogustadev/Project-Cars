import { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/** Centered max-width content container */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-5 sm:px-8 md:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/** Uppercase overline label with wide tracking */
export function Overline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase text-[0.6875rem] tracking-[0.18em] text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

/** Numbered section marker e.g. "01 / Sobre" */
export function SectionMarker({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-accent">{index}</span>
      <span className="h-px w-8 bg-border" />
      <Overline>{label}</Overline>
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: boolean;
  className?: string;
  target?: string;
};

export function PillButton({
  children,
  onClick,
  href,
  variant = "primary",
  icon = true,
  className = "",
  target,
}: ButtonProps) {
  const base =
    "group inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[0.9375rem] leading-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
  const styles = {
    primary:
      "bg-white text-neutral-900 hover:bg-white/85 font-[500]",
    secondary:
      "border border-border text-foreground hover:border-accent/60 hover:bg-accent/[0.06]",
    ghost: "text-foreground hover:text-accent",
  }[variant];

  const content = (
    <>
      <span className="truncate">{children}</span>
      {icon && (
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target ? "noopener noreferrer" : undefined}
        className={`${base} ${styles} ${className}`}
      >
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {content}
    </button>
  );
}

// Selos are displayed over light car-photo panels — needs opaque dark bg for contrast
const seloStyles: Record<string, string> = {
  RARO:             "border-[#6ba5e0]/60 text-[#6ba5e0]",
  "ÚLTIMA UNIDADE": "border-red-400/60   text-red-300",
  NOVO:             "border-emerald-500/60 text-emerald-400",
  RESERVADO:        "border-white/30     text-white/70",
  "EDIÇÃO LIMITADA":"border-[#6ba5e0]/60 text-[#6ba5e0]",
};

export function Selo({ selo }: { selo: string | null }) {
  if (!selo) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border bg-[#0c0c0d]/80 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] backdrop-blur-md ${
        seloStyles[selo] ?? "border-white/30 text-white"
      }`}
    >
      {selo}
    </span>
  );
}

export function LinkArrow({
  children,
  onClick,
  href,
  target,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-1.5 whitespace-nowrap text-[0.9375rem] text-foreground transition-colors hover:text-accent ${className}`;
  const inner = (
    <>
      {children}
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  if (href)
    return (
      <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined} className={cls}>
        {inner}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
