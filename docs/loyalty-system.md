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
  - **Salida**: `{ saveUrl: string }` (Enlace directo a Google Wallet)
- `GET /api/loyalty/apple-pass/[passToken]` (Fase 4):
  - **Salida**: Binario `application/vnd.apple.pkpass` firmado con PassKit.

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

- [ ] **3.1** Instalar dependencias `@googleapis/walletobjects` / `googleapis` / `jsonwebtoken`.
- [ ] **3.2** Configurar variables de entorno en `.env.local` (`GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_SERVICE_ACCOUNT_KEY`).
- [ ] **3.3** Crear script/función para inicializar la `LoyaltyClass` de Neón en Google Wallet.
- [ ] **3.4** Implementar endpoint `POST /api/loyalty/google-pass` para firmar y emitir el enlace `Save to Google Wallet`.
- [ ] **3.5** Implementar disparador de actualización push hacia Google Wallet al sellar desde el POS.

### 🟡 Fase 4: Integración Nativa con Apple Wallet (PassKit)

- [ ] **4.1** Diseñar los assets gráficos requeridos por Apple Wallet (`icon.png`, `logo.png`, `strip.png` de 10 sellos).
- [ ] **4.2** Configurar certificados `.p12` de Pass Type ID y variables de entorno de Apple Developer.
- [ ] **4.3** Implementar generador de `.pkpass` en `GET /api/loyalty/apple-pass/[passToken]`.
- [ ] **4.4** Implementar webhook para registro de dispositivos y notificaciones push vía APNs.

### 🟡 Fase 5: Métricas y Reportes de Fidelización

- [ ] **5.1** Agregar métricas de fidelización al dashboard administrativo (clientes recurrentes, sellos emitidos, premios redimidos).
- [ ] **5.2** Exportación y visualización del historial de clientes en el panel de administración.

---

## 8. Bitácora de Iteraciones y Cambios

| Fecha (YYYY-MM-DD) | Autor / Agente | Fase / Tarea          | Resumen del Cambio Realizado                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------- | :------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _2026-08-19_       | Antigravity AI | Documentación Inicial | Creación del documento de arquitectura y plan maestro de implementación iterativa.                                                                                                                                                                                                                                                                                                                                                                         |
| _2026-08-19_       | Antigravity AI | Fase 1 - Completa     | Migración SQL `202608190001_loyalty_system.sql` (customers, loyalty_passes, loyalty_logs + índices + RLS), tipos en database.ts/domain.ts, `schemas/loyalty.ts`, `repositories/loyalty-repository.ts`, hook `use-loyalty-card.ts`, APIs register/card/lookup, páginas `/club/register` y `/club/[passToken]` con QR y 10 sellos animados (estética neón #ff73e3, #3de8c2, #ffd24d). Se añadió la columna `rewards_granted INT DEFAULT 0` a `loyalty_logs`. |
| _2026-08-19_       | Antigravity AI | Fase 2 - Completa     | Modal `loyalty-scanner-modal.tsx` con escaneo QR (`BarcodeDetector`) y búsqueda por teléfono; botón 💎 Tarjeta NEON integrado en `pos-terminal.tsx` (desktop + móvil); endpoint `POST /api/loyalty/stamp` con cap 0..10 y canje automático; toasts de recompensa disponible/canjeada; sellos = unidades del pedido; manejo offline con toast de sincronización diferida.                                                                                   |
| _2026-08-19_       | Antigravity AI | Fase 1/2 - Ajustes    | Corrección de la tarjeta `/club/[passToken]` para leer el token del segmento de ruta (`useParams`); el QR ahora encodifica `/club/{passToken}` (antes apuntaba a ruta inexistente). Se documentó el cambio de esquema (rewards_granted) y se destacaron los detalles de integración.                                                                                                                                                                       |

---

## 9. Variables de Entorno Requeridas

```env
# Google Wallet (Fase 3)
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_CLASS_ID=neon_loyalty_v1
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=
GOOGLE_WALLET_PRIVATE_KEY=

# Apple Wallet (Fase 4)
APPLE_PASS_TYPE_IDENTIFIER=pass.com.neondrinks.loyalty
APPLE_TEAM_ID=
APPLE_PASS_CERTIFICATE_BASE64=
APPLE_PASS_KEY_PASSWORD=
```
