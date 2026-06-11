# Antifocus

> Enterprise Print-on-Demand ERP & E-Commerce — Bogor, Jawa Barat, Indonesia

Antifocus is a **multi-tenant SaaS** platform for print-on-demand businesses targeting Indonesian SMBs. It ships as **two Next.js applications** sharing a single Neon PostgreSQL database:

| App | Route Root | Audience |
|-----|-----------|---------|
| **Storefront** | `/[locale]/(public)/` | End customers — catalog, configurator, checkout |
| **ERP Dashboard** | `/[locale]/admin/` | Staff & admins — all operational modules |

> See [`AGENTS.md`](./AGENTS.md) for coding conventions. See [`PLANS.md`](./PLANS.md) for the MVP build roadmap.

---

## Architecture

### Multi-Tenant Model

| Entity | Description | Scope |
|--------|-------------|-------|
| `Organization` | The tenant — one POD business | Root scope for all records |
| `Branch` | A physical location or warehouse | Scopes inventory, orders, cash |
| `Member` | A staff user inside an org | Role-based via `OrganizationRole` |
| `Customer` | An end customer (linked `User` or walk-in) | Scoped to org |
| `Supplier` | Raw material vendor | Scoped to org |

Every business record carries `organizationId`. Branch-specific records additionally carry `branchId`. There are no cross-tenant queries.

### Print-on-Demand Lifecycle

```
Storefront:
  Product + DesignArea  →  Variant + AttributeOptions
       ↓ customer picks design & options
  Order + OrderItems + OrderItemDesigns

ERP:
  Order → ProductionOrder → ProductionTask(s) → InventoryMovement
               ↓
          BOM (materials consumed)
               ↓
          Fulfillment → ShippingMethod → Courier
               ↓
          Invoice → Payment (Cashbook)
```

### Data Isolation Strategy

- **Org scope:** all reads filter `WHERE organization_id = $orgId`
- **Branch scope:** inventory and POS reads additionally filter `WHERE branch_id = $branchId`
- **Soft delete:** `deletedAt` on all mutable entities; hard delete is rare
- **Audit:** all writes emit `AuditLog` records via middleware

---

## Tech Stack

### Core Engine

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.2 | App Router, Turbopack, Server Actions |
| React | 19.2 | React Compiler enabled |
| TypeScript | 5.9 | Strict mode throughout |
| Biome + Ultracite | 2.4 / 7.6 | Linting & opinionated formatting |
| next-intl | 4.11 | i18n (ID primary, EN secondary) |
| date-fns + @date-fns/tz | 4.1 / 1.4 | Date math with WIB/WITA/WIT timezone support |
| CUID2 | 3.3 | `createId()` — collision-resistant IDs |

### UI & Styling

| Library | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS v4 | 4.2 | Utility-first; OKLCH color tokens via tweakcn |
| Base UI | 1.4 | Unstyled accessible primitives |
| shadcn/ui | 4.7 | Opinionated component layer over Base UI |
| Motion | 12.38 | Animation (layout, transitions) |
| Tabler Icons | 3.44 | Icon set (stroke style) |
| Recharts | 3.8 | ERP charts and dashboards |
| Sonner | 2.0 | Toast notifications |
| TanStack Form | 1.32 | Complex multi-step forms with field-level validation |
| TanStack Table | 8.21 | Sortable, filterable data tables |
| dnd kit | 6.3 | Drag-and-drop (variant ordering, kanban) |
| Embla Carousel | 8.6 | Product image carousels |
| react-day-picker | 10.0 | Date pickers |
| cmdk | 1.1 | Command palette |
| Vaul | 1.1 | Bottom-sheet drawers (mobile) |

### Auth & Security

| Library | Version | Purpose |
|---------|---------|---------|
| Better Auth | 1.6 | Auth core + Organization, Username, PhoneNumber, TwoFactor, Admin, MultiSession plugins |
| @node-rs/argon2 | 2.0 | Password hashing |
| Zod v4 | 4.4 | Runtime validation — all tRPC inputs + form schemas |
| libphonenumber-js | 1.13 | +62 phone number validation |

### Data & State

| Library | Version | Purpose |
|---------|---------|---------|
| Drizzle ORM | 0.45 | Type-safe SQL queries — **primary DB layer** |
| Drizzle Kit | 0.31 | Migrations and studio |
| Neon | — | Serverless PostgreSQL (pooled) |
| tRPC | 11.17 | End-to-end type-safe API layer |
| TanStack Query | 5.100 | Client-side server state, caching, mutations |
| Upstash Redis | — | Rate limiting, session cache, pub/sub |
| Inngest | 4.4 | Durable background workflows (order flows, email queues) |
| nuqs | 2.8 | URL-based state (filters, pagination) |
| dinero.js | 2.0 | Monetary arithmetic — all IDR calculations |

