# AGENTS.md — Antifocus

> **Single source of truth for every AI coding agent working on Antifocus.**
> Read this file in full before touching any code. No exceptions.

---

## ⚠️ MANDATORY PRE-CODE CHECKLIST

Execute every step before writing a single line:

1. **Read this file completely.** Not skimmable — rules compound.
2. **Identify your task in `PLANS.md`** — confirm scope and dependencies.
3. **Verify library APIs.** Use `context7` MCP or read `node_modules/<pkg>/README.md`. Your training data is outdated.
4. **Never write code until the user explicitly commands it.** Brainstorm and discuss first.
5. **Never run `prisma` commands.** The `.prisma` files are blueprints — Drizzle is the live ORM.

---

## Critical Architecture Rules

These override everything else:

| # | Rule |
|---|------|
| 1 | **DB = Drizzle.** Schema lives in `src/lib/db/schema/*.ts`. The `.prisma` files at root are read-only reference blueprints. Never touch them programmatically. |
| 2 | **IDs = `createId()`.** Import from `@paralleldrive/cuid2`. Never use `uuid()`, `crypto.randomUUID()`, or hand-written IDs. |
| 3 | **Money = `numeric(15,2)`.** All monetary DB columns use Drizzle `numeric` with `{ precision: 15, scale: 2 }`. All arithmetic via `dinero.js`. Never use `float` or JS number for money. |
| 4 | **Every record is org-scoped.** Every table that belongs to a tenant must have `organizationId`. Every query MUST `WHERE organization_id = ctx.organizationId`. No exceptions. |
| 5 | **tRPC only.** Client ↔ server data flows through tRPC. No raw `fetch`, no Route Handlers for data (auth route `api/auth` is the only exception). |
| 6 | **Zod v4 for all inputs.** Import from `'zod/v4'`, not `'zod'`. All tRPC inputs and form schemas must be Zod schemas. |
| 7 | **Auth = Better Auth.** No custom JWT, no NextAuth. Session is read via `auth.api.getSession()`. Org context from `session.session.activeOrganizationId`. |
| 8 | **No `any`.** TypeScript strict mode. Infer DB types via `typeof table.$inferSelect`. |
| 9 | **Soft deletes.** Set `deletedAt = new Date()`. Hard deletes only for junction tables and log records. |
| 10 | **i18n all UI text.** Every user-visible string goes in `messages/id.json` + `messages/en.json` and is accessed via `useTranslations()` or `getTranslations()`. No hardcoded strings in components. |

---

## Project Structure

