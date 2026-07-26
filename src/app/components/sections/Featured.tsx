import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container, SectionMarker, PillButton, Selo } from "../kit";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useVehicles } from "../../context/VehiclesContext";
import { formatBRL, whatsappUrl, vehicleWhatsappMsg } from "../../lib/site";

export function Featured() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [activeIndex, setActiveIndex] = useState(0);

  // Pegamos apenas os veículos que não estão pausados
  const activeVehicles = vehicles.filter((v) => !v.paused);

  if (activeVehicles.length === 0) return null;

  // Garante que o index não estoure caso o array mude
  const currentIndex = activeIndex >= activeVehicles.length ? 0 : activeIndex;
  const activeV = activeVehicles[currentIndex];
  const spotlightSrc = activeV.featuredImage ?? activeV.images[0];

  return (
    <section id="destaque" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] min-h-[100svh] flex flex-col justify-center">
      <Container>
        <SectionMarker index="02" label="Inventory" />
        
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] xl:gap-16">
          
          {/* ── Esquerda: Imagem Principal & Miniaturas ── */}
          <div className="flex flex-col overflow-hidden">
            
            {/* Spotlight photo */}
            <div className="relative flex aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-white/[0.03] p-8 sm:p-16 group/spotlight">
              {/* Radial Glow Subtle */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-70 blur-3xl" />
              
              {/* Selo */}
              <div className="absolute left-6 top-6 z-20">
                <Selo selo={activeV.selo} />
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => setActiveIndex((prev) => (prev === 0 ? activeVehicles.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-[#6ba5e0] hover:text-black hover:scale-110 group-hover/spotlight:opacity-100 sm:left-6"
                aria-label="Veículo anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button 
                onClick={() => setActiveIndex((prev) => (prev === activeVehicles.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-[#6ba5e0] hover:text-black hover:scale-110 group-hover/spotlight:opacity-100 sm:right-6"
                aria-label="Próximo veículo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <ImageWithFallback
                key={activeV.id} // força re-render pra rodar transição se necessário
                src={spotlightSrc}
                alt={`${activeV.brand} ${activeV.model}`}
                className="relative z-10 w-[90%] lg:w-[80%] object-contain drop-shadow-2xl animate-[fade-up_0.6s_ease_both]"
              />
            </div>

            {/* Thumbnails Carousel */}
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {activeVehicles.map((v, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex h-20 w-32 sm:h-24 sm:w-36 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "border-[#6ba5e0] bg-[#1a1a1a] shadow-[0_0_15px_rgba(107,165,224,0.15)]"
                        : "border-white/5 bg-[#0a0a0a] hover:border-white/20 hover:bg-[#111111] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={v.images[0]}
                      alt={v.model}
                      className="w-[85%] object-contain drop-shadow-lg"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Direita: Informações & Especificações ── */}
          <div className="flex flex-col justify-center">
            
            <div className="animate-[fade-up_0.5s_ease_both] flex flex-col justify-between">
              <div className="h-[8.5rem] sm:h-[9.5rem] flex flex-col justify-start">
                <h3 className="font-display text-[2rem] sm:text-[2.5rem] leading-[1.1] tracking-tight text-white mb-2 line-clamp-3">
                  {activeV.brand} {activeV.model} <span className="text-white/40">{activeV.year}</span>
                </h3>
                
                <p className="mb-8 text-[0.875rem] text-white/40">
                  Disponível para visitação presencial no showroom.
                </p>
              </div>

              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between h-[4.5rem]">
                <span className="font-display text-[2.5rem] font-medium tracking-tight text-white shrink-0">
                  {activeV.price ? formatBRL(activeV.price) : "Sob consulta"}
                </span>
                
                <PillButton
                  icon={true}
                  href={whatsappUrl(vehicleWhatsappMsg(activeV.brand, activeV.model))}
                  target="_blank"
                  className="w-full sm:w-auto px-8 !bg-[#6ba5e0] !text-neutral-950 hover:!bg-[#82b4e6]"
                >
                  Solicitar proposta
                </PillButton>
              </div>
            </div>

            {/* Key Specifications Panel */}
            <div className="rounded-[1.5rem] bg-[#111111] border border-white/5 p-6 animate-[fade-up_0.6s_ease_both]">
              <h4 className="mb-6 font-display text-[1.125rem] text-white/80">Key Specifications</h4>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Engine */}
                <div className="h-[4.5rem]">
                  <p className="mb-1 text-[0.6875rem] font-mono uppercase tracking-widest text-white/30">Motor</p>
                  <p className="text-[0.9375rem] font-medium text-white/90 line-clamp-2">{activeV.motor}</p>
                  <p className="text-[0.75rem] text-white/50">{activeV.potencia}</p>
                </div>
                
                {/* Max Speed */}
                <div className="h-[4.5rem]">
                  <p className="mb-1 text-[0.6875rem] font-mono uppercase tracking-widest text-white/30">Vel. Máxima</p>
                  <p className="text-[0.9375rem] font-medium text-white/90">{activeV.velocidadeMax}</p>
                </div>
                
                {/* Transmission */}
                <div className="h-[4.5rem]">
                  <p className="mb-1 text-[0.6875rem] font-mono uppercase tracking-widest text-white/30">Transmissão</p>
                  <p className="text-[0.9375rem] font-medium text-white/90">{activeV.carroceria}</p>
                  <p className="text-[0.75rem] text-white/50">{activeV.cambio}</p>
                </div>
                
                {/* Fuel */}
                <div className="h-[4.5rem]">
                  <p className="mb-1 text-[0.6875rem] font-mono uppercase tracking-widest text-white/30">Combustível</p>
                  <p className="text-[0.9375rem] font-medium text-white/90">{activeV.combustivel}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 self-start">
               <button onClick={() => navigate("/colecao")} className="text-[0.875rem] text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                 Ver inventário completo
               </button>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
