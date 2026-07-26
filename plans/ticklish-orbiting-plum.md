# Plano — Hero Redesign + Avaliação Geral do Site

## Context

O usuário identificou que a primeira tela (Hero) não retém o visitante: o carro aparece num card pequeno à direita, o headline está em tamanho conservador e não há nenhum elemento visual que crie drama ou urgência para scrollar. A imagem nova fornecida (`Image__Porsche_911_GT3_RS_em_destaque_-1.png`) é um Porsche 911 em perfil lateral, fundo branco estúdio — ideal para um tratamento cinematográfico full-viewport.

**Avaliação do site completo:**
- **Hero** — Problema principal. Card pequeno, título modesto, nenhuma animação de entrada, sem call-to-scroll.
- **About, Services, Process, FAQ, Testimonials, Contact** — Estrutura e contraste corretos após a rodada anterior; nenhuma mudança necessária.
- **Featured / Catalog** — Funcionam bem com o modelo de galeria já implementado.

---

## Abordagem

### 1. `src/styles/theme.css` — Adicionar keyframes de entrada

Inserir três novas animações após o keyframe `fade-up` existente:

```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-right {
  from { opacity: 0; transform: translateX(48px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-dot {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%       { transform: translateY(6px); opacity: 1; }
}
```

Usar com classes Tailwind inline: `animate-[slide-up_0.7s_ease_0.2s_both]`  
(o `both` mantém o estado `from` antes de começar e `to` depois — sem flash de conteúdo visível.)

---

### 2. `src/app/components/sections/Hero.tsx` — Reescrita completa

**Importar nova imagem:**
```ts
import imgHero from "../../imports/Image__Porsche_911_GT3_RS_em_destaque_-1.png";
```
Também manter `imgPorsche` e `imgPorscheDestaque` para o drawer de galeria — não remover do `vehicles.ts`.

**Layout visual (desktop):**
```
┌──── LEFT 42% ────────────────┐ ┌──── RIGHT 58% ──────────────────────┐
│                              │ │ ┌─ light panel (rounded-3xl) ──────┐ │
│ 2026 / Edição 01             │ │ │                                  │ │
│                              │ │ │   [PORSCHE 911 SIDE PROFILE]     │ │
│ CARROS QUE NÃO               │ │ │   object-contain, padding large  │ │
│ SE ENCONTRAM.                │ │ │                                  │ │
│ SE RECONHECEM.               │ │ │ [RARO] [2026 · Edição limitada]  │ │
│                              │ │ │                                  │ │
│ ─ 3 stats ─────────────      │ │ │ ═══ info row (dark bg) ═══════  │ │
│  9 veículos · 5% · São Paulo │ │ │  Porsche 911 GT3 RS · R$2.89M   │ │
│                              │ │ └──────────────────────────────────┘ │
│ [Ver coleção] [Agendar]      │ │                                       │
│                              │ │   gradient-left-edge: blends white    │
│ ↓ scroll indicator           │ │   panel into #0c0c0d (no hard seam)   │
└──────────────────────────────┘ └───────────────────────────────────────┘

════════════ [marquee] ════════════════════════════════════════════
```

**Detalhes técnicos:**

**Seção:** `min-h-[calc(100svh-3.5rem)]` com `flex flex-col` — garante que preencha o viewport sem scroll forçado.

**Headline:** Escalar de `text-[3.5rem]` (mobile) → `text-[5.5rem]` (lg) → `text-[6.5rem]` (xl). Leading `0.88`, tracking `-0.04em`. A terceira linha usa `text-white/28` em vez de `text-white/35` para mais drama.

**Stats row** (entre headline e CTAs):
```tsx
const stats = [
  { value: "9", label: "Modelos no acervo" },
  { value: "5%", label: "Taxa de seleção", accent: true },
  { value: "SP", label: "Showroom exclusivo" },
];
```
Exibidos em uma linha horizontal com separadores `|` finos, fonte mono.

**Painel do carro (right column):**
- Container: `relative rounded-3xl overflow-hidden` com background `from-[#f2f2f4] to-[#e8e9ec]`
- Imagem: `object-contain p-8 lg:p-12` — dar espaço para o carro "respirar"
- **Gradient de borda esquerda** (o truque principal): `<div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#0c0c0d] to-transparent pointer-events-none" />` — elimina a linha dura entre o fundo branco da foto e o fundo escuro da página
- **Info row** no bottom: `absolute inset-x-0 bottom-0 bg-[#0f0f10]/90 backdrop-blur-sm px-6 py-4` — sem separação de card, integrado ao painel
- Badges (top-left do painel): `Selo` + badge de edição com fundo `bg-[#0c0c0d]/80 backdrop-blur-md`

**Scroll indicator** (bottom-left do left column):
```tsx
<div className="mt-auto pt-10 flex items-center gap-3">
  <div className="flex h-7 w-[1.125rem] items-center justify-center rounded-full border border-white/20 pb-0.5">
    <span className="h-1.5 w-0.5 rounded-full bg-white/60 animate-[pulse-dot_1.4s_ease-in-out_infinite]" />
  </div>
  <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white/30">
    Descobrir
  </span>
</div>
```

**Animações staggered:**
| Elemento | Classe de animação |
|---|---|
| Overline badge | `animate-[slide-up_0.6s_ease_0.05s_both]` |
| Headline linha 1+2 | `animate-[slide-up_0.7s_ease_0.15s_both]` |
| Headline linha 3 | `animate-[slide-up_0.7s_ease_0.25s_both]` |
| Stats row | `animate-[slide-up_0.7s_ease_0.35s_both]` |
| CTA group | `animate-[slide-up_0.7s_ease_0.45s_both]` |
| Scroll indicator | `animate-[slide-up_0.6s_ease_0.7s_both]` |
| Right panel (car) | `animate-[slide-right_0.9s_ease_0.2s_both]` |

**Mobile:** painel do carro vem primeiro (aspect `[16/9]` com `max-h-[42vh]`), headline abaixo, stats 3 colunas compactas.

---

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/styles/theme.css` | Adicionar 3 keyframes: `slide-up`, `slide-right`, `pulse-dot` |
| `src/app/components/sections/Hero.tsx` | Reescrita completa com novo design |

Nenhum outro arquivo precisa ser alterado.

---

## Verificação

1. Preview deve mostrar Hero preenchendo o viewport inteiro sem scroll
2. Carro grande e dominante no lado direito, sem borda dura de card
3. Animações de entrada suaves e staggered na primeira carga
4. Gradient esquerdo faz a transição sem costura entre fundo branco da foto e fundo escuro
5. Mobile: carro empilhado no topo, texto abaixo, stats em 3 colunas
6. Marquee de marcas ao final, separando Hero do About
