import { useNavigate } from "react-router";
import { MessageCircle, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Container, SectionMarker, PillButton } from "../kit";
import { whatsappUrl, GENERIC_WHATSAPP_MSG } from "../../lib/site";

const info = [
  {
    icon: MapPin,
    label: "Showroom",
    lines: ["São Paulo, SP", "Endereço completo enviado no agendamento"],
  },
  {
    icon: Clock,
    label: "Horário",
    lines: ["Seg a sex · 10h às 19h", "Sábado · 10h às 14h, sempre por agendamento"],
  },
  {
    icon: Phone,
    label: "Contato direto",
    lines: ["+55 11 0000-0000", "contato@selectcars.com.br"],
  },
];

export function Contact() {
  const navigate = useNavigate();
  return (
    <section id="contato" className="border-t border-border py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionMarker index="07" label="Próximo passo" />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">
              Encontre o seu próximo.
              <br />
              <span className="text-white/38">
                Ou o que você ainda não sabia que era o seu.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-white/55">
              Seja para uma compra específica, uma consignação ou uma conversa sobre o que faz
              sentido para o seu momento — estamos disponíveis. Atendimento privado, sob agendamento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PillButton className="w-full sm:w-auto" href={whatsappUrl(GENERIC_WHATSAPP_MSG)} target="_blank">
                Falar com um curador
              </PillButton>
              <PillButton className="w-full sm:w-auto" variant="secondary" onClick={() => navigate("/colecao")}>
                Ver coleção
              </PillButton>
            </div>
          </div>

          {/* Agendar visita — WhatsApp CTA (sem captação de lead) */}
          <div className="rounded-2xl border border-border bg-card p-8 lg:p-10">
            <h3 className="font-display text-[1.375rem] tracking-tight">Agendar visita ao showroom</h3>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-white/55">
              Compartilhe o que você procura. Respondemos no mesmo dia útil.
            </p>
            <a
              href={whatsappUrl(GENERIC_WHATSAPP_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#1f8a4c] px-6 py-3.5 text-[0.9375rem] text-white transition-colors hover:bg-[#1a7742]"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar mensagem no WhatsApp
            </a>
            <p className="mt-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
              Resposta em até 1 dia útil · Atendimento confidencial
            </p>

            <div className="mt-8 flex flex-col gap-5 border-t border-border pt-8">
              {info.map((row) => (
                <div key={row.label} className="flex gap-3">
                  <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {row.label}
                    </p>
                    {row.lines.map((l) => (
                      <p key={l} className="text-[0.875rem] text-white/80">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
