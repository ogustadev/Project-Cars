import { useNavigate } from "react-router";
import { Container, SectionMarker, LinkArrow } from "../kit";

const principles = [
  {
    n: "01",
    title: "Procedência",
    text: "Cada veículo é rastreado desde o primeiro proprietário. Documentação completa, histórico de manutenção e laudo técnico independente.",
  },
  {
    n: "02",
    title: "Curadoria",
    text: "Selecionamos menos de 5% dos carros que avaliamos. O que entra no nosso showroom precisa ter algo além de preço alto.",
  },
  {
    n: "03",
    title: "Discrição",
    text: "Atendimento privado, agendado, sem vitrine de rua. O processo de compra é tão exclusivo quanto o carro.",
  },
];

const eras = ["1960", "1970", "1980", "1990", "2000", "2010"];

export function About() {
  const navigate = useNavigate();
  return (
    <section id="sobre" className="theme-light bg-background text-foreground py-16 sm:py-24 lg:py-32 min-h-[100svh] flex flex-col justify-center">
      <Container>
        <SectionMarker index="01" label="Sobre" />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
              Não vendemos carros.
              <br />
              <span className="text-muted-foreground">Entregamos exceções.</span>
            </h2>
            <div className="mt-10 flex items-start gap-6">
              <div className="shrink-0">
                <p className="font-display text-[3.5rem] leading-none tracking-tight text-accent">5%</p>
                <p className="mt-2 max-w-[10rem] text-[0.8125rem] leading-snug text-muted-foreground">
                  Percentual de carros avaliados que chegam ao showroom.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              A SELECTCARS nasceu da convicção de que um carro extraordinário merece um processo à
              altura. Cada veículo no nosso showroom passou por uma seleção criteriosa: procedência
              verificada, histórico documentado, condição mecânica e estética dentro de padrões que
              não admitem concessões.
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              Trabalhamos com um número limitado de unidades por mês. Por escolha. Porque atender bem
              importa mais do que vender muito.
            </p>
            <LinkArrow onClick={() => document.querySelector("#processo")?.scrollIntoView({ behavior: "smooth" })}>
              Conheça o processo
            </LinkArrow>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-16 flex items-center gap-4">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            SP · BR
          </span>
          <div className="flex flex-1 items-center gap-4 overflow-x-auto">
            {eras.map((e, i) => (
              <div key={e} className="flex flex-1 items-center gap-4">
                <span className="font-mono text-[0.8125rem] text-foreground">{e}</span>
                {i < eras.length - 1 && <span className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.n} className="flex flex-col gap-3 bg-background p-8">
              <span className="font-mono text-[0.75rem] text-accent">{p.n}</span>
              <h3 className="font-display text-[1.25rem] tracking-tight text-foreground">{p.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