```
antifocus/
├── auth.prisma              ← Blueprint only. DO NOT run Prisma CLI.
├── catalog.prisma           ← Blueprint only.
├── core.prisma              ← Blueprint only.
├── finance.prisma           ← Blueprint only.
├── marketing.prisma         ← Blueprint only.
├── order.prisma             ← Blueprint only.
├── org.prisma               ← Blueprint only.
├── production.prisma        ← Blueprint only.
├── schema.prisma            ← Blueprint only.
├── supply.prisma            ← Blueprint only.
├── taxonomy.prisma          ← Blueprint only.
│
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── (auth)/          ← sign-in, sign-up
│   │       ├── (public)/        ← storefront (home, search, product pages)
│   │       ├── account/         ← customer self-service
│   │       ├── admin/           ← ERP dashboard (staff only)
│   │       └── api/
│   │           ├── auth/[...all]/   ← Better Auth handler
│   │           └── trpc/[trpc]/     ← tRPC handler
│   │
│   ├── components/
│   │   ├── forms/           ← Generic form primitives (form-base, form-input, etc.)
│   │   ├── providers/       ← App-level providers (trpc, i18n, app)
│   │   └── ui/              ← shadcn/ui components (DO NOT edit generated files)
│   │
│   ├── features/            ← Domain-specific UI (co-located components + libs)
│   │   ├── admin/           ← ERP feature modules
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── orders/
│   │   │   ├── finance/
│   │   │   ├── supply/
│   │   │   ├── production/
│   │   │   └── marketing/
│   │   └── main/            ← Storefront feature modules
│   │       ├── auth/
│   │       ├── catalog/
│   │       ├── cart/
│   │       └── checkout/
│   │
│   └── lib/
│       ├── api/
│       │   ├── index.ts         ← tRPC app router (merges all sub-routers)
│       │   ├── routers/         ← One file per domain
│       │   └── trpc/
│       │       ├── context.ts   ← Request context (session, org, db)
│       │       └── index.ts     ← Procedure builders (publicProcedure, protectedProcedure, orgProcedure)
│       │
│       ├── auth/
│       │   ├── index.ts         ← Better Auth instance
│       │   ├── options/         ← Auth configuration split files
│       │   ├── permissions/     ← RBAC statements + role definitions
│       │   └── plugins/         ← Better Auth plugin configs
│       │
│       ├── db/
│       │   ├── index.ts         ← Drizzle client (export `db`)
│       │   ├── helpers.ts       ← Query helpers (paginate, softDelete, etc.)
│       │   └── schema/
│       │       ├── auth.ts      ← Better Auth tables (DO NOT modify structure)
│       │       ├── org.ts       ← Organization domain
│       │       ├── core.ts      ← Core utilities domain
│       │       ├── taxonomy.ts  ← Classification domain
│       │       ├── catalog.ts   ← Product & variant domain
│       │       ├── finance.ts   ← Financial domain
│       │       ├── supply.ts    ← Supply chain domain
│       │       ├── order.ts     ← Order management domain
│       │       ├── production.ts ← Production domain
│       │       ├── marketing.ts ← Marketing & CRM domain
│       │       └── index.ts     ← Barrel — re-exports all tables and relations
│       │
│       ├── email/               ← Resend client + react-email templates
│       ├── inngest/             ← Inngest client + event/function definitions
│       ├── redis/               ← Upstash Redis client
│       ├── storage/             ← UploadThing file router
│       └── utils/               ← Pure utility functions (money, date, id, etc.)
```

---

## Drizzle Schema Conventions

### File skeleton

```ts
// src/lib/db/schema/example.ts
import {
  pgTable, pgEnum, text, numeric, boolean, integer,
  jsonb, timestamp, index, uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { organizations } from './org';

// ── 1. Enums ────────────────────────────────────────────────────────────────
export const exampleStatusEnum = pgEnum('example_status', ['active', 'inactive']);

// ── 2. Table ─────────────────────────────────────────────────────────────────
export const examples = pgTable('examples', {
  // IDs
  id:             text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id')
                    .notNull()
                    .references(() => organizations.id, { onDelete: 'cascade' }),

  // Data fields
  name:     text('name').notNull(),
  price:    numeric('price', { precision: 15, scale: 2 }).default('0').notNull(),
  status:   exampleStatusEnum('status').default('active').notNull(),
  enabled:  boolean('enabled').default(true).notNull(),
  metadata: jsonb('metadata'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
               .defaultNow()
               .$onUpdateFn(() => new Date())
               .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (t) => [
  index('examples_org_idx').on(t.organizationId),
  index('examples_status_idx').on(t.status),
]);

// ── 3. Relations ──────────────────────────────────────────────────────────────
export const examplesRelations = relations(examples, ({ one }) => ({
  organization: one(organizations, {
    fields: [examples.organizationId],
    references: [organizations.id],
  }),
}));

// ── 4. Types ─────────────────────────────────────────────────────────────────
export type Example    = typeof examples.$inferSelect;
export type NewExample = typeof examples.$inferInsert;
```

### Column type reference

