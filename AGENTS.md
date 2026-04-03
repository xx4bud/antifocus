# AGENTS.md | Antifocus

> **Enterprise-grade rules for AI coding agents working on this repository.**
> This is a **Print-on-Demand (PoD) SaaS platform** — a multi-tenant B2B/B2C fullstack application.
>
> ⛔ **Read this entire file BEFORE writing a single line of code.**
> Every rule reflects an intentional architectural decision.
> When in doubt, check the relevant skill file first. When still in doubt, ask.

---

## 📋 Table of Contents

1. [Next.js Warning](#️-this-is-not-the-nextjs-you-know)
2. [Project Context](#-project-context)
3. [Tech Stack](#️-tech-stack)
4. [Directory Structure](#️-directory-structure)
5. [Non-Negotiable Rules](#-non-negotiable-rules)
6. [Definition of Done](#-definition-of-done)
7. [Commands Reference](#-commands-reference)
8. [Layered Architecture](#-layered-architecture)
9. [Type System](#️-type-system)
10. [Database Schema Rules](#️-database-schema-rules)
11. [Authentication](#-authentication)
12. [tRPC API Layer](#-trpc-api-layer)
13. [Feature Module Rules](#-feature-module-rules)
14. [Error Handling](#-error-handling)
15. [Storage & Media](#-storage--media)
16. [Background Jobs](#-background-jobs-inngest)
17. [Canvas Editor](#-canvas-editor)
18. [Rich Text & Documents](#-rich-text--documents)
19. [Search](#-search)
20. [Payment & Shipping](#-payment--shipping)
21. [Notifications & Push](#-notifications--push)
22. [State Management](#-state-management)
23. [i18n Rules](#-i18n-rules)
24. [Indonesia-Specific Rules](#-indonesia-specific-rules)
25. [Performance Rules](#-performance-rules)
26. [Security Rules](#-security-rules)
27. [Testing Strategy](#-testing-strategy)
28. [Observability & Logging](#-observability--logging)
29. [Audit Logging](#-audit-logging)
30. [Feature Flags](#-feature-flags)
31. [SEO & OG Images](#-seo--og-images)
32. [Environment Variables](#️-environment-variables)
33. [Scalability Constraints](#-scalability-constraints)
34. [UI Component Rules](#-ui-component-rules)
35. [Code Quality Standards](#-code-quality-standards)
36. [⚠️ LLM Drift Prevention](#️-llm-drift-prevention--common-agent-mistakes)
37. [Skill Mappings](#-skill-mappings)
38. [Anti-Patterns Reference](#-anti-patterns-quick-reference)

---

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ This is NOT the Next.js you know

This project uses **Next.js 16** with React 19 and the React Compiler — breaking changes from prior versions.

**Before writing any Next.js code:**
1. Read the relevant guide in `node_modules/next/dist/docs/`
2. Heed all deprecation notices and compiler warnings
3. Prefer Server Components by default — use `"use client"` only when strictly necessary
4. The **React Compiler** (`babel-plugin-react-compiler`) is active — do NOT manually add `useMemo`/`useCallback`
5. `searchParams` in page props is now `Promise<SearchParams>` — always `await` it
6. `cookies()` and `headers()` are now async — always `await` them
<!-- END:nextjs-agent-rules -->

---

## 🏢 Project Context

**Antifocus** is an enterprise-grade **Print-on-Demand SaaS platform** targeting the Indonesian market.

- **Primary Language**: Indonesian UI (`id-ID`), English code/comments
- **Platform**: Multi-tenant (organizations = print shops / resellers)
- **Target Users**: Consumers, Organization Admins, Platform Admins, Super Admins
- **Deployment**: Vercel (Edge-compatible where possible)
- **Package Manager**: `pnpm` (v10+) — never use `npm` or `yarn`
- **Node.js**: `>=22.x`

---

## 🛠️ Tech Stack

### Core Framework

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript | ^5.9 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI | ^4.2 |
| Icons | Tabler Icons React | ^3.41 |

### Data & API

| Layer | Technology | Version |
|---|---|---|
| Server State | TanStack Query | ^5.96 |
| Table | TanStack Table | ^8.x |
| Forms | TanStack Form | ^1.28 |
| API Layer | tRPC v11 | ^11.16 |
| Database | Neon (PostgreSQL serverless) | ^1.0 |
| ORM | Drizzle ORM | ^0.45 |
| Cache / Session | Upstash Redis | ^1.37 |
| Validation | **Zod v4** | ^4.3 |
| Serialization | SuperJSON | ^2.2 |

### Auth & Security

| Layer | Technology | Version |
|---|---|---|
| Auth | Better Auth | ^1.5.6 |
| Env Validation | @t3-oss/env-nextjs | ^0.13 |

### Storage & Media

| Layer | Technology | Notes |
|---|---|---|
| Object Storage | Cloudflare R2 | Primary — zero egress fee |
| CDN | Cloudflare CDN | Serves R2 public bucket |
| SDK | @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner | S3-compatible |

> **Cloudinary** is intentionally deferred. `lib/storage/` is provider-agnostic — add Cloudinary as a transform layer later with zero breaking changes in feature code.

### Communication

| Layer | Technology | Version |
|---|---|---|
| Email | Resend | ^6.10 |
| Web Push | web-push | ^3.x |
| Real-time | SSE via Next.js Route Handler | native |

### Background Jobs & Integrations

| Layer | Technology | Version |
|---|---|---|
| Background Jobs | Inngest | ^3.x |
| Payment | Midtrans | ^1.x |
| Shipping | Biteship | REST API |
| PDF Generation | Puppeteer | ^22.x |

### UI Features

| Layer | Technology | Version |
|---|---|---|
| Rich Text Editor | Tiptap | ^2.x |
| Canvas Editor | Konva.js + react-konva | ^9.x |
| MDX / Docs | Fumadocs | ^14.x |
| Charts / Analytics | Recharts | ^2.x |
| Date handling | date-fns + date-fns-tz | ^3.x |

### State & URL

| Layer | Technology | Version |
|---|---|---|
| Client State | Zustand | ^5.x |
| URL State | nuqs | ^2.x |

### Search

| Layer | Technology | Notes |
|---|---|---|
| Full-text | Postgres FTS (`pg_trgm`) | Zero infra cost |
| Instant UI | Orama | Client-side / edge |

### Money & Locale

| Layer | Technology | Notes |
|---|---|---|
| Money Calculations | dinero.js v2 | Immutable, no float errors |
| Currency Formatting | `Intl.NumberFormat` | Native — no extra dep |
| Phone Validation | libphonenumber-js | Indonesian format |

### Testing

| Layer | Technology | Version |
|---|---|---|
| Unit / Integration | Vitest | ^2.x |
| E2E | Playwright | ^1.x |
| API Mocking | MSW (Mock Service Worker) | ^2.x |

### Observability

| Layer | Technology | Notes |
|---|---|---|
| Error Monitoring | Sentry | Next.js SDK |
| Structured Logging | `@/lib/utils/logger` | Custom, JSON output |

### DX

| Layer | Technology | Version |
|---|---|---|
| Linter/Formatter | Ultracite (Biome-based) | 7.4.0 |
| Commit Lint | commitlint (conventional commits) | ^20.5 |
| Git Hooks | Husky + lint-staged | ^9.1 |
| i18n | next-intl | ^4.8 |
| Feature Flags | @vercel/flags | ^3.x |
| OG Images | @vercel/og | ^0.6.x |
| Sitemap | next-sitemap | ^4.x |

---

## 🗂️ Directory Structure

```
antifocus/
├── .agents/
│   ├── skills/           # SKILL.md per domain — read before coding
│   └── workflows/
├── content/docs/         # Fumadocs MDX — at project root, NOT in src/
├── drizzle/              # Generated migrations — do NOT edit manually
├── e2e/                  # Playwright E2E specs
├── public/
│   └── sw.js             # Service Worker (Web Push)
├── scripts/              # Seed & one-off utils (run with tsx)
├── src/
│   ├── app/              # Next.js App Router — ROUTING ONLY
│   │   ├── [locale]/
│   │   │   ├── (auth)/       # sign-in, sign-up, reset-password
│   │   │   ├── (public)/     # home, products, blog, search, docs
│   │   │   ├── (user)/       # account, orders, carts
│   │   │   ├── (dashboard)/  # dashboard, editor, members, settings
│   │   │   └── (admin)/      # users, organizations, audit-logs
│   │   └── api/
│   │       ├── trpc/         # tRPC handler
│   │       ├── auth/         # Better Auth handler
│   │       ├── inngest/      # Inngest function handler
│   │       ├── og/           # @vercel/og image generation
│   │       ├── sse/          # Server-Sent Events
│   │       ├── push/         # Web Push subscribe/unsubscribe
│   │       └── webhooks/     # Midtrans + Biteship webhooks
│   │
│   ├── features/         # Feature-Driven vertical slices
│   │   └── [feature]/
│   │       ├── actions/       # "use server" — orchestration only
│   │       ├── components/    # Feature-scoped UI
│   │       ├── mutations/     # Drizzle write ops
│   │       ├── queries/       # Drizzle read ops
│   │       ├── router.ts      # Thin tRPC router
│   │       ├── utils/         # Pure functions
│   │       ├── validators/    # Zod schemas
│   │       └── index.ts       # Public barrel — ONLY cross-feature interface
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui — never modify directly
│   │   ├── forms/            # TanStack Form wrappers
│   │   ├── tables/           # TanStack Table wrappers
│   │   ├── navigations/      # Navbar, sidebar, breadcrumbs
│   │   └── shared/
│   │
│   ├── hooks/                # Shared React hooks
│   │   ├── use-push-notifications.ts
│   │   ├── use-sse.ts
│   │   └── use-media-upload.ts
│   │
│   ├── lib/                  # Shared infrastructure — no domain logic
│   │   ├── api/              # tRPC setup
│   │   ├── auth/             # Better Auth setup
│   │   ├── cache/            # Upstash Redis
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   └── schema/       # One file per domain
│   │   ├── i18n/
│   │   ├── inngest/
│   │   ├── notifications/    # Resend + web-push
│   │   ├── payment/          # Midtrans
│   │   ├── search/           # Orama config
│   │   ├── shipping/         # Biteship
│   │   ├── storage/          # Cloudflare R2
│   │   ├── flags/            # @vercel/flags
│   │   └── utils/
│   │       ├── audit.ts      # writeAuditLog()
│   │       ├── errors.ts     # parseError()
│   │       ├── ids.ts        # generateId()
│   │       ├── logger.ts
│   │       ├── money.ts      # dinero.js helpers
│   │       └── types.ts      # AppError, Pagination, etc.
│   │
│   ├── messages/             # id-ID.json
│   └── styles/
│
├── AGENTS.md
├── better-auth.ts            # Auto-generated — do NOT edit manually
├── biome.jsonc
├── drizzle.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## 🚨 Non-Negotiable Rules

### Architecture
- NEVER bypass layer boundaries
- NEVER write DB logic outside `mutations/` or `queries/`
- NEVER write business logic inside tRPC routers or UI components
- NEVER import another feature's internals — always use its `index.ts` barrel

### Type Safety
- NEVER use `any` — use `unknown` + type guards
- NEVER manually write TypeScript types for DB tables — always `$inferSelect` / `$inferInsert`
- NEVER use `@ts-ignore` — use `@ts-expect-error` with explanation

### Validation & Security
- NEVER skip Zod validation on any external input (form, API, webhook, URL params)
- NEVER access `process.env` directly — use `@/env`
- NEVER trust client-side data — always re-validate server-side
- NEVER import from `better-auth` directly in feature code — use `@/lib/auth`

### Financial
- NEVER perform money calculations with native JavaScript `number` — use `dinero.js`
- NEVER store money as `float` or `decimal` — store as `integer` (sen/smallest unit)

### Infrastructure
- NEVER use `npm` or `yarn` — always use `pnpm`
- NEVER run `pnpm db:push` in production
- NEVER edit files in `drizzle/` manually
- NEVER edit `better-auth.ts` manually

### Commits
- ALWAYS run `pnpm check:all` before committing
- ALWAYS write conventional commits

---

## ✅ Definition of Done

A feature is complete ONLY when ALL of the following are true:

- [ ] All inputs validated with Zod v4 (form, tRPC, webhook, URL params)
- [ ] Types fully inferred — no manually written DB types
- [ ] No `any`, no unsafe casting
- [ ] tRPC router is thin (delegates to mutations/queries)
- [ ] DB access only via `mutations/` or `queries/`
- [ ] Errors handled via `parseError()` or `TRPCError`
- [ ] All user-visible strings use `next-intl`
- [ ] No unnecessary `"use client"` directives
- [ ] Money operations use `dinero.js`
- [ ] All list queries are paginated
- [ ] Audit log written for all critical mutations
- [ ] `pnpm check:all` passes with zero errors
- [ ] Unit tests written (Vitest) for all utils and business logic
- [ ] Follows all folder & naming conventions in this file

---

## 📦 Commands Reference

```bash
# Development
pnpm dev
pnpm build
pnpm start

# Code Quality — run before EVERY commit
pnpm check:lint            # Ultracite (Biome)
pnpm check:types           # tsc --noEmit
pnpm check:all             # lint + types in sequence

# Database — all require .env
pnpm db:push               # DEV ONLY — push schema directly
pnpm db:generate           # Generate migration SQL
pnpm db:migrate            # Apply migrations (safe for production)
pnpm db:seed               # scripts/seed-main.ts
pnpm db:studio             # Drizzle Studio

# Auth
pnpm auth:generate         # Regenerate better-auth.ts

# Testing
pnpm test                  # Vitest
pnpm test:watch
pnpm test:e2e              # Playwright
pnpm test:e2e:ui

# Utilities
pnpm clean
```

> **Production migrations**: always `pnpm db:generate` then `pnpm db:migrate`. Never `db:push`.

---

## 📐 Layered Architecture

Each layer may ONLY import from layers below it. Upward imports are forbidden.

```
┌──────────────────────────────────────────────────────────────────┐
│  app/                   Routing + Page Composition               │
│                         Imports: features/, components/, lib/    │
├──────────────────────────────────────────────────────────────────┤
│  features/[f]/          Vertical Domain Slices                   │
│                                                                  │
│  components/ → actions/          imports: lib/, components/      │
│  router.ts   → mutations/queries  imports: lib/api/trpc          │
│  actions/    → mutations/queries  imports: lib/                  │
│  mutations/  → (nothing)          imports: lib/db ONLY           │
│  queries/    → (nothing)          imports: lib/db ONLY           │
│  validators/ → (nothing)          imports: zod, @/lib/validators │
├──────────────────────────────────────────────────────────────────┤
│  lib/                   Shared Infrastructure                    │
│                         Imports: external packages only          │
└──────────────────────────────────────────────────────────────────┘
```

### Cross-Feature Access

```ts
// ❌ WRONG
import { getUserById } from "@/features/auth/queries/user";

// ✅ CORRECT
import { getUserById } from "@/features/auth";
```

---

## 🗃️ Type System

**Schema-first typing.** Drizzle schema files are the single source of truth.

```
src/lib/db/schema/
├── auth.ts           # users, accounts, sessions, verifications, apikeys
├── organization.ts   # organizations, members, invitations
├── product.ts        # products, productVariants, productCategories
├── order.ts          # orders, orderItems
├── design.ts         # designs, designLayers (Konva JSON state)
├── billing.ts        # invoices, payments
├── audit.ts          # auditLogs
├── notification.ts   # notifications, pushSubscriptions
└── index.ts          # export * from "./auth"; ...
```

### Type Export Pattern (required in all schema files)

```ts
export type User    = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Non-DB Shared Types

```ts
// src/lib/utils/types.ts
export type AppError = {
  code: string;
  message: string;
  statusCode: number;
  context?: Record<string, unknown>;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: { page: number; limit: number; total: number; hasNextPage: boolean };
};
```

---

## 🗄️ Database Schema Rules

### Naming Conventions

- **Table names**: plural camelCase — `users`, `auditLogs`
- **Column names**: camelCase in TS → `snake_case` in DB via `casing: "snake_case"` in `drizzle.config.ts`
- **IDs**: `generateId()` from `@/lib/utils/ids` — never `crypto.randomUUID()`, never integers
- **Timestamps**: every table has `createdAt` + `updatedAt`; soft-deletable adds `deletedAt`
- **Money columns**: always `integer` (sen), never `decimal` or `float`
- **JSONB columns**: always `.$type<YourInterface>()` for type safety
- **Indexes**: always index FK columns and filter fields — passed as **array** to table factory
- **Better Auth columns**: never rename/remove — annotate with `// better-auth`

### Correct Schema Pattern

```ts
// src/lib/db/schema/order.ts
import { pgTable, pgEnum, text, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/ids";
import { users } from "./auth";
import { organizations } from "./organization";

export const orderStatusEnum = pgEnum("order_status", [
  "pending", "confirmed", "processing", "shipped", "completed", "cancelled",
]);

export const orders = pgTable("orders", {
  id:             text("id").primaryKey().$defaultFn(() => generateId()),
  userId:         text("user_id").notNull().references(() => users.id),
  organizationId: text("organization_id").notNull().references(() => organizations.id),

  // financials — integer only (sen)
  subtotalAmount: integer("subtotal_amount").notNull(),
  shippingAmount: integer("shipping_amount").notNull().default(0),
  taxAmount:      integer("tax_amount").notNull().default(0),
  totalAmount:    integer("total_amount").notNull(),

  status:   orderStatusEnum("status").default("pending").notNull(),
  metadata: jsonb("metadata").$type<{ notes?: string }>(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  // ✅ $onUpdateFn — NOT $onUpdate
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

// ✅ Indexes as ARRAY — not object
}, (table) => [
  index("orders_user_id_idx").on(table.userId),
  index("orders_org_id_idx").on(table.organizationId),
  index("orders_status_idx").on(table.status),
  index("orders_created_at_idx").on(table.createdAt),
]);

export type Order    = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
```

### Drizzle Relations (v0.45 stable)

```ts
import { relations } from "drizzle-orm";

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user:         one(users, { fields: [orders.userId], references: [users.id] }),
  organization: one(organizations, { fields: [orders.organizationId], references: [organizations.id] }),
  items:        many(orderItems),
}));
```

> If upgrading to Drizzle v1 beta, migrate to `defineRelations()`. See `https://orm.drizzle.team/docs/relations-v1-v2`.

---

## 🔐 Authentication

Better Auth is the **single source of truth** for auth and RBAC.

```
src/lib/auth/
├── server.ts        # auth instance
├── index.ts         # public barrel
├── types.ts         # AuthSession, AuthUser (inferred from auth instance)
├── options/
│   ├── index.ts
│   ├── email-password.ts
│   ├── email-verification.ts
│   ├── rate-limit.ts
│   ├── secondary-storage.ts   # Upstash Redis session store
│   └── database-hooks.ts
└── plugins/
    ├── index.ts
    ├── admin.ts, api-key.ts, organization.ts
    ├── two-factor.ts, username.ts, phone-number.ts
    └── expo.ts
```

### Active Plugins

| Plugin | Purpose |
|---|---|
| `username` | Custom `username` + `displayUsername` |
| `phoneNumber` | Phone number auth |
| `twoFactor` | TOTP 2FA |
| `admin` | Platform-level RBAC |
| `organization` | Multi-tenant with dynamic ACL |
| `apiKey` | Machine-to-machine access |
| `nextCookies` | SSR cookie sync |
| `multiSession` | Multiple concurrent sessions |
| `expo` | Mobile auth (future) |

### Session Usage

```ts
import type { AuthSession, AuthUser } from "@/lib/auth"; // never from better-auth directly

// Server Components / Actions
import { getServerSession } from "@/features/auth/actions/session";
const session = await getServerSession();
if (!session) redirect("/sign-in");

// tRPC context — non-null in authProcedure+
ctx.session   // AuthSession
ctx.user      // AuthUser
```

> After any plugin or schema change: `pnpm auth:generate`

---

## 🔌 tRPC API Layer

### File Responsibilities

| File | Purpose | Runtime |
|---|---|---|
| `context.ts` | Build `Context` (session, user, db) | Server |
| `trpc.ts` | `initTRPC`, procedures, middleware | Server |
| `root.ts` | Merge all feature routers | Server |
| `server.tsx` | `createTRPCOptionsProxy`, `HydrateClient`, `prefetch` | Server |
| `client.ts` | `useTRPC` hook | Client |
| `provider.tsx` | `TRPCProviderWrapper` | Client |
| `query.ts` | `makeQueryClient` / `getQueryClient` | Both |
| `index.ts` | **Unified entry — always import from here** | Both |

### Import Rule

```ts
// ✅ Unified entry only
import { api, useTRPC, HydrateClient } from "@/lib/api";

// ❌ Never import sub-files
import { api } from "@/lib/api/server";
```

### Procedure Hierarchy

```
publicProcedure
  └── authProcedure                   ctx.user is non-null
        └── rbacProcedure([roles])
              ├── adminProcedure      ["admin", "super_admin"]
              └── superAdminProcedure ["super_admin"]
```

### Thin Router Pattern

```ts
// ✅ Correct — thin, delegates to mutations/queries
export const orderRouter = router({
  create: authProcedure
    .input(createOrderSchema)
    .mutation(({ ctx, input }) => createOrder(ctx.user.id, input)),
  list: authProcedure
    .input(listOrdersSchema)
    .query(({ ctx, input }) => listOrdersByUser(ctx.user.id, input)),
});

// ❌ Wrong — DB logic in router
export const orderRouter = router({
  create: authProcedure
    .mutation(async ({ ctx, input }) => {
      return db.insert(orders).values({ ...input }).returning(); // NOT HERE
    }),
});
```

### Client Usage — tRPC v11 + TanStack Query v5

```ts
"use client";
import { useTRPC } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function OrderList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // ✅ tRPC v11 — queryOptions factory
  const { data } = useQuery(trpc.order.list.queryOptions({ page: 1 }));

  // ✅ mutationOptions with type-safe invalidation
  const createOrder = useMutation(
    trpc.order.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.order.list.queryKey(), // ✅ type-safe key
        });
      },
    })
  );

  return <div>...</div>;
}

// ❌ OLD v10 — breaks React Compiler
const { data }  = trpc.order.list.useQuery({ page: 1 });
const mutation  = trpc.order.create.useMutation();
```

### Server Component Prefetch

```ts
import { api, HydrateClient, trpc, prefetch } from "@/lib/api";

export default async function OrdersPage() {
  void prefetch(trpc.order.list.queryOptions({ page: 1 }));
  return (
    <HydrateClient>
      <OrderList />
    </HydrateClient>
  );
}
```

---

## 🧩 Feature Module Rules

### File Naming

| File | Rule |
|---|---|
| `router.ts` | One per feature; always thin |
| `actions/*.ts` | Must start with `"use server"` |
| `mutations/*.ts` | Must NOT have `"use server"`; one atomic DB write |
| `queries/*.ts` | Must NOT have `"use server"`; one DB read |
| `validators/*.ts` | Zod schemas only; `import { z } from "zod"` |
| `components/*.tsx` | Add `"use client"` only when strictly required |
| `utils/*.ts` | Pure functions — no side effects, no DB, no auth |
| `index.ts` | Public barrel only |

### Server Action Shape

```ts
"use server";
import { parseError } from "@/lib/utils/errors";
import { writeAuditLog } from "@/lib/utils/audit";
import { getServerSession } from "@/features/auth/actions/session";

type ActionResult<T> = { data?: T; error?: AppError };

export async function createOrder(input: CreateOrderInput): Promise<ActionResult<Order>> {
  try {
    const session = await getServerSession();
    if (!session) return { error: parseError(new Error("Unauthorized")) };

    const order = await insertOrder({ ...input, userId: session.user.id });

    await writeAuditLog({
      action: "order.create",
      resourceType: "order",
      resourceId: order.id,
      userId: session.user.id,
      newValue: order,
    });

    return { data: order };
  } catch (error) {
    return { error: parseError(error) };
  }
}
```

---

## ❗ Error Handling

### Server Actions — `parseError()`

```ts
// Always return { error } — never throw from actions
try {
  return { data: await doWork() };
} catch (error) {
  return { error: parseError(error) };
}
```

### tRPC — `TRPCError`

```ts
throw new TRPCError({ code: "NOT_FOUND",    message: "Resource tidak ditemukan" });
throw new TRPCError({ code: "FORBIDDEN",    message: "Akses ditolak" });
throw new TRPCError({ code: "BAD_REQUEST",  message: "Input tidak valid" });
throw new TRPCError({ code: "UNAUTHORIZED", message: "Silakan masuk terlebih dahulu" });
```

### Webhooks — idempotency required

```ts
const key = `webhook:midtrans:${transactionId}`;
if (await redis.get(key)) return new Response("OK", { status: 200 });
await processPayment(payload);
await redis.set(key, "1", { ex: 86400 });
```

---

## 🗂️ Storage & Media (Cloudflare R2)

Files upload **directly from client to R2** via presigned URLs — never through Next.js server.

### Upload Flow

```
1. Client → tRPC: requestPresignedUrl({ filename, contentType, folder })
2. Server → R2:   generatePresignedPutUrl(key, contentType, expiresIn: 3600)
3. Server → Client: { presignedUrl, key }
4. Client → R2:   PUT file directly
5. Client → tRPC: confirmUpload({ key })
6. Server → DB:   save { fileKey: key }  ← KEY not full URL
```

### Rules

- Never expose R2 credentials to client
- Key structure: `{organizationId}/{resourceType}/{id}/{nanoid()}.{ext}`
- Always store key in DB — derive URL at read time via `getPublicUrl(key)`
- Presigned PUT URLs expire in 60 minutes
- Size limits: designs ≤ 50MB, avatars ≤ 5MB

---

## ⚙️ Background Jobs (Inngest)

All async/long-running work goes through **Inngest**.

```
src/lib/inngest/
├── client.ts
├── functions/
│   ├── order-confirmed.ts   # Email + fulfillment
│   ├── invoice-generate.ts  # Puppeteer PDF
│   ├── push-notify.ts       # Web push
│   └── shipping-sync.ts     # Biteship poll
└── index.ts
```

### Rules

- Send events from actions — never call Inngest functions directly
- All functions must be idempotent
- Route handler: `src/app/api/inngest/route.ts`
- Puppeteer runs only in Inngest — never in HTTP request path

```ts
// ✅ Send event, Inngest handles async
await inngest.send({ name: "order/confirmed", data: { orderId } });

// ❌ Blocking the request
await generateInvoicePDF(orderId);
```

---

## 🎨 Canvas Editor (Konva.js — v1 Scope)

- Text, image, shape layers
- JSON state in `designs.canvasState jsonb` (Zod-validated)
- PNG export via `stage.toDataURL({ pixelRatio: 3 })`
- Auto-save: 1.5s debounce
- All canvas components are `"use client"`
- Zustand manages editor state (active tool, selected layer, zoom)

---

## 📝 Rich Text & Documents

### Tiptap

```ts
// ✅ Store as JSON, not HTML
await updateProduct(id, { description: editor.getJSON() });
```

### Fumadocs

```
content/docs/                          # at project root — NOT in src/
src/app/[locale]/(public)/docs/[[...slug]]/page.tsx
```

All MDX frontmatter must include `title` and `description`.

---

## 🔍 Search

### Postgres FTS

```ts
import { sql } from "drizzle-orm";

const results = await db
  .select()
  .from(products)
  .where(
    sql`to_tsvector('indonesian', ${products.name}) @@ plainto_tsquery('indonesian', ${query})`
  )
  .limit(20);
```

Enable in first migration: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`

### Orama

- Index built server-side — never on the client
- Rebuild via Inngest when catalog changes
- Never use for sensitive data

---

## 💳 Payment & Shipping

### Midtrans Rules

- Verify webhook signature: `midtrans.transaction.notification(rawBody)`
- Idempotency key on every webhook
- Store only `transactionId`, `status`, `amount`

### Biteship Rules

- Cache shipping rates in Upstash Redis (TTL: 10 min)
- Store `biteshipOrderId` for tracking

---

## 🔔 Notifications & Push

| Channel | Implementation |
|---|---|
| In-app (SSE) | `src/app/api/sse/route.ts` |
| Email | Resend + React Email |
| Web Push | `web-push` + Service Worker |

**Web Push Rules:**
- VAPID keys in env vars — never hardcoded
- Push subscriptions scoped to `userId`
- Always send via Inngest function — never inline

---

## 🧠 State Management

### Zustand v5

```ts
// ✅ Slice pattern — one store per domain concern
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
    }),
    { name: "antifocus-cart" }
  )
);
```

- `"use client"` only — never in Server Components
- Never store server data in Zustand (use TanStack Query cache)

### nuqs v2 — URL State

#### Client

```ts
"use client";
import { useQueryState, useQueryStates, parseAsInteger, parseAsString, debounce } from "nuqs";

const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

const [{ q, sort }, setFilters] = useQueryStates({
  q:    parseAsString.withDefault(""),
  sort: parseAsString.withDefault("newest"),
}, { history: "push", shallow: false }); // shallow: false triggers server re-render

const [query, setQuery] = useQueryState("q",
  parseAsString.withDefault("").withOptions({
    shallow: false,
    limitUrlUpdates: debounce(300), // ✅ NOT deprecated throttleMs
  })
);
```

#### Server — define parsers ONCE, share with client

```ts
// src/features/product/utils/search-params.ts
import { parseAsString, parseAsInteger, createSearchParamsCache } from "nuqs/server";
// ⚠️ "nuqs/server" — NOT "nuqs"

export const productSearchParams = {
  q:    parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export const productParamsCache = createSearchParamsCache(productSearchParams);
```

```ts
// page.tsx — Next.js 15: searchParams is Promise
import type { SearchParams } from "nuqs/server";
type Props = { searchParams: Promise<SearchParams> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q, page } = await productParamsCache.parse(searchParams); // must await
  return (
    <>
      <ProductFilters />           {/* uses useQueryStates(productSearchParams) */}
      <ProductGrid page={page} />
    </>
  );
}

// Nested Server Component — cache available without prop drilling
function Count() {
  const page = productParamsCache.get("page");
  return <span>Page {page}</span>;
}
```

**Rules summary:**
- Client: `from "nuqs"` — Server: `from "nuqs/server"` — always separate
- Share parser definitions between client/server in one file
- `shallow: false` when URL changes must trigger server re-render
- `limitUrlUpdates: debounce(ms)` — not `throttleMs`

---

## 🌐 i18n Rules

- **Active locale**: `id-ID` only
- All user-visible strings use `next-intl`
- `getTranslations()` in Server Components; `useTranslations()` in Client Components
- Route definitions: `src/lib/i18n/routing.ts`
- Message files: `src/messages/id-ID.json`

| Path | Group | Access |
|---|---|---|
| `/`, `/products`, `/blog`, `/docs` | `(public)` | Public |
| `/sign-in`, `/sign-up` | `(auth)` | Unauthenticated |
| `/account`, `/orders` | `(user)` | Authenticated |
| `/dashboard` | `(dashboard)` | Org member |
| `/admin` | `(admin)` | `admin` / `super_admin` |

---

## 🇮🇩 Indonesia-Specific Rules

### Phone

```ts
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const normalized = parsePhoneNumber(input, "ID").format("E.164"); // +628xxxxxxxxxx

// Zod v4 syntax
export const phoneIdSchema = z.string().refine(
  (val) => isValidPhoneNumber(val, "ID"),
  { error: "Nomor telepon Indonesia tidak valid" } // ← error not message
);
```

### Currency

```ts
import { dinero, add } from "dinero.js";
import { IDR } from "@dinero.js/currencies";

const price    = dinero({ amount: 15000000, currency: IDR }); // sen
const shipping = dinero({ amount: 1500000, currency: IDR });
const total    = add(price, shipping);

export const formatRupiah = (amountInSen: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })
    .format(amountInSen / 100);
```

### Timezone

```ts
import { formatInTimeZone } from "date-fns-tz";
// Always store UTC in DB
const WIB = "Asia/Jakarta"; // UTC+7
formatInTimeZone(date, WIB, "dd MMM yyyy HH:mm 'WIB'");
```

### NIK / NPWP — Zod v4 syntax

```ts
export const nikSchema = z.string()
  .length(16, { error: "NIK harus 16 digit" })
  .regex(/^\d{16}$/, { error: "NIK hanya angka" });
```

---

## ⚡ Performance Rules

- Server Components first — `"use client"` only for hooks, events, browser APIs
- All list endpoints paginated (cursor or offset)
- No N+1 queries — Drizzle joins or `inArray`
- Cache shipping rates in Redis (TTL: 10 min)
- Use PPR and `use cache` — load `next-cache-components` skill first
- Trust React Compiler — no `useMemo`/`useCallback` without profiling
- Puppeteer in Inngest only — never in request path

---

## 🔒 Security Rules

- All endpoints validate input with Zod v4
- All protected routes use `authProcedure` or higher
- RBAC via `rbacProcedure` — never inline role checks
- Re-validate all inputs server-side
- Sanitize user-generated rich text before persistence
- R2 presigned URLs expire in 60 minutes
- Midtrans webhook signature verified on every request
- Idempotency key for every webhook
- Never log passwords, tokens, secrets, or PII

---

## 🧪 Testing Strategy

### Vitest

```ts
// nuqs v2 — test with NuqsTestingAdapter
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

render(<ProductFilters />, {
  wrapper: ({ children }) => (
    <NuqsTestingAdapter searchParams="?page=2&q=kaos">
      {children}
    </NuqsTestingAdapter>
  ),
});
```

- Test all `utils/` — pure and easy
- Test money helpers with edge cases
- Test webhook signature validation
- Mock external APIs with **MSW**

### Playwright E2E

```
e2e/
├── auth/sign-in.spec.ts
├── order/checkout-flow.spec.ts
└── design/editor-save.spec.ts
```

Mock payment with `page.route()`. Run in CI on PRs to `main`.

---

## 📊 Observability & Logging

```ts
import { logger } from "@/lib/utils/logger";
import * as Sentry from "@sentry/nextjs";

logger.info("order.created", { orderId, totalAmount });
logger.error("shipping.failed", { error: parseError(err) });
Sentry.captureException(error, { extra: { orderId } });
```

**Never log:** passwords, tokens, secrets, PII, full card numbers.

---

## 📋 Audit Logging

```ts
export const auditLogs = pgTable("audit_logs", {
  id:             text("id").primaryKey().$defaultFn(() => generateId()),
  userId:         text("user_id").references(() => users.id),
  organizationId: text("organization_id").references(() => organizations.id),
  action:         text("action").notNull(),         // "order.create"
  resourceType:   text("resource_type").notNull(),  // "order"
  resourceId:     text("resource_id"),
  oldValue:       jsonb("old_value"),
  newValue:       jsonb("new_value"),
  ipAddress:      text("ip_address"),
  userAgent:      text("user_agent"),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("audit_logs_user_id_idx").on(table.userId),
  index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
  index("audit_logs_created_at_idx").on(table.createdAt),
]);

export type AuditLog = typeof auditLogs.$inferSelect;
```

**Required for:** order lifecycle, user role changes, org settings, payment status, design exports, feature flag changes.

---

## 🚩 Feature Flags

```ts
import { flag } from "@vercel/flags/next";

export const newCheckoutFlow = flag<boolean>({
  key: "new-checkout-flow",
  decide: () => false, // always safe default
});
```

- All flags default to `false`
- `kebab-case` names
- Audit log on every change
- Remove after full rollout — not permanent

---

## 🔍 SEO & OG Images

```ts
// src/app/api/og/route.tsx
import { ImageResponse } from "@vercel/og";

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") ?? "Antifocus";
  return new ImageResponse(
    <div style={{ display: "flex" }}><h1>{title}</h1></div>,
    { width: 1200, height: 630 }
  );
}
```

All public pages export `metadata`. Product pages use dynamic OG via `/api/og`.

---

## ⚙️ Environment Variables

```ts
import { env } from "@/env"; // ✅ always
process.env.DATABASE_URL;    // ❌ never
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL |
| `BETTER_AUTH_SECRET` | Min 32 chars |
| `RESEND_API_KEY` | Email |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Upstash Redis |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | OAuth |
| `CLOUDFLARE_R2_ACCOUNT_ID` | R2 |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 |
| `CLOUDFLARE_R2_BUCKET_NAME` | R2 |
| `CLOUDFLARE_R2_PUBLIC_URL` | R2 CDN base |
| `MIDTRANS_SERVER_KEY` + `MIDTRANS_CLIENT_KEY` | Payment |
| `MIDTRANS_IS_PRODUCTION` | `"true"` in prod |
| `BITESHIP_API_KEY` | Shipping |
| `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` | Jobs |
| `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` | Web Push |
| `SENTRY_DSN` | Error monitoring |
| `FLAGS_SECRET` | Feature flags |
| `NEXT_PUBLIC_APP_URL` | Public URL |

---

## 📈 Scalability Constraints

- All list queries paginated
- No N+1 queries
- Scope by `organizationId` for multi-tenant isolation
- All critical flows idempotent
- All FK and filter fields indexed
- Money as integer — no float accumulation
- Webhooks use idempotency keys
- Heavy ops in Inngest

---

## 🎨 UI Component Rules

| Directory | Use When |
|---|---|
| `src/components/ui/` | shadcn/ui primitive — never modify directly |
| `src/components/forms/` | TanStack Form wrappers |
| `src/components/tables/` | TanStack Table wrappers |
| `src/components/navigations/` | Global nav |
| `src/components/shared/` | Cross-feature |
| `src/features/[f]/components/` | One feature only |

- Build from shadcn/ui — never raw HTML forms/inputs
- Server Components by default
- No business/data logic in components
- `nuqs` for URL state — never `useState` for filter/pagination
- `TanStack Table` for all data tables

---

## ✅ Code Quality Standards

- No `any` — `unknown` + type guards
- No `@ts-ignore` — `@ts-expect-error` with explanation
- DB types from schema: `typeof users.$inferSelect`
- tRPC types via `RouterInputs` / `RouterOutputs` from `@/lib/api`
- `@/` path aliases — never `../../` across layers

```
feat:     add product catalog router
fix:      resolve session expiry
refactor: extract email templates
docs:     update AGENTS.md
chore:    upgrade drizzle-orm
test:     add unit tests for parseError
```

---

## ⚠️ LLM Drift Prevention — Common Agent Mistakes

This section documents **where AI coding agents consistently produce incorrect code** for this stack. Check this before writing code in any of these areas.

---

### 1. tRPC v11 — Client Hook API

```ts
// ❌ OLD v10 — breaks React Compiler, do NOT use
const { data }  = trpc.order.list.useQuery({ page: 1 });
const mutation  = trpc.order.create.useMutation();

// ✅ CORRECT v11
const trpc      = useTRPC();
const { data }  = useQuery(trpc.order.list.queryOptions({ page: 1 }));
const mutation  = useMutation(trpc.order.create.mutationOptions());
```

---

### 2. nuqs v2 — Wrong Import in Server Component

```ts
// ❌ "nuqs" contains "use client" — throws in Server Component
import { parseAsInteger, createSearchParamsCache } from "nuqs";

// ✅ Always "nuqs/server" in server files
import { parseAsInteger, createSearchParamsCache } from "nuqs/server";
```

---

### 3. nuqs v2 — searchParams Not Awaited (Next.js 15)

```ts
// ❌ searchParams is Promise<SearchParams> in Next.js 15
const { page } = productParamsCache.parse(searchParams); // runtime error

// ✅ Must await
import type { SearchParams } from "nuqs/server";
type Props = { searchParams: Promise<SearchParams> };

export default async function Page({ searchParams }: Props) {
  const { page } = await productParamsCache.parse(searchParams);
}
```

---

### 4. nuqs v2 — Deprecated throttleMs

```ts
// ❌ Deprecated in nuqs 2.5+
useQueryState("q", parseAsString.withOptions({ throttleMs: 300 }));

// ✅ Current API
import { debounce } from "nuqs";
useQueryState("q", parseAsString.withOptions({ limitUrlUpdates: debounce(300) }));
```

---

### 5. Zod v4 — String Format Validators

```ts
// ❌ Zod v3 method-chain validators (removed/moved in v4)
z.string().email()
z.string().uuid()
z.string().url()
z.string().datetime()

// ✅ Zod v4 — top-level functions
z.email()
z.uuid()          // RFC 4122 strict; z.guid() for looser UUIDs
z.url()
z.iso.datetime()  // ISO 8601
z.iso.date()      // YYYY-MM-DD
```

---

### 6. Zod v4 — Error Customization

```ts
// ❌ Zod v3 APIs (removed in v4)
z.string({ required_error: "Wajib", invalid_type_error: "Harus teks" })
z.string().min(5, { message: "Min 5 karakter" })

// ✅ Zod v4 — unified error parameter
z.string({ error: (issue) => issue.input === undefined ? "Wajib diisi" : "Harus berupa teks" })
z.string().min(5, { error: "Minimal 5 karakter" })
```

---

### 7. Zod v4 — Object Modes

```ts
// ❌ Method chains (deprecated, legacy)
z.object({ name: z.string() }).strict()
z.object({ name: z.string() }).passthrough()

// ✅ Top-level functions
z.strictObject({ name: z.string() })
z.looseObject({ name: z.string() })
```

---

### 8. Zod v4 — Error Access

```ts
// ❌ .errors removed
if (err instanceof ZodError) console.log(err.errors);

// ✅ Use .issues
if (err instanceof ZodError) console.log(err.issues);
```

---

### 9. Zod v4 — .optional().default() Behavior Change

```ts
// ⚠️ BREAKING: In v4, defaults ALWAYS apply even when field absent
const schema = z.object({ age: z.number().default(18).optional() });
schema.parse({});
// v3: {}            ← key absent
// v4: { age: 18 }  ← default always applied
// Audit code that relies on key existence
```

---

### 10. Drizzle — $onUpdateFn vs $onUpdate

```ts
// ❌ Wrong function name
updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())

// ✅ Correct
updatedAt: timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull()
```

---

### 11. Drizzle — Index Array Syntax

```ts
// ❌ Old object syntax
export const t = pgTable("t", {...}, (table) => ({
  idx: index("idx").on(table.email),
}));

// ✅ Current array syntax
export const t = pgTable("t", {...}, (table) => [
  index("t_email_idx").on(table.email),
]);
```

---

### 12. Next.js 15 — Async cookies/headers

```ts
// ❌ Synchronous — throws at runtime
const token = cookies().get("token");

// ✅ Async
const cookieStore = await cookies();
const token = cookieStore.get("token");
```

---

### 13. Money — Never Native Number

```ts
// ❌ Float arithmetic
const total = 99900 + 15000;
const disc  = total * 0.1;

// ✅ dinero.js
import { dinero, add } from "dinero.js";
import { IDR } from "@dinero.js/currencies";

const total = add(
  dinero({ amount: 9990000, currency: IDR }),
  dinero({ amount: 1500000, currency: IDR })
);
```

---

### 14. tRPC — Type-Safe Cache Invalidation

```ts
// ❌ String key — loses type safety
queryClient.invalidateQueries({ queryKey: ["order", "list"] });

// ✅ Type-safe
const trpc = useTRPC();
queryClient.invalidateQueries({ queryKey: trpc.order.list.queryKey() });
```

---

### 15. Feature Isolation — Cross-Feature Imports

```ts
// ❌ Internal import
import { insertOrder } from "@/features/order/mutations/insert-order";

// ✅ Public barrel
import { insertOrder } from "@/features/order";
```

---

## 🧠 Skill Mappings

Load the linked skill BEFORE writing code in that area.

```yaml
skills:
  - task: "node_modules skills"
    load: "node_modules/[package]/skills/[skill]/SKILL.md"
  - task: "Kilo Rules"
    load: ".kilo/rules/[skill-name]/SKILL.md"
  - task: "Agent skill"
    load: ".agents/skills/[skill-name]/SKILL.md"
```

---

## 🚫 Anti-Patterns Quick Reference

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| Business logic in tRPC routers | Move to `mutations/` or `queries/` |
| `"use server"` in mutations/queries | Only in `actions/` |
| Direct import from another feature's internals | Use `index.ts` barrel |
| Raw SQL strings | Drizzle ORM query builders |
| Inline role checks in routers | `rbacProcedure`, `adminProcedure` |
| Relative imports across layers | `@/` alias |
| Manually writing DB types | `typeof table.$inferSelect` |
| Skipping Zod on any external input | Validate at every boundary |
| `process.env` directly | `@/env` |
| `better-auth` imports in features | `@/lib/auth` wrappers |
| `useMemo`/`useCallback` without profiling | Trust React Compiler |
| `trpc.proc.useQuery()` (v10) | `useQuery(trpc.proc.queryOptions())` |
| `trpc.proc.useMutation()` (v10) | `useMutation(trpc.proc.mutationOptions())` |
| `from "nuqs"` in Server Component | `from "nuqs/server"` |
| `searchParams.page` in Next.js 15 | `const { page } = await searchParams` |
| `throttleMs` in nuqs | `limitUrlUpdates: debounce(ms)` |
| `z.string().email()` (Zod v4) | `z.email()` |
| `z.string().uuid()` (Zod v4) | `z.uuid()` / `z.guid()` |
| `{ message: "..." }` in Zod v4 | `{ error: "..." }` |
| `required_error` / `invalid_type_error` | Unified `error` function |
| `error.errors` in Zod v4 | `error.issues` |
| `z.object({}).strict()` (Zod v4) | `z.strictObject({})` |
| `$onUpdate()` on Drizzle timestamp | `$onUpdateFn(() => new Date())` |
| `(table) => ({ idx: index() })` | `(table) => [index()]` — array |
| `cookies().get()` sync (Next.js 15) | `(await cookies()).get()` |
| Money with native `number` | `dinero.js` |
| Money stored as float | Store as `integer` (sen) |
| Upload files through Next.js server | Presigned R2 — direct to R2 |
| R2 full URL stored in DB | Store key — `getPublicUrl(key)` at read |
| Puppeteer in request path | Inngest background job |
| Webhooks without idempotency | Check + set Redis key first |
| Unbounded list queries | Always paginate |
| `useState` for filter/pagination | `nuqs` URL state |
| One giant Zustand store | Slice per domain |
| Critical mutation without audit log | `writeAuditLog()` |
| Permanent feature flags | Remove after full rollout |
| Unvalidated phone numbers | `libphonenumber-js` |
| Dates without timezone | `date-fns-tz`, store UTC |
| Editing `better-auth.ts` manually | `pnpm auth:generate` |
| Editing `drizzle/` manually | `pnpm db:generate` + `pnpm db:migrate` |
| `npm` or `yarn` | `pnpm` |
| `pnpm db:push` in production | `db:generate` + `db:migrate` |
| Hardcoded UI text | `next-intl` |
| `lib/types.ts` for DB entities | Types in `lib/db/schema/` |
