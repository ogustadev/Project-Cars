import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Container, PillButton } from "../components/kit";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleDrawer } from "../components/VehicleDrawer";
import {
  Vehicle,
  brands,
  carrocerias,
  cambios,
  combustiveis,
} from "../data/vehicles";
import { useVehicles } from "../context/VehiclesContext";
import { formatBRL, whatsappUrl, GENERIC_WHATSAPP_MSG } from "../lib/site";

const quickFilters = [
  "Todos",
  "Esportivos",
  "Clássicos",
  "SUV Premium",
  "Edições limitadas",
  "Recém-chegados",
];

const sortOptions = [
  { value: "recent", label: "Recém-chegados" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "km-asc", label: "Menor km" },
];

const MAX_PRICE = 3450000;

export function Catalog() {
  const { vehicles } = useVehicles();
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [quick, setQuick] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selBody, setSelBody] = useState<string[]>([]);
  const [selCambio, setSelCambio] = useState<string[]>([]);
  const [selFuel, setSelFuel] = useState<string[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const clearAll = () => {
    setOnlyAvailable(false);
    setMaxPrice(MAX_PRICE);
    setSelBrands([]);
    setSelBody([]);
    setSelCambio([]);
    setSelFuel([]);
  };

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (v.paused) return false;
      if (quick !== "Todos") {
        if (quick === "Recém-chegados" ? v.addedWeeksAgo > 1 : v.categoria !== quick) return false;
      }
      if (onlyAvailable && !v.available) return false;
      if (v.price !== null && v.price > maxPrice) return false;
      if (selBrands.length && !selBrands.includes(v.brand)) return false;
      if (selBody.length && !selBody.includes(v.carroceria)) return false;
      if (selCambio.length && !selCambio.includes(v.cambio)) return false;
      if (selFuel.length && !selFuel.includes(v.combustivel)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !`${v.brand} ${v.model} ${v.color}`.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "price-desc":
          return (b.price ?? -Infinity) - (a.price ?? -Infinity);
        case "km-asc":
          return a.km - b.km;
        default:
          return a.addedWeeksAgo - b.addedWeeksAgo;
      }
    });
    return list;
  }, [vehicles, quick, onlyAvailable, maxPrice, selBrands, selBody, selCambio, selFuel, search, sort]);

  const sidebar = (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[1rem] tracking-tight">Filtrar por</h3>
        <button
          onClick={clearAll}
          className="text-[0.8125rem] text-muted-foreground transition-colors hover:text-accent"
        >
          Limpar
        </button>
      </div>

      <FilterGroup title="Disponibilidade">
        <label className="flex cursor-pointer items-center gap-3 text-[0.875rem]">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="h-4 w-4 accent-[#6ba5e0]"
          />
          Apenas disponíveis para visita
        </label>
      </FilterGroup>

      <FilterGroup title="Faixa de valor">
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#6ba5e0]"
        />
        <div className="mt-2 flex justify-between font-mono text-[0.6875rem] text-muted-foreground">
          <span>R$ 0</span>
          <span>{formatBRL(maxPrice)}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Marca">
        <CheckList options={brands} selected={selBrands} onToggle={(v) => toggle(selBrands, setSelBrands, v)} />
      </FilterGroup>

      <FilterGroup title="Carroceria">
        <ChipList options={carrocerias} selected={selBody} onToggle={(v) => toggle(selBody, setSelBody, v)} />
      </FilterGroup>

      <FilterGroup title="Câmbio">
        <ChipList options={cambios} selected={selCambio} onToggle={(v) => toggle(selCambio, setSelCambio, v)} />
      </FilterGroup>

      <FilterGroup title="Combustível">
        <ChipList options={combustiveis} selected={selFuel} onToggle={(v) => toggle(selFuel, setSelFuel, v)} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="pt-24 pb-24 lg:pt-28">
      <Container>
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-accent" />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            Coleção · Showroom São Paulo
          </span>
        </div>
        <h1 className="mt-6 font-display text-[2.5rem] leading-none tracking-[-0.02em] sm:text-[3.25rem]">
          {vehicles.filter((v) => !v.paused).length} veículos no acervo
        </h1>

        {/* Quick filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {quickFilters.map((f) => (
            <button
              key={f}
              onClick={() => setQuick(f)}
              className={`rounded-full px-4 py-2 text-[0.8125rem] font-mono tracking-wide transition-all duration-300 ${
                quick === f
                  ? "border border-[#6ba5e0]/40 bg-[#6ba5e0]/10 text-white shadow-[0_0_12px_rgba(107,165,224,0.2)]"
                  : "border border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar marca, modelo ou cor"
              className="w-full rounded-full border border-border bg-input px-11 py-3 text-[0.875rem] placeholder:text-muted-foreground focus:border-white/25 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-3 text-[0.8125rem] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-input px-4 py-3 text-[0.8125rem] text-foreground focus:border-white/25 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-background">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{sidebar}</div>
          </aside>

          <div>
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((v) => (
                    <VehicleCard key={v.id} vehicle={v} onOpen={setSelected} />
                  ))}
                </div>
                <div className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[0.75rem] text-muted-foreground">
                  <span>
                    Exibindo 1–{filtered.length} de {filtered.length}
                  </span>
                  <span>01 / 01</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-10">
                <h3 className="font-display text-[1.5rem] tracking-tight">
                  Nenhum veículo encontrado com esses filtros.
                </h3>
                <p className="max-w-lg text-[0.9375rem] leading-relaxed text-white/55">
                  Fale diretamente com a loja — talvez tenhamos algo em processo de chegada ou
                  possamos buscar no mercado por você.
                </p>
                <PillButton href={whatsappUrl(GENERIC_WHATSAPP_MSG)} target="_blank">
                  Falar no WhatsApp
                </PillButton>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto border-r border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display tracking-tight">Filtros</span>
              <button onClick={() => setMobileFilters(false)} aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <VehicleDrawer vehicle={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <p className="mb-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckList({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((o) => (
        <label key={o} className="flex cursor-pointer items-center gap-3 text-[0.875rem]">
          <input
            type="checkbox"
            checked={selected.includes(o)}
            onChange={() => onToggle(o)}
            className="h-4 w-4 accent-[#6ba5e0]"
          />
          <span className={selected.includes(o) ? "text-white" : "text-white/50"}>{o}</span>
        </label>
      ))}
    </div>
  );
}

function ChipList({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onToggle(o)}
          className={`rounded-full border px-3 py-1.5 text-[0.75rem] transition-colors ${
            selected.includes(o)
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