| Data | Drizzle type | Notes |
|------|-------------|-------|
| Primary key | `text('id').primaryKey().$defaultFn(() => createId())` | Always cuid2 |
| Foreign key string | `text('..._id').references(() => table.id, { onDelete: 'cascade' })` | |
| Money / price | `numeric('price', { precision: 15, scale: 2 })` | Never float |
| Rate / percentage | `numeric('rate', { precision: 5, scale: 2 })` | e.g. 12.00 for 12% |
| Coordinates | `numeric('lat', { precision: 9, scale: 6 })` | |
| Weight/dimension | `numeric('weight', { precision: 15, scale: 2 })` | |
| Timestamp with TZ | `timestamp('...', { withTimezone: true })` | All timestamps |
| Date only | `date('date')` | Invoice due date, expense date |
| JSON blob | `jsonb('metadata')` | Use for shapeless config, snapshots |
| Enum field | `myEnum('column_name')` | After defining `pgEnum` |
| Counter | `integer('count').default(0).notNull()` | |
| Long text | `text('content')` | No varchar limits in Postgres |
| Short constrained | `varchar('code', { length: 255 })` | Codes, slugs, phone numbers |

### `onDelete` reference policy

| Relationship | Policy | Rationale |
|-------------|--------|-----------|
| Child → parent org | `cascade` | Deleting org purges all its data |
| Item → parent document | `cascade` | e.g. OrderItem → Order |
| Reference to master data | `restrict` | Never auto-delete variants, payment methods |
| Optional reference | `setNull` | e.g. Order → Promotion (optional) |
| Supplier catalog | `setNull` | Costlist survives supplier deletion |

### Index rules

- Index every FK column.
- Index `status`, `type`, `enabled` on large tables (orders, payments, inventory_movements).
- Composite unique index for natural business keys: `[organizationId, slug]`, `[organizationId, code]`, `[organizationId, orderNumber]`.

---

## tRPC Conventions

### Procedure types

Define in `src/lib/api/trpc/index.ts`:

| Procedure | Auth | Org | Branch | Use for |
|-----------|------|-----|--------|---------|
| `publicProcedure` | ❌ | ❌ | ❌ | Public storefront reads |
| `protectedProcedure` | ✅ | ❌ | ❌ | User-specific actions |
| `orgProcedure` | ✅ | ✅ | ❌ | All ERP operations |
| `branchProcedure` | ✅ | ✅ | ✅ | POS, inventory, fulfillment |

Context shape (available as `ctx`):

```ts
type Context = {
  session: Session | null;
  user:    User    | null;
  orgId:   string  | null;   // activeOrganizationId
  branchId: string | null;   // from session.metadata.active_branch_id
  db:      DrizzleDB;
  redis:   Redis;
};
```

### Router file skeleton

```ts
// src/lib/api/routers/catalog.ts
import { z } from 'zod/v4';
import { eq, and, desc, ilike } from 'drizzle-orm';
import { createTRPCRouter, orgProcedure } from '../trpc';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema/catalog';
import { paginationSchema } from '@/lib/db/validations/pagination';

export const catalogRouter = createTRPCRouter({

  list: orgProcedure
    .input(paginationSchema.extend({
      search: z.string().optional(),
      status: productStatusEnum.optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status } = input;

      const conditions = [eq(products.organizationId, ctx.orgId!)];
      if (search) conditions.push(ilike(products.name, `%${search}%`));
      if (status) conditions.push(eq(products.status, status));

      const [rows, [{ count }]] = await Promise.all([
        db.select().from(products)
          .where(and(...conditions))
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: count() }).from(products)
          .where(and(...conditions)),
      ]);

      return { items: rows, total: Number(count), page, limit };
    }),

  create: orgProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      const [product] = await db.insert(products)
        .values({ ...input, organizationId: ctx.orgId! })
        .returning();
      return product;
    }),
});
```

### Naming conventions

| Operation | Procedure name |
|-----------|---------------|
| List with pagination | `list` |
| Get by ID | `byId` |
| Create | `create` |
| Update | `update` |
| Delete (soft) | `delete` |
| Status change | `setStatus` |
| Bulk ops | `bulkDelete`, `bulkUpdate` |

