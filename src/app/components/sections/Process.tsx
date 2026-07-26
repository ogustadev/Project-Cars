import { Container, SectionMarker } from "../kit";

const steps = [
  {
    n: "01",
    title: "Conversa inicial",
    text: "Entendimento do perfil, preferências e uso pretendido do cliente.",
  },
  {
    n: "02",
    title: "Curadoria personalizada",
    text: "Apresentamos opções do nosso estoque ou buscamos no mercado interno e internacional o carro exato que você procura. Cada candidato é avaliado antes de chegar até você.",
  },
  {
    n: "03",
    title: "Inspeção e documentação",
    text: "Laudo técnico independente, verificação de procedência e regularização documental completa.",
  },
  {
    n: "04",
    title: "Entrega",
    text: "Entrega assistida, com toda a documentação e histórico organizados.",
  },
];

export function Process() {
  return (
    <section id="processo" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionMarker index="05" label="O processo" />
        <div className="mt-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
            Comprar um carro deveria ser tão refinado quanto dirigi-lo.
          </h2>
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-muted-foreground">
            04 etapas · 1 padrão
          </span>
        </div>
        <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-white/55">
          Quatro etapas pensadas para entregar previsibilidade, transparência e o tempo adequado para
          cada decisão importante.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-[1.75rem] tracking-tight text-accent">{s.n}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="font-display text-[1.125rem] tracking-tight">{s.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-white/55">{s.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
