export const WHATSAPP_NUMBER = "5511000000000";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const GENERIC_WHATSAPP_MSG =
  "Olá, gostaria de falar com um curador da SELECTCARS.";

export function vehicleWhatsappMsg(brand: string, model: string) {
  return `Olá, gostaria de saber mais sobre o ${brand} ${model}`;
}

export function unsplash(id: string, w = 1200, h = 800) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
