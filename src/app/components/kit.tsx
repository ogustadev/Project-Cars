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
    "group inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 h-11 text-[0.9375rem] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
  const styles = {
    primary:
      "bg-white text-neutral-900 hover:bg-white/85 font-[500]",
    secondary:
      "border border-accent/40 text-foreground hover:border-accent hover:bg-accent/[0.08]",
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
const seloConfig: Record<string, { cls: string; glow: string; pulse: boolean }> = {
  RARO:             { cls: "border-[#6ba5e0]/50 text-[#6ba5e0]",    glow: "shadow-[0_0_10px_rgba(107,165,224,0.3)]",  pulse: true  },
  "ÚLTIMA UNIDADE": { cls: "border-red-400/50   text-red-300",       glow: "shadow-[0_0_10px_rgba(248,113,113,0.35)]", pulse: true  },
  NOVO:             { cls: "border-emerald-500/50 text-emerald-400", glow: "shadow-[0_0_8px_rgba(52,211,153,0.25)]",   pulse: false },
  RESERVADO:        { cls: "border-white/20     text-white/50",      glow: "",                                         pulse: false },
  "EDIÇÃO LIMITADA":{ cls: "border-[#d4a84b]/50 text-[#d4a84b]",    glow: "shadow-[0_0_10px_rgba(212,168,75,0.3)]",  pulse: false },
};

export function Selo({ selo }: { selo: string | null }) {
  if (!selo) return null;
  const cfg = seloConfig[selo] ?? { cls: "border-white/20 text-white/60", glow: "", pulse: false };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-[#0c0c0d]/85 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] backdrop-blur-md ${cfg.cls} ${cfg.glow}`}
    >
      {cfg.pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${cfg.cls.includes("red") ? "bg-red-400" : cfg.cls.includes("6ba5") ? "bg-[#6ba5e0]" : "bg-emerald-400"}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.cls.includes("red") ? "bg-red-400" : cfg.cls.includes("6ba5") ? "bg-[#6ba5e0]" : "bg-emerald-400"}`} />
        </span>
      )}
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
