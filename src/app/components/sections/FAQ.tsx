import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container, SectionMarker } from "../kit";

const faqs = [
  {
    q: "Como funciona o processo de compra na SELECTCARS?",
    a: "Tudo começa com uma conversa privada para entender seu perfil, preferências e o uso pretendido. A partir daí podemos apresentar opções do nosso estoque atual no showroom, buscar no mercado interno e internacional o carro exato que você procura, e conduzir todo o processo: laudo técnico, documentação, transferência e entrega.",
  },
  {
    q: "Vocês fazem importação de modelos específicos?",
    a: "Sim. Nosso serviço de sourcing internacional realiza a procura ativa de modelos específicos nos mercados europeu, americano e asiático, com importação completa e documentação regularizada.",
  },
  {
    q: "Como funciona a consignação?",
    a: "Na consignação premium, avaliamos e apresentamos o seu carro de forma editorial — com laudo técnico independente, fotografia e ficha completa — para uma rede qualificada de compradores verificados, sem exposição em vitrine.",
  },
  {
    q: "Posso financiar a compra?",
    a: "Trabalhamos com parceiros financeiros e de seguro especializados em veículos premium. Os detalhes são discutidos de forma individual durante o atendimento.",
  },
  {
    q: "Vocês entregam fora de São Paulo?",
    a: "Sim. Realizamos entrega assistida em todo o Brasil, com toda a documentação e histórico organizados. Os detalhes de logística são combinados no agendamento.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="perguntas" className="theme-light bg-background text-foreground py-16 sm:py-24 lg:py-32 min-h-[100svh] flex flex-col justify-center">
      <Container>
        <SectionMarker index="—" label="Perguntas frequentes" />
        <h2 className="mt-10 font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
          Antes de agendar.
        </h2>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-6 py-6 text-left hover:opacity-70 transition-opacity"
                >
                  <span className="font-mono text-[0.8125rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-[1.125rem] tracking-tight">{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pl-[2.6rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
