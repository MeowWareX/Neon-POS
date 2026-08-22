"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CupSoda,
  Sparkles,
  Wine,
  Phone,
  ShieldCheck,
  HelpCircle,
  Calculator,
  TrendingUp,
  Maximize2,
  X,
  Droplet,
  Zap,
  Award,
  PackageCheck,
  ChevronRight,
  BadgePercent,
  Truck,
  Store,
} from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Sales graphics list
const PROMO_ARTS = [
  {
    id: "promo-mayorista",
    title: "Promoción Líquidos Mayorista",
    subtitle: "Precios especiales por bolsas concentradas de alto rendimiento",
    src: "/images/promos/promocion-liquidos-mayorista.jpg",
    badge: "OFERTA PRINCIPAL",
    category: "Mayorista",
  },
  {
    id: "ojo-de-diablo",
    title: "Ojo de Diablo & Sabores Con Licor",
    subtitle: "Sabor estrella con Vodka, Whisky y Champagne + Carta con Licor",
    src: "/images/promos/ojo-de-diablo-sabores.jpg",
    badge: "SABOR ESTRELLA",
    category: "Con Licor",
  },
  {
    id: "carta-sin-licor",
    title: "Carta de Sabores Sin Licor",
    subtitle: "15 Sabores frutales e intensos ideal para todo público",
    src: "/images/promos/carta-sin-licor.jpg",
    badge: "15 SABORES",
    category: "Sin Licor",
  },
  {
    id: "carta-premium",
    title: "Carta de Sabores Premium",
    subtitle: "Limonadas especiales, cremosos de Milo, Coco y Baileys",
    src: "/images/promos/carta-premium.jpg",
    badge: "REVELACIÓN",
    category: "Premium",
  },
  {
    id: "carta-con-licor",
    title: "Carta Coctelera Con Licor",
    subtitle: "Sambapalo, Tussy, Sombra, Chichonero, Pupi, Azulito",
    src: "/images/promos/carta-con-licor.jpg",
    badge: "COCTELERÍA",
    category: "Con Licor",
  },
];

