import { useEffect, useState } from "react";
import { X, Check, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "../data/vehicles";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Selo, Overline } from "./kit";
import { formatBRL, whatsappUrl, vehicleWhatsappMsg } from "../lib/site";

export function VehicleDrawer({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle | null;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Reset gallery index when a different vehicle opens
  useEffect(() => {
    setActiveIdx(0);
  }, [vehicle?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!vehicle) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setActiveIdx((i) => Math.min(i + 1, vehicle.images.length - 1));
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(i - 1, 0));
    };
    if (vehicle) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [vehicle, onClose]);

  const specs = vehicle
    ? [
        { label: "Motor / Potência", value: `${vehicle.motor} · ${vehicle.potencia}` },
        { label: "Velocidade máxima", value: vehicle.velocidadeMax },
        { label: "Câmbio", value: vehicle.cambio },
        { label: "Combustível", value: vehicle.combustivel },
      ]
    : [];

  const hasMultiple = (vehicle?.images.length ?? 0) > 1;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          vehicle ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l border-white/[0.08] bg-[#0e0e0f] transition-transform duration-300 ease-out ${
          vehicle ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!vehicle}
      >
        {vehicle && (
          <>
            {/* close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-[#0c0c0d]/60 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto">

              {/* ── main image — light studio panel ── */}
              <div className="relative aspect-[16/11] bg-gradient-to-b from-[#f5f5f6] to-[#e8e9eb]">
                <ImageWithFallback
                  src={vehicle.images[activeIdx]}
                  alt={`${vehicle.brand} ${vehicle.model} — foto ${activeIdx + 1}`}
                  className="h-full w-full object-contain p-6"
                />

                {/* prev / next arrows */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                      disabled={activeIdx === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0c0c0d]/70 text-white backdrop-blur-sm transition-all hover:bg-[#0c0c0d]/90 disabled:opacity-30"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveIdx((i) => Math.min(i + 1, vehicle.images.length - 1))}
                      disabled={activeIdx === vehicle.images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0c0c0d]/70 text-white backdrop-blur-sm transition-all hover:bg-[#0c0c0d]/90 disabled:opacity-30"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* selo */}
                <div className="absolute left-4 top-4">
                  <Selo selo={vehicle.selo} />
                </div>

                {/* image counter */}
                {hasMultiple && (
                  <span className="absolute bottom-3 right-4 font-mono text-[0.625rem] tracking-wide text-white/60 bg-[#0c0c0d]/70 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {activeIdx + 1} / {vehicle.images.length}
                  </span>
                )}
              </div>

              {/* ── thumbnail strip ── */}
              {hasMultiple && (
                <div className="flex gap-2 border-b border-white/[0.06] bg-[#111112] px-4 py-3">
                  {vehicle.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`relative aspect-[4/3] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border-2 bg-gradient-to-b from-[#f5f5f6] to-[#e8e9eb] transition-all duration-150 ${
                        activeIdx === i
                          ? "border-[#6ba5e0] opacity-100"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                      aria-label={`Ver foto ${i + 1}`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${vehicle.brand} ${vehicle.model} — miniatura ${i + 1}`}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* ── info content ── */}
              <div className="flex flex-col gap-6 p-6">
                {/* heading */}
                <div>
                  <Overline className="text-[#6ba5e0]">{vehicle.categoria}</Overline>
                  <h2 className="mt-2 font-display text-[1.75rem] leading-tight tracking-tight text-white">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                  <p className="mt-1 font-mono text-[0.6875rem] tracking-wide text-white/45">
                    {vehicle.year} · {vehicle.km.toLocaleString("pt-BR")} km · {vehicle.color}
                  </p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
                    {vehicle.shortDesc}
                  </p>
                </div>

                {/* specs */}
                <div>
                  <Overline>Especificações rápidas</Overline>
                  <dl className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07] bg-[#141415]">
                    {specs.map((s) => (
                      <div key={s.label} className="flex items-start justify-between gap-4 px-4 py-3">
                        <dt className="text-[0.8125rem] text-white/45 shrink-0">{s.label}</dt>
                        <dd className="text-right text-[0.8125rem] text-white/85">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* highlights */}
                <div>
                  <Overline>Destaques do veículo</Overline>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {vehicle.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-[0.8125rem] text-white/75">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6ba5e0]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── sticky CTA bar ── */}
            <div className="shrink-0 border-t border-white/[0.07] bg-[#111112] p-5">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-[1.625rem] leading-none tracking-tight text-white">
                    {vehicle.price ? formatBRL(vehicle.price) : "Sob consulta"}
                  </p>
                  <p
                    className={`mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] ${
                      vehicle.available ? "text-emerald-400" : "text-white/35"
                    }`}
                  >
                    {vehicle.available ? "Disponível para visita" : "Reservado"}
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl(vehicleWhatsappMsg(vehicle.brand, vehicle.model))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1a7a45] px-6 py-3.5 text-[0.9375rem] font-[500] text-white transition-colors hover:bg-[#1f9052]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                Falar sobre este veículo no WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
