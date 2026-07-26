import { useState } from "react";
import { useNavigate } from "react-router";
import { Container, SectionMarker, PillButton, Selo } from "../kit";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { vehicles } from "../../data/vehicles";
import { formatBRL, whatsappUrl, vehicleWhatsappMsg } from "../../lib/site";

const tabs = ["Exterior", "Interior", "Rodas", "Mecânica", "Documentação"];

const specs = [
  { label: "Motor", value: "4.0L Boxer 6 aspirado · 525 cv · 0–100 em 3.2s" },
  { label: "Velocidade máxima", value: "296 km/h" },
  { label: "Transmissão", value: "Tração traseira · PDK 7 velocidades" },
  { label: "Combustível", value: "13.6 / 8.9 L/100 km · Combinado · WLTP" },
];

export function Featured() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(tabs[0]);
  const v = vehicles[0];
  // Use the silver side-profile dedicated spotlight image
  const spotlightSrc = v.featuredImage ?? v.images[0];

  return (
    <section id="destaque" className="border-t border-white/[0.06] py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionMarker index="02" label="Em destaque" />
        <h2 className="mt-10 max-w-2xl font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-[3rem]">
          Cada detalhe contado.
          <br />
          <span className="text-white/40">Cada procedência verificada.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          {/* ── spotlight photo — light studio panel ── */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#f5f5f6] to-[#e8e9eb]">
            <div className="relative aspect-[16/10]">
              <ImageWithFallback
                src={spotlightSrc}
                alt={`${v.brand} ${v.model} em destaque`}
                className="h-full w-full object-contain p-6 sm:p-10"
              />

              {/* subtle bottom fade into card body */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#e8e9eb]/80 to-transparent" />

              {/* selo */}
              <div className="absolute left-5 top-5">
                <Selo selo="RARO" />
              </div>

              {/* annotation pins — light-panel-safe (dark badge) */}
              {v.highlights.map((h, i) => (
                <span
                  key={h}
                  className="absolute flex items-center gap-2"
                  style={{
                    top: `${22 + i * 19}%`,
                    left: i % 2 === 0 ? "5%" : "auto",
                    right: i % 2 === 0 ? "auto" : "5%",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6ba5e0] shadow-[0_0_10px_rgba(107,165,224,0.9)]" />
                  <span className="rounded-full border border-black/10 bg-white/90 px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-neutral-700 shadow-sm backdrop-blur-sm">
                    {h}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ── spec card — dark surface ── */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.375rem] tracking-tight text-white">
                {v.brand} {v.model}
              </h3>
              <span className="font-display text-[1.125rem] tracking-tight text-[#6ba5e0]">
                {formatBRL(v.price!)}
              </span>
            </div>

            <dl className="mt-5 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07] bg-[#141415]">
              {specs.map((s) => (
                <div key={s.label} className="px-4 py-3.5">
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/40">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-[0.875rem] text-white/85">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* tab pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
                    tab === t
                      ? "border-[#6ba5e0]/50 bg-[#6ba5e0]/10 text-[#6ba5e0]"
                      : "border-white/[0.07] text-white/45 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-white/45">
              Documentação de {tab.toLowerCase()} disponível para análise durante a visita
              privada, incluindo registros fotográficos e laudo técnico independente.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
