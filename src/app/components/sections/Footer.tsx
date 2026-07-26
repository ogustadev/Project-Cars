import { Link } from "react-router";
import { Container } from "../kit";

const nav = ["Coleção", "Marcas", "Serviços", "Sobre", "Contato"];
const servicos = [
  "Sourcing internacional",
  "Consignação premium",
  "Gestão de coleção",
  "Financiamento e seguro",
];
const social = ["Instagram", "LinkedIn", "WhatsApp"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-neutral-950 py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="font-display text-[1.0625rem] tracking-[0.24em]">
              SELECT<span className="text-accent">CARS</span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed text-white/45">
              Curadoria de automóveis premium para o colecionador exigente. Atemporal. Discreta.
              Inconfundível.
            </p>
            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              São Paulo · Brasil
            </p>
          </div>

          <FooterCol title="Navegação" items={nav} />
          <FooterCol title="Serviços" items={servicos} />

          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              Contato
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[0.875rem] text-white/75">
              <li>+55 11 0000-0000</li>
              <li>contato@selectcars.com.br</li>
              <li className="text-white/40">Endereço enviado no agendamento</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {social.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[0.8125rem] text-muted-foreground transition-colors hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-[0.75rem] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SELECTCARS — Todos os direitos reservados</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition-colors hover:text-white/70">
              Política de privacidade
            </a>
            <a href="#" className="transition-colors hover:text-white/70">
              Termos de uso
            </a>
            <a href="#" className="transition-colors hover:text-white/70">
              Cookies
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              className="text-[0.875rem] text-white/60 transition-colors hover:text-[#6ba5e0]"
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
