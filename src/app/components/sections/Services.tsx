import { Container, SectionMarker } from "../kit";

const services = [
  {
    n: "01",
    title: "Consignação Premium",
    desc: "Vendemos o seu carro do jeito que ele merece ser apresentado.",
    items: [
      "Avaliação justa — Laudo técnico independente",
      "Rede qualificada — Compradores verificados",
      "Apresentação editorial — Fotografia · vídeo · ficha",
      "Discrição total — Sem exposição em vitrine",
    ],
  },
  {
    n: "02",
    title: "Sourcing Internacional",
    desc: "Procura ativa de modelos específicos no mercado europeu, americano e asiático. Importação completa com toda a documentação regularizada.",
    items: [],
  },
  {
    n: "03",
    title: "Gestão de Coleção",
    desc: "Patrimônio merece estrutura à altura.",
    items: ["Climatização", "Manutenção", "Documentação"],
  },
];

export function Services() {
  return (
    <section id="servicos" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] min-h-[100svh] flex flex-col justify-center">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <div>
            <SectionMarker index="04" label="Serviços" />
            <h2 className="mt-10 font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
              Para além da venda.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-white/55">
              Estrutura completa para clientes que veem o automóvel como patrimônio e não como mero
              objeto de consumo.
            </p>
          </div>
          <span className="hidden shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground lg:block">
            Edição rara · Acervo SELECTCARS
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {services.map((s) => (
            <div key={s.n} className="flex flex-col gap-4 bg-background p-8">
              <span className="font-mono text-[0.75rem] text-accent">{s.n}</span>
              <h3 className="font-display text-[1.375rem] tracking-tight">{s.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-white/55">{s.desc}</p>
              {s.items.length > 0 && (
                <ul className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                  {s.items.map((it) => (
                    <li key={it} className="text-[0.8125rem] text-white/45">
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-10 lg:p-16">
          <p className="max-w-4xl font-display text-[1.75rem] uppercase leading-tight tracking-[-0.01em] sm:text-[2.25rem]">
            Comprar um carro deveria ser tão refinado quanto dirigi-lo.
          </p>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-white/55">
            Sem pressa, sem ruído, sem cláusulas escondidas. Cada etapa do processo SELECTCARS é
            desenhada para que você reconheça o carro certo e nunca seja empurrado para nenhum.
          </p>
        </div>
      </Container>
    </section>
  );
}
