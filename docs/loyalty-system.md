# Módulo de Tarjetas de Fidelización - NEON OS
> **Sistema Digital de Lealtad (Apple Wallet, Google Wallet, Tarjeta Web PWA y POS)**

---

## 📌 Regla de Mantenimiento Obligatorio (Para Agentes y Desarrolladores)

> [!IMPORTANT]
> **INSTRUCCIÓN DE ACTUALIZACIÓN ITERATIVA:**
> Este documento es la **fuente de verdad viva** del sistema de fidelización de NEON OS.
> **En cada iteración, commit o modificación** realizada sobre esta funcionalidad, el desarrollador o agente de IA **DEBE actualizar este archivo**:
> 1. Marcar las casillas de verificación correspondientes (`[ ]` ➔ `[x]`) en el [Plan de Implementación](#7-plan-de-implementación-detallado-por-fases).
> 2. Documentar cualquier nuevo endpoint, cambio de esquema SQL o ajuste en la arquitectura.
> 3. Registrar la entrada respectiva en la [Bitácora de Iteraciones](#8-bitácora-de-iteraciones-y-cambios).

---

## 1. Visión General del Sistema

El sistema de fidelización de **NEON Drinks & Snacks** permite a los clientes acumular sellos por sus compras de raspados y canjear premios (por ejemplo, 1 raspado gratis por cada 10 sellos), eliminando las tarjetas de papel y sustituyéndolas por una solución digital multicanal:

1. **Tarjeta Web Neón (PWA Universal)**: Tarjeta interactiva accesible vía URL/QR, con estética oscura y neón fluorescente (`#ff73e3`, `#3de8c2`, `#ffd24d`), 100% funcional en cualquier smartphone (iOS/Android) con costo $0.
2. **Google Wallet**: Pase digital oficial con botón *"Save to Google Wallet"*, enlace JWT y notificaciones push automáticas tras cada compra.
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

| Canal | Requisitos de Cuenta | Costo | Mecanismo Técnico |
| :--- | :--- | :--- | :--- |
| **Tarjeta Web Neón (PWA)** | Ninguno (Stack actual Next.js + Supabase) | **$0 USD** | Web App responsiva con actualización en tiempo real y QR renderizado en pantalla. |
| **Google Wallet** | Google Cloud Console + Google Pay & Wallet Console | **$0 USD (Gratis)** | REST API (`@googleapis/walletobjects`), Service Account y enlaces JWT firmados. |
| **Apple Wallet** | Apple Developer Program | **$99 USD / año** | Generación de archivo comprimido `.pkpass` firmado con certificados SSL PassKit + APNs. |

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
    reward_redeemed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de alto rendimiento para búsqueda rápida en el POS
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_loyalty_passes_token ON public.loyalty_passes(pass_token);
CREATE INDEX IF NOT EXISTS idx_loyalty_logs_customer ON public.loyalty_logs(customer_id);
```

---

## 5. Especificación de Endpoints y Rutas

### Rutas Frontend
* `app/club/page.tsx`: Landing pública de enrolamiento donde el cliente ingresa su celular y nombre.
* `app/club/[passToken]/page.tsx`: Vista de la Tarjeta Digital Neón con animación de sellos, código QR y botones para agregar a Google/Apple Wallet.

### Rutas de API Backend
* `POST /api/loyalty/register`:
  * **Entrada**: `{ fullName: string, phone: string, email?: string }`
  * **Salida**: `{ customer: Customer, passToken: string, webUrl: string }`
* `GET /api/loyalty/card/[passToken]`:
  * **Salida**: Datos del cliente, sellos actuales (`0-10`), historial reciente y estado de recompensa.
* `POST /api/loyalty/stamp`:
  * **Entrada**: `{ passToken?: string, phone?: string, orderId?: string, stampsToAdd: number, redeemReward?: boolean }`
  * **Salida**: `{ customer: Customer, newStampsCount: number, rewardRedeemed: boolean, message: string }`
* `POST /api/loyalty/google-pass`:
  * **Entrada**: `{ passToken: string }`
  * **Salida**: `{ saveUrl: string }` (Enlace directo a Google Wallet)
* `GET /api/loyalty/apple-pass/[passToken]`:
  * **Salida**: Binario `application/vnd.apple.pkpass` firmado con PassKit.

---

## 6. Experiencia Operativa en el POS

Para cumplir con la regla de oro de **atención en < 10 segundos**:
1. **Botón Rápido "💎 Tarjeta Neón"**: Ubicado en el panel de cobro/resumen del pedido en el POS.
2. **Escaneo sin Fricción**:
   * Mediante cámara web/tablet (usando lector QR HTML5).
   * O soporte nativo para lector de código de barras 2D físico (emulación de teclado).
   * O búsqueda rápida ingresando los últimos dígitos del número de celular.
3. **Alertas Visuales de Recompensa**:
   * Si el cliente llega a 10 sellos: Alerta luminosa 🎁 **"¡Raspado Gratis Disponible!"**
   * Botón de un solo clic para redimir el raspado en el pedido actual.
4. **Soporte Offline**: Si no hay conexión a internet durante el despacho, la asignación del cliente se guarda en la cola local de pedidos y se sincroniza con Supabase al recuperar la red.

---

## 7. Plan de Implementación Detallado por Fases

> **Nota:** Actualizar las casillas `[ ]` a `[x]` a medida que se completen las tareas en cada iteración.

### 🟡 Fase 1: Base de Datos y Tarjeta Web Neón (PWA Universal)
- [ ] **1.1** Crear la migración SQL en `supabase/migrations/` con las tablas `customers`, `loyalty_passes` y `loyalty_logs`.
- [ ] **1.2** Definir tipos TypeScript en `types/database.ts` y `types/domain.ts` para clientes y pases de lealtad.
- [ ] **1.3** Crear repositorio y servicio de lealtad (`repositories/loyalty.repository.ts` y `services/loyalty.service.ts`).
- [ ] **1.4** Crear endpoint `POST /api/loyalty/register` para enrolar clientes y generar tokens QR únicos.
- [ ] **1.5** Crear endpoint `GET /api/loyalty/card/[passToken]` para consultar el estado de la tarjeta.
- [ ] **1.6** Diseñar la landing pública `/club` con estética Neón (dark mode con tonos rosa/turquesa y formulario ultra-rápido).
- [ ] **1.7** Diseñar la vista `/club/[passToken]` con la tarjeta de 10 sellos animados y código QR legible por el POS.

### 🟡 Fase 2: Integración Operativa en el Terminal POS
- [ ] **2.1** Crear componente modal de escaneo y búsqueda de cliente (`components/pos/loyalty-scanner-modal.tsx`).
- [ ] **2.2** Integrar botón de fidelización en el checkout del POS (`components/pos/pos-terminal.tsx`).
- [ ] **2.3** Crear endpoint `POST /api/loyalty/stamp` para registrar sellos y procesar redenciones ligadas al pedido.
- [ ] **2.4** Implementar la alerta de "Raspado Gratis" y la lógica de descuento/canje al llegar a 10 sellos.
- [ ] **2.5** Asegurar persistencia local y soporte para sincronización diferida en modo offline.

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

| Fecha (YYYY-MM-DD) | Autor / Agente | Fase / Tarea | Resumen del Cambio Realizado |
| :--- | :--- | :--- | :--- |
| *2026-08-19* | Antigravity AI | Documentación Inicial | Creación del documento de arquitectura y plan maestro de implementación iterativa. |

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
