// ── Primary (card hero) — high-quality 3/4 angle studio shots ──
import imgPorsche from "../../imports/Image__Porsche_911_GT3_RS_.png";
import imgPorscheDestaque from "../../imports/Image__Porsche_911_GT3_RS_em_destaque_.png";
import imgPorscheVideo from "../../imports/Video_-_Porsche_911_GT3_RS___perfil_em_v_deo.png";
import imgFerrari from "../../imports/Image__Ferrari_296_GTB_-1.png";
import imgFerrariAlt from "../../imports/Image__Ferrari_296_GTB_.png";
import imgLambo from "../../imports/Image__Lamborghini_Hurac_n_Tecnica_-1.png";
import imgLamboAlt from "../../imports/Image__Lamborghini_Hurac_n_Tecnica_.png";
import imgAmg from "../../imports/Image__Mercedes-AMG_GT_63_S_-1.png";
import imgAmgAlt from "../../imports/Image__Mercedes-AMG_GT_63_S_.png";
import imgAston from "../../imports/Image__Aston_Martin_DB12_-1.png";
import imgAstonAlt from "../../imports/Image__Aston_Martin_DB12_.png";
import imgBentley from "../../imports/Image__Bentley_Continental_GT_Speed_-1.png";
import imgBentleyAlt from "../../imports/Image__Bentley_Continental_GT_Speed_.png";
import imgBmw from "../../imports/Image__BMW_M5_Competition_-1.png";
import imgBmwAlt from "../../imports/Image__BMW_M5_Competition_.png";
import imgJaguar from "../../imports/Image__Jaguar_F-Type_R75_-1.png";
import imgJaguarAlt from "../../imports/Image__Jaguar_F-Type_R75_.png";
import imgRange from "../../imports/Image__Range_Rover_SV_Autobiography_.png";

export type Selo = "RARO" | "ÚLTIMA UNIDADE" | "NOVO" | "RESERVADO" | "EDIÇÃO LIMITADA" | null;

export type Categoria =
  | "Esportivos"
  | "Clássicos"
  | "SUV Premium"
  | "Edições limitadas"
  | "Recém-chegados";

export type Carroceria = "Coupé" | "Sedan" | "GT" | "Conversível" | "SUV";
export type Cambio = "PDK" | "DCT" | "Automático";
export type Combustivel = "Gasolina" | "Híbrido";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  color: string;
  selo: Selo;
  categoria: Categoria;
  carroceria: Carroceria;
  cambio: Cambio;
  combustivel: Combustivel;
  motor: string;
  potencia: string;
  velocidadeMax: string;
  price: number | null;
  shortDesc: string;
  highlights: string[];
  images: string[]; // [0] = card primary, [1+] = gallery
  featuredImage?: string; // optional dedicated spotlight image
  available: boolean;
  paused?: boolean;
  addedWeeksAgo: number;
}

