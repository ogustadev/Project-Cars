import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Plus, Pencil, Trash2, PauseCircle, PlayCircle, Search, X,
  ArrowLeft, Save, Car, Eye, EyeOff, HelpCircle, Check,
  ChevronUp, ChevronDown, AlertTriangle, Image as ImageIcon,
  BarChart2, LogOut, LayoutGrid, TrendingUp, TrendingDown,
} from "lucide-react";
import { useVehicles } from "../context/VehiclesContext";
import {
  Vehicle, Selo, Categoria, Carroceria, Cambio, Combustivel,
  categorias, carrocerias, cambios, combustiveis,
} from "../data/vehicles";
import { formatBRL } from "../lib/site";
import imgLogin from "../../imports/Image__Porsche_911_GT3_RS_em_destaque_-1.png";

// ── Design tokens — dark cinematic (matches public site) ─────────────────────
const ACCENT  = "#6ba5e0";           // same blue accent as public site
const BG      = "#0c0c0d";           // page background
const SURFACE = "#161617";           // card surface
const FRAME   = "#111112";           // sidebar / topbar
const TEXT    = "#f4f4f5";           // foreground
const MUTED   = "rgba(255,255,255,0.4)";
const BORDER  = "rgba(255,255,255,0.08)";

// ── Mock analytics ────────────────────────────────────────────────────────────
const MONTHLY_REV = [
  { month: "Fev", value: 2_890_000 },
  { month: "Mar", value: 4_150_000 },
  { month: "Abr", value: 2_100_000 },
  { month: "Mai", value: 5_800_000 },
  { month: "Jun", value: 2_950_000 },
  { month: "Jul", value: 3_420_000, current: true },
];

