import { useNavigate } from "react-router";
import { Container, PillButton } from "../kit";
import { vehicles, featuredBrands } from "../../data/vehicles";
import { whatsappUrl, GENERIC_WHATSAPP_MSG } from "../../lib/site";
import heroVideo from "../../../imports/5309381-hd_1920_1080_25fps.mp4";

const heroStats = [
  { value: "9", label: "Modelos no acervo" },
  { value: "5%", label: "Taxa de seleção", accent: true },
  { value: "SP", label: "Showroom exclusivo" },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── VIDEO BACKGROUND ──────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 30%" }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* ── GRADIENT LAYERS ───────────────────────────────────────── */}
      {/* 1 — dark film for overall depth */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 2 — diagonal sweep: heavy top-left → lighter right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(12,12,13,0.97) 0%, rgba(12,12,13,0.78) 30%, rgba(12,12,13,0.35) 60%, transparent 85%)",
        }}
      />

      {/* 3 — bottom fade to page background */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "60%",
          background:
            "linear-gradient(to top, #0c0c0d 0%, rgba(12,12,13,0.85) 28%, rgba(12,12,13,0.4) 55%, transparent 100%)",
        }}
      />

      {/* 4 — top vignette for header legibility */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "9rem",
          background:
            "linear-gradient(to bottom, rgba(12,12,13,0.7) 0%, transparent 100%)",
        }}
      />

      {/* ── ACCENT LIGHT — subtle blue glow lower-left ────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[40vh] w-[35vw]"
        style={{
          background:
            "radial-gradient(ellipse at 20% 90%, rgba(107,165,224,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col"
        style={{ minHeight: "100svh" }}
      >
        <Container className="flex flex-1 flex-col pt-16 sm:pt-20">
          {/* Main content — bottom-anchored */}
          <div className="flex flex-1 flex-col justify-end pb-12 sm:pb-16 lg:pb-20">

            {/* Overline */}
            <div className="flex items-center gap-3 animate-[slide-up_0.6s_ease_0.05s_both]">
              <span className="h-px w-6 bg-[#6ba5e0]" />
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[#6ba5e0]">
                2026&nbsp;/&nbsp;Edição 01
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-6 max-w-4xl font-display leading-[0.87] tracking-[-0.04em] text-white animate-[slide-up_0.75s_ease_0.15s_both]"
              style={{ fontSize: "clamp(3rem, 6.5vw + 0.5rem, 7.5rem)" }}
            >
              Carros que não
              <br />
              se encontram.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.18) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Se reconhecem.
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/45 animate-[slide-up_0.7s_ease_0.28s_both]">
              Curadoria de automóveis raros, esportivos e de coleção para quem
              entende a diferença entre possuir e pertencer.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center animate-[slide-up_0.7s_ease_0.38s_both]">
              {heroStats.map((s, i) => (
                <div key={s.value} className="flex items-center">
                  <div className="px-5 first:pl-0">
                    <p
                      className={`font-display text-[1.75rem] leading-none tracking-tight lg:text-[2.125rem] ${
                        s.accent ? "text-[#6ba5e0]" : "text-white"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/30">
                      {s.label}
                    </p>
                  </div>
                  {i < heroStats.length - 1 && (
                    <span className="h-8 w-px shrink-0 bg-white/[0.1]" />
                  )}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-[slide-up_0.7s_ease_0.47s_both]">
              <PillButton onClick={() => navigate("/colecao")}>
                Ver coleção
              </PillButton>
              <PillButton
                variant="secondary"
                icon={false}
                href={whatsappUrl(GENERIC_WHATSAPP_MSG)}
                target="_blank"
              >
                Agendar visita
              </PillButton>
            </div>

            {/* Scroll indicator */}
            <div className="mt-10 flex items-center gap-3 animate-[slide-up_0.6s_ease_0.7s_both]">
              <div className="flex h-7 w-[1.125rem] items-center justify-center rounded-full border border-white/20 pb-0.5">
                <span className="h-2 w-0.5 rounded-full bg-white/55 animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
              </div>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-white/28">
                Descobrir
              </span>
            </div>
          </div>

          {/* Contact strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] py-4 font-mono text-[0.6875rem] tracking-wide text-white/35">
            <span>+55 11 0000-0000</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>São Paulo, SP</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Atendimento sob agendamento</span>
          </div>
        </Container>

        {/* Brand marquee */}
        <div className="overflow-hidden border-t border-white/[0.04] py-5">
          <div className="flex animate-[marquee_28s_linear_infinite] items-center gap-14 whitespace-nowrap">
            {[...featuredBrands, ...featuredBrands, ...featuredBrands].map(
              (b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="font-display text-[1.25rem] uppercase tracking-[0.12em] text-white/10"
                >
                  {b}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