// Flavor SKUs
const FLAVOR_CATALOG = [
  // Con Licor
  {
    sku: "NEON-LIC-001",
    name: "Ojo de Diablo",
    type: "Con Licor",
    category: "con-licor",
    base: "Fresa + Vodka + Whisky + Champagne",
    color: "#ff1e56",
    badge: "Top Ventas 🔥",
    description:
      "Fuerte, dulce y peligrosamente delicioso. Rojo fuego vibrante.",
  },
  {
    sku: "NEON-LIC-002",
    name: "Sambapalo",
    type: "Con Licor",
    category: "con-licor",
    base: "Limón + Licor Tequila",
    color: "#10b981",
    badge: "Tequila Special",
    description: "Toque cítrico de limón fresco equilibrado con tequila.",
  },
  {
    sku: "NEON-LIC-003",
    name: "Tussy",
    type: "Con Licor",
    category: "con-licor",
    base: "Sandía, Fresa, Cereza + Licor Whisky",
    color: "#ec4899",
    badge: "Whisky Blend",
    description: "Trilogía de frutos rojos con carácter aromático de whisky.",
  },
  {
    sku: "NEON-LIC-004",
    name: "Sombra",
    type: "Con Licor",
    category: "con-licor",
    base: "Frutos Rojos + Vodka",
    color: "#8b5cf6",
    badge: "Vodka Premium",
    description: "Misterioso blend morado intenso con notas silvestres.",
  },
  {
    sku: "NEON-LIC-005",
    name: "Chichonero",
    type: "Con Licor",
    category: "con-licor",
    base: "Maracuyá + Vodka",
    color: "#eab308",
    badge: "Tropical Vodka",
    description:
      "Explosión tropical de maracuyá ácido con el toque frío de vodka.",
  },
  {
    sku: "NEON-LIC-006",
    name: "Pupi",
    type: "Con Licor",
    category: "con-licor",
    base: "Fresa y Sandía + Whisky",
    color: "#f43f5e",
    badge: "Whisky Fruit",
    description: "Doble frescura frutal con final sofisticado.",
  },
  {
    sku: "NEON-LIC-007",
    name: "Azulito",
    type: "Con Licor",
    category: "con-licor",
    base: "Mora Azul + Vodka",
    color: "#3b82f6",
    badge: "Blue Electric",
    description: "Azul eléctrico impactante en copa con sabor irresistible.",
  },
  {
    sku: "NEON-LIC-008",
    name: "Fresabom Con Licor",
    type: "Con Licor",
    category: "con-licor",
    base: "Fresa Concentrada + Licor Seleccionado",
    color: "#ef4444",
    badge: "Bolsa Concentrada",
    description: "Concentrado directo de fresa intensa para carga de máquina.",
  },

  // Premium
  {
    sku: "NEON-PRM-001",
    name: "Limonada Cerezada",
    type: "Premium",
    category: "premium",
    base: "Limón natural + Extracto de Cereza",
    color: "#f43f5e",
    badge: "Refrescante",
    description: "Equilibrio cítrico y dulce en tono rosado deslumbrante.",
  },
  {
    sku: "NEON-PRM-002",
    name: "Limonada de Coco",
    type: "Premium",
    category: "premium",
    base: "Limón + Crema de Coco Concentrada",
    color: "#fef08a",
    badge: "Crema Caribe",
    description: "Textura ultrasuave y aroma tropical caribeño.",
  },
  {
    sku: "NEON-PRM-003",
    name: "Maracucoco",
    type: "Premium",
    category: "premium",
    base: "Maracuyá + Crema de Coco",
    color: "#a855f7",
    badge: "Fusión Tropigala",
    description: "Acidez del maracuyá amalgamada con la cremosidad del coco.",
  },
  {
    sku: "NEON-PRM-004",
    name: "Piña Colada",
    type: "Premium",
    category: "premium",
    base: "Piña Madura + Crema de Coco",
    color: "#eab308",
    badge: "Clásico Tropical",
    description: "Sabor festivo universal formulado para granizadoras.",
  },
  {
    sku: "NEON-PRM-005",
    name: "Milo",
    type: "Premium",
    category: "premium",
    base: "Extracto de Chocolate Maltado Milo",
    color: "#78350f",
    badge: "Sabor Chocolate",
    description: "Granizado cremoso helado con auténtico sabor a Milo.",
  },
  {
    sku: "NEON-PRM-006",
    name: "Cocoloco",
    type: "Premium",
    category: "premium",
    base: "Coco + Piña + Cítricos",
    color: "#fef08a",
    badge: "Special Mix",
    description: "Cóctel caribeño sin licor listo para dispensar.",
  },
  {
    sku: "NEON-PRM-007",
    name: "Bayllys",
    type: "Premium",
    category: "premium",
    base: "Perfil Crema Irlandesa & Café",
    color: "#d97706",
    badge: "Gourmet Cream",
    description: "Sabor afamado de crema de whisky para paladares exigentes.",
  },

  // Sin Licor
  {
    sku: "NEON-SL-001",
    name: "Mango Biche",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Mango Verde + Cítricos",
    color: "#84cc16",
    badge: "Super Ventas",
    description: "Acidito, salado opcional y ultra refrescante.",
  },
  {
    sku: "NEON-SL-002",
    name: "Mora Azul",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Mora Silvestre Azul",
    color: "#2563eb",
    badge: "Neon Icon",
    description: "Sabor característico e intenso color azul neón.",
  },
  {
    sku: "NEON-SL-003",
    name: "Maracumango",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Maracuyá + Mango Dulce",
    color: "#f59e0b",
    badge: "Dúo Frutal",
    description: "Combinación de dos frutas íconos de la costa.",
  },
  {
    sku: "NEON-SL-004",
    name: "Chicle",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Tutti Frutti Chicle Neon",
    color: "#ec4899",
    badge: "Infantil & Joven",
    description: "Divertido sabor dulce que encanta en todo evento.",
  },
  {
    sku: "NEON-SL-005",
    name: "Sandía",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Extracto de Sandía Fresca",
    color: "#f43f5e",
    badge: "Jugoso",
    description: "Sensación hidratante e intensa en boca.",
  },
  {
    sku: "NEON-SL-006",
    name: "Piña",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Piña Tropical Concentrada",
    color: "#eab308",
    badge: "Tropical",
    description: "Cítrico y dulce equilibrado para granizados de fruta.",
  },
  {
    sku: "NEON-SL-007",
    name: "Fresa",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Fresa Silvestre Concentrada",
    color: "#ef4444",
    badge: "Clásico",
    description: "El sabor infaltable con color rojo brillante.",
  },
  {
    sku: "NEON-SL-008",
    name: "Cereza",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Cereza Madura",
    color: "#dc2626",
    badge: "Intenso",
    description: "Dulce intenso ideal para combinaciones con toppings.",
  },
  {
    sku: "NEON-SL-009",
    name: "Bombombum",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Perfil Chupeta Bombombum",
    color: "#e11d48",
    badge: "Explosivo",
    description: "Nostálgico sabor de chupeta de fresa congelada.",
  },
  {
    sku: "NEON-SL-010",
    name: "Kiwi",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Kiwi Verde Cítrico",
    color: "#65a30d",
    badge: "Cítrico Exótico",
    description: "Verde vibrante y sabor refrescante exótico.",
  },
  {
    sku: "NEON-SL-011",
    name: "Maracuyá",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Maracuyá Natural Concentrado",
    color: "#eab308",
    badge: "Fruta de la Pasión",
    description: "Sabor ácido punzante característico.",
  },
  {
    sku: "NEON-SL-012",
    name: "Lulo",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Lulo Colombiano",
    color: "#84cc16",
    badge: "Autóctono",
    description: "Sabor tradicional colombiano irresistible.",
  },
  {
    sku: "NEON-SL-013",
    name: "Mandarina",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Mandarina Dulce",
    color: "#f97316",
    badge: "Cítrico Dulce",
    description: "Aroma cítrico penetrante y dulzor balanceado.",
  },
  {
    sku: "NEON-SL-014",
    name: "Limonada",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Limón Criollo Concentrado",
    color: "#84cc16",
    badge: "Ultra Base",
    description: "Base ideal para limonadas congeladas.",
  },
  {
    sku: "NEON-SL-015",
    name: "Uva",
    type: "Sin Licor",
    category: "sin-licor",
    base: "Uva Morada Dulce",
    color: "#9333ea",
    badge: "Frutal Dulce",
    description: "Púrpura neón vibrante con sabor frutal dulzón.",
  },
];

