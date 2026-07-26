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
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] transition-all duration-500 hover:border-white/[0.14] hover:shadow-[0_0_0_1px_rgba(107,165,224,0.08),0_24px_64px_rgba(0,0,0,0.7),0_0_80px_rgba(107,165,224,0.04)]"
    >
      {/* ── car photo — studio panel with cinematic overlay ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#e8e9eb] via-[#f0f1f2] to-[#d8d9db]">
        <ImageWithFallback
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="h-full w-full object-contain p-5 transition-all duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Scan-line reveal effect on hover */}
        <div className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-b from-transparent via-[#6ba5e0]/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100" />

        {/* Bottom-to-dark gradient for seamless body join */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111113] via-[#111113]/40 to-transparent" />

        {/* Diagonal cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#111113]/20 via-transparent to-transparent" />

        <div className="absolute left-3.5 top-3.5 flex gap-1.5">
          <Selo selo={vehicle.selo} />
        </div>

        {vehicle.images.length > 1 && (
          <span className="absolute bottom-3 right-3.5 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[0.55rem] tracking-widest text-white/60 backdrop-blur-sm transition-all duration-300 group-hover:border-white/25 group-hover:text-white/80">
            <span className="h-1 w-1 rounded-full bg-[#6ba5e0]/70" />
            {vehicle.images.length} fotos
          </span>
        )}
      </div>

      {/* ── info block ── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-[#6ba5e0]/80 transition-colors duration-300 group-hover:text-[#6ba5e0]">
            {vehicle.categoria}
          </p>
          <h3 className="mt-1.5 font-display text-[1.125rem] leading-tight tracking-[-0.02em] text-white">
            {vehicle.brand}{" "}
            <span className="font-light text-white/70">{vehicle.model}</span>
          </h3>
          <p className="mt-1 font-mono text-[0.625rem] tracking-wide text-white/30">
            {vehicle.year} · {vehicle.km.toLocaleString("pt-BR")} km · {vehicle.color}
          </p>
        </div>

        <p className="text-[0.8125rem] leading-relaxed text-white/45 line-clamp-2">
          {vehicle.shortDesc}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.05] pt-4">
          <div>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-white/25">
              Valor
            </p>
            {vehicle.price ? (
              <p className="font-display text-[1.0625rem] tracking-tight text-[#d4a84b]">
                {formatBRL(vehicle.price)}
              </p>
            ) : (
              <p className="font-display text-[1rem] tracking-tight text-white/40 italic">
                Sob consulta
              </p>
            )}
          </div>
          <LinkArrow onClick={() => onOpen(vehicle)} className="text-[0.8125rem]">
            Ver detalhes
          </LinkArrow>
        </div>
      </div>

      {/* Side accent line — appears on hover */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#6ba5e0]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </article>
  );
}
