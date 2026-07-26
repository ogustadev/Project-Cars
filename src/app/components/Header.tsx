import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X, Search, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Container, PillButton } from "./kit";

const NAV = [
  { label: "Início",    to: "#top",       section: "top" },
  { label: "Sobre",     to: "#sobre",     section: "sobre" },
  { label: "Coleção",   to: "/colecao",   route: true },
  { label: "Destaque",  to: "#destaque",  section: "destaque" },
  { label: "Processo",  to: "#processo",  section: "processo" },
  { label: "Perguntas", to: "#perguntas", section: "perguntas" },
];

const SECTION_IDS = NAV.filter((n) => n.section).map((n) => n.section!);

export function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [open, setOpen]                   = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const navigate  = useNavigate();
  const location  = useLocation();

  // Detect scroll depth
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in viewport
  useEffect(() => {
    if (location.pathname !== "/") return;
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [location.pathname]);

  const goTo = (item: (typeof NAV)[number]) => {
    setOpen(false);
    if (item.route) {
      navigate(item.to);
      window.scrollTo(0, 0);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/" + item.to);
    } else if (item.to === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(item.to)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.route) return location.pathname === "/colecao";
    return location.pathname === "/" && activeSection === item.section;
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(12,12,13,0.65)"
          : "rgba(12,12,13,0.18)",
        backdropFilter:       "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
      }}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="font-display text-[1.0625rem] tracking-[0.24em] text-white"
        >
          SELECT<span className="text-accent">CARS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.label}
                onClick={() => goTo(item)}
                className="relative rounded-full px-4 py-2 text-[0.875rem] transition-colors duration-200"
                style={{ color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.50)" }}
              >
                {/* Sliding glass pill */}
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border:     "1px solid rgba(255,255,255,0.10)",
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  />
                )}

                {/* Lamp line + glow at bottom */}
                {active && (
                  <motion.div
                    layoutId="nav-lamp"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  >
                    {/* Blue accent line */}
                    <div className="h-[2px] w-6 rounded-full bg-[#6ba5e0]/75" />
                    {/* Glow halo */}
                    <div
                      className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-md"
                      style={{
                        width: "3rem",
                        height: "1.25rem",
                        background: "rgba(107,165,224,0.22)",
                        transform: "translateX(-50%) translateY(-40%)",
                      }}
                    />
                  </motion.div>
                )}

                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/colecao")}
            aria-label="Buscar"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
          >
            <Search className="h-[1.05rem] w-[1.05rem]" />
          </button>

          <Link
            to="/admin"
            className="hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/30 transition-all hover:text-white/60 sm:flex"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Lock className="h-3 w-3" />
            Admin
          </Link>

          <div className="hidden sm:block">
            <PillButton
              variant="secondary"
              icon={false}
              onClick={() =>
                location.pathname !== "/"
                  ? navigate("/#contato")
                  : document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Agendar visita
            </PillButton>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            background:           "rgba(12,12,13,0.88)",
            backdropFilter:       "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderTop:            "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Container className="flex flex-col py-4">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item)}
                className="py-3 text-left text-[0.9375rem] text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3">
              <PillButton
                variant="secondary"
                icon={false}
                onClick={() => goTo({ label: "", to: "#contato" } as any)}
              >
                Agendar visita
              </PillButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