export default function HomePage() {
  const [selectedArtModal, setSelectedArtModal] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  // Profit Calculator State
  const [calcBags, setCalcBags] = useState<number>(6);
  const [calcType, setCalcType] = useState<"sin-licor" | "con-licor">(
    "con-licor",
  );
  const [calcGlassPrice, setCalcGlassPrice] = useState<number>(10000);

  // Calculations
  const costPerBag =
    calcType === "con-licor"
      ? calcBags >= 10
        ? 30000
        : calcBags >= 6
          ? 33333
          : 35000
      : calcBags >= 10
        ? 26000
        : calcBags >= 6
          ? 28333
          : 30000;

  const totalCost = costPerBag * calcBags;
  const estimatedGlassesPerBag = 35; // ~35 vasos de 10-12oz por bolsa mezclada
  const totalGlasses = calcBags * estimatedGlassesPerBag;
  const estimatedRevenue = totalGlasses * calcGlassPrice;
  const estimatedProfit = estimatedRevenue - totalCost;
  const marginPercentage = Math.round(
    (estimatedProfit / estimatedRevenue) * 100,
  );

  const filteredFlavors =
    activeCategoryFilter === "all"
      ? FLAVOR_CATALOG
      : FLAVOR_CATALOG.filter((f) => f.category === activeCategoryFilter);

  const activeArt = PROMO_ARTS.find((art) => art.id === selectedArtModal);

  // JSON-LD Schemas for Search Engines and AI Search (ChatGPT, Perplexity, Gemini, Google Search)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Neon Drinks & Concentrados",
    legalName: "Neon Drinks & Snacks",
    url: "https://www.clubneon.co",
    logo: "https://www.clubneon.co/logo.jpg",
    description:
      "Distribuidor mayorista y detal de líquidos concentrados para máquinas granizadoras en Colombia. Sabores intensos con y sin licor para negocios, eventos y discotecas.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+573113795540",
      contactType: "Sales & Wholesale Distribution",
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
    sameAs: ["https://instagram.com/neon_ctg", "https://facebook.com/neon_ctg"],
  };

  const productCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Líquidos Concentrados para Máquinas Granizadoras Neon",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Líquido Concentrado Con Licor para Granizadora",
          description:
            "Fórmula concentrada con licor (Tequila, Whisky, Vodka, Champagne) de alto rendimiento para máquinas granizadoras. Sabores Ojo de Diablo, Sambapalo, Tussy, Sombra, Chichonero, Pupi, Azulito.",
          brand: "Neon",
          image: "https://www.clubneon.co/images/promos/carta-con-licor.jpg",
        },
        priceCurrency: "COP",
        price: "35000",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "35000",
          priceCurrency: "COP",
          name: "Bolsa Individual Con Licor",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Líquido Concentrado Sin Licor para Granizadora",
          description:
            "Concentrado frutal de alto rendimiento para máquinas granizadoras. 15 sabores intensos como Mango Biche, Mora Azul, Maracumango, Chicle, Sandía, Fresa, Lulo, Limonada.",
          brand: "Neon",
          image: "https://www.clubneon.co/images/promos/carta-sin-licor.jpg",
        },
        priceCurrency: "COP",
        price: "30000",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "30000",
          priceCurrency: "COP",
          name: "Bolsa Individual Sin Licor",
        },
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo se preparan los líquidos concentrados Neon para máquinas granizadoras?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nuestros líquidos vienen en bolsas de concentrado listos para diluir con agua o hielo según las especificaciones de rendimiento. Garantizan congelación homogénea, textura de granizado suave y estabilidad de color y sabor sin saturar los tanques de la granizadora.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hacen envíos de concentrados de granizados a toda Colombia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, despachamos líquidos concentrados para granizadoras desde Cartagena a todo el departamento de Bolívar, Costa Caribe y principales ciudades de Colombia al por mayor y detal.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuáles son los precios al por mayor de los líquidos concentrados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para líquidos Con Licor: 1 unidad por $35.000, pack de 6 bolsas por $200.000 y pack de 10 bolsas por $300.000. Para líquidos Sin Licor: 1 unidad por $30.000, pack de 6 unidades por $170.000 y pack de 10 unidades por $260.000.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué rendimiento tiene cada bolsa concentrada Neon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada bolsa concentrada rinde aproximadamente 35 a 40 vasos de 10-12oz de granizado listo para servir, ofreciendo un excelente margen de rentabilidad superior al 65% para tu negocio.",
        },
      },
    ],
  };

  return (
    <div
      className="min-h-screen font-sans text-slate-100 selection:bg-pink-500 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #1e0539 0%, #090014 60%, #030008 100%)",
      }}
    >
      {/* Structural Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productCatalogSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation Bar (Public Site - NO POS Links) */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#090014]/85 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 overflow-hidden rounded-2xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-0.5 shadow-[0_0_20px_rgba(255,115,227,0.4)]">
              <Image
                src="/logo.jpg"
                alt="Neon Drinks & Concentrados Logo"
                width={44}
                height={44}
                className="h-full w-full rounded-[14px] object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-display bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-xl font-extrabold tracking-[0.15em] text-transparent sm:text-2xl">
                NEON
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Líquidos para Granizadoras
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 text-xs font-semibold text-slate-300 md:flex">
            <a
              href="#concentrados"
              className="transition-colors hover:text-pink-400"
            >
              Líquidos Mayoristas
            </a>
            <a
              href="#artes-ventas"
              className="transition-colors hover:text-pink-400"
            >
              Artes de Venta
            </a>
            <a
              href="#precios"
              className="transition-colors hover:text-pink-400"
            >
              Precios & Promos
            </a>
            <a
              href="#calculadora"
              className="transition-colors hover:text-pink-400"
            >
              Calculadora Negocios
            </a>
            <a
              href="#sabores"
              className="transition-colors hover:text-pink-400"
            >
              Catálogo Sabores
            </a>
            <Link
              href="/punto-fisico"
              className="flex items-center gap-1 text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <Store className="h-3.5 w-3.5" />
              Punto Físico
            </Link>
          </div>

          {/* CTA Buttons - Wholesale WhatsApp */}
          <div className="flex items-center gap-3">
            <Link
              href="/club/register"
              className="hidden rounded-xl border border-pink-500/40 px-3.5 py-2 text-xs font-semibold text-pink-300 transition-colors hover:bg-pink-500/10 sm:block"
            >
              Neon Club
            </Link>

            <a
              href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20informaci%C3%B3n%20y%20precios%20al%20por%20mayor%20de%20l%C3%ADquidos%20concentrados%20para%20granizadoras"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" />
              <span>Pedidos WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-16 text-center sm:px-8">
        {/* Glow ambient background sphere */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/15 blur-[120px]"></div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-emerald-500/20 px-4 py-1.5 text-xs font-bold tracking-widest text-pink-300 uppercase backdrop-blur-md">
            <Sparkles className="h-4 w-4 animate-pulse text-emerald-400" />
            Proveedor Oficial de Líquidos Concentrados para Granizadoras en
            Colombia
          </div>

          <h1 className="font-display mx-auto max-w-5xl text-4xl leading-tight font-black tracking-tight sm:text-6xl md:text-7xl">
            <span className="block text-white">DISTRIBUIDOR DE</span>
            <span className="bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">
              LÍQUIDOS CONCENTRADOS PARA MÁQUINAS GRANIZADORAS
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed font-normal text-slate-200 sm:text-xl">
            Potencia las ventas de tu negocio, evento o establecimiento.
            Suministramos al por mayor y detal{" "}
            <strong className="font-semibold text-pink-300">
              fórmulas concentradas de alto rendimiento
            </strong>{" "}
            con sabores intensos con licor y sin licor, diseñadas para
            congelación perfecta y máxima rentabilidad.
          </p>

          {/* Quick Value Badges */}
          <div className="mx-auto flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
              <Droplet className="h-4 w-4 text-pink-400" />
              <span>Sabores Intensos y Vibrantes</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Rendimiento Garantizado en Granizadora</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
              <Truck className="h-4 w-4 text-yellow-400" />
              <span>Despachos Cartagena y Colombia</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <a
              href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20cotizar%20un%20pedido%20al%20por%20mayor%20de%20l%C3%ADquidos%20para%20granizadora"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 transition-transform hover:scale-[1.03]"
            >
              <Phone className="h-5 w-5" />
              Cotizar Pedido Mayorista por WhatsApp
            </a>

            <a
              href="#precios"
              className="glass-panel flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition-all hover:border-pink-500/50 hover:text-pink-300"
            >
              <BadgePercent className="h-4 w-4 text-pink-400" />
              Ver Precios y Descuentos por Volumen
            </a>

            <Link
              href="/punto-fisico"
              className="glass-panel flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
            >
              <Store className="h-4 w-4 text-emerald-400" />
              Conocer Punto Físico Cartagena
            </Link>
          </div>
        </div>
      </section>

      {/* Main Focus 1: Sales Arts Showcase (Artes de Ventas) */}
      <section
        id="artes-ventas"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-8"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Material de Ventas & Cartas de Sabores
            </div>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Nuestras Piezas & Artes de Ventas Oficiales
            </h2>
            <p className="max-w-2xl text-xs text-slate-300 sm:text-sm">
              Haz clic en cualquiera de los artes promocionales para ampliarlo.
              Disponibles para exhibir en tu establecimiento o solicitar pedidos
              de líquido concentrado directo por sabor.
            </p>
          </div>

          {/* Promotional Arts Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_ARTS.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtModal(art.id)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(255,115,227,0.3)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={art.src}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-pink-500/90 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase backdrop-blur-md">
                      {art.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                  </div>

                  <div className="absolute right-4 bottom-4 left-4 space-y-1">
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-pink-300">
                      {art.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-slate-300">
                      {art.subtitle}
                    </p>
                    <div className="flex items-center gap-1 pt-1 text-[11px] font-bold text-emerald-400">
                      <span>Ver arte en alta resolución</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Art Modal Preview Lightbox */}
      {activeArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-slate-950 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                  {activeArt.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeArt.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArtModal(null)}
                className="rounded-full bg-white/10 p-2 text-slate-300 transition-colors hover:bg-pink-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative max-h-[70vh] min-h-[400px] w-full overflow-auto rounded-2xl bg-black">
              <Image
                src={activeArt.src}
                alt={activeArt.title}
                width={800}
                height={1200}
                className="mx-auto h-auto w-full max-w-full rounded-xl object-contain"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-3 sm:flex-row">
              <p className="text-xs text-slate-400">{activeArt.subtitle}</p>
              <a
                href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20quisiera%20pedir%20l%C3%ADquidos%20relacionados%20con%20el%20arte%3A%20${encodeURIComponent(
                  activeArt.title,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-transform hover:scale-105 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Pedir Sabores de este Arte por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Focus 2: Pricing & Volume Discounts */}
      <section id="precios" className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="glass-panel space-y-8 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-10">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 uppercase">
              <BadgePercent className="h-3.5 w-3.5" />
              Precios Directos de Fábrica
            </div>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Lista de Precios al Por Mayor y Detal
            </h2>
            <p className="text-xs text-slate-300 sm:text-sm">
              Líquidos concentrados listos para dosificar y vaciar en máquinas
              granizadoras. Descuentos progresivos por volumen.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Table 1: Con Licor */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl border border-pink-500/40 bg-gradient-to-b from-pink-950/30 via-slate-950 to-black p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-pink-500/20 p-3 text-pink-400">
                    <Wine className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Líquidos CON LICOR
                    </h3>
                    <p className="text-xs font-semibold text-pink-400">
                      Tequila, Whisky, Vodka & Champagne
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-extrabold text-pink-300">
                  COCTELERÍA
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div>
                    <span className="block font-bold text-white">
                      1 Unidad (Bolsa Concentrada)
                    </span>
                    <span className="text-xs text-slate-400">
                      Prueba o venta al detal
                    </span>
                  </div>
                  <span className="text-xl font-black text-pink-400">
                    $35.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4">
                  <div>
                    <span className="block font-bold text-white">
                      Pack de 6 Bolsas
                    </span>
                    <span className="text-xs font-semibold text-pink-300">
                      Precio por bolsa: ~$33.333
                    </span>
                  </div>
                  <span className="text-xl font-black text-pink-300">
                    $200.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 shadow-lg">
                  <div>
                    <span className="block flex items-center gap-1.5 font-extrabold text-white">
                      Pack de 10 Bolsas
                      <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase">
                        Mejor Valor
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-300">
                      Precio por bolsa: $30.000 (Ahorro $50k)
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    $300.000
                  </span>
                </div>
              </div>

              <a
                href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20ordenar%20líquidos%20concentrados%20CON%20LICOR"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-3.5 text-center text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition-transform hover:scale-[1.02]"
              >
                Pedir Pack Con Licor por WhatsApp
              </a>
            </div>

            {/* Table 2: Sin Licor */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 via-slate-950 to-black p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
                    <CupSoda className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Líquidos SIN LICOR
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400">
                      15 Sabores Frutales & Premium
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-extrabold text-cyan-300">
                  TODO PÚBLICO
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div>
                    <span className="block font-bold text-white">
                      1 Unidad (Bolsa Concentrada)
                    </span>
                    <span className="text-xs text-slate-400">
                      Venta al detal
                    </span>
                  </div>
                  <span className="text-xl font-black text-cyan-400">
                    $30.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                  <div>
                    <span className="block font-bold text-white">
                      Pack de 6 Unidades
                    </span>
                    <span className="text-xs font-semibold text-cyan-300">
                      Precio por bolsa: ~$28.333
                    </span>
                  </div>
                  <span className="text-xl font-black text-cyan-300">
                    $170.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 shadow-lg">
                  <div>
                    <span className="block flex items-center gap-1.5 font-extrabold text-white">
                      Pack de 10 Unidades
                      <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase">
                        Mejor Valor
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-300">
                      Precio por bolsa: $26.000 (Ahorro $40k)
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    $260.000
                  </span>
                </div>
              </div>

              <a
                href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20ordenar%20líquidos%20concentrados%20SIN%20LICOR"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3.5 text-center text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.02]"
              >
                Pedir Pack Sin Licor por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Focus 3: Wholesale Profit Margin Calculator */}
      <section
        id="calculadora"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-black p-6 backdrop-blur-xl sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 uppercase">
                <Calculator className="h-4 w-4" />
                Simulador de Negocio para Emprendedores
              </div>

              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
                Calculadora de Rentabilidad Neon
              </h2>

              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                Descubre cuánto dinero puedes generar en tu máquina granizadora
                vendiendo nuestros líquidos concentrados. Ajusta el número de
                bolsas y tu precio de venta por vaso.
              </p>

              {/* Calculator Inputs */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-300 uppercase">
                    Tipo de Líquido Concentrado:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCalcType("con-licor")}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                        calcType === "con-licor"
                          ? "border-pink-500 bg-pink-500/20 text-pink-300"
                          : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      Con Licor (Coctelera)
                    </button>
                    <button
                      onClick={() => setCalcType("sin-licor")}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                        calcType === "sin-licor"
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                          : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      Sin Licor (Frutales)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-300">
                    <span>Cantidad de Bolsas Concentradas:</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {calcBags} bolsas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={calcBags}
                    onChange={(e) => setCalcBags(Number(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between pt-1 text-[10px] text-slate-400">
                    <span>1 Bolsa</span>
                    <span>10 Bolsas (Precio Pro)</span>
                    <span>50 Bolsas</span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-300">
                    <span>Precio estimado de venta por vaso:</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      ${calcGlassPrice.toLocaleString("es-CO")} COP
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4000"
                    max="20000"
                    step="500"
                    value={calcGlassPrice}
                    onChange={(e) => setCalcGlassPrice(Number(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between pt-1 text-[10px] text-slate-400">
                    <span>$4.000</span>
                    <span>$10.000 (Promedio)</span>
                    <span>$20.000 (Discoteca/Evento)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Results Display */}
            <div className="space-y-6 rounded-3xl border border-emerald-500/30 bg-black/60 p-6 shadow-2xl lg:col-span-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Resultados Estimados
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Margen ~{marginPercentage}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="block text-[11px] text-slate-400">
                    Inversión en Concentrado:
                  </span>
                  <span className="text-xl font-bold text-white">
                    ${totalCost.toLocaleString("es-CO")}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="block text-[11px] text-slate-400">
                    Vasos Producidos (~35/bolsa):
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
                    {totalGlasses} vasos
                  </span>
                </div>
              </div>

              <div className="space-y-1 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 to-teal-950/50 p-5">
                <span className="block text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  Ingreso Total Estimado en Ventas:
                </span>
                <span className="text-3xl font-black text-white">
                  ${estimatedRevenue.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="space-y-1 rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-950/50 to-purple-950/50 p-5">
                <span className="block text-xs font-bold tracking-wider text-pink-300 uppercase">
                  GANANCIA NETA ESTIMADA:
                </span>
                <span className="text-3xl font-black text-pink-400">
                  ${estimatedProfit.toLocaleString("es-CO")} COP
                </span>
              </div>

              <a
                href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20estuve%20simulando%20un%20pedido%20de%20${calcBags}%20bolsas%20y%20deseo%20hacer%20el%20pedido`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 py-4 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02]"
              >
                <Phone className="h-4 w-4" />
                Hacer este Pedido por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Focus 4: Filterable Flavor Catalog & SKUs */}
      <section id="sabores" className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400 uppercase">
              <Droplet className="h-3.5 w-3.5" />
              Catálogo Completo de Sabores & SKUs
            </div>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Nuestros Sabores Formulados para Granizadoras
            </h2>
            <p className="max-w-2xl text-xs text-slate-300 sm:text-sm">
              Conoce nuestro portafolio completo con código de referencia SKU
              para facilitar tus pedidos.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeCategoryFilter === "all"
                  ? "bg-gradient-to-r from-pink-500 to-emerald-400 text-slate-950 shadow-lg"
                  : "glass-panel border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              Todos los Sabores ({FLAVOR_CATALOG.length})
            </button>

            <button
              onClick={() => setActiveCategoryFilter("sin-licor")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeCategoryFilter === "sin-licor"
                  ? "bg-cyan-500 text-slate-950 shadow-lg"
                  : "glass-panel border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              Sin Licor (15)
            </button>

            <button
              onClick={() => setActiveCategoryFilter("premium")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeCategoryFilter === "premium"
                  ? "bg-amber-500 text-slate-950 shadow-lg"
                  : "glass-panel border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              Premium (7)
            </button>

            <button
              onClick={() => setActiveCategoryFilter("con-licor")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeCategoryFilter === "con-licor"
                  ? "bg-pink-500 text-white shadow-lg"
                  : "glass-panel border border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              Con Licor (8)
            </button>
          </div>

          {/* Flavors Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFlavors.map((flavor) => (
              <div
                key={flavor.sku}
                className="glass-panel group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">
                    SKU: {flavor.sku}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-slate-950 uppercase"
                    style={{ backgroundColor: flavor.color }}
                  >
                    {flavor.badge}
                  </span>
                </div>

                <div className="mb-3 space-y-1">
                  <h3 className="text-lg font-bold text-white transition-colors group-hover:text-pink-300">
                    {flavor.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400">
                    {flavor.base}
                  </p>
                </div>

                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-300">
                  {flavor.description}
                </p>

                <a
                  href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20solicitar%20el%20sabor%20${encodeURIComponent(
                    flavor.name,
                  )}%20(SKU%3A%20${flavor.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-slate-300 transition-colors group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20 group-hover:text-emerald-300"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Pedir este SKU
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Focus 5: Why Neon Liquid Concentrates? (Benefits for businesses) */}
      <section
        id="concentrados"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-8"
      >
        <div className="glass-panel space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl sm:p-12">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 uppercase">
              <Zap className="h-3.5 w-3.5" />
              Por Qué Elegir Líquidos Neon
            </div>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Diseñados Específicamente para Granizadoras
            </h2>
            <p className="text-xs text-slate-300 sm:text-sm">
              Formulación técnica superior para que tu máquina opere sin atascos
              y tus granizados destaquen sobre la competencia.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="w-fit rounded-xl bg-pink-500/20 p-3 text-pink-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Sabores Intensos & Estables
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Nuestras esencias no se diluyen ni pierden color durante la
                congelación prolongada en el tanque de la granizadora.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="w-fit rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. Rendimiento Garantizado
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Concentrado de alta densidad con la relación justa de azúcares
                para congelar rápido formando la nieve granizada ideal.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="w-fit rounded-xl bg-yellow-500/20 p-3 text-yellow-400">
                <PackageCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. Asesoría Técnica para Granizadoras
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Te orientamos en la dosificación exacta para marcas de máquinas
                como Donper, SPM, Bras, Cofrimell y Ugolini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Focus: Punto Físico Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-pink-950/40 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-2xl space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 uppercase">
                <Store className="h-3.5 w-3.5" />
                Punto de Venta Físico en Cartagena
              </div>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                ¿Quieres probar nuestros granizados preparados en punto físico?
              </h2>
              <p className="text-xs text-slate-300 sm:text-sm">
                Conoce la carta de bebidas preparadas al instante en Cartagena y
                nuestro programa de fidelización digital Neon Club (&quot;PAGA
                10, LLEVA 11&quot;).
              </p>
            </div>

            <Link
              href="/punto-fisico"
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-4 text-xs font-extrabold text-slate-950 shadow-xl shadow-emerald-500/20 transition-transform hover:scale-105"
            >
              <Store className="h-4 w-4" />
              Ver Detalles del Punto Físico
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 uppercase">
              <HelpCircle className="h-3.5 w-3.5" />
              Preguntas Frecuentes
            </div>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">
              Dudas de Compradores & Operadores
            </h2>
          </div>

          <div className="space-y-4">
            <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-base font-bold text-white">
                ¿Cómo viene empacado el líquido concentrado?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Viene en bolsas selladas de alta resistencia de fácil
                dosificación, diseñadas para vaciar directo a la mezcla de tu
                granizadora.
              </p>
            </div>

            <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-base font-bold text-white">
                ¿Realizan despachos fuera de Cartagena?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Sí, coordinamos envíos de concentrados al por mayor a Bolívar,
                Costa Caribe y toda Colombia mediante las principales
                transportadoras.
              </p>
            </div>

            <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-base font-bold text-white">
                ¿Ofrecen asesoría si apenas estoy iniciando mi negocio de
                granizados?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Totalmente. Te asesoramos en la mezcla correcta, selección de
                sabores con mayor rotación y mantenimiento de tu máquina
                granizadora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google API & Platform Compliance Statement (Discrete Section for Reviewers) */}
      <section
        id="google-compliance"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-8"
      >
        <div className="glass-panel space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 text-xs text-slate-400">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-slate-300 uppercase">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Declaración de Cumplimiento Plataforma Neon
            </span>
            <span className="font-mono text-[10px]">www.clubneon.co</span>
          </div>

          <p className="leading-relaxed">
            La plataforma <strong className="text-slate-200">Neon</strong>{" "}
            utiliza autenticación Google OAuth 2.0 y servicios de Google Wallet
            API para la emisión de tarjetas de lealtad digitales de{" "}
            <strong className="text-slate-200">Neon Club</strong>. Los datos
            obtenidos a través de las API de Google se emplean de acuerdo con la{" "}
            <em>Google API Services User Data Policy</em>. No vendemos ni
            compartimos datos personales con plataformas publicitarias de
            terceros.
          </p>
        </div>
      </section>

      {/* Footer (Public Site - NO POS Links) */}
      <footer className="border-t border-white/10 bg-black/80 px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo Neon"
              width={32}
              height={32}
              className="size-8 rounded-lg object-cover"
            />
            <div>
              <span className="font-bold text-white">
                Neon Drinks & Concentrados
              </span>{" "}
              — www.clubneon.co © {new Date().getFullYear()}. Todos los derechos
              reservados.
            </div>
          </div>

          {/* Social Links & WhatsApp */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/neon_ctg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-pink-400"
            >
              <InstagramIcon className="h-4 w-4 text-pink-400" />
              <span>@neon_ctg</span>
            </a>

            <a
              href="https://wa.me/573113795540"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-emerald-400"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>311 379 5540</span>
            </a>

            <Link
              href="/punto-fisico"
              className="transition-colors hover:text-emerald-400"
            >
              Punto Físico
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-pink-400"
            >
              Privacidad
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-pink-400"
            >
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
