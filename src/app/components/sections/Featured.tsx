import { useState } from "react";
import { useNavigate } from "react-router";
import { Container, SectionMarker, PillButton, Selo } from "../kit";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useVehicles } from "../../context/VehiclesContext";
import { formatBRL, whatsappUrl, vehicleWhatsappMsg } from "../../lib/site";

const tabs = ["Exterior", "Interior", "Rodas", "Mecânica", "Documentação"];

export function Featured() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [tab, setTab] = useState(tabs[0]);

  // Pega o primeiro veículo não pausado da coleção real
  const v = vehicles.find((v) => !v.paused);

  if (!v) return null;

  const spotlightSrc = v.featuredImage ?? v.images[0];

  return (
    <section id="destaque" className="border-t border-white/[0.06] py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionMarker index="02" label="Em destaque" />
        <h2 className="mt-10 max-w-2xl font-display text-[2.25rem] font-light leading-[1.05] tracking-wide text-white sm:text-[3rem]">
          Cada detalhe contado.
          <br />
          <span className="text-white/40">Cada procedência verificada.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          {/* ── spotlight photo — dark cinematic panel ── */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-[#1a1a1a] to-[#050505]">
            
            {/* Spotlight Radial Glow atrás do carro */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative flex aspect-[16/10] items-center justify-center p-6 pb-20 sm:p-10 sm:pb-24">
              <ImageWithFallback
                src={spotlightSrc}
                alt={`${v.brand} ${v.model} em destaque`}
                className="relative z-10 w-4/5 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* selo real do veículo */}
              <div className="absolute left-6 top-6 z-20">
                <Selo selo={v.selo} />
              </div>

              {/* Feature badges overlaid using Glassmorphism */}
              {v.highlights.length > 0 && (
                <div className="absolute bottom-6 inset-x-0 z-20 flex w-full flex-wrap justify-center gap-3 px-6">
                  {v.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[0.625rem] tracking-[0.06em] text-white/80 shadow-lg backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-amber-400 opacity-50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      </span>
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── spec card — dark surface ── */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.375rem] tracking-tight text-white">
                {v.brand} {v.model}
              </h3>
              <span className="font-display text-[1.125rem] tracking-tight text-amber-400">
                {v.price ? formatBRL(v.price) : "Sob consulta"}
              </span>
            </div>

            {/* 2x2 Specs Grid */}
            <div className="my-8 grid grid-cols-2 gap-4">
              {/* Motor */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">Motor</p>
                <p className="text-sm font-medium text-white/90">{v.motor}</p>
                <p className="mt-1 text-xs text-white/50">{v.potencia}</p>
              </div>

              {/* Desempenho */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">Vel. Máxima</p>
                <p className="text-sm font-medium text-white/90">{v.velocidadeMax}</p>
              </div>

              {/* Transmissão */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">Transmissão</p>
                <p className="text-sm font-medium text-white/90">{v.carroceria}</p>
                <p className="mt-1 text-xs text-white/50">{v.cambio}</p>
              </div>

              {/* Combustível */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">Combustível</p>
                <p className="text-sm font-medium text-white/90">{v.combustivel}</p>
              </div>
            </div>

            {/* tab pills - Segmented Control Style */}
            <div className="mb-4 inline-flex flex-wrap gap-1 rounded-full bg-white/5 p-1 self-start">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-[0.8125rem] transition-colors ${
                    tab === t
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <p className="mb-7 text-[0.8125rem] leading-relaxed text-white/45">
              Documentação de {tab.toLowerCase()} disponível para análise durante a visita
              privada, incluindo registros fotográficos e laudo técnico independente.
            </p>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PillButton className="w-full sm:w-auto" onClick={() => navigate("/colecao")}>
                Ver coleção completa
              </PillButton>
              <PillButton
                className="w-full sm:w-auto"
                variant="secondary"
                icon={false}
                href={whatsappUrl(vehicleWhatsappMsg(v.brand, v.model))}
                target="_blank"
              >
                Solicitar proposta
              </PillButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
