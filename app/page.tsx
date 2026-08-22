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
  ChevronDown,
  BadgePercent,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [showAllFlavors, setShowAllFlavors] = useState(false);
  const [pricingCategoryMobile, setPricingCategoryMobile] = useState<
    "con-licor" | "sin-licor"
  >("con-licor");

  // Profit Calculator State
  const [calcBags, setCalcBags] = useState<number>(10);
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

  const displayFlavors =
    showAllFlavors || activeCategoryFilter !== "all"
      ? filteredFlavors
      : filteredFlavors.slice(0, 8);

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
      <nav className="glass-panel sticky top-0 z-40 border-b border-white/10 px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 overflow-hidden rounded-2xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-0.5 shadow-[0_0_20px_rgba(255,62,171,0.4)]">
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
              <span className="font-display text-gradient-neon text-xl font-extrabold tracking-[0.15em] sm:text-2xl">
                NEON
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Líquidos para Granizadoras
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-muted-foreground hidden items-center gap-6 text-xs font-semibold md:flex">
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
              className="flex items-center gap-1.5 font-bold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <Store className="h-3.5 w-3.5" />
              Punto Físico
            </Link>
          </div>

          {/* CTA Buttons - Wholesale WhatsApp */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden border-pink-500/40 text-pink-300 hover:bg-pink-500/15 sm:inline-flex"
            >
              <Link href="/club/register">Neon Club</Link>
            </Button>

            <Button asChild variant="emerald" size="sm">
              <a
                href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20informaci%C3%B3n%20y%20precios%20al%20por%20mayor%20de%20l%C3%ADquidos%20concentrados%20para%20granizadoras"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-4 w-4" />
                <span>Pedidos WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 text-center sm:px-8 sm:pt-14 sm:pb-16">
        {/* Glow ambient background sphere */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/15 blur-[120px] sm:size-[550px]"></div>

        <div className="space-y-5 sm:space-y-6">
          <Badge
            variant="default"
            className="gap-2 px-3.5 py-1 text-[11px] sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            Mayorista & Detal · Fórmulas de Alto Rendimiento
          </Badge>

          <h1 className="font-display mx-auto max-w-4xl text-3xl leading-tight font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-white">Líquidos Concentrados para</span>
            <span className="text-gradient-neon block">
              Máquinas Granizadoras
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-xs leading-relaxed font-normal sm:text-base">
            Abastece tu negocio o evento con fórmulas de alta densidad listas
            para vaciar en tu granizadora. Sabores intensos con y sin licor,
            congelación rápida y{" "}
            <strong className="font-semibold text-pink-300">
              hasta 70% de rentabilidad neta
            </strong>
            .
          </p>

          {/* Quick Value Metrics Chips */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2.5 pt-1 sm:gap-4">
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-3 text-center sm:p-4">
              <span className="font-display text-sm font-black text-emerald-400 tabular-nums sm:text-lg">
                ~$850 COP
              </span>
              <span className="text-muted-foreground text-[10px] font-semibold sm:text-xs">
                Costo por vaso
              </span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-3 text-center sm:p-4">
              <span className="font-display text-sm font-black text-cyan-400 tabular-nums sm:text-lg">
                ~35 Vasos
              </span>
              <span className="text-muted-foreground text-[10px] font-semibold sm:text-xs">
                Rinde cada bolsa
              </span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-3 text-center sm:p-4">
              <span className="font-display text-sm font-black text-pink-400 sm:text-lg">
                Envíos 🇨🇴
              </span>
              <span className="text-muted-foreground text-[10px] font-semibold sm:text-xs">
                Toda Colombia
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row sm:pt-4">
            <Button
              asChild
              variant="emerald"
              size="lg"
              className="w-full px-6 py-3.5 text-sm font-bold shadow-lg shadow-emerald-500/25 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              <a
                href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20cotizar%20un%20pedido%20al%20por%20mayor%20de%20l%C3%ADquidos%20para%20granizadora"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Cotizar Pedido por WhatsApp</span>
              </a>
            </Button>

            <Button
              asChild
              variant="glass"
              size="lg"
              className="w-full px-6 py-3.5 text-sm font-bold sm:w-auto sm:text-base"
            >
              <a href="#precios">
                <BadgePercent className="h-4 w-4 text-pink-400" />
                <span>Ver Precios & Ganancias</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Focus 1: Pricing & Volume Discounts */}
      <section
        id="precios"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="glass-panel space-y-6 rounded-3xl border border-white/10 p-5 backdrop-blur-xl sm:space-y-8 sm:p-10">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <Badge variant="success" className="gap-1.5 px-3 py-1">
              <BadgePercent className="h-3.5 w-3.5" />
              Precios Directos de Fábrica
            </Badge>
            <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
              Lista de Precios al Por Mayor y Detal
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Líquidos listos para dosificar y vaciar en máquinas granizadoras.
            </p>
          </div>

          {/* Mobile Category Toggle (Only visible on mobile screens) */}
          <div className="mx-auto flex max-w-xs items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-1 md:hidden">
            <button
              onClick={() => setPricingCategoryMobile("con-licor")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                pricingCategoryMobile === "con-licor"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/25"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              🍹 Con Licor
            </button>
            <button
              onClick={() => setPricingCategoryMobile("sin-licor")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                pricingCategoryMobile === "sin-licor"
                  ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              🥤 Sin Licor
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Table 1: Con Licor */}
            <div
              className={`glass-card via-card relative space-y-5 overflow-hidden rounded-3xl border border-pink-500/40 bg-gradient-to-b from-pink-950/25 to-black p-5 shadow-xl sm:p-6 ${
                pricingCategoryMobile === "sin-licor"
                  ? "hidden md:block"
                  : "block"
              }`}
            >
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-pink-500/30 bg-pink-500/20 p-2.5 text-pink-400">
                    <Wine className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                      Líquidos CON LICOR
                    </h3>
                    <p className="text-[11px] font-semibold text-pink-400 sm:text-xs">
                      Tequila, Whisky, Vodka & Champagne
                    </p>
                  </div>
                </div>
                <Badge variant="default" size="sm">
                  COCTELERÍA
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 p-3.5 transition-colors hover:bg-white/8 sm:p-4">
                  <div>
                    <span className="block font-bold text-white">
                      1 Unidad (Bolsa Concentrada)
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Prueba o venta al detal
                    </span>
                  </div>
                  <span className="font-display text-lg font-black text-pink-400 tabular-nums sm:text-xl">
                    $35.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-pink-500/30 bg-pink-500/10 p-3.5 transition-colors hover:bg-pink-500/15 sm:p-4">
                  <div>
                    <span className="block font-bold text-white">
                      Pack de 6 Bolsas
                    </span>
                    <span className="text-[11px] font-semibold text-pink-300">
                      ~$33.333 por bolsa
                    </span>
                  </div>
                  <span className="font-display text-lg font-black text-pink-300 tabular-nums sm:text-xl">
                    $200.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-3.5 shadow-lg sm:p-4">
                  <div>
                    <span className="flex items-center gap-1.5 font-extrabold text-white">
                      Pack de 10 Bolsas
                      <Badge
                        variant="success"
                        size="sm"
                        className="bg-emerald-400 text-[10px] font-black text-slate-950"
                      >
                        Mejor Valor
                      </Badge>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-300">
                      $30.000/bolsa · Ahorras $50.000
                    </span>
                  </div>
                  <span className="font-display text-xl font-black text-emerald-400 tabular-nums sm:text-2xl">
                    $300.000
                  </span>
                </div>
              </div>

              <Button
                asChild
                variant="default"
                size="lg"
                className="w-full font-bold"
              >
                <a
                  href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20ordenar%20el%20Pack%20de%2010%20bolsas%20CON%20LICOR%20($300.000)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Pedir Pack Con Licor por WhatsApp</span>
                </a>
              </Button>
            </div>

            {/* Table 2: Sin Licor */}
            <div
              className={`glass-card via-card relative space-y-5 overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/25 to-black p-5 shadow-xl sm:p-6 ${
                pricingCategoryMobile === "con-licor"
                  ? "hidden md:block"
                  : "block"
              }`}
            >
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/20 p-2.5 text-cyan-400">
                    <CupSoda className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                      Líquidos SIN LICOR
                    </h3>
                    <p className="text-[11px] font-semibold text-cyan-400 sm:text-xs">
                      15 Sabores Frutales & Premium
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" size="sm">
                  TODO PÚBLICO
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 p-3.5 transition-colors hover:bg-white/8 sm:p-4">
                  <div>
                    <span className="block font-bold text-white">
                      1 Unidad (Bolsa Concentrada)
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Venta al detal
                    </span>
                  </div>
                  <span className="font-display text-lg font-black text-cyan-400 tabular-nums sm:text-xl">
                    $30.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 transition-colors hover:bg-cyan-500/15 sm:p-4">
                  <div>
                    <span className="block font-bold text-white">
                      Pack de 6 Unidades
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-300">
                      ~$28.333 por bolsa
                    </span>
                  </div>
                  <span className="font-display text-lg font-black text-cyan-300 tabular-nums sm:text-xl">
                    $170.000
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-3.5 shadow-lg sm:p-4">
                  <div>
                    <span className="flex items-center gap-1.5 font-extrabold text-white">
                      Pack de 10 Unidades
                      <Badge
                        variant="success"
                        size="sm"
                        className="bg-emerald-400 text-[10px] font-black text-slate-950"
                      >
                        Mejor Valor
                      </Badge>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-300">
                      $26.000/bolsa · Ahorras $40.000
                    </span>
                  </div>
                  <span className="font-display text-xl font-black text-emerald-400 tabular-nums sm:text-2xl">
                    $260.000
                  </span>
                </div>
              </div>

              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full font-bold"
              >
                <a
                  href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20ordenar%20el%20Pack%20de%2010%20bolsas%20SIN%20LICOR%20($260.000)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Pedir Pack Sin Licor por WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Focus 2: Profit Margin Calculator */}
      <section
        id="calculadora"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="glass-panel-elevated via-card relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-black p-5 backdrop-blur-xl sm:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-4 lg:col-span-6">
              <Badge variant="success" className="gap-2 px-3 py-1">
                <Calculator className="h-4 w-4" />
                Simulador de Rentabilidad
              </Badge>

              <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
                Calcula tu Ganancia Neta
              </h2>

              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                Ajusta las bolsas y tu precio por vaso para simular tu ingreso
                real en máquina granizadora.
              </p>

              {/* Calculator Inputs & Presets */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-muted-foreground mb-1.5 block text-xs font-bold tracking-wider uppercase">
                    Tipo de Concentrado:
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => setCalcType("con-licor")}
                      className={`cursor-pointer rounded-2xl border px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                        calcType === "con-licor"
                          ? "border-pink-500 bg-pink-500/20 text-pink-300 shadow-[0_0_16px_rgba(255,62,171,0.25)]"
                          : "text-muted-foreground border-white/10 bg-white/5 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      🍹 Con Licor
                    </button>
                    <button
                      onClick={() => setCalcType("sin-licor")}
                      className={`cursor-pointer rounded-2xl border px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                        calcType === "sin-licor"
                          ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-[0_0_16px_rgba(0,240,255,0.25)]"
                          : "text-muted-foreground border-white/10 bg-white/5 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      🥤 Sin Licor
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-white">
                    <span>Cantidad de Bolsas:</span>
                    <span className="font-display text-sm font-extrabold text-emerald-400 tabular-nums">
                      {calcBags} bolsas
                    </span>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="grid grid-cols-4 gap-1.5 pb-2">
                    {[6, 10, 20, 50].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setCalcBags(preset)}
                        className={`cursor-pointer rounded-xl border py-1.5 text-[11px] font-bold transition-all ${
                          calcBags === preset
                            ? "border-emerald-500 bg-emerald-500/25 text-emerald-300"
                            : "text-muted-foreground border-white/8 bg-white/4 hover:text-white"
                        }`}
                      >
                        {preset} {preset === 10 ? "⭐" : "Bolsas"}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={calcBags}
                    onChange={(e) => setCalcBags(Number(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-400"
                  />
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-white">
                    <span>Precio de venta por vaso:</span>
                    <span className="font-display text-sm font-extrabold text-emerald-400 tabular-nums">
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
                  <div className="text-muted-foreground flex justify-between pt-1 text-[10px]">
                    <span>$4.000 (Básico)</span>
                    <span>$10.000 (Promedio)</span>
                    <span>$20.000 (Evento)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Results Display */}
            <div className="glass-card space-y-4 rounded-3xl border border-emerald-500/30 p-5 shadow-2xl sm:space-y-5 sm:p-6 lg:col-span-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Resultado Financiero
                </span>
                <Badge variant="success" size="sm" className="gap-1 font-black">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Margen ~{marginPercentage}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/4 p-3 sm:p-4">
                  <span className="text-muted-foreground block text-[11px]">
                    Inversión:
                  </span>
                  <span className="font-display text-base font-bold text-white tabular-nums sm:text-xl">
                    ${totalCost.toLocaleString("es-CO")}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/4 p-3 sm:p-4">
                  <span className="text-muted-foreground block text-[11px]">
                    Producción Total:
                  </span>
                  <span className="font-display text-base font-bold text-emerald-400 tabular-nums sm:text-xl">
                    {totalGlasses} vasos
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-3.5 sm:p-4">
                <span className="block text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                  Ventas Brutas Estimadas:
                </span>
                <span className="font-display text-xl font-black text-white tabular-nums sm:text-2xl">
                  ${estimatedRevenue.toLocaleString("es-CO")} COP
                </span>
              </div>

              <div className="space-y-0.5 rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-950/40 to-purple-950/40 p-3.5 sm:p-4">
                <span className="block text-[11px] font-bold tracking-wider text-pink-300 uppercase">
                  GANANCIA NETA ESTIMADA:
                </span>
                <span className="font-display text-2xl font-black text-pink-400 tabular-nums sm:text-3xl">
                  +${estimatedProfit.toLocaleString("es-CO")} COP
                </span>
              </div>

              <Button
                asChild
                variant="emerald"
                size="lg"
                className="w-full font-bold"
              >
                <a
                  href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20ordenar%20el%20pedido%20de%20${calcBags}%20bolsas%20${encodeURIComponent(calcType === "con-licor" ? "CON LICOR" : "SIN LICOR")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Pedir este Combo por WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Focus 3: Sales Arts Showcase */}
      <section
        id="artes-ventas"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Material Promocional
            </Badge>
            <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
              Piezas & Artes de Ventas Oficiales
            </h2>
            <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
              Artes listos para imprimir o exhibir en tu establecimiento
              comercial.
            </p>
          </div>

          {/* Promotional Arts Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_ARTS.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtModal(art.id)}
                className="glass-card glass-interactive group relative cursor-pointer overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={art.src}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent"></div>

                  <div className="absolute top-3.5 left-3.5">
                    <Badge
                      variant="default"
                      size="sm"
                      className="bg-pink-500/90 font-extrabold text-white backdrop-blur-md"
                    >
                      {art.badge}
                    </Badge>
                  </div>

                  <div className="absolute top-3.5 right-3.5 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                  </div>

                  <div className="absolute right-3.5 bottom-3.5 left-3.5 space-y-1">
                    <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-pink-300">
                      {art.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      {art.subtitle}
                    </p>
                    <div className="flex items-center gap-1 pt-0.5 text-[11px] font-bold text-emerald-400">
                      <span>Ampliar arte en alta definición</span>
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
          <div className="glass-panel-elevated relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border border-white/20 p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <Badge variant="default" size="sm" className="mb-1">
                  {activeArt.category}
                </Badge>
                <h3 className="font-display text-lg font-bold text-white">
                  {activeArt.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArtModal(null)}
                className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-300 transition-colors hover:border-pink-500/40 hover:bg-pink-500/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative max-h-[65vh] min-h-[300px] w-full overflow-auto rounded-2xl bg-black">
              <Image
                src={activeArt.src}
                alt={activeArt.title}
                width={800}
                height={1200}
                className="mx-auto h-auto w-full max-w-full rounded-xl object-contain"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row">
              <p className="text-muted-foreground text-xs">
                {activeArt.subtitle}
              </p>
              <Button
                asChild
                variant="emerald"
                size="sm"
                className="w-full sm:w-auto"
              >
                <a
                  href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20quisiera%20pedir%20l%C3%ADquidos%20relacionados%20con%20el%20arte%3A%20${encodeURIComponent(
                    activeArt.title,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Pedir Sabores de este Arte por WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Focus 4: Filterable Flavor Catalog & SKUs */}
      <section
        id="sabores"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Badge variant="warning" className="gap-1.5 px-3 py-1">
              <Droplet className="h-3.5 w-3.5" />
              Catálogo de Sabores & SKUs
            </Badge>
            <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
              Nuestros 30+ Sabores Disponibles
            </h2>
            <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
              Fórmulas balanceadas con el nivel exacto de azúcar para no saturar
              tu granizadora.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                activeCategoryFilter === "all"
                  ? "bg-gradient-to-r from-pink-500 to-emerald-400 text-slate-950 shadow-md shadow-pink-500/20"
                  : "glass-panel text-muted-foreground hover:text-white"
              }`}
            >
              Todos ({FLAVOR_CATALOG.length})
            </button>

            <button
              onClick={() => setActiveCategoryFilter("sin-licor")}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                activeCategoryFilter === "sin-licor"
                  ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25"
                  : "glass-panel text-muted-foreground hover:text-white"
              }`}
            >
              Sin Licor (15)
            </button>

            <button
              onClick={() => setActiveCategoryFilter("premium")}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                activeCategoryFilter === "premium"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25"
                  : "glass-panel text-muted-foreground hover:text-white"
              }`}
            >
              Premium (7)
            </button>

            <button
              onClick={() => setActiveCategoryFilter("con-licor")}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                activeCategoryFilter === "con-licor"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/25"
                  : "glass-panel text-muted-foreground hover:text-white"
              }`}
            >
              Con Licor (8)
            </button>
          </div>

          {/* Flavors Grid (Optimized with progressive disclosure) */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {displayFlavors.map((flavor) => (
              <div
                key={flavor.sku}
                className="glass-card glass-interactive group relative overflow-hidden rounded-2xl p-4 sm:p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-[10px] font-semibold">
                    SKU: {flavor.sku}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-slate-950 uppercase shadow-sm"
                    style={{ backgroundColor: flavor.color }}
                  >
                    {flavor.badge}
                  </span>
                </div>

                <div className="mb-2 space-y-0.5">
                  <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-pink-300">
                    {flavor.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-emerald-400">
                    {flavor.base}
                  </p>
                </div>

                <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
                  {flavor.description}
                </p>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-[11px] group-hover:border-emerald-500/50 group-hover:bg-emerald-500/15 group-hover:text-emerald-300"
                >
                  <a
                    href={`https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20solicitar%20el%20sabor%20${encodeURIComponent(
                      flavor.name,
                    )}%20(SKU%3A%20${flavor.sku})`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Pedir este Sabor</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Progressive disclosure toggle button */}
          {activeCategoryFilter === "all" && filteredFlavors.length > 8 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="glass"
                size="default"
                onClick={() => setShowAllFlavors(!showAllFlavors)}
                className="gap-2 border-pink-500/30 text-xs font-bold text-pink-300 hover:bg-pink-500/15"
              >
                <span>
                  {showAllFlavors
                    ? "Mostrar Menos Sabores"
                    : `Ver Todos los ${FLAVOR_CATALOG.length} Sabores (${FLAVOR_CATALOG.length - 8} más)`}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showAllFlavors ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Focus 5: Technical Reliability */}
      <section
        id="concentrados"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="glass-panel space-y-6 rounded-3xl border border-white/10 p-6 backdrop-blur-xl sm:space-y-8 sm:p-10">
          <div className="mx-auto max-w-3xl space-y-2 text-center">
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <Zap className="h-3.5 w-3.5" />
              Garantía Técnica Neon
            </Badge>
            <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
              Formulado para Cuidar tu Granizadora
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Evita bloqueos en espirales y asegura el mejor sabor copa tras
              copa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass-card space-y-2.5 rounded-2xl p-5 transition-all hover:border-pink-500/30">
              <div className="w-fit rounded-2xl border border-pink-500/30 bg-pink-500/20 p-2.5 text-pink-400">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Sabores Intensos & Estables
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Color y sabor intactos sin diluirse ni asentarse en el fondo
                durante toda la jornada.
              </p>
            </div>

            <div className="glass-card space-y-2.5 rounded-2xl p-5 transition-all hover:border-emerald-500/30">
              <div className="w-fit rounded-2xl border border-emerald-500/30 bg-emerald-500/20 p-2.5 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Congelación Rápida
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Brix balanceado para lograr textura de nieve suave en menor
                tiempo de máquina.
              </p>
            </div>

            <div className="glass-card space-y-2.5 rounded-2xl p-5 transition-all hover:border-amber-500/30">
              <div className="w-fit rounded-2xl border border-amber-500/30 bg-amber-500/20 p-2.5 text-amber-400">
                <PackageCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                Compatibilidad Universal
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Aprobado para máquinas Donper, SPM, Bras, Cofrimell, Ugolini y
                equipos estándar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Focus: Punto Físico Banner */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="glass-panel-elevated relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-pink-950/40 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="max-w-2xl space-y-2 text-center md:text-left">
              <Badge variant="success" className="gap-1.5 px-3 py-1">
                <Store className="h-3.5 w-3.5" />
                Punto Físico en Cartagena
              </Badge>
              <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
                ¿Quieres probar nuestros granizados preparados en Cartagena?
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Conoce nuestra carta en punto de venta y acumula sellos con Neon
                Club (&quot;PAGA 10, LLEVA 11&quot;).
              </p>
            </div>

            <Button
              asChild
              variant="emerald"
              size="lg"
              className="w-full shrink-0 font-bold md:w-auto"
            >
              <Link href="/punto-fisico">
                <Store className="h-4 w-4" />
                <span>Ver Punto Físico</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Preguntas Frecuentes
            </Badge>
            <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
              Dudas de Compradores & Operadores
            </h2>
          </div>

          <div className="space-y-3">
            <div className="glass-card space-y-1.5 rounded-2xl p-4 transition-all hover:border-pink-500/30 sm:p-5">
              <h3 className="font-display text-sm font-bold text-white sm:text-base">
                ¿Cómo viene empacado el concentrado?
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Viene en bolsas selladas de alta resistencia y dosificación
                fácil, listas para vaciar directo con agua a la máquina.
              </p>
            </div>

            <div className="glass-card space-y-1.5 rounded-2xl p-4 transition-all hover:border-cyan-400/30 sm:p-5">
              <h3 className="font-display text-sm font-bold text-white sm:text-base">
                ¿Realizan despachos fuera de Cartagena?
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Sí, enviamos a Bolívar, Costa Caribe y toda Colombia mediante
                las principales transportadoras del país.
              </p>
            </div>

            <div className="glass-card space-y-1.5 rounded-2xl p-4 transition-all hover:border-emerald-500/30 sm:p-5">
              <h3 className="font-display text-sm font-bold text-white sm:text-base">
                ¿Brindan asesoría si apenas estoy iniciando mi negocio?
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Totalmente. Te orientamos en la mezcla exacta, selección de
                sabores con mayor rotación y mantenimiento preventivo de tu
                máquina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google API & Platform Compliance Statement (Discrete Section for Reviewers) */}
      <section
        id="google-compliance"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-8"
      >
        <div className="glass-panel text-muted-foreground space-y-3 rounded-3xl border border-white/10 p-5 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Declaración de Cumplimiento Plataforma Neon
            </span>
            <span className="text-muted-foreground font-mono text-[10px]">
              www.clubneon.co
            </span>
          </div>

          <p className="text-[11px] leading-relaxed">
            La plataforma <strong className="text-slate-200">Neon</strong>{" "}
            utiliza autenticación Google OAuth 2.0 y servicios de Google Wallet
            API para la emisión de tarjetas de lealtad digitales de{" "}
            <strong className="text-slate-200">Neon Club</strong>. No vendemos
            ni compartimos datos personales con plataformas publicitarias de
            terceros.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/90 px-4 py-8 pb-24 sm:px-8 md:pb-10">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-xs sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo Neon"
              width={32}
              height={32}
              className="size-8 rounded-xl border border-white/15 object-cover"
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
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
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

      {/* Sticky Mobile Bottom Bar (High-Conversion Floating Trigger for Mobile Traffic) */}
      <div className="fixed inset-x-0 bottom-0 z-40 block border-t border-white/15 bg-[#070010]/95 px-4 py-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Pack 10 Mayorista
            </span>
            <span className="font-display text-sm font-black text-emerald-400 tabular-nums">
              Desde $26.000 /bolsa
            </span>
          </div>

          <Button
            asChild
            variant="emerald"
            size="sm"
            className="gap-1.5 px-4 text-xs font-bold shadow-md shadow-emerald-500/30"
          >
            <a
              href="https://wa.me/573113795540?text=Hola%20NEON%2C%20deseo%20hacer%20un%20pedido%20de%20l%C3%ADquidos%20concentrados"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Pedir por WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