### Router registration

Always register in `src/lib/api/index.ts`:

```ts
export const appRouter = createTRPCRouter({
  users:       usersRouter,
  orgs:        orgsRouter,
  branches:    branchesRouter,
  taxonomy:    taxonomyRouter,
  catalog:     catalogRouter,
  // ... all domain routers
});
```

---

## Better Auth Conventions

### Session reading (server)

```ts
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect('/sign-in');

const orgId = session.session.activeOrganizationId;
```

### Session reading (client)

```ts
import { authClient } from '@/lib/auth/client';

const { data: session } = authClient.useSession();
```

### Permission check

```ts
import { auth } from '@/lib/auth';

const hasPermission = await auth.api.hasPermission({
  headers: await headers(),
  body: { permission: { orders: ['create'] } },
});
```

### Role hierarchy

Custom roles are defined in `OrganizationRole` table. System roles:

| Role | Permissions |
|------|------------|
| `owner` | All permissions |
| `admin` | Most permissions; cannot manage billing |
| `manager` | Operational — orders, production, inventory |
| `cashier` | POS only — create orders, process payments |
| `staff` | View-only + production task updates |

---

## Domain Reference

Quick lookup for all models across 10 domains.

### auth

| Model | Key columns | Notes |
|-------|-------------|-------|
| `users` | `id`, `email`, `role`, `status` | Better Auth managed |
| `sessions` | `userId`, `activeOrganizationId`, `metadata.active_branch_id` | Branch stored in metadata |
| `accounts` | `userId`, `providerId` | OAuth accounts |
| `apikeys` | `referenceId` (polymorphic), `key` | Per-org API access |

### org

| Model | Key columns | Notes |
|-------|-------------|-------|
| `organizations` | `id`, `slug`, `status` | Tenant root |
| `organization_roles` | `organizationId`, `role`, `permission` | permission = JSON string for Better Auth |
| `members` | `organizationId`, `userId`, `role` | role = string matching `organization_roles.role` |
| `branches` | `organizationId`, `name`, `status` | Physical locations |
| `customers` | `organizationId`, `userId?` | Linked user or walk-in |
| `suppliers` | `organizationId` | Raw material vendors |

### core

| Model | Key columns | Notes |
|-------|-------------|-------|
| `audit_logs` | `organizationId`, `actorId`, `action`, `targetId` | Append-only; no updates |
| `files` | `organizationId`, `providerId`, `url`, `mime` | All UploadThing uploads |
| `addresses` | Multiple nullable FK owners | Polymorphic address |
| `sequences` | `organizationId`, `branchId?`, `name` | Auto-number generator (INV-0001) |
| `settings` | `organizationId`, `category`, `key`, `value` | Key-value config store |

### taxonomy

| Model | Key columns | Notes |
|-------|-------------|-------|
| `tags` | `organizationId`, `slug` | Free-form labels |
| `attributes` | `organizationId`, `slug`, `type` | Variant dimensions (ukuran, warna) |
| `attribute_options` | `attributeId`, `value`, `price`, `cost` | Selectable values per attribute |
| `categories` | `organizationId`, `parentId?`, `slug` | Nested tree |
| `collections` | `organizationId`, `slug`, `rules?` | Manual or rule-based groupings |
| `units` | `organizationId`, `code`, `rate` | Unit of measure (pcs, kg, rol) |

### catalog

| Model | Key columns | Notes |
|-------|-------------|-------|
| `products` | `organizationId`, `slug`, `type`, `status` | `type`: good / service / blank / material / digital |
| `variants` | `productId`, `sku`, `price`, `costPrice` | Base variant has `baseVariantId = null` |
| `design_areas` | `productId`, `variantId?`, `name`, `x/y/width/height` | Print zones on the product |
| `product_designs` | `areaId`, `fileId?` | Template designs for an area |
| `pricelists` | `organizationId`, `orderChannelId?` | Sales price overrides |
| `costlists` | `organizationId`, `supplierId?` | Supplier cost overrides |

