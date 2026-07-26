import { Container, SectionMarker } from "../kit";

const testimonials = [
  {
    quote:
      "Procurei um Porsche específico por dois anos antes de chegar à SELECTCARS. Em três semanas eles encontraram a unidade certa, na cor certa, com o histórico certo. Atendimento de outro nível.",
    author: "R. M.",
    role: "Empresário · São Paulo",
  },
  {
    quote:
      "O que mais me impressionou foi a discrição. Comprei dois carros pela SELECTCARS e em nenhum momento me senti um número. O processo é silencioso, preciso e respeita o seu tempo.",
    author: "C. A.",
    role: "Investidor · Rio de Janeiro",
  },
  {
    quote:
      "Já tive experiências ruins comprando importados. Aqui foi diferente desde o primeiro contato. Eles realmente entendem o produto e tratam o carro como peça, não como estoque.",
    author: "F. L.",
    role: "Colecionador · Belo Horizonte",
  },
];

export function Testimonials() {
  return (
    <section id="clientes" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionMarker index="06" label="Clientes" />
        <h2 className="mt-10 max-w-2xl font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
          O que nos define é
          <br />
          <span className="text-white/38">quem confia em nós.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8"
            >
              <blockquote className="text-[0.9375rem] leading-relaxed text-white/75">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-border pt-5">
                <p className="font-display tracking-tight text-white">{t.author}</p>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {t.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