### Infrastructure

| Service | Purpose |
|---------|---------|
| UploadThing | File storage (product images, design files, receipts) |
| Resend + react-email | Transactional email (OTP, order confirmation, invoice) |
| PostHog | Product analytics + feature flags |
| Sentry | Error tracking + performance monitoring |
| Vercel | Hosting, edge functions, CDN |
| GitHub Actions | CI/CD (lint, type-check, preview deploys) |

---

## Database Domains

The database is organised into **10 domain schema files** at `src/lib/db/schema/`. The `.prisma` files at the repo root are **reference blueprints only** — never run Prisma CLI commands.

| Domain | File | Core Models |
|--------|------|------------|
| **auth** | `auth.ts` | `users`, `sessions`, `accounts`, `verifications`, `two_factors`, `apikeys` |
| **org** | `org.ts` | `organizations`, `organization_roles`, `members`, `invitations`, `branches`, `branch_members`, `customers`, `suppliers` |
| **core** | `core.ts` | `audit_logs`, `files`, `addresses`, `sequences`, `settings`, `integrations`, `webhooks`, `notifications` |
| **taxonomy** | `taxonomy.ts` | `tags`, `attributes`, `attribute_options`, `categories`, `collections`, `units` |
| **catalog** | `catalog.ts` | `products`, `variants`, `design_areas`, `product_designs`, `pricelists`, `costlists` + pivot tables |
| **finance** | `finance.ts` | `tax_rates`, `payment_methods`, `invoices`, `supplier_bills`, `expense_categories`, `expenses`, `payments` |
| **supply** | `supply.ts` | `couriers`, `shipping_methods`, `shipping_rates`, `purchase_orders`, `inventories`, `inventory_movements`, `inventory_transfers` |
| **order** | `order.ts` | `order_channels`, `order_sessions`, `orders`, `order_items`, `order_item_designs`, `fulfillments`, `order_returns` |
| **production** | `production.ts` | `bill_of_materials`, `bom_items`, `production_orders`, `production_order_items`, `production_tasks` |
| **marketing** | `marketing.ts` | `promotions`, `vouchers`, `banners`, `reviews`, `posts`, `tickets`, `ticket_messages` |

### Key Cross-Domain Relationships

```
organizations ──< branches ──< inventories >── variants
             ──< members   ──< orders
             ──< products  ──< variants ──< order_items
                                        ──< production_order_items
orders ──< production_orders ──< production_tasks
       ──< fulfillments
       ──< invoices ──< payments >── payment_methods
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 22
- pnpm ≥ 10
- Neon PostgreSQL database (create a project at [neon.tech](https://neon.tech))

### Installation

```bash
# Clone and install
pnpm install

# Configure environment
cp .env.example .env
# Edit .env and fill in all required values

# Push schema to database (development)
pnpm db:push

# Start dev server (Turbopack on port 3000)
pnpm dev
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on port 3000 with Turbopack |
| `pnpm build` | Production build (clean .next first) |
| `pnpm check:lint` | Biome lint + unsafe fix |
| `pnpm check:types` | Full TypeScript type-check |
| `pnpm check:all` | Lint + types in sequence |
| `pnpm db:generate` | Generate Drizzle migration SQL |
| `pnpm db:push` | Push schema directly (dev only) |
| `pnpm db:studio` | Open Drizzle Studio in browser |
| `pnpm auth:generate` | Regenerate Better Auth schema output |

---

## Environment Variables

```bash
# Database
DATABASE_URL=                    # Neon pooled connection string

# Auth (Better Auth)
BETTER_AUTH_SECRET=              # 32+ char random secret

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=               # e.g. no-reply@antifocus.id

# File Storage (UploadThing)
UPLOADTHING_TOKEN=

# Cache / Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Background Workflows (Inngest)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=        # https://app.posthog.com

# Error Tracking (Sentry)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=               # For source map uploads
SENTRY_ORG=
SENTRY_PROJECT=
```

---

## Indonesian Locale Notes

| Concern | Implementation |
|---------|---------------|
| Currency | IDR — all monetary DB fields `numeric(15,2)`, displayed via `dinero.js` |
| Timezone | WIB (UTC+7) default; WITA/WIT supported via `@date-fns/tz` |
| Phone | E.164 +62 format; validated via `libphonenumber-js` |
| Address | Province → City/Kabupaten → District → Sub-district hierarchy (JSON fields) |
| Couriers | JNE, SICEPAT, AnterAja, Pos Indonesia, GoSend, GrabExpress |
| Tax | PPN 12% standard; configurable per product via `TaxRate` |
| Language | `id.json` primary, `en.json` secondary; all UI text via `next-intl` |