### finance

| Model | Key columns | Notes |
|-------|-------------|-------|
| `tax_rates` | `organizationId`, `rate` | PPN 12% etc |
| `payment_methods` | `organizationId`, `type`, `currentBalance` | Cash drawer, QRIS, bank accounts |
| `invoices` | `organizationId`, `orderId?`, `status` | AR — customer receivable |
| `supplier_bills` | `organizationId`, `purchaseOrderId?`, `status` | AP — supplier payable |
| `expenses` | `organizationId`, `categoryId`, `amount`, `date` | OPEX |
| `payments` | `organizationId`, `paymentMethodId`, `type` | Central cashbook ledger |

### supply

| Model | Key columns | Notes |
|-------|-------------|-------|
| `couriers` | `organizationId`, `code` | JNE, SICEPAT, etc. |
| `shipping_methods` | `courierId`, `code` | JNE REG, JNE OKE, etc. |
| `shipping_rates` | `shippingMethodId`, `originCode`, `destinationCode` | Zone-based rates |
| `purchase_orders` | `organizationId`, `supplierId`, `branchId`, `status` | Kulakan |
| `inventories` | `branchId`, `variantId`, `available`, `reserved` | Real-time stock per branch |
| `inventory_movements` | `branchId`, `variantId`, `type`, `quantity` | Immutable ledger |
| `inventory_transfers` | `sourceBranchId`, `destinationBranchId` | Surat jalan antarcabang |

### order

| Model | Key columns | Notes |
|-------|-------------|-------|
| `order_channels` | `organizationId`, `code` | Tokopedia, Shopee, POS, web |
| `order_sessions` | `branchId`, `memberId`, `status` | POS cash register session |
| `orders` | `organizationId`, `orderNumber`, `status`, `paymentStatus`, `fulfillmentStatus` | `shippingAddress` stored as JSON snapshot |
| `order_items` | `orderId`, `variantId`, `quantity`, `unitPrice` | |
| `order_item_designs` | `orderItemId`, `designAreaId`, `fileId?` | Customer design per print zone |
| `fulfillments` | `orderId`, `branchId`, `trackingNumber` | Partial fulfillment supported |
| `order_returns` | `orderId`, `branchId`, `status` | Retur barang |

### production

| Model | Key columns | Notes |
|-------|-------------|-------|
| `bill_of_materials` | `organizationId`, `variantId`, `code` | BOM / resep produksi |
| `bom_items` | `bomId`, `variantId`, `quantity`, `unitId` | Materials needed |
| `production_orders` | `organizationId`, `orderId?`, `supplierId?`, `status`, `priority` | Links to sales order or makloon supplier |
| `production_order_items` | `productionOrderId`, `variantId`, `orderItemId?` | What to produce |
| `production_tasks` | `productionOrderId`, `assigneeId?`, `status`, `sequence` | Step-by-step work tasks |

### marketing

| Model | Key columns | Notes |
|-------|-------------|-------|
| `promotions` | `organizationId`, `type`, `target`, `value` | Discount engine |
| `vouchers` | `promotionId`, `code` | 1 promotion → N voucher codes |
| `promotion_usages` | `customerId`, `promotionId?`, `voucherId?`, `orderId` | Usage + reservation tracking |
| `banners` | `organizationId`, `position`, `fileId` | Hero, popup, sidebar |
| `reviews` | `organizationId`, `productId?`, `orderItemId?` | Verified purchase flag |
| `posts` | `organizationId`, `slug`, `status` | Blog / article CMS |
| `tickets` | `organizationId`, `customerId?`, `orderId?`, `status` | Help desk |

---

## UI & Component Conventions

