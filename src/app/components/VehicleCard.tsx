import { Vehicle } from "../data/vehicles";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Selo, LinkArrow } from "./kit";
import { formatBRL } from "../lib/site";

export function VehicleCard({
  vehicle,
  onOpen,
}: {
  vehicle: Vehicle;
  onOpen: (v: Vehicle) => void;
}) {
  return (
    <article
      onClick={() => onOpen(vehicle)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#161617] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      {/* ── car photo — light studio panel ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#f5f5f6] to-[#e8e9eb]">
        <ImageWithFallback
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {/* subtle bottom shadow so the dark card body doesn't hard-cut */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#161617]/60 to-transparent" />

        <div className="absolute left-3.5 top-3.5 flex gap-1.5">
          <Selo selo={vehicle.selo} />
        </div>

        {vehicle.images.length > 1 && (
          <span className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-[#0c0c0d]/75 px-2 py-0.5 font-mono text-[0.55rem] tracking-wide text-white/70 backdrop-blur-sm">
            {vehicle.images.length} fotos
          </span>
        )}
      </div>

      {/* ── info block — dark surface ── */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#6ba5e0]">
            {vehicle.categoria}
          </p>
          <h3 className="mt-1 font-display text-[1.0625rem] leading-snug tracking-tight text-white">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="mt-0.5 font-mono text-[0.6875rem] tracking-wide text-white/40">
            {vehicle.year} · {vehicle.km.toLocaleString("pt-BR")} km · {vehicle.color}
          </p>
        </div>

        <p className="text-[0.8125rem] leading-relaxed text-white/55">{vehicle.shortDesc}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.06] pt-4">
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/35">
              Valor
            </p>
            <p className="font-display text-[1rem] tracking-tight text-white">
              {vehicle.price ? formatBRL(vehicle.price) : "Sob consulta"}
            </p>
          </div>
          <LinkArrow onClick={() => onOpen(vehicle)} className="text-[0.8125rem]">
            Ver detalhes
          </LinkArrow>
        </div>
      </div>
    </article>
  );
}
