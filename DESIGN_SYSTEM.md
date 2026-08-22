# 🌟 Sistema de Diseño Neon — "Cyber-Tropic Glow"

> **Manual de Identidad Visual, Tokens y Especificación de Componentes**  
> Diseñado para la plataforma pública (B2B/B2C) y el sistema operativo de punto de venta (POS) de **Neon Drinks & Concentrados** ([www.clubneon.co](https://www.clubneon.co)).

---

## 1. Filosofía de Diseño & Dirección de Arte

El sistema visual **Cyber-Tropic Glow** fusiona la vibrante cultura caribeña de Cartagena de Indias con una estética cyberpunk moderna y sofisticada:

1. **Inmersión & Contraste Extremo**: Superficies oscuras en obsidiana de medianoche (`#070010`) que hacen resaltar acentos luminosos en rosa neón, cian glacial y esmeralda tropical.
2. **Jerarquía Guiada por Luminiscencia**: La intensidad del brillo y la elevación de cristal guían la mirada del usuario de forma intuitiva hacia los llamados a la acción (CTAs, pedidos por WhatsApp, cálculo de rentabilidad).
3. **Ergonomía Táctil & Fast-POS**: Controles optimizados para pantallas táctiles y móviles, con áreas de toque amplias (mínimo 44×44px), retroalimentación física instantánea (`active:scale-[0.98]`) y respuesta inmediata en horarios nocturnos de alta demanda.
4. **Armonía Dual**:
   - **Vista Pública & Mayoristas**: Elegante, persuasiva, con micro-interacciones pulidas, cálculo en vivo de ganancias y catálogo interactivo de sabores.
   - **Vista Operativa (POS)**: Limpia, sin distracciones, tipografía numérica tabular y de alto contraste para rapidez en barra y caja.

---

## 2. Paleta de Colores & Tokens Semánticos

Todos los tokens están construidos con variables CSS nativas y expuestos a través de **Tailwind CSS v4** (`@theme inline` en `app/globals.css`).

### 2.1 Colores Base de Superficie

| Token CSS         | Variable Tailwind     | Hex / Color               | Uso                                     |
| :---------------- | :-------------------- | :------------------------ | :-------------------------------------- |
| `--background`    | `bg-background`       | `#070010`                 | Lienzo principal obsidiana              |
| `--card`          | `bg-card`             | `#0f0320`                 | Tarjetas y contenedores base            |
| `--card-elevated` | `bg-card-elevated`    | `#16082e`                 | Modales, popovers y tarjetas destacadas |
| `--card-hover`    | `hover:bg-card-hover` | `#1e0b3d`                 | Estado hover de tarjetas interactivas   |
| `--border`        | `border-border`       | `rgba(255,255,255, 0.10)` | Bordes sutiles de cristal               |
| `--border-focus`  | `border-border-focus` | `rgba(0, 240, 255, 0.50)` | Halo de foco en inputs y selectores     |

### 2.2 Acentos Neón Semánticos

| Acento           | Variable         | Hex / Glow | Significado Semántico                                                                |
| :--------------- | :--------------- | :--------- | :----------------------------------------------------------------------------------- |
| **Pink Glow**    | `--neon-pink`    | `#ff3eab`  | CTA Principal, Marca Neon, Sabores con Licor, Coctelería TOP                         |
| **Cyan Glow**    | `--neon-cyan`    | `#00f0ff`  | Acciones Secundarias, Sabores Sin Licor, Info de Plataforma, Halos de Foco           |
| **Emerald Glow** | `--neon-emerald` | `#10b981`  | Packs Mayoristas "Mejor Valor", Márgenes de Ganancia, WhatsApp Orders, Estado Online |
| **Amber Glow**   | `--neon-amber`   | `#fbbf24`  | Sabores Premium, Promociones Especiales, Advertencias, Estado Offline                |
| **Purple Glow**  | `--neon-purple`  | `#8b5cf6`  | Tarjetas VIP Neon Club, Gradientes Holográficos                                      |

---

## 3. Tipografía & Escala

El sistema implementa dos familias tipográficas complementarias:

### 3.1 Familias Tipográficas

- **Display & Titulares (`font-display`)**: `Orbitron` (Google Fonts).
  - _Uso_: Logotipos, H1/H2/H3 principales, números de KPI, badges en mayúsculas y precios destacados.
  - _Tracking_: Amplio (`tracking-wider`, `tracking-[0.15em]`).
- **Cuerpo de Texto & Datos (`font-sans` / `font-body`)**: `Space Grotesk` (Google Fonts).
  - _Uso_: Párrafos descriptivos, etiquetas de formulario, botones, tablas y datos numéricos continuos.

### 3.2 Utilidades de Texto con Gradiente

- `.text-gradient-neon`: Gradiente Neón Rosa a Cian (`#ff3eab` -> `#a855f7` -> `#00f0ff`).
- `.text-gradient-sunset`: Gradiente Púrpura a Ámbar Cálido (`#ff3eab` -> `#fbbf24`).
- `.text-gradient-cyan`: Gradiente Cian a Esmeralda Tropical (`#00f0ff` -> `#10b981`).

---

## 4. Glassmorphism & Elevación de Capas

El sistema cuenta con tres niveles de profundidad con efecto cristal (_frosted glass_):

### Nivel 1: Panel Base (`.glass-panel`)

- **Backdrop Blur**: `16px`
- **Fondo**: `rgba(15, 3, 32, 0.65)`
- **Borde**: `1px solid rgba(255, 255, 255, 0.08)`
- **Uso**: Barras de navegación fijas, tablas de datos, contenedores secundarios.

### Nivel 2: Panel Elevado (`.glass-panel-elevated`)

- **Backdrop Blur**: `24px`
- **Fondo**: `linear-gradient(180deg, rgba(22, 8, 46, 0.85) 0%, rgba(10, 1, 22, 0.95) 100%)`
- **Borde**: `1px solid rgba(255, 255, 255, 0.15)`
- **Sombra**: `0 20px 50px rgba(0, 0, 0, 0.60), inset 0 1px 0 rgba(255, 255, 255, 0.10)`
- **Uso**: Modales (`Dialog`), tarjetas de producto destacadas, formulario de registro VIP.

### Nivel 3: Tarjeta Interactiva (`.glass-card` + `.glass-interactive`)

- **Efecto Hover**: Elevación en eje Y (`translateY(-2px)`), transición de borde iluminado y sombra neón reactiva.
- **Uso**: Catálogo de sabores, cartas de precios al por mayor, módulos del POS.

---

## 5. Catálogo de Componentes Primitivos

### 5.1 Botón (`components/ui/button.tsx`)

- `default`: Gradiente Rosa-Fucsia + `shadow-pink-500/25` (CTA Principal).
- `secondary`: Fondo Cian + Texto Oscuro + `shadow-cyan-500/25`.
- `emerald` / `success`: Gradiente Esmeralda-Teal + `shadow-emerald-500/25` (WhatsApp / Ventas).
- `glass`: Fondo Cristal + Borde Blanco Translúcido.
- `outline`: Borde `border-white/15` + Hover Neón.
- `ghost`: Fondo transparente + Hover suave.
- `destructive`: Fondo Rojo Neón + Glow.
- **Escala de Tamaños**: `xs` (h-7), `sm` (h-8.5), `default` (h-10), `lg` (h-12), `xl` (h-14), `icon-sm`, `icon`, `icon-lg`.

### 5.2 Badge / Insignia (`components/ui/badge.tsx`)

- `default`: Rosa Neón (Coctelería con Licor, VIP).
- `secondary`: Cian Glacial (Sin Licor, Todo Público).
- `success`: Esmeralda (Pack Mayorista Mejor Valor, Online, Pagado).
- `warning`: Ámbar (Sabores Premium, Alerta de Stock).
- `purple`: Púrpura Neón (Ediciones Especiales).
- `glass` / `outline`: Estilos translúcidos discretos.
- `muted`: Etiquetas neutrales de rol (Operador, Admin).

### 5.3 Tarjetas (`components/ui/card.tsx`)

- `default`: Contenedor base de cristal.
- `elevated`: Sombra profunda con highlight superior.
- `interactive`: Reactiva al cursor con micro-elevación.
- `glow-pink`, `glow-cyan`, `glow-emerald`: Bordes con resplandor temático.

---

## 6. Vistas Implementadas con el Sistema de Diseño

1. **Landing Page Principal (`app/page.tsx`)**: Precios al por mayor, calculadora de rentabilidad en vivo, artes de venta en alta resolución con lightbox y catálogo de 30+ sabores con filtro dinámico.
2. **Punto Físico Cartagena (`app/punto-fisico/page.tsx`)**: Presentación de tienda, horarios, ubicación, carta clasificada y acceso a Neon Club.
3. **Neon Club VIP Digital Pass (`app/club/[passToken]/_page.tsx` & `app/club/register/_page.tsx`)**: Tarjeta digital holográfica con 10 sellos de fidelización, botón para Google Wallet y código QR de escaneo en caja.
4. **Shell de Plataforma & Login (`components/layout/app-shell.tsx` & `components/auth/login-form.tsx`)**: Entorno operativo con navegación por roles, indicador de conectividad y tarjeta de acceso rápido.