- **Component location:** Feature-specific components in `src/features/{admin|main}/{domain}/components/`. Shared primitives in `src/components/ui/` (shadcn — do not edit generated files).
- **Data tables:** Always use TanStack Table v8 via `src/components/ui/table.tsx`. Column definitions typed with `ColumnDef<T>`.
- **Forms:** Complex forms use `TanStack Form 1.32` + `src/components/forms/form-base.tsx`. Simple 1-2 field forms may use `react-hook-form` if already present, but prefer TanStack Form for new code.
- **Mutations:** All mutations via `trpc.router.procedure.useMutation()` + Sonner toast for feedback.
- **Server Components:** Default to RSC. Use `"use client"` only for interactivity (forms, modals, real-time). Never put `'use client'` in layout files.
- **Loading states:** Every data-fetching page gets a `loading.tsx` sibling using `<Skeleton>`.
- **Error states:** Every data-fetching page gets an `error.tsx` sibling.
- **Modals:** Use shadcn `<Dialog>` for desktop, Vaul `<Drawer>` for mobile (detect via `useIsMobile()`).
- **Icons:** Tabler Icons only (`@tabler/icons-react`). Stroke style, no solid.

---

## File & Asset Conventions

All file records are centralized in the `files` table:

1. Client uploads via UploadThing → receives `url` + `key`
2. Create `File` record via `trpc.files.create` with `{ url, name, size, mime, providerId: 'uploadthing', organizationId }`
3. Link `fileId` to the entity (ProductImage, DesignArea, etc.)
4. Never store raw URLs directly on entity tables — always via `fileId` FK

---

## Inngest Workflow Conventions

Event naming: `antifocus/{domain}/{event_name}` e.g. `antifocus/order/confirmed`

```ts
// src/lib/inngest/production.ts
import { inngest } from './index';
import { db } from '@/lib/db';

export const handleOrderConfirmed = inngest.createFunction(
  { id: 'create-production-order', name: 'Create Production Order on Confirm' },
  { event: 'antifocus/order/confirmed' },
  async ({ event, step }) => {
    const { orderId, organizationId } = event.data;

    await step.run('create-production-order', async () => {
      // ... db operations
    });

    await step.sendEvent('notify-staff', {
      name: 'antifocus/production/order-created',
      data: { /* ... */ },
    });
  },
);
```

---

## Monetary Arithmetic

Never add or multiply raw numbers for money. Always use `dinero.js`:

```ts
import { createDinero, toDecimal } from '@/lib/utils/money';

// From DB numeric string
const price  = createDinero(item.unitPrice);   // "15000.00" → Dinero
const qty    = Dinero({ amount: 2, currency: IDR });
const total  = multiply(price, 2);
const dbVal  = toDecimal(total);               // "30000.00" → store in DB
```

The utility at `src/lib/utils/money.ts` wraps dinero.js with IDR defaults.

---

## ❌ HARD RULES — NEVER DO

| Never | Why |
|-------|-----|
| `import { PrismaClient }` or run `prisma generate` | Prisma is not in the stack |
| `crypto.randomUUID()` or `uuidv4()` for record IDs | Use `createId()` (cuid2) |
| `parseFloat()` or JS arithmetic on monetary strings | Use dinero.js |
| Bare `fetch('/api/...')` for data | Use tRPC client |
| Raw SQL strings (`db.execute(sql\`...\`)`) for app queries | Use Drizzle query builder |
| `console.log` in committed code | Use Sentry for errors |
| Hardcoded organisation IDs or branch IDs | Always read from `ctx` |
| `onDelete: 'cascade'` on `Variant → Order` or production chains | Orders must survive variant changes |
| Cross-tenant queries (no `organizationId` filter) | Data isolation is non-negotiable |
| Modifying `src/components/ui/*.tsx` generated files | Run `pnpm ui:generate` to upgrade |
| `"use client"` on layout files | Breaks RSC streaming |
| `z.any()` or `z.unknown()` in tRPC input schemas | Always define the shape |
| Storing design file contents in DB | Store in UploadThing; DB holds `url` only |