export const vehicles: Vehicle[] = [
  {
    id: "porsche-gt3rs",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    km: 1200,
    color: "Branco Carrara",
    selo: "RARO",
    categoria: "Esportivos",
    carroceria: "Coupé",
    cambio: "PDK",
    combustivel: "Gasolina",
    motor: "4.0L Boxer 6 aspirado",
    potencia: "525 cv",
    velocidadeMax: "296 km/h",
    price: 2890000,
    shortDesc:
      "Aero kit Weissach, bancos em fibra de carbono e procedência impecável de primeiro dono.",
    highlights: [
      "Aero kit Weissach completo",
      "Teto em magnésio",
      'Rodas forjadas 20"',
      "Bancos em fibra de carbono",
    ],
    images: [imgPorsche, imgPorscheDestaque, imgPorscheVideo],
    featuredImage: imgPorscheDestaque,
    available: true,
    addedWeeksAgo: 0,
  },
  {
    id: "ferrari-296gtb",
    brand: "Ferrari",
    model: "296 GTB",
    year: 2023,
    km: 3400,
    color: "Rosso Corsa",
    selo: "ÚLTIMA UNIDADE",
    categoria: "Esportivos",
    carroceria: "Coupé",
    cambio: "DCT",
    combustivel: "Híbrido",
    motor: "V6 híbrido turbinado",
    potencia: "830 cv",
    velocidadeMax: "330 km/h",
    price: null,
    shortDesc:
      "V6 híbrido turbinado, 830 cv combinados. Histórico completo e revisão oficial.",
    highlights: [
      "Pacote Assetto Fiorano",
      "Freios carbono-cerâmica",
      "Revisão oficial em dia",
      "Interior Alcantara",
    ],
    images: [imgFerrari, imgFerrariAlt],
    available: true,
    addedWeeksAgo: 1,
  },
  {
    id: "lamborghini-huracan",
    brand: "Lamborghini",
    model: "Huracán Tecnica",
    year: 2024,
    km: 800,
    color: "Bianco Icarus",
    selo: "NOVO",
    categoria: "Edições limitadas",
    carroceria: "Coupé",
    cambio: "DCT",
    combustivel: "Gasolina",
    motor: "5.2L V10 aspirado",
    potencia: "640 cv",
    velocidadeMax: "325 km/h",
    price: 3450000,
    shortDesc:
      "V10 aspirado, dinâmica de pista, configuração específica para a unidade.",
    highlights: [
      "Configuração Ad Personam",
      "Escapamento esportivo",
      "Pacote em carbono",
      "Bancos esportivos",
    ],
    images: [imgLambo, imgLamboAlt],
    available: true,
    addedWeeksAgo: 0,
  },
  {
    id: "amg-gt63s",
    brand: "Mercedes-AMG",
    model: "GT 63 S",
    year: 2023,
    km: 5100,
    color: "Cinza Selenita",
    selo: null,
    categoria: "Esportivos",
    carroceria: "Sedan",
    cambio: "Automático",
    combustivel: "Gasolina",
    motor: "4.0L V8 biturbo",
    potencia: "639 cv",
    velocidadeMax: "315 km/h",
    price: 1690000,
    shortDesc:
      "Quatro portas com motor 4.0 V8 biturbo. Acabamento Designo e laudo independente.",
    highlights: [
      "Acabamento Designo",
      "Teto panorâmico",
      "Burmester High-End",
      "Laudo independente",
    ],
    images: [imgAmg, imgAmgAlt],
    available: true,
    addedWeeksAgo: 2,
  },
  {
    id: "aston-db12",
    brand: "Aston Martin",
    model: "DB12",
    year: 2024,
    km: 1500,
    color: "Magnetic Silver",
    selo: "RESERVADO",
    categoria: "Esportivos",
    carroceria: "GT",
    cambio: "Automático",
    combustivel: "Gasolina",
    motor: "4.0L V8 biturbo",
    potencia: "680 cv",
    velocidadeMax: "325 km/h",
    price: null,
    shortDesc:
      "GT inglês com 680 cv. Couro Bridge of Weir e detalhes em alumínio escovado.",
    highlights: [
      "Couro Bridge of Weir",
      "Alumínio escovado",
      "Freios carbono-cerâmica",
      "Bang & Olufsen",
    ],
    images: [imgAston, imgAstonAlt],
    available: false,
    addedWeeksAgo: 3,
  },
  {
    id: "bentley-gt-speed",
    brand: "Bentley",
    model: "Continental GT Speed",
    year: 2023,
    km: 6800,
    color: "Orange Flame",
    selo: null,
    categoria: "Clássicos",
    carroceria: "GT",
    cambio: "Automático",
    combustivel: "Gasolina",
    motor: "6.0L W12 biturbo",
    potencia: "659 cv",
    velocidadeMax: "335 km/h",
    price: 2150000,
    shortDesc:
      "GT de 12 cilindros, interior em couro Mulliner, presença para qualquer agenda.",
    highlights: [
      "Interior Mulliner",
      'Rodas 22" diamantadas',
      "Naim for Bentley",
      "Volante aquecido",
    ],
    images: [imgBentley, imgBentleyAlt],
    available: true,
    addedWeeksAgo: 4,
  },
  {
    id: "bmw-m5",
    brand: "BMW",
    model: "M5 Competition",
    year: 2024,
    km: 2800,
    color: "Cinza Brooklyn",
    selo: "NOVO",
    categoria: "Recém-chegados",
    carroceria: "Sedan",
    cambio: "Automático",
    combustivel: "Gasolina",
    motor: "4.4L V8 biturbo",
    potencia: "625 cv",
    velocidadeMax: "305 km/h",
    price: 1290000,
    shortDesc:
      "Sedã de alta performance com pacote M Competition e freios M Carbon.",
    highlights: [
      "Pacote M Competition",
      "Freios M Carbon",
      "M Driver's Package",
      "Bancos M em carbono",
    ],
    images: [imgBmw, imgBmwAlt],
    available: true,
    addedWeeksAgo: 0,
  },
  {
    id: "jaguar-ftype",
    brand: "Jaguar",
    model: "F-Type R75",
    year: 2023,
    km: 4200,
    color: "Azul Velocity",
    selo: null,
    categoria: "Clássicos",
    carroceria: "Conversível",
    cambio: "Automático",
    combustivel: "Gasolina",
    motor: "5.0L V8 supercharged",
    potencia: "575 cv",
    velocidadeMax: "300 km/h",
    price: 980000,
    shortDesc:
      "Edição de despedida do V8 supercharged. Capota flexível e escape esportivo.",
    highlights: [
      "Edição comemorativa R75",
      "Escapamento Switchable",
      "Meridian Surround",
      "Bancos Windsor",
    ],
    images: [imgJaguar, imgJaguarAlt],
    available: true,
    addedWeeksAgo: 5,
  },
  {
    id: "range-rover-sv",
    brand: "Range Rover",
    model: "SV Autobiography",
    year: 2024,
    km: 3200,
    color: "Belgravia Green",
    selo: null,
    categoria: "SUV Premium",
    carroceria: "SUV",
    cambio: "Automático",
    combustivel: "Híbrido",
    motor: "4.4L V8 híbrido",
    potencia: "615 cv",
    velocidadeMax: "290 km/h",
    price: 1890000,
    shortDesc:
      "SUV de luxo com acabamento SV, mesas traseiras retráteis e sistema híbrido.",
    highlights: [
      "Acabamento SV Bespoke",
      "Mesas Executive traseiras",
      "Meridian Signature",
      "Suspensão pneumática",
    ],
    images: [imgRange],
    available: true,
    addedWeeksAgo: 6,
  },
];

export const brands = [
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Mercedes-AMG",
  "Aston Martin",
  "Bentley",
  "BMW",
  "Jaguar",
  "Range Rover",
];

export const featuredBrands = [
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Aston Martin",
  "Bentley",
  "McLaren",
];

export const categorias: Categoria[] = [
  "Esportivos",
  "Clássicos",
  "SUV Premium",
  "Edições limitadas",
  "Recém-chegados",
];

export const carrocerias: Carroceria[] = ["Coupé", "Sedan", "GT", "Conversível", "SUV"];
export const cambios: Cambio[] = ["PDK", "DCT", "Automático"];
export const combustiveis: Combustivel[] = ["Gasolina", "Híbrido"];
