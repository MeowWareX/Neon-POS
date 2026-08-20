# Módulo de Tarjetas de Fidelización - NEON OS

> **Sistema Digital de Lealtad (Apple Wallet, Google Wallet, Tarjeta Web PWA y POS)**

---

## 📌 Regla de Mantenimiento Obligatorio (Para Agentes y Desarrolladores)

> [!IMPORTANT]
> **INSTRUCCIÓN DE ACTUALIZACIÓN ITERATIVA:**
> Este documento es la **fuente de verdad viva** del sistema de fidelización de NEON OS.
> **En cada iteración, commit o modificación** realizada sobre esta funcionalidad, el desarrollador o agente de IA **DEBE actualizar este archivo**:
>
> 1. Marcar las casillas de verificación correspondientes (`[ ]` ➔ `[x]`) en el [Plan de Implementación](#7-plan-de-implementación-detallado-por-fases).
> 2. Documentar cualquier nuevo endpoint, cambio de esquema SQL o ajuste en la arquitectura.
> 3. Registrar la entrada respectiva en la [Bitácora de Iteraciones](#8-bitácora-de-iteraciones-y-cambios).

---

## 1. Visión General del Sistema

El sistema de fidelización de **NEON Drinks & Snacks** permite a los clientes acumular sellos por sus compras de raspados y canjear premios (por ejemplo, 1 raspado gratis por cada 10 sellos), eliminando las tarjetas de papel y sustituyéndolas por una solución digital multicanal:

1. **Tarjeta Web Neón (PWA Universal)**: Tarjeta interactiva accesible vía URL/QR, con estética oscura y neón fluorescente (`#ff73e3`, `#3de8c2`, `#ffd24d`), 100% funcional en cualquier smartphone (iOS/Android) con costo $0.
2. **Google Wallet**: Pase digital oficial con botón _"Save to Google Wallet"_, enlace JWT y notificaciones push automáticas tras cada compra.
3. **Apple Wallet**: Pase oficial `.pkpass` para la app Wallet de iPhone, con soporte para certificados PassKit y notificaciones APNs.
4. **Integración POS de Alta Velocidad**: Escaneo ultra-rápido en el POS táctil mediante cámara o búsqueda por celular para mantener la regla de atención en **menos de 10 segundos**.

---

## 2. Diagrama de Arquitectura y Flujo de Datos

```
                                  ┌────────────────────────────────────────┐
                                  │   Página Pública /club (Landing QR)    │
                                  │      Registro: Nombre + Celular        │
                                  └──────────────────┬─────────────────────┘
                                                     │
                    ┌────────────────────────────────┼────────────────────────────────┐
                    ▼                                ▼                                ▼
         ┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
         │  Tarjeta Web Neón   │          │    Google Wallet    │          │    Apple Wallet     │
         │  (PWA Universal)    │          │ (JWT Link Android)  │          │  (.pkpass para iOS) │
         │  *Inmediata / $0*   │          │   *API REST GCloud* │          │  *Requiere Apple ID*│
         └──────────┬──────────┘          └──────────┬──────────┘          └──────────┬──────────┘
                    │                                │                                │
                    └────────────────────────────────┼────────────────────────────────┘
                                                     ▼
                                      ┌───────────────────────────────┐
                                      │  Código QR Único (pass_token) │
                                      └──────────────┬────────────────┘
                                                     ▼
                                      ┌───────────────────────────────┐
                                      │    Escaneo en POS NEON OS     │
                                      │  (Cámara o búsqueda teléfono) │
                                      └──────────────┬────────────────┘
                                                     ▼
                                      ┌───────────────────────────────┐
                                      │  Supabase: +1 Sello / Canje   │
                                      │  Notificación Push a Wallet   │
                                      └───────────────────────────────┘
```

---

## 3. Requisitos Técnicos y Costos

| Canal                      | Requisitos de Cuenta                               | Costo               | Mecanismo Técnico                                                                       |
| :------------------------- | :------------------------------------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| **Tarjeta Web Neón (PWA)** | Ninguno (Stack actual Next.js + Supabase)          | **$0 USD**          | Web App responsiva con actualización en tiempo real y QR renderizado en pantalla.       |
| **Google Wallet**          | Google Cloud Console + Google Pay & Wallet Console | **$0 USD (Gratis)** | REST API (`@googleapis/walletobjects`), Service Account y enlaces JWT firmados.         |
| **Apple Wallet**           | Apple Developer Program                            | **$99 USD / año**   | Generación de archivo comprimido `.pkpass` firmado con certificados SSL PassKit + APNs. |

> [!TIP]
> **Estrategia Progresiva:** Iniciamos con la **Tarjeta Web Neón** y la **integración POS**, habilitando inmediatamente **Google Wallet** (que es gratuito). Apple Wallet se activará tan pronto se configuren las credenciales del programa de desarrolladores de Apple.

---

## 4. Modelo de Datos en Supabase (PostgreSQL)

El sistema agrega tres tablas a Supabase bajo el esquema `public`:

```sql
-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    stamps_count INT DEFAULT 0 CHECK (stamps_count >= 0 AND stamps_count <= 10),
    total_rewards_claimed INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pases Digitales Instalados
CREATE TABLE IF NOT EXISTS public.loyalty_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    wallet_type TEXT NOT NULL CHECK (wallet_type IN ('web', 'google', 'apple')),
    pass_token TEXT UNIQUE NOT NULL, -- Token UUID codificado en el QR del pase
    push_token TEXT,                 -- Token APNs de Apple para notificaciones push
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Historial de Transacciones de Fidelización (Sellos y Canjes)
CREATE TABLE IF NOT EXISTS public.loyalty_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    stamps_added INT DEFAULT 0,
    rewards_granted INT DEFAULT 0, -- nº de recompensas ganadas/canjeadas en la transacción
    reward_redeemed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices adicionales de alto rendimiento (añadidos en Fase 1.1)
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_loyalty_passes_customer ON public.loyalty_passes(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_logs_order ON public.loyalty_logs(order_id) WHERE order_id IS NOT NULL;
```

---

## 5. Especificación de Endpoints y Rutas

### Rutas Frontend

- `app/club/page.tsx`: Landing pública de enrolamiento que redirige a `/club/register`.
- `app/club/register/page.tsx`: Formulario ultra-rápido de enrolamiento (nombre + celular + email opcional) con estética Neón.
- `app/club/[passToken]/page.tsx`: Vista de la Tarjeta Digital Neón con 10 sellos animados y código QR (encodifica `/club/{passToken}`) legible por el POS.

### Rutas de API Backend

- `POST /api/loyalty/register`:
  - **Entrada**: `{ fullName: string, phone: string, email?: string }`
  - **Salida**: `{ customer: Customer, pass: LoyaltyPass, webUrl: string }` (genera `pass_token` UUID único).
- `GET /api/loyalty/card/[passToken]`:
  - **Salida**: `{ customer, pass, recentLogs }` con sellos actuales (`0-10`), historial reciente y estado de recompensa.
- `GET /api/loyalty/lookup?phone=...`:
  - **Salida**: Cliente correspondiente al celular (búsqueda rápida del POS).
- `POST /api/loyalty/stamp`:
  - **Entrada**: `{ passToken?: string, phone?: string, orderId?: string, stampsToAdd: number, redeemReward?: boolean }`
  - **Salida**: `{ customer: Customer, newStampsCount: number, rewardRedeemed: boolean, message: string }` (cap `stamps_count` a `0..10`; si llega a 10 activa recompensa y con `redeemReward` la descuenta).
- `POST /api/loyalty/google-pass` (Fase 3):
  - **Entrada**: `{ passToken: string }`
  - **Salida**: `{ saveUrl: string }` (Enlace `https://pay.google.com/gp/v/save/{jwt}` para guardar la tarjeta NEON en Google Wallet). Flujo: `getOrCreateLoyaltyClass` (get → insert `issuerID.neon_loyalty_v1`) → `getOrCreateLoyaltyObject` (objeto por cliente con sellos, QR con URL `/club/{passToken}` y links) → `jwt.insert` firma con RS256 y devuelve `saveUri`.
- `GET /api/loyalty/apple-pass/[passToken]` (Fase 4):
  - **Salida**: Binario `application/vnd.apple.pkpass` firmado con PassKit.
- `GET /api/loyalty/metrics` (Fase 5):
  - **Salida**: `{ totals: { totalCustomers, stampsIssued, rewardsRedeemed, recurringCustomers }, walletBreakdown: Record<wallet_type, count>, topCustomers: top 10 por premios/sellos }`.
- `GET /api/loyalty/customers` (Fase 5):
  - **Salida**: `{ customers: [{ id, fullName, phone, email, currentStamps, totalRewardsClaimed, lifetimeStamps, orders, lastActivity, createdAt }] }` (historial completo limitado a 2000 clientes, ordenado por `created_at` desc).

---

## 6. Experiencia Operativa en el POS

Para cumplir con la regla de oro de **atención en < 10 segundos**:

1. **Botón Rápido "💎 Tarjeta Neón"**: Ubicado en el panel de resumen del pedido en el POS (desktop y barra inferior móvil) dentro de `pos-terminal.tsx`.
2. **Escaneo sin Fricción**:
   - Mediante cámara web/tablet usando `BarcodeDetector` (HTML5 Shapes API) en `loyalty-scanner-modal.tsx`.
   - O búsqueda rápida ingresando el número de celular vía `GET /api/loyalty/lookup`.
3. **Alertas Visuales de Recompensa**:
   - Si el cliente llega a 10 sellos: Alerta 🎁 **"¡Raspado Gratis Disponible!"** en el modal y toast tras guardar el pedido.
   - El canje se procesa automáticamente al guardar el pedido cuando `stamps_count + sellos >= 10`, vía `POST /api/loyalty/stamp`.
4. **Soporte Offline**: Si falla la llamada a `/api/loyalty/stamp`, se muestra un toast advirtiendo que los sellos se sincronizarán después; el pedido se conserva en la cola local (`addOrder`) y se sincroniza al recuperar la red como el resto de pedidos.
5. **Sincronización Push Google Wallet**: Al sellar (vía token QR o búsqueda por celular), `/api/loyalty/stamp` dispara en segundo plano `updateGoogleWalletPass` (PATCH `loyaltyPoints` + `textModulesData` con `notifyPreference: NOTIFY`); si el objeto aún no existe se crea. Best-effort: los errores solo se loguean, no afectan la respuesta del POS.

---

## 7. Plan de Implementación Detallado por Fases

> **Nota:** Actualizar las casillas `[ ]` a `[x]` a medida que se completen las tareas en cada iteración.

### 🟡 Fase 1: Base de Datos y Tarjeta Web Neón (PWA Universal)

- [x] **1.1** Crear la migración SQL en `supabase/migrations/` con las tablas `customers`, `loyalty_passes` y `loyalty_logs`.
- [x] **1.2** Definir tipos TypeScript en `types/database.ts` y `types/domain.ts` para clientes y pases de lealtad.
- [x] **1.3** Crear repositorio y servicio de lealtad (`repositories/loyalty-repository.ts` y hook `hooks/use-loyalty-card.ts`).
- [x] **1.4** Crear endpoint `POST /api/loyalty/register` para enrolar clientes y generar tokens QR únicos.
- [x] **1.5** Crear endpoint `GET /api/loyalty/card/[passToken]` para consultar el estado de la tarjeta.
- [x] **1.6** Diseñar la landing pública `/club/register` con estética Neón (dark mode con tonos rosa/turquesa y formulario ultra-rápido).
- [x] **1.7** Diseñar la vista `/club/[passToken]` con la tarjeta de 10 sellos animados y código QR legible por el POS.
- [x] **1.8** Crear schema Zod en `schemas/loyalty.ts` y endpoint `GET /api/loyalty/lookup` para búsqueda por teléfono.

### 🟡 Fase 2: Integración Operativa en el Terminal POS

- [x] **2.1** Crear componente modal de escaneo y búsqueda de cliente (`components/pos/loyalty-scanner-modal.tsx`).
- [x] **2.2** Integrar botón de fidelización en el checkout del POS (`components/pos/pos-terminal.tsx`).
- [x] **2.3** Crear endpoint `POST /api/loyalty/stamp` para registrar sellos y procesar redenciones ligadas al pedido.
- [x] **2.4** Implementar la alerta de "Raspado Gratis" y la lógica de descuento/canje al llegar a 10 sellos.
- [x] **2.5** Asegurar persistencia local y soporte para sincronización diferida en modo offline (manejo de errores en saveOrder con toast warning).

### 🟡 Fase 3: Integración Nativa con Google Wallet

- [x] **3.1** Instalar dependencias `@googleapis/walletobjects` / `google-auth-library` / `jsonwebtoken`.
- [x] **3.2** Configurar variables de entorno en `.env.local` (`GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID`, `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_WALLET_PRIVATE_KEY`).
- [x] **3.3** Crear script/función para inicializar la `LoyaltyClass` de Neón en Google Wallet.
- [x] **3.4** Implementar endpoint `POST /api/loyalty/google-pass` para firmar y emitir el enlace `Save to Google Wallet`.
- [x] **3.5** Implementar disparador de actualización push hacia Google Wallet al sellar desde el POS.

### 🟡 Fase 4: Integración Nativa con Apple Wallet (PassKit)

- [ ] **4.1** Diseñar los assets gráficos requeridos por Apple Wallet (`icon.png`, `logo.png`, `strip.png` de 10 sellos).
- [ ] **4.2** Configurar certificados `.p12` de Pass Type ID y variables de entorno de Apple Developer.
- [ ] **4.3** Implementar generador de `.pkpass` en `GET /api/loyalty/apple-pass/[passToken]`.
- [ ] **4.4** Implementar webhook para registro de dispositivos y notificaciones push vía APNs.

### 🟡 Fase 5: Métricas y Reportes de Fidelización

- [x] **5.1** Agregar métricas de fidelización al dashboard administrativo (clientes recurrentes, sellos emitidos, premios redimidos).
- [x] **5.2** Exportación y visualización del historial de clientes en el panel de administración.

---

## 8. Bitácora de Iteraciones y Cambios

| Fecha (YYYY-MM-DD) | Autor / Agente | Fase / Tarea          | Resumen del Cambio Realizado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------- | :------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _2026-08-19_       | Antigravity AI | Documentación Inicial | Creación del documento de arquitectura y plan maestro de implementación iterativa.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| _2026-08-19_       | Antigravity AI | Fase 1 - Completa     | Migración SQL `202608190001_loyalty_system.sql` (customers, loyalty_passes, loyalty_logs + índices + RLS), tipos en database.ts/domain.ts, `schemas/loyalty.ts`, `repositories/loyalty-repository.ts`, hook `use-loyalty-card.ts`, APIs register/card/lookup, páginas `/club/register` y `/club/[passToken]` con QR y 10 sellos animados (estética neón #ff73e3, #3de8c2, #ffd24d). Se añadió la columna `rewards_granted INT DEFAULT 0` a `loyalty_logs`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| _2026-08-19_       | Antigravity AI | Fase 2 - Completa     | Modal `loyalty-scanner-modal.tsx` con escaneo QR (`BarcodeDetector`) y búsqueda por teléfono; botón 💎 Tarjeta NEON integrado en `pos-terminal.tsx` (desktop + móvil); endpoint `POST /api/loyalty/stamp` con cap 0..10 y canje automático; toasts de recompensa disponible/canjeada; sellos = unidades del pedido; manejo offline con toast de sincronización diferida.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| _2026-08-19_       | Antigravity AI | Fase 1/2 - Ajustes    | Corrección de la tarjeta `/club/[passToken]` para leer el token del segmento de ruta (`useParams`); el QR ahora encodifica `/club/{passToken}` (antes apuntaba a ruta inexistente). Se documentó el cambio de esquema (rewards_granted) y se destacaron los detalles de integración.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| _2026-08-20_       | Antigravity AI | Fase 3 - Completa     | Integración nativa Google Wallet: `services/google-wallet.service.ts` (cliente JWT con `google-auth-library`, limpieza de clave privada `\n`, get-or-create de LoyaltyClass `3388000000023186986.neon_loyalty_v1`, objetos de lealtad por cliente con QR/`linksModuleData`/`loyaltyPoints` y generación del enlace JWT firmado RS256 vía `client.jwt.insert`); endpoint `POST /api/loyalty/google-pass` validado 200 OK end-to-end con `saveUrl` real; botón "📱 Google Wallet" funcional en `/club/[passToken]` (fetch + `window.open`); push de actualización al sellar en `/api/loyalty/stamp` (best-effort, `notifyPreference: NOTIFY`); credenciales reales en `.env`/`.env.local` (issuer corregido `BCR2...` → `3388000000023186986`, el Merchant ID alfanumérico no era válido como ID de clase). Añadido `NEXT_PUBLIC_APP_URL=https://www.clubneon.co/`; versionadas `google-auth-library@10.5.0` para alinear tipos con `@googleapis/walletobjects@14` y `@types/jsonwebtoken`. |

| _2026-08-20_ | Antigravity AI | Fase 5 - En curso | Métricas y reportes de fidelización: endpoints `GET /api/loyalty/metrics` (totales: clientes, sellos emitidos, premios redimidos, recurrentes; desglose por billetera; top 10 clientes) y `GET /api/loyalty/customers` (historial con sellos de por vida, pedidos, última actividad); componente `components/dashboard/loyalty-overview.tsx` (4 KPI cards, pases por billetera, top clientes, tabla de historial con export CSV con BOM UTF-8); página `app/(platform)/loyalty/page.tsx` y nav "Fidelización" (icono Sparkles, adminOnly) en `app-shell.tsx`. **Migración pendiente**: se detectó que `loyalty_logs.rewards_granted` no existe en la BD live (el `ALTER` nunca se ejecutó); crear `202608200001_loyalty_add_rewards_granted.sql` y aplicarla (pendiente de confirmación del usuario). |
| _2026-08-20_ | Antigravity AI | Fase 5 - Pruebas | Aplicada en la BD live la migración `202608200001_loyalty_add_rewards_granted.sql` (columna `rewards_granted` en `loyalty_logs`). Verificado end-to-end en vivo: `GET /api/loyalty/metrics` y `GET /api/loyalty/customers` 200 OK; flujo completo registro→sello→log→métricas confirmado (Flow Test, phone 3019990001: 4 clientes, 1 sello emitido, 1 pedido). **Bug corregido**: `webUrl` devolvía doble slash (`https://www.clubneon.co//club/{token}`) por la trailing slash de `NEXT_PUBLIC_APP_URL`; se normalizó la URL en `lib/env.ts` (strip trailing slash) y se aplicó también al QR de `/club/[passToken]` y a los enlaces del pase de Google Wallet. Se eliminó la propiedad inválida `audience` de `app/manifest.ts` (rompía typecheck). Bitácora de pruebas completa: ver sección 10. |
| _2026-08-20_ | Antigravity AI | Fase 5 - Fixes registro/POS | **Bug crítico corregido**: el form de `/club/register` redirigía a `/club/undefined` porque el endpoint devuelve el pase en camelCase (`pass.passToken`) pero la página leía `data.pass.pass_token` (snake*case); ahora acepta ambos y valida que exista token antes de redirigir (`app/club/register/_page.tsx`). **Bug corregido**: el escaneo QR del POS (`loyalty-scanner-modal.tsx`) leía `data.customer.full_name/stamps_count` (snake_case) pero `GET /api/loyalty/card` devuelve camelCase (`fullName/stampsCount`), mostrando cliente con datos vacíos; ahora acepta ambos formatos. La búsqueda por teléfono (`/api/loyalty/lookup`) ya devolvía camelCase correctamente y no estaba afectada. |
| \_2026-08-20* | Antigravity AI | Fase 5 - Fix sellos POS | **Bug crítico corregido (sello no se sumaba)**: `POST /api/loyalty/stamp` fallaba con `ZodError: Invalid pass token` (500) porque el `passToken` llegaba vacío. Causa raíz: (1) `registerCustomer` reutilizaba el cliente por teléfono pero **siempre insertaba un nuevo pass web** → clientes con 2+ pases; (2) `GET /api/loyalty/lookup` filtraba `wallet_type="web"` con `maybeSingle()`, que con múltiples pases devolvía `null` → `passToken: ""`; (3) `pos-terminal.tsx` enviaba ese `passToken` vacío al sellar → Zod lo rechazaba. **Soluciones**: `registerCustomer` ahora reutiliza el pass web existente del cliente (`findExistingWebPass`) antes de insertar; `lookup` ordena por `created_at` ascendente (primer pass, sin filtrar billetera); `pos-terminal.tsx` envía `phone` como respaldo y `passToken` solo si existe. Corregidas erratas de duplicación de funciones en el repo. Verificado en vivo: registro doble (mismo teléfono) devuelve el mismo token; sellado por teléfono 200 OK y `lookup` devuelve stamps incrementados. |
| _2026-08-20_ | Antigravity AI | Fase 5 - Mejora Mobile | Mejoras para uso en celular del POS y el escáner de tarjetas: (1) **Cámara**: el escaneo QR dependía de `BarcodeDetector` (API inexistente en iOS/Safari y muchos Android), por lo que la cámara se detenía apenas iniciaba con error de navegador no compatible. Se añadió `jsqr@1.4.0` (decodificador QR universal por píxeles, sin APIs nativas), se reescribió `scanQRCode` con loop `requestAnimationFrame` sobre frames de ≤640px, y el `<video>` ahora fuerza `autoPlay playsInline muted` (crítico en iOS); `startCamera` reintenta con cámara frontal si la trasera falla y espera el montaje del `<video>`. (2) **Viewport**: se quitó `maximumScale:1` y `userScalable:false` en `app/layout.tsx` para permitir el zoom/ajuste natural en móvil. (3) **Barra inferior del POS**: `grid-cols-[1fr_1fr_auto]` con 4 botones desbordaba en pantallas pequeñas; se rediseñó a `grid-cols-2` con "Agregar a orden" a ancho completo, respeto de `safe-area-inset-bottom` y total visible; padding inferior del grid principal ajustado a `pb-64`. (4) **Modal escáner**: ahora es bottom-sheet en móvil (`items-end`, `max-h-[92dvh]` con scroll interno) en vez de centrado que se cortaba. Build de producción OK. |
| _2026-08-20_       | Antigravity AI | Fix: sellos Wallet desactualizados | El pass de Google Wallet quedaba "congelado" (mostraba 1/10 cuando la BD tenía 3 sellos). Causa: `getOrCreateLoyaltyObject` hacía `loyaltyobject.get` y **devolvía el objeto existente sin actualizarlo** al generar el save-link, por lo que el token se creaba con datos viejos; además `loyaltyobject.patch` salta con 404 mientras el usuario no ha guardado la tarjeta (los pushes por sello se pierden en silencio hasta ese momento). Fix: `getOrCreateLoyaltyObject` ahora hace **PATCH siempre** del objeto existente con los datos frescos (sellos, barcode, texto, accountName, links) + `notifyPreference: "NOTIFY"`, y solo inserta si no existe. Con esto, al volver a tocar "Agregar a Google Wallet" el objeto se sincroniza al conteo real (3/10) y notifica al dispositivo. Verificado: BD de 3123456789 tenía stamps_count=3 con 3 logs; el fix aplicado y typecheck OK. |

---
| _2026-08-20_ | Antigravity AI | Fase 3 - Fix prod Wallet | Google Wallet fallaba en producción (`clubneon.co`) pero funcionaba en localhost. Causa: las variables `.env*` están en `.gitignore` y **no se suben a Vercel**, por lo que `isGoogleWalletConfigured` era `false` en producción y `/api/loyalty/google-pass` devolvía 501 "Google Wallet no configurado". Solución (usuario): configurar las 9 variables (NEXT*PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE*\*, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_WALLET_ISSUER_ID/CLASS_ID/SERVICE_ACCOUNT_EMAIL/PRIVATE_KEY) en Vercel → Settings → Environment Variables y redeploy. Código: el botón "🍎 Apple Wallet" (no implementado) se **eliminó** de `/club/[passToken]` dejando únicamente "📱 Google Wallet" a ancho completo; el `catch` de `handleGoogleWallet` ahora muestra el mensaje de error real del endpoint en el alert en vez de uno genérico. |

---

```env
# URLs públicas de la app (requeridas por Google Wallet para logo y enlaces del pase)
NEXT_PUBLIC_APP_URL=https://www.clubneon.co/

# Google Wallet (Fase 3) - el ISSUER_ID es numérico (18-19 dígitos) de la cuenta Google Pay & Wallet Console
GOOGLE_WALLET_ISSUER_ID=3388000000023186986
GOOGLE_WALLET_CLASS_ID=neon_loyalty_v1
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=
# Clave PEM entre comillas; conservar los \n literales (el servicio los convierte a saltos de línea)
GOOGLE_WALLET_PRIVATE_KEY=

# Apple Wallet (Fase 4)
APPLE_PASS_TYPE_IDENTIFIER=pass.com.neondrinks.loyalty
APPLE_TEAM_ID=
APPLE_PASS_CERTIFICATE_BASE64=
APPLE_PASS_KEY_PASSWORD=
```

---

## 10. Guía de Pruebas End-to-End

> Pruebas validadas en vivo (2026-08-19/20) usando `npm run dev` en `http://localhost:3000` y SQL Editor de Supabase. Todas las respuestas son JSON.

### 10.1 Registro de cliente (crea `customer` + `pass` web)

```bash
curl -X POST http://localhost:3000/api/loyalty/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Flow Test","phone":"3019990001","email":"flowtest@neon.club"}'
```

**Esperado (200):** `{ customer, pass, webUrl }`.

> [!NOTE]
> `webUrl` debe ser `https://www.clubneon.co/club/{token}` **sin doble slash**. Se normalizó `NEXT_PUBLIC_APP_URL` en `lib/env.ts` (strip de trailing slash) para corregirlo; también aplica al QR de `/club/[passToken]` y a los enlaces del pase de Google Wallet.

### 10.2 Sellar (+1) y verificar log insertado

```bash
curl -X POST http://localhost:3000/api/loyalty/stamp \
  -H "Content-Type: application/json" \
  -d '{"passToken":"<PASS_TOKEN>","stampsToAdd":1}'
```

**Esperado (200):** `{ customer: { stampsCount: 1 }, newStampsCount: 1, rewardRedeemed: false, message: "Sellos actualizados: 1/10" }`.

> [!WARNING]
> Si `stamp` responde 200 pero las métricas muestran `stampsIssued: 0`, verifica que `loyalty_logs.rewards_granted` exista:
>
> ```sql
> ALTER TABLE public.loyalty_logs ADD COLUMN IF NOT EXISTS rewards_granted INT DEFAULT 0;
> ```
>
> (migración `supabase/migrations/202608200001_loyalty_add_rewards_granted.sql`). El insert del log ignora errores en `loyalty-repository.ts`, así que la columna ausente falla silenciosamente.

### 10.3 Canje de premio (10 sellos → raspado gratis)

```bash
# 1. Sellar 9 veces hasta llegar a 10
curl -X POST http://localhost:3000/api/loyalty/stamp \
  -H "Content-Type: application/json" \
  -d '{"passToken":"<PASS_TOKEN>","stampsToAdd":9}'
# 2. Redimir
curl -X POST http://localhost:3000/api/loyalty/stamp \
  -H "Content-Type: application/json" \
  -d '{"passToken":"<PASS_TOKEN>","redeemReward":true}'
```

**Esperado:** tras el paso 1 `stampsCount: 10` y mensaje "¡Raspado gratis disponible!"; tras el paso 2 `stampsCount: 0`, `rewardRedeemed: true` y `message: "¡Raspado gratis redimido!"`.

### 10.4 Tarjeta web y Google Wallet

1. Abre `http://localhost:3000/club/<PASS_TOKEN>` → tarjeta NEON con 10 sellos y QR.
2. Escanea el QR con cámara → debe abrir `/club/<PASS_TOKEN>` (el QR apunta a la app, el POS extrae el token por texto).
3. Click **"📱 Google Wallet"** → llama `POST /api/loyalty/google-pass` y abre `https://pay.google.com/gp/v/save/{jwt}` en una pestaña nueva → "Save to Google Wallet".
4. Al sellar desde el POS, el pase guardado en el teléfono se actualiza vía push (PATCH `loyaltyPoints` + `notifyPreference: NOTIFY`, best-effort).

### 10.5 Métricas y panel de administración

```bash
curl http://localhost:3000/api/loyalty/metrics      # totals + walletBreakdown + topCustomers
curl http://localhost:3000/api/loyalty/customers    # historial completo por cliente
```

**Esperado:** `metrics.totals.totalCustomers` refleja el total, `stampsIssued` suma los `stamps_added` positivos de `loyalty_logs`, `rewardsRedeemed` suma `rewards_granted`, `recurringCustomers` cuenta clientes con >1 log.

Panel: inicia sesión → nav **"Fidelización"** (`/loyalty`, admin) → KPIs, pases por billetera, top clientes y tabla de historial con botón **"Exportar CSV"** (archivo con BOM UTF-8 listo para Excel).

### 10.6 Datos de prueba registrados

Durante la validación se registraron (se pueden eliminar desde el SQL Editor si estorban):

| phone      | fullName    | sellos | origen        |
| :--------- | :---------- | :----- | :------------ |
| 3000000001 | Test Wallet | 1      | Fase 3        |
| 3001122334 | eadasd      | 0      | previo        |
| 3001234567 | test        | 0      | previo        |
| 3019990001 | Flow Test   | 1      | 10.1          |
| 3019990002 | Flow Test 2 | 0      | prueba webUrl |
