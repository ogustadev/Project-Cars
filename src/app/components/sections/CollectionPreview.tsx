import { useState } from "react";
import { useNavigate } from "react-router";
import { Container, SectionMarker, PillButton, LinkArrow } from "../kit";
import { VehicleCard } from "../VehicleCard";
import { vehicles, Vehicle } from "../../data/vehicles";
import { whatsappUrl, GENERIC_WHATSAPP_MSG } from "../../lib/site";

const filters = [
  "Todos",
  "Esportivos",
  "Clássicos",
  "SUV Premium",
  "Edições limitadas",
  "Recém-chegados",
];

export function CollectionPreview({ onOpen }: { onOpen: (v: Vehicle) => void }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Todos");

  const list = (
    filter === "Todos"
      ? vehicles
      : filter === "Recém-chegados"
      ? vehicles.filter((v) => v.addedWeeksAgo <= 1)
      : vehicles.filter((v) => v.categoria === filter)
  ).slice(0, 6);

  return (
    <section id="colecao" className="theme-light bg-background text-foreground py-16 sm:py-24 lg:py-32 min-h-[100svh] flex flex-col justify-center">
      <Container>
        <SectionMarker index="03" label="Coleção" />
        <div className="mt-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
              Disponíveis no showroom.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              Uma seleção atualizada semanalmente. Para a coleção completa, agende uma visita
              privada.
            </p>
          </div>
          <div className="hidden lg:block">
            <PillButton variant="secondary" onClick={() => navigate("/colecao")}>
              Ver coleção completa
            </PillButton>
          </div>
        </div>

        {/* Filter pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors ${
                filter === f
                  ? "border-foreground bg-foreground/5 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onOpen={onOpen} />
          ))}
        </div>

        {/* Not found block */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-8 lg:flex-row lg:items-center lg:p-12 shadow-sm">
          <div className="max-w-xl">
            <h3 className="font-display text-[1.5rem] tracking-tight">Não encontrou o que procura?</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Para modelos específicos, edições limitadas ou unidades em outros estados, compartilhe
              o que você procura. Buscamos no mercado interno e internacional.
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
            <PillButton className="w-full sm:w-auto" href={whatsappUrl(GENERIC_WHATSAPP_MSG)} target="_blank">
              Falar com um curador
            </PillButton>
            <LinkArrow onClick={() => navigate("/colecao")}>Ver coleção completa</LinkArrow>
          </div>
        </div>
      </Container>
    </section>
  );
}