const FUNNEL = [
  { label: "Visitas ao site",   value: 4_800 },
  { label: "Leads WhatsApp",    value:   342 },
  { label: "Visitas agendadas", value:    96 },
  { label: "Vendas",            value:    12 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function addedDate(weeksAgo: number): string {
  const d = new Date(2026, 6, 12);
  d.setDate(d.getDate() - weeksAgo * 7);
  return [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("/");
}

// ── Types & converters ────────────────────────────────────────────────────────
interface FormState {
  brand: string; model: string; year: string; km: string;
  color: string; motor: string; potencia: string; velocidadeMax: string;
  price: string; priceOnConsult: boolean; shortDesc: string;
  highlights: string[]; selo: string; categoria: Categoria;
  carroceria: Carroceria; cambio: Cambio; combustivel: Combustivel;
  available: boolean; addedWeeksAgo: string;
}

const emptyForm: FormState = {
  brand: "", model: "", year: String(new Date().getFullYear()), km: "0",
  color: "", motor: "", potencia: "", velocidadeMax: "", price: "",
  priceOnConsult: false, shortDesc: "", highlights: ["", "", "", ""],
  selo: "", categoria: "Esportivos", carroceria: "Coupé",
  cambio: "Automático", combustivel: "Gasolina", available: true, addedWeeksAgo: "0",
};

function vehicleToForm(v: Vehicle): FormState {
  return {
    brand: v.brand, model: v.model, year: String(v.year), km: String(v.km),
    color: v.color, motor: v.motor, potencia: v.potencia, velocidadeMax: v.velocidadeMax,
    price: v.price !== null ? String(v.price) : "",
    priceOnConsult: v.price === null,
    shortDesc: v.shortDesc,
    highlights: [...v.highlights, "", "", "", ""].slice(0, 4),
    selo: v.selo ?? "", categoria: v.categoria, carroceria: v.carroceria,
    cambio: v.cambio, combustivel: v.combustivel, available: v.available,
    addedWeeksAgo: String(v.addedWeeksAgo),
  };
}

function formToVehicle(form: FormState, existing?: Vehicle): Vehicle {
  const id = existing?.id ?? `${form.brand.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  return {
    id, brand: form.brand.trim(), model: form.model.trim(),
    year: parseInt(form.year) || new Date().getFullYear(),
    km: parseInt(form.km) || 0, color: form.color.trim(),
    motor: form.motor.trim(), potencia: form.potencia.trim(),
    velocidadeMax: form.velocidadeMax.trim(),
    price: form.priceOnConsult ? null : (parseFloat(form.price) || null),
    shortDesc: form.shortDesc.trim(),
    highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
    selo: (form.selo as Selo) || null, categoria: form.categoria,
    carroceria: form.carroceria, cambio: form.cambio, combustivel: form.combustivel,
    available: form.available, paused: existing?.paused ?? false,
    images: existing?.images ?? [], featuredImage: existing?.featuredImage,
    addedWeeksAgo: parseInt(form.addedWeeksAgo) || 0,
  };
}

// ── Dark form field styles ────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 text-[0.875rem] " +
  "placeholder:text-white/25 focus:outline-none transition-colors " +
  "border-white/[0.08] text-white focus:border-[#6ba5e0]/50";

const selectCls =
  "w-full rounded-lg border bg-[#1a1a1b] px-3.5 py-2.5 text-[0.875rem] " +
  "focus:outline-none transition-colors border-white/[0.08] text-white focus:border-[#6ba5e0]/50";

const labelCls =
  "mb-1.5 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white/35";

// ── Status badge (dark) ───────────────────────────────────────────────────────
function StatusBadge({ vehicle }: { vehicle: Vehicle }) {
  if (vehicle.paused)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-[0.6875rem] text-orange-400">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
        Pausado
      </span>
    );
  if (!vehicle.available)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.6875rem] text-white/40">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
        Reservado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.6875rem] text-emerald-400">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
      Publicado
    </span>
  );
}

// ── Selo badge (dark) ─────────────────────────────────────────────────────────
function SeloBadge({ selo }: { selo: Selo }) {
  if (!selo) return <span className="text-white/20">—</span>;
  const colors: Record<string, string> = {
    RARO: "text-[#6ba5e0]",
    "ÚLTIMA UNIDADE": "text-red-400",
    NOVO: "text-emerald-400",
    RESERVADO: "text-white/40",
    "EDIÇÃO LIMITADA": "text-amber-400",
    "NOVA UNIDADE": "text-emerald-400",
  };
  return (
    <span
      className={`rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] ${colors[selo] ?? "text-white/40"}`}
    >
      {selo}
    </span>
  );
}

// ── Delete dialog (dark) ──────────────────────────────────────────────────────
function DeleteDialog({ vehicle, onConfirm, onCancel }: {
  vehicle: Vehicle; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-7"
        style={{ background: SURFACE, borderColor: BORDER }}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <h3 className="font-display text-[1.125rem] tracking-tight" style={{ color: TEXT }}>
          Excluir veículo
        </h3>
        <p className="mt-2 text-[0.875rem] leading-relaxed" style={{ color: MUTED }}>
          Tem certeza que deseja excluir o{" "}
          <span style={{ color: TEXT, fontWeight: 500 }}>{vehicle.brand} {vehicle.model}</span>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full py-2.5 text-[0.875rem] transition-colors hover:bg-white/[0.04]"
            style={{ border: `1px solid ${BORDER}`, color: MUTED }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-500/90 py-2.5 text-[0.875rem] text-white transition-opacity hover:opacity-80"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form section (dark) ───────────────────────────────────────────────────────
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/35">
          {title}
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

// ── Vehicle form slide-over (dark) ────────────────────────────────────────────
function VehicleForm({ initial, onSave, onClose }: {
  initial: FormState; onSave: (f: FormState) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: val }));
  const setHL = (i: number, val: string) =>
    setForm((p) => { const h = [...p.highlights]; h[i] = val; return { ...p, highlights: h }; });
  const valid = form.brand.trim() && form.model.trim();
  const isNew = initial === emptyForm;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative flex h-full w-full max-w-xl flex-col shadow-2xl"
        style={{ background: "#111112" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div>
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              {isNew ? "Novo veículo" : "Editar veículo"}
            </p>
            <h2 className="mt-0.5 font-display text-[1.0625rem] tracking-tight" style={{ color: TEXT }}>
              {isNew ? "Cadastrar veículo" : `${form.brand} ${form.model}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ background: "#0f0f10" }}>
          <div className="flex flex-col gap-7">

            <FormSection title="Identificação">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Marca *</label>
                  <input className={inputCls} value={form.brand}
                    onChange={(e) => set("brand", e.target.value)} placeholder="Porsche" />
                </div>
                <div>
                  <label className={labelCls}>Modelo *</label>
                  <input className={inputCls} value={form.model}
                    onChange={(e) => set("model", e.target.value)} placeholder="911 GT3 RS" />
                </div>
                <div>
                  <label className={labelCls}>Ano</label>
                  <input type="number" className={inputCls} value={form.year}
                    onChange={(e) => set("year", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Km</label>
                  <input type="number" className={inputCls} value={form.km}
                    onChange={(e) => set("km", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Cor</label>
                  <input className={inputCls} value={form.color}
                    onChange={(e) => set("color", e.target.value)} placeholder="Branco Carrara" />
                </div>
              </div>
            </FormSection>

            <FormSection title="Motor & Desempenho">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Motor</label>
                  <input className={inputCls} value={form.motor}
                    onChange={(e) => set("motor", e.target.value)} placeholder="4.0L Boxer 6 aspirado" />
                </div>
                <div>
                  <label className={labelCls}>Potência</label>
                  <input className={inputCls} value={form.potencia}
                    onChange={(e) => set("potencia", e.target.value)} placeholder="525 cv" />
                </div>
                <div>
                  <label className={labelCls}>Vel. máxima</label>
                  <input className={inputCls} value={form.velocidadeMax}
                    onChange={(e) => set("velocidadeMax", e.target.value)} placeholder="296 km/h" />
                </div>
                <div>
                  <label className={labelCls}>Câmbio</label>
                  <select className={selectCls} value={form.cambio}
                    onChange={(e) => set("cambio", e.target.value as Cambio)}>
                    {cambios.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Combustível</label>
                  <select className={selectCls} value={form.combustivel}
                    onChange={(e) => set("combustivel", e.target.value as Combustivel)}>
                    {combustiveis.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Classificação">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Categoria</label>
                  <select className={selectCls} value={form.categoria}
                    onChange={(e) => set("categoria", e.target.value as Categoria)}>
                    {categorias.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Carroceria</label>
                  <select className={selectCls} value={form.carroceria}
                    onChange={(e) => set("carroceria", e.target.value as Carroceria)}>
                    {carrocerias.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Selo</label>
                  <select className={selectCls} value={form.selo}
                    onChange={(e) => set("selo", e.target.value)}>
                    <option value="">Nenhum</option>
                    <option value="RARO">Raro</option>
                    <option value="NOVA UNIDADE">Nova Unidade</option>
                    <option value="ÚLTIMA UNIDADE">Última Unidade</option>
                    <option value="NOVO">Novo</option>
                    <option value="RESERVADO">Reservado</option>
                    <option value="EDIÇÃO LIMITADA">Edição Limitada</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Adicionado há (sem.)</label>
                  <input type="number" className={inputCls} value={form.addedWeeksAgo}
                    onChange={(e) => set("addedWeeksAgo", e.target.value)} min="0" />
                </div>
              </div>
            </FormSection>

            <FormSection title="Preço">
              <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[0.875rem] text-white/70 transition-colors hover:bg-white/[0.04]">
                <input
                  type="checkbox"
                  checked={form.priceOnConsult}
                  onChange={(e) => set("priceOnConsult", e.target.checked)}
                  className="h-4 w-4 rounded accent-[#6ba5e0]"
                />
                Consulte o preço (não exibir valor)
              </label>
              {!form.priceOnConsult && (
                <div>
                  <label className={labelCls}>Valor (R$)</label>
                  <input type="number" className={inputCls} value={form.price}
                    onChange={(e) => set("price", e.target.value)} placeholder="1890000" />
                </div>
              )}
            </FormSection>

            <FormSection title="Descrição">
              <div>
                <label className={labelCls}>Descrição curta</label>
                <textarea className={`${inputCls} resize-none`} rows={3}
                  value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)}
                  placeholder="Destaque principal do veículo em uma ou duas frases." />
              </div>
              <div className="mt-3">
                <label className={labelCls}>Destaques (até 4)</label>
                <div className="flex flex-col gap-2">
                  {form.highlights.map((h, i) => (
                    <input key={i} className={inputCls} value={h}
                      onChange={(e) => setHL(i, e.target.value)} placeholder={`Destaque ${i + 1}`} />
                  ))}
                </div>
              </div>
            </FormSection>

            <FormSection title="Status no site">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[0.875rem] text-white/70 transition-colors hover:bg-white/[0.04]">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => set("available", e.target.checked)}
                  className="h-4 w-4 rounded accent-[#6ba5e0]"
                />
                Disponível para visita
              </label>
              <p className="mt-2 text-[0.75rem] text-white/25">
                Desmarcado exibe o veículo como reservado no catálogo.
              </p>
            </FormSection>

            <FormSection title="Imagens">
              <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
                <p className="text-[0.8125rem] leading-relaxed text-white/35">
                  Gerencie imagens via{" "}
                  <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.75rem] text-white/60">
                    vehicles.ts
                  </code>{" "}
                  e{" "}
                  <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.75rem] text-white/60">
                    src/imports/
                  </code>.
                </p>
              </div>
            </FormSection>

          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: `1px solid ${BORDER}`, background: "#111112" }}
        >
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-5 py-2.5 text-[0.875rem] text-white/50 transition-colors hover:border-white/25 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.875rem] text-[#0b0f14] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: ACCENT }}
          >
            <Save className="h-4 w-4" />
            Salvar veículo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Thin icon sidebar (dark) ──────────────────────────────────────────────────
function ThinSidebar({
  view, onView, onLogout,
}: {
  view: "dashboard" | "acervo";
  onView: (v: "dashboard" | "acervo") => void;
  onLogout: () => void;
}) {
  const nav = [
    { id: "dashboard" as const, icon: BarChart2, label: "Visão geral" },
    { id: "acervo"    as const, icon: Car,        label: "Acervo"      },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[52px] flex-col items-center py-4"
      style={{ background: FRAME, borderRight: `1px solid ${BORDER}` }}
    >
      {/* Logo mark */}
      <div
        className="mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: ACCENT }}
      >
        <Car className="h-[1.05rem] w-[1.05rem]" style={{ color: "#0b0f14" }} />
      </div>

      <div className="my-2 h-px w-7" style={{ background: BORDER }} />

      {/* Nav icons */}
      <div className="flex flex-1 flex-col items-center gap-1 pt-2">
        {nav.map(({ id, icon: Icon, label }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onView(id)}
              title={label}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
              style={{
                background: active ? `${ACCENT}18` : "transparent",
                color: active ? ACCENT : "rgba(255,255,255,0.3)",
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                  style={{ background: ACCENT }}
                />
              )}
              <Icon className="h-[1.05rem] w-[1.05rem]" />
              {/* Tooltip */}
              <span
                className="pointer-events-none absolute left-[52px] z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.75rem] opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                style={{ background: "#1C1C1E", color: "#fff" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        title="Sair"
        className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/[0.06]"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        <LogOut className="h-[1.05rem] w-[1.05rem]" />
        <span
          className="pointer-events-none absolute left-[52px] z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.75rem] opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          style={{ background: "#1C1C1E", color: "#fff" }}
        >
          Sair
        </span>
      </button>
    </aside>
  );
}

// ── Dashboard view ────────────────────────────────────────────────────────────
function DashboardView({ vehicles }: { vehicles: Vehicle[] }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "12m">("30d");

  const totalValue = useMemo(
    () => vehicles.reduce((s, v) => s + (v.price ?? 0), 0),
    [vehicles]
  );
  const publicados = vehicles.filter((v) => !v.paused && v.available).length;

  const catBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => { counts[v.categoria] = (counts[v.categoria] ?? 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ cat, count }));
  }, [vehicles]);
  const maxCat = Math.max(...catBreakdown.map((c) => c.count), 1);

  const maxRev = Math.max(...MONTHLY_REV.map((m) => m.value), 1);

  const mostVisited = useMemo(
    () =>
      vehicles.slice(0, 5).map((v, i) => ({
        name: `${v.brand} ${v.model}`,
        views: Math.round(14_200 / (i + 1)),
        img: v.images[0],
      })),
    [vehicles]
  );
  const maxViews = mostVisited[0]?.views ?? 1;

  const kpis = [
    {
      label: "Valor do Acervo",
      value: totalValue > 0 ? `R$ ${(totalValue / 1_000_000).toFixed(1)}M` : "—",
      delta: "+8,2%", up: true,
    },
    { label: "Veículos",         value: String(vehicles.length), delta: `${publicados} publicados`, up: true },
    { label: "Visitas (30d)",    value: "4.800",  delta: "+12,4%", up: true  },
    { label: "Faturamento (30d)", value: "R$ 3,4M", delta: "+28,1%", up: true  },
    { label: "Ticket Médio",     value: "R$ 2,1M", delta: "-4,3%",  up: false },
  ];

  return (
    <div className="min-h-full px-8 py-7" style={{ background: BG }}>
      {/* Title + period */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Admin · Visão Geral
          </p>
          <h1 className="mt-0.5 font-display text-[1.375rem] tracking-tight" style={{ color: TEXT }}>
            Visão geral do negócio
          </h1>
        </div>
        <div
          className="flex items-center rounded-xl p-1"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {(["7d", "30d", "12m"] as const).map((k) => {
            const labels = { "7d": "7 dias", "30d": "30 dias", "12m": "12 meses" };
            return (
              <button
                key={k}
                onClick={() => setPeriod(k)}
                className="rounded-lg px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] transition-all"
                style={
                  period === k
                    ? { background: ACCENT, color: "#0b0f14" }
                    : { color: MUTED }
                }
              >
                {labels[k]}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-[18px] p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              {k.label}
            </p>
            <p
              className="mt-2 font-display leading-none tracking-tight"
              style={{ fontSize: "clamp(1.25rem, 2vw, 1.625rem)", color: TEXT }}
            >
              {k.value}
            </p>
            <p
              className="mt-2 flex items-center gap-1 font-mono text-[0.5rem]"
              style={{ color: k.up ? "#4ADE80" : "#F87171" }}
            >
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Bar chart */}
        <div className="col-span-2 rounded-[18px] p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                Faturamento por mês
              </p>
              <p className="mt-0.5 font-display text-[1rem] tracking-tight" style={{ color: TEXT }}>
                2026 · Acumulado
              </p>
            </div>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              em milhões (R$)
            </p>
          </div>
          <div className="flex items-end gap-2" style={{ height: "9rem" }}>
            {MONTHLY_REV.map((m) => {
              const pct = m.value / maxRev;
              const cur = !!m.current;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <p
                    className="font-mono text-[0.5rem] leading-none"
                    style={{ color: cur ? ACCENT : "rgba(255,255,255,0.3)" }}
                  >
                    {(m.value / 1_000_000).toFixed(1)}M
                  </p>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-[5px] transition-all duration-700"
                      style={{
                        height: `${Math.max(pct * 100, 5)}%`,
                        background: cur ? ACCENT : "rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                  <p
                    className="font-mono text-[0.5rem] uppercase tracking-[0.06em]"
                    style={{ color: cur ? ACCENT : "rgba(255,255,255,0.22)" }}
                  >
                    {m.month}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-[18px] p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <p className="mb-5 font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Estoque por categoria
          </p>
          <div className="flex flex-col gap-4">
            {catBreakdown.length > 0 ? catBreakdown.map(({ cat, count }) => (
              <div key={cat}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[0.8125rem]" style={{ color: TEXT }}>{cat}</span>
                  <span className="font-mono text-[0.5625rem]" style={{ color: MUTED }}>{count}</span>
                </div>
                <div className="h-[4px] overflow-hidden rounded-full" style={{ background: BORDER }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / maxCat) * 100}%`, background: ACCENT }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-[0.875rem]" style={{ color: MUTED }}>Nenhum veículo cadastrado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Most visited */}
        <div className="col-span-2 rounded-[18px] p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <p className="mb-5 font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Veículos mais visitados
          </p>
          {mostVisited.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {mostVisited.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3">
                  <span className="w-4 shrink-0 text-right font-mono text-[0.5625rem]" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  {v.img ? (
                    <div
                      className="h-7 w-11 shrink-0 overflow-hidden rounded-lg"
                      style={{ background: "linear-gradient(135deg,#f0f0f2,#e4e4e6)" }}
                    >
                      <img src={v.img} alt={v.name} className="h-full w-full object-contain p-0.5" />
                    </div>
                  ) : (
                    <div className="h-7 w-11 shrink-0 rounded-lg" style={{ background: BORDER }} />
                  )}
                  <span className="flex-1 truncate text-[0.875rem]" style={{ color: TEXT }}>{v.name}</span>
                  <div className="flex items-center gap-2.5">
                    <div className="h-[3px] w-20 overflow-hidden rounded-full" style={{ background: BORDER }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(v.views / maxViews) * 100}%`, background: "rgba(255,255,255,0.3)" }}
                      />
                    </div>
                    <span className="w-14 text-right font-mono text-[0.5625rem]" style={{ color: MUTED }}>
                      {v.views.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[0.875rem]" style={{ color: MUTED }}>Nenhum veículo cadastrado.</p>
          )}
        </div>

        {/* Funnel */}
        <div className="rounded-[18px] p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <p className="mb-5 font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Funil do mês
          </p>
          <div className="flex flex-col gap-4">
            {FUNNEL.map((f, i) => (
              <div key={f.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[0.8125rem]" style={{ color: TEXT }}>{f.label}</span>
                  <span
                    className="font-display text-[1rem] leading-none tracking-tight"
                    style={{ color: i === 0 ? TEXT : MUTED }}
                  >
                    {f.value.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="h-[3px] overflow-hidden rounded-full" style={{ background: BORDER }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(f.value / FUNNEL[0].value) * 100}%`,
                      background: i === 0 ? ACCENT : "rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Acervo view ───────────────────────────────────────────────────────────────
function AcervoView(ctx: ReturnType<typeof useVehicles>) {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, togglePause } = ctx;

  const [search, setSearch]             = useState("");
  const [formOpen, setFormOpen]         = useState(false);
  const [editTarget, setEditTarget]     = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [sortCol, setSortCol]           = useState<"brand" | "year" | "km" | "price" | "status">("brand");
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("asc");
  const [saved, setSaved]               = useState(false);

  const stats = useMemo(() => ({
    total:    vehicles.length,
    ativos:   vehicles.filter((v) => !v.paused && v.available).length,
    pausados: vehicles.filter((v) => v.paused).length,
    consultar: vehicles.filter((v) => v.price === null).length,
  }), [vehicles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = q
      ? vehicles.filter((v) => `${v.brand} ${v.model} ${v.color}`.toLowerCase().includes(q))
      : [...vehicles];
    list.sort((a, b) => {
      let va: string | number, vb: string | number;
      switch (sortCol) {
        case "year":   va = a.year;  vb = b.year;  break;
        case "km":     va = a.km;    vb = b.km;    break;
        case "price":  va = a.price ?? Infinity; vb = b.price ?? Infinity; break;
        case "status":
          va = a.paused ? 2 : a.available ? 0 : 1;
          vb = b.paused ? 2 : b.available ? 0 : 1; break;
        default: va = `${a.brand} ${a.model}`; vb = `${b.brand} ${b.model}`;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [vehicles, search, sortCol, sortDir]);

  const sort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortCol }) =>
    sortCol === col
      ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
      : <ChevronUp className="h-3 w-3 opacity-20" />;

  const handleSave = (form: FormState) => {
    if (editTarget) updateVehicle(editTarget.id, formToVehicle(form, editTarget));
    else addVehicle(formToVehicle(form));
    setFormOpen(false);
    setEditTarget(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full px-8 py-7" style={{ background: BG }}>
      {/* Page header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Admin · Acervo
          </p>
          <h1 className="mt-0.5 font-display text-[1.375rem] tracking-tight" style={{ color: TEXT }}>
            Acervo de veículos
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar marca, modelo…"
              className="w-52 rounded-full border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-4 text-[0.8125rem] text-white placeholder:text-white/25 focus:border-white/20 focus:outline-none"
            />
          </div>
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.875rem] text-[#0b0f14] transition-opacity hover:opacity-85"
            style={{ background: ACCENT }}
          >
            <Plus className="h-4 w-4" />
            Novo veículo
          </button>
        </div>
      </div>

      {/* Stat pills */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        {[
          { label: "Total no acervo",  value: stats.total,    color: TEXT },
          { label: "Publicados",       value: stats.ativos,   color: "#4ADE80" },
          { label: "Pausados",         value: stats.pausados, color: "#F59E0B" },
          { label: "Consulte o preço", value: stats.consultar, color: MUTED  },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col rounded-2xl px-5 py-3.5"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              {s.label}
            </span>
            <span
              className="mt-1 font-display leading-none tracking-tight"
              style={{ fontSize: "1.5rem", color: s.color }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Toast */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-[0.875rem] text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          Veículo salvo com sucesso.
        </div>
      )}

      <p className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        {search && ` · "${search}"`}
      </p>

      {/* Table */}
      <div
        className="overflow-hidden rounded-[18px]"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)" }}>
                <th className="w-[4.5rem] px-5 py-3.5" />
                <th className="px-4 py-3.5 text-left">
                  <button onClick={() => sort("brand")}
                    className="flex items-center gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30 hover:text-white/60">
                    Marca / Modelo <SortIcon col="brand" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30">
                    Cadastro
                  </span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <button onClick={() => sort("price")}
                    className="flex items-center gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30 hover:text-white/60">
                    Preço <SortIcon col="price" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <button onClick={() => sort("status")}
                    className="flex items-center gap-1.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30 hover:text-white/60">
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="hidden px-4 py-3.5 text-left lg:table-cell">
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30">
                    Selo
                  </span>
                </th>
                <th className="px-5 py-3.5 text-right">
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/30">
                    Ações
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, idx) => (
                <tr
                  key={v.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderTop: idx > 0 ? `1px solid ${BORDER}` : undefined,
                    opacity: v.paused ? 0.55 : 1,
                  }}
                >
                  {/* Thumbnail */}
                  <td className="px-5 py-3">
                    {v.images[0] ? (
                      <div
                        className="h-9 w-[3.25rem] overflow-hidden rounded-xl"
                        style={{ background: "linear-gradient(135deg,#f0f0f2,#e4e4e6)" }}
                      >
                        <img src={v.images[0]} alt={`${v.brand} ${v.model}`}
                          className="h-full w-full object-contain p-0.5" />
                      </div>
                    ) : (
                      <div
                        className="flex h-9 w-[3.25rem] items-center justify-center rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-white/20" />
                      </div>
                    )}
                  </td>
                  {/* Brand / Model */}
                  <td className="px-4 py-3">
                    <p className="font-display text-[0.9375rem] tracking-tight" style={{ color: TEXT }}>
                      {v.brand}
                    </p>
                    <p className="font-mono text-[0.6875rem]" style={{ color: MUTED }}>
                      {v.model} · {v.color}
                    </p>
                  </td>
                  {/* Cadastro */}
                  <td className="px-4 py-3">
                    <p className="font-mono text-[0.8125rem]" style={{ color: TEXT }}>
                      {addedDate(v.addedWeeksAgo)}
                    </p>
                    <p className="font-mono text-[0.6875rem]" style={{ color: MUTED }}>
                      {v.year} · {v.km.toLocaleString("pt-BR")} km
                    </p>
                  </td>
                  {/* Preço */}
                  <td className="px-4 py-3">
                    {v.price !== null ? (
                      <p className="font-mono text-[0.8125rem]" style={{ color: TEXT }}>
                        {formatBRL(v.price)}
                      </p>
                    ) : (
                      <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
                        Consulte
                      </p>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge vehicle={v} />
                  </td>
                  {/* Selo */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <SeloBadge selo={v.selo} />
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditTarget(v); setFormOpen(true); }}
                        title="Editar"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => togglePause(v.id)}
                        title={v.paused ? "Reativar" : "Pausar"}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          v.paused
                            ? "text-orange-400 hover:bg-orange-500/10"
                            : "text-white/30 hover:bg-white/[0.06] hover:text-white/70"
                        }`}
                      >
                        {v.paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(v)}
                        title="Excluir"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <LayoutGrid className="h-8 w-8 text-white/10" />
              <p className="text-[0.9375rem] text-white/35">
                {search ? `Nenhum resultado para "${search}"` : "Nenhum veículo cadastrado."}
              </p>
            </div>
          )}

          {filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3 font-mono text-[0.5rem] uppercase tracking-[0.1em]"
              style={{ borderTop: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.15)" }}
            >
              <span>{filtered.length} de {vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""}</span>
              <span>SELECTCARS Admin · {new Date().getFullYear()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form slide-over */}
      {formOpen && (
        <VehicleForm
          initial={editTarget ? vehicleToForm(editTarget) : emptyForm}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteDialog
          vehicle={deleteTarget}
          onConfirm={() => { deleteVehicle(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ── Credentials (hardcoded — no backend per project design) ──────────────────
const ADMIN_EMAIL = "admin@selectcars.com.br";
const ADMIN_PASS  = "selectcars@2026";

// ── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate a brief async check
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASS
      ) {
        onLogin();
      } else {
        setError("E-mail ou senha incorretos. Tente novamente.");
        setPassword("");
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      {/* Left — car image with cinematic overlay */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <img
          src={imgLogin}
          alt="SelectCars"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center center", filter: "brightness(0.35) contrast(1.15)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(12,12,13,0.97) 0%, rgba(12,12,13,0.65) 40%, rgba(12,12,13,0.2) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "40%",
            background: "linear-gradient(to top, rgba(12,12,13,0.95) 0%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <p className="font-display text-[1.0625rem] tracking-[0.22em] text-white">
            SELECT<span style={{ color: ACCENT }}>CARS</span>
          </p>
          <div>
            <p
              className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Painel Administrativo
            </p>
            <p className="max-w-xs font-display text-[1.625rem] leading-tight tracking-tight text-white">
              Gerencie toda a sua loja do acervo ao detalhe.
            </p>
            <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Curadoria diária do acervo, publicada com o padrão SELECTCARS.
            </p>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-[420px] lg:shrink-0">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <p className="font-display text-[1.125rem] tracking-[0.22em] text-white">
              SELECT<span style={{ color: ACCENT }}>CARS</span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border p-8 transition-all duration-150"
            style={{
              background: SURFACE,
              borderColor: error ? "rgba(248,113,113,0.35)" : BORDER,
              transform: shake ? "translateX(0)" : undefined,
              animation: shake ? "shake 0.4s ease" : undefined,
            }}
          >
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
              Área restrita
            </p>
            <h1 className="mt-3 font-display text-[1.5rem] tracking-tight" style={{ color: TEXT }}>
              Acesse o painel
            </h1>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed" style={{ color: MUTED }}>
              Acesso restrito à equipe SELECTCARS.
            </p>

            <div className="mt-7 flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className={labelCls}>E-mail</label>
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@selectcars.com.br"
                  className={inputCls}
                  style={error ? { borderColor: "rgba(248,113,113,0.5)" } : undefined}
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelCls}>Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••••••"
                    className={`${inputCls} pr-11`}
                    style={error ? { borderColor: "rgba(248,113,113,0.5)" } : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/70"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-[0.8125rem] text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-display text-[0.9375rem] tracking-tight transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: ACCENT, color: "#0b0f14" }}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Verificando…
                  </>
                ) : (
                  "Entrar no painel"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-60"
              style={{ color: MUTED }}
            >
              <ArrowLeft className="h-3 w-3" />
              Ver o site
            </Link>
          </div>

          <p
            className="mt-4 text-center font-mono text-[0.5625rem] uppercase tracking-[0.12em]"
            style={{ color: "rgba(255,255,255,0.12)" }}
          >
            Acesso confidencial · SELECTCARS
          </p>
        </div>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

// ── Admin shell ───────────────────────────────────────────────────────────────
function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<"dashboard" | "acervo">("dashboard");
  const ctx = useVehicles();

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      <ThinSidebar view={view} onView={setView} onLogout={onLogout} />

      <div className="flex min-h-screen flex-1 flex-col" style={{ marginLeft: 52 }}>
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex h-[52px] items-center justify-between px-6"
          style={{ background: FRAME, borderBottom: `1px solid ${BORDER}` }}
        >
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Admin&nbsp;·&nbsp;SELECTCARS
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[0.5625rem] uppercase tracking-[0.12em] sm:block" style={{ color: "rgba(255,255,255,0.2)" }}>
              {view === "dashboard" ? "Visão Geral" : "Acervo"}
            </span>
            <Link
              to="/"
              className="hidden font-mono text-[0.5625rem] uppercase tracking-[0.1em] transition-opacity hover:opacity-70 sm:block"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Ver site →
            </Link>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.5rem] font-bold"
              style={{ background: ACCENT, color: "#0b0f14" }}
            >
              SC
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">
          {view === "dashboard"
            ? <DashboardView vehicles={ctx.vehicles} />
            : <AcervoView {...ctx} />
          }
        </div>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <AdminShell onLogout={() => setLoggedIn(false)} />
    : <AdminLogin onLogin={() => setLoggedIn(true)} />;
}
