# PLANS.md — Antifocus MVP Build Guide

> Agent-executable build roadmap. Complete tasks in order — later phases depend on earlier ones.
> Cross-reference `AGENTS.md` for all coding conventions before executing any task.

---

## Current Build Status

| Area | Status | Notes |
|------|--------|-------|
| Auth UI (sign-in, sign-up) | ✅ Done | Pages, forms, Better Auth wired |
| Better Auth configuration | ✅ Done | Plugins, permissions, hooks |
| tRPC scaffold | ✅ Done | Context, handler, basic routers (orgs, users) |
| UI components (shadcn) | ✅ Done | Full component set installed |
| Email templates | ✅ Done | OTP, invite, verify, reset |
| i18n setup | ✅ Done | next-intl, ID + EN message files |
| Inngest / Redis / UploadThing clients | ✅ Done | Client instances wired |
| Utility functions | ✅ Done | money, date, id, error, etc. |
| DB schema: auth + org | ✅ Done | `auth.ts`, `org.ts` in Drizzle |
| DB schema: core / taxonomy / catalog | ✅ Done | Tasks T-01, T-02 |
| DB schema: finance / supply / order | ✅ Done | Tasks T-01, T-02, T-03 |
| DB schema: production / marketing | ✅ Done | Task T-03 |
| Domain tRPC routers | ❌ Needed | Tasks T-05 through T-24 |
| Admin ERP pages | ❌ Needed | Tasks T-25 through T-28 |
| Storefront pages | ❌ Needed | Tasks T-29 through T-30 |

---

## Build Strategy

- Execute phases in order. Never skip a phase.
- Each task is a discrete, committable unit of work.
- Reference the relevant `.prisma` blueprint file in `TASK RULES` — it defines the intended model shape.
- The `.prisma` files are read-only documentation. Write Drizzle schema; never run Prisma.
- After T-03, run `pnpm db:push` once to sync the full schema.
- tRPC routers and admin UI can be built in parallel after T-06.

---

## Task Format

Each task uses this structure:

```
### T-XX: Title
Goal      — One sentence description
Depends   — Must be complete first
Creates   — New files
Modifies  — Existing files
Rules     — Task-specific constraints
Done when — Acceptance criteria
```

---

## Phase 0 — Database Schema Foundation

> Convert remaining 8 Prisma blueprints to Drizzle. Output: full type-safe DB layer.

---

### T-01: Drizzle Schema — Core · Taxonomy · Finance

**Goal:** Create Drizzle schema files for three domains: core utilities, classification taxonomy, and finance.

**Depends on:** `auth.ts` and `org.ts` already done.

**Creates:**
- `src/lib/db/schema/core.ts`
- `src/lib/db/schema/taxonomy.ts`
- `src/lib/db/schema/finance.ts`

**Modifies:**
- `src/lib/db/schema/index.ts` — add exports for new files

**Rules:**
- Source blueprints: `core.prisma`, `taxonomy.prisma`, `finance.prisma`
- `core.ts`: models `audit_logs`, `files`, `addresses`, `sequences`, `settings`, `integrations`, `webhooks`, `notifications`. Import `organizations`, `members`, `branches`, `customers`, `suppliers` for FK refs.
- `taxonomy.ts`: models `tags`, `attributes`, `attribute_options`, `categories` (self-referential via `parentId`), `category_images`, `category_attributes`, `collections`, `collection_images`, `units` (self-referential via `baseUnitId`). `TaxRate` model goes in `finance.ts`, not here.
- `finance.ts`: models `tax_rates`, `payment_methods`, `invoices`, `supplier_bills`, `expense_categories`, `expenses`, `payments`. All monetary columns use `numeric(15,2)`.
- All enums from these blueprints (`AddressType`, `AttributeType`, `PaymentMethodType`, `FeeType`, `PaymentType`, `PaymentStatus`, `InvoiceStatus`, `BillStatus`) become `pgEnum`.
- Export `type X = typeof table.$inferSelect` and `type NewX = typeof table.$inferInsert` for every table.
- Address has multiple nullable FK owners (`userId?`, `organizationId?`, `memberId?`, `branchId?`, `customerId?`, `supplierId?`). All use `onDelete: 'setNull'` except `organizationId` → `cascade`.

**Done when:** `pnpm check:types` passes; all tables importable from `@/lib/db/schema`.

---

### T-02: Drizzle Schema — Catalog · Supply

**Goal:** Create Drizzle schema for product catalog and supply chain domains.

**Depends on:** T-01

**Creates:**
- `src/lib/db/schema/catalog.ts`
- `src/lib/db/schema/supply.ts`

**Modifies:**
- `src/lib/db/schema/index.ts`

**Rules:**
- Source blueprints: `catalog.prisma`, `supply.prisma`
- `catalog.ts` models: `products`, `product_images`, `product_tags`, `product_categories`, `product_attributes`, `product_collections`, `variants`, `variant_images`, `variant_options`, `design_areas`, `product_designs`, `pricelists`, `pricelist_items`, `costlists`, `costlist_items`.
- `DesignArea` in blueprint uses `@default(uuid())` — **override this to `createId()`** (cuid2) for consistency.
- `Variant.baseVariantId` is a self-referential FK (`onDelete: 'restrict'`). A base variant has `baseVariantId = null`.
- `Costlist.supplierId` → `onDelete: 'setNull'` (not cascade — blueprint has a bug here; supplierless costlist is valid).
- `supply.ts` models: `couriers`, `shipping_methods`, `shipping_rates`, `purchase_orders`, `purchase_order_items`, `inventories`, `inventory_movements`, `inventory_transfers`, `inventory_transfer_items`.
- `InventoryMovement` has 7 nullable polymorphic source FKs (`purchaseOrderItemId`, `orderItemId`, `productionOrderItemId`, etc.) — all `onDelete: 'setNull'`.
- `Inventory` has a `@@unique([branchId, variantId])` — map to `uniqueIndex('inventories_branch_variant_idx', [t.branchId, t.variantId])`.
- `InventoryTransfer` has two named FK relations to `branches` — use Drizzle named relations: `sourceBranch` and `destinationBranch`.
- Enums: `ProductStatus`, `ProductType`, `DesignStatus`, `PurchaseOrderStatus`, `PurchasePaymentStatus`, `InventoryMovementType`, `InventoryTransferStatus`.

**Done when:** `pnpm check:types` passes; no circular import errors.

---

### T-03: Drizzle Schema — Order · Production · Marketing → DB Push

**Goal:** Complete the schema with the final three domains, then push the full schema to Neon.

**Depends on:** T-02

**Creates:**
- `src/lib/db/schema/order.ts`
- `src/lib/db/schema/production.ts`
- `src/lib/db/schema/marketing.ts`

**Modifies:**
- `src/lib/db/schema/index.ts` — final full barrel export
- `drizzle.config.ts` — verify schema glob covers all domain files

**Rules:**
- Source blueprints: `order.prisma`, `production.prisma`, `marketing.prisma`
- `order.ts` models: `order_channels`, `order_sessions`, `orders`, `order_items`, `order_item_designs`, `fulfillments`, `fulfillment_items`, `order_returns`, `order_return_items`.
- `Order` has `customerId` index but **no Prisma relation defined** — add a proper Drizzle relation to `customers`. The `Order.customerId` uses `onDelete: 'setNull'` (customer deletion should not kill orders).
- `Order.shippingAddress`, `Order.billingAddress`, `Order.shippingRate` are `jsonb` snapshot columns — typed with generic `jsonb('...')`.
- `production.ts` models: `bill_of_materials`, `bom_items`, `production_orders`, `production_order_items`, `production_tasks`.
- `ProductionOrder.onDelete` for `orderId`: use `cascade` (production order is child of sales order).
- `ProductionTask.productionOrderItemId` → `onDelete: 'cascade'` (blueprint has this; task is meaningless without its item).
- `marketing.ts` models: `promotions`, `vouchers`, `promotion_products`, `promotion_collections`, `promotion_usages`, `banners`, `reviews`, `review_images`, `post_categories`, `posts`, `tickets`, `ticket_messages`.
- `Ticket.orderItemId` — in the blueprint this relation is awkwardly placed at the bottom; ensure it is declared as a proper column and FK inside the main table definition.
- Enums: `OrderSessionStatus`, `OrderStatus`, `OrderPaymentStatus`, `OrderFulfillmentStatus`, `FulfillmentStatus`, `OrderReturnStatus`, `ProductionOrderStatus`, `ProductionTaskStatus`, `ProductionPriority`, `PromotionType`, `PromotionTarget`, `PromotionUsageStatus`, `BannerPosition`, `ReviewStatus`, `PostStatus`, `TicketChannel`, `TicketPriority`, `TicketStatus`, `MessageSender`.
- After creating all files: run `pnpm db:push`.

**Done when:** `pnpm db:push` succeeds; `pnpm db:studio` shows all 60+ tables; `pnpm check:types` passes.

---

## Phase 1 — tRPC Infrastructure

> Build the middleware stack and shared procedure types before any domain routers.

---

### T-04: tRPC Middleware Stack

**Goal:** Implement `protectedProcedure`, `orgProcedure`, and `branchProcedure` with full context enrichment.

**Depends on:** T-01 (org schema needed for context)

**Modifies:**
- `src/lib/api/trpc/context.ts` — add `orgId`, `branchId`, `member` to context
- `src/lib/api/trpc/index.ts` — export all four procedure types

**Rules:**
- `protectedProcedure`: throw `UNAUTHORIZED` if `ctx.session` is null.
- `orgProcedure`: extend `protectedProcedure`; read `activeOrganizationId` from session. Verify the member record exists and is `active`. Throw `FORBIDDEN` if not. Attach `ctx.orgId`, `ctx.member` to context.
- `branchProcedure`: extend `orgProcedure`; read `branchId` from `session.metadata.active_branch_id`. Verify branch belongs to org. Attach `ctx.branchId`.
- Context must also expose `ctx.db` (Drizzle) and `ctx.redis` (Upstash).
- Keep an `auditLog` helper in context: `ctx.audit(action, targetName, targetId)` — inserts to `audit_logs` table.

**Done when:** All four procedure types exported; `pnpm check:types` passes.

---

### T-05: Core tRPC Routers — Settings · Sequences · Files · Notifications

**Goal:** Implement tRPC routers for core utilities.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/settings.ts`
- `src/lib/api/routers/sequences.ts`
- `src/lib/api/routers/files.ts`
- `src/lib/api/routers/notifications.ts`

**Modifies:**
- `src/lib/api/index.ts` — register all four routers

**Rules:**
- `settings`: procedures `get(category, key)`, `set(category, key, value)`, `list(category)` — org-scoped.
- `sequences`: `next(name)` — atomically increments `current` and returns the formatted number string (e.g. `INV-0042`). Use a DB transaction + `SELECT ... FOR UPDATE`.
- `files`: `create(url, name, size, mime, providerId)` — creates a `File` record. `delete(id)` — soft-delete the file record (does not delete from UploadThing; that is handled separately). `list` with pagination.
- `notifications`: `list` (paginated, unread first), `markRead(id)`, `markAllRead`.

**Done when:** All procedures callable from a tRPC client; type-safe.

---

### T-06: Org tRPC Routers — Orgs · Branches · Members · Customers · Suppliers

**Goal:** Full CRUD tRPC coverage for the organisational layer.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/branches.ts`
- `src/lib/api/routers/customers.ts`
- `src/lib/api/routers/suppliers.ts`

**Modifies:**
- `src/lib/api/routers/orgs.ts` — expand with full CRUD + settings
- `src/lib/api/routers/users.ts` — expand with member role management
- `src/lib/api/index.ts` — register all new routers

**Rules:**
- All routers are `orgProcedure`-gated.
- `orgs`: `update` (name, logo, metadata), `getSettings`, `updateSettings`.
- `branches`: `list`, `create`, `update`, `setStatus`, `delete` (soft). Include `addresses` sub-procedures.
- `users` / `members`: `list` (with `role` filter), `invite` (creates `Invitation` via Better Auth), `setRole`, `remove` (sets `deletedAt`).
- `customers`: `list` (search by name/phone/email), `create`, `update`, `delete` (soft). A customer can be linked to a `User` via `userId` — link/unlink procedures.
- `suppliers`: `list`, `create`, `update`, `delete` (soft). Include `addresses` sub-procedures.

**Done when:** All procedures typed; existing `orgs.ts` and `users.ts` still compile after modification.

---

## Phase 2 — Taxonomy & Catalog

---

### T-07: Taxonomy tRPC Routers

**Goal:** CRUD routers for all classification entities.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/taxonomy.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- Procedures: `tags.list/create/update/delete`, `attributes.list/create/update/delete`, `attributes.addOption/updateOption/removeOption`, `categories.tree` (recursive fetch), `categories.list/create/update/delete`, `collections.list/create/update/delete`, `units.list/create/update/delete`, `taxRates.list/create/update/delete`.
- `categories.tree` returns a nested structure (parent → children). Fetch flat, build tree in application layer (not recursive SQL).
- `attributes.addOption` increments `position` automatically.
- Soft-delete via `deletedAt` for `categories` only. Others: hard delete pivot table rows first, then the record.

**Done when:** All procedures typed and registered.

---

### T-08: Catalog tRPC Routers — Products · Variants

**Goal:** Full product and variant management.

**Depends on:** T-07

**Creates:**
- `src/lib/api/routers/catalog.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `products`: `list` (search, status filter, category filter, pagination), `byId` (with variants, images, categories, attributes), `create`, `update`, `setStatus`, `delete` (soft).
- `products.setStatus` transitions: `draft → live`, `live → discontinued`, `* → archived`.
- `variants`: `list(productId)`, `create`, `update`, `delete` (soft). Variant `sku` must be unique per org — validate on create/update.
- `variants.generateMatrix(productId, selectedAttributeIds)` — creates all combination variants from selected attribute options. Use a Cartesian product algorithm. Returns created variant IDs.
- `productImages`: `add(productId, fileId)`, `setMain(imageId)`, `remove(imageId)`, `reorder(imageIds[])`.
- Pricing: `variants.updatePricing(variantId, { price, costPrice, compareAtPrice })`.
- All monetary inputs validated as `z.string().regex(/^\d+(\.\d{1,2})?$/)`.

**Done when:** Product creation with variants and images works end-to-end.

---

### T-09: Catalog tRPC Routers — Designs · Pricelists · Costlists

**Goal:** Design zone management and pricing catalogue.

**Depends on:** T-08

**Modifies:**
- `src/lib/api/routers/catalog.ts` — append new procedures

**Rules:**
- `designAreas`: `list(productId)`, `create(productId, { name, x, y, width, height, price, cost })`, `update`, `delete`. Areas can be product-level or variant-level.
- `productDesigns`: `list(areaId)`, `create(areaId, { fileId, name, placement })`, `delete`.
- `pricelists`: `list`, `create`, `update`, `delete`. `pricelistItems`: `set(pricelistId, variantId, { price, minQuantity })`, `remove(pricelistId, variantId)`, `bulkSet(pricelistId, items[])`.
- `costlists`: same structure as pricelists but with `costPrice` field. Linked to supplier.
- Pricelist effective date validation: `startDate < endDate` if both provided.

**Done when:** All procedures typed and registered.

---

### T-10: File Upload Integration

**Goal:** Wire UploadThing to the `files` table so all uploads create a centralised `File` record.

**Depends on:** T-05

**Modifies:**
- `src/lib/storage/uploadthing.ts` — add file router endpoints
- `src/lib/api/routers/files.ts` — `createFromUpload` procedure

**Rules:**
- UploadThing endpoints: `productImage`, `variantImage`, `designFile`, `orderDesignFile`, `reviewImage`, `postCover`, `receiptFile`, `avatarImage`.
- Each endpoint calls `trpc.files.createFromUpload` after upload succeeds (use `onUploadComplete`).
- Max sizes: `productImage` 5 MB, `designFile` 20 MB, `orderDesignFile` 50 MB.
- Accepted MIME types per endpoint — `productImage` accepts `image/*`; `designFile` accepts `image/*, application/pdf, image/svg+xml`.
- `createFromUpload` input: `{ key, url, name, size, mime, providerId: 'uploadthing', organizationId }`.

**Done when:** Uploading a product image creates a `files` row; `fileId` can be linked to `product_images`.

---

## Phase 3 — Supply Chain

---

### T-11: Shipping tRPC Routers

**Goal:** Courier, shipping method, and rate management.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/shipping.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `couriers`: `list`, `create`, `update`, `delete` (soft).
- `shippingMethods`: `list(courierId)`, `create`, `update`, `delete` (soft).
- `shippingRates`: `list(methodId)`, `create`, `update`, `delete`, `bulkUpsert(methodId, rates[])`.
- `calculateRate(methodId, originCode, destinationCode, weight)` — finds matching rate by weight range and zone codes. Returns `{ cost, price, estimatedDays }`. Used during order creation.
- Rate lookup priority: exact zone match → wildcard origin → wildcard destination → global rate.

**Done when:** `calculateRate` returns correct IDR cost for a known test route.

---

### T-12: Purchase Order tRPC Router

**Goal:** Full purchase order lifecycle (kulakan dari supplier).

**Depends on:** T-11

**Creates:**
- `src/lib/api/routers/purchase-orders.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- Procedures: `list` (filter by status, supplier, branch, date range), `byId` (with items), `create`, `addItem`, `removeItem`, `updateItem`, `submit` (draft → pending_approval), `approve`, `markOrdered`, `receive(id, receivedItems[{ itemId, receivedQty }])`, `cancel`.
- `receive`: update each `PurchaseOrderItem.receivedQuantity`; create `InventoryMovement` records with type `purchase_receipt` per item; update `Inventory.available` for the branch; trigger `SupplierBill` creation if not exists.
- Auto-generate `purchaseNumber` using `sequences.next('PO')`.
- `paymentStatus` auto-updates: if all bills paid → `paid`; any paid → `partial`.

**Done when:** Full receive flow creates inventory movements and updates stock.

---

### T-13: Inventory tRPC Routers

**Goal:** Real-time stock management, adjustments, and transfers.

**Depends on:** T-12

**Creates:**
- `src/lib/api/routers/inventory.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `inventory.get(branchId, variantId)` — returns stock levels.
- `inventory.listByBranch(branchId, { search, lowStock })` — list all variants with stock. `lowStock` filters where `available <= reorderPoint`.
- `inventory.adjust(branchId, variantId, quantity, type: 'adjustment_add' | 'adjustment_deduct', reason)` — creates `InventoryMovement` and updates `Inventory`. Use a DB transaction.
- `inventory.movements(branchId, variantId, pagination)` — movement ledger for a variant.
- `transfers.list`, `transfers.create`, `transfers.addItem`, `transfers.dispatch` (draft → in_transit; deducts source inventory), `transfers.receive(id, receivedItems[])` (in_transit → completed; adds destination inventory), `transfers.cancel`.
- Auto-generate `transferNumber` using `sequences.next('TR')`.
- All stock mutations run in a single DB transaction: movement insert + inventory update.

**Done when:** Transfer between branches correctly moves stock; movements ledger reflects each action.

---

## Phase 4 — Order Management

---

### T-14: Order Channel · POS Session tRPC Routers

**Goal:** Sales channel config and POS cash session management.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/order-channels.ts`
- `src/lib/api/routers/order-sessions.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `orderChannels`: `list`, `create`, `update`, `delete`. Codes: `POS`, `WEB`, `TOKOPEDIA`, `SHOPEE`, etc.
- `orderSessions`: `open(branchId, openingBalance)` — creates session with status `in_progress`, records `openedAt`. Only one active session per branch per member at a time. `close(id, actualBalance)` — sets `closingBalance`, `actualBalance`, `closedAt`, status `closed`. `current(branchId)` — returns the active session for a branch.
- `branchProcedure` required for session operations.

**Done when:** A POS session can be opened and closed with balance tracking.

---

### T-15: Order tRPC Router

**Goal:** Complete order lifecycle from creation to delivery.

**Depends on:** T-13, T-14

**Creates:**
- `src/lib/api/routers/orders.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `orders.create(input)`: calculate totals, create `Order` + `OrderItems`, reserve inventory (`Inventory.reserved += qty`), emit Inngest event `antifocus/order/created`. Auto-generate `orderNumber` via `sequences.next('ORD')`.
- Total calculation pipeline:
  1. `subtotal` = sum of `unitPrice * quantity`
  2. Apply promotion/voucher → `discountTotal`
  3. Apply tax from `TaxRate` → `taxTotal`
  4. Add `shippingCost` → `shippingTotal`
  5. `grandTotal` = `subtotal - discountTotal + taxTotal + shippingTotal`
- `orders.update`: only allowed when `status = pending`. Updates `shippingAddress`, items, etc.
- `orders.setStatus`: allowed transitions — `pending → confirmed → processing → ready_for_pickup → shipped → delivered`, `* → cancelled` (not delivered). Cancellation releases reserved inventory.
- `orders.list`: filter by status, paymentStatus, fulfillmentStatus, channel, branch, date range, search (orderNumber, customer name/phone).
- `orders.byId`: full detail with items, designs, fulfillments, invoices, production orders.
- `orders.applyPromotion(orderId, { code? | promotionId? })`: validate eligibility, reserve usage via `PromotionUsage` with status `reserved`, recalculate totals.
- `shippingAddress` and `billingAddress` stored as JSON snapshots on order creation — do NOT link FKs to address records.

**Done when:** Order create → confirm → ship status flow works; inventory reserved on create.

---

### T-16: Fulfillment · Returns tRPC Routers

**Goal:** Partial fulfillment and return management.

**Depends on:** T-15

**Creates:**
- `src/lib/api/routers/fulfillments.ts`
- `src/lib/api/routers/order-returns.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `fulfillments.create(orderId, branchId, items[{ orderItemId, quantity }], shippingMethodId?)`: creates `Fulfillment` + `FulfillmentItems`; deducts `Inventory.reserved` and creates `InventoryMovement` with type `sales_delivery`; updates `Order.fulfillmentStatus` (partial → fulfilled when all items covered).
- `fulfillments.ship(id, trackingNumber)`: sets `status = shipped`, `shippedAt`.
- `fulfillments.deliver(id)`: sets `status = delivered`, `deliveredAt`; updates `Order.status = delivered` if all fulfillments delivered.
- Auto-generate `fulfillmentNumber` via `sequences.next('FUL')`.
- `returns.create(orderId, branchId, items[{ orderItemId, quantity, condition }], reason)`: creates return; auto-generates `returnNumber`.
- `returns.receive(id, receivedItems[])`: updates received quantities; creates `InventoryMovement` with type `adjustment_add` for restocked items; triggers refund process (optional for MVP — stub as `// TODO: refund`).

**Done when:** Partial fulfillment correctly updates `Order.fulfillmentStatus`.

---

## Phase 5 — Production

---

### T-17: Bill of Materials tRPC Router

**Goal:** BOM (resep produksi) management.

**Depends on:** T-08

**Creates:**
- `src/lib/api/routers/bom.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `bom.list(variantId?)` — list all BOMs, optionally filtered by output variant.
- `bom.byId(id)` — with full item list (each item includes variant name, unit).
- `bom.create({ variantId, name, code?, instructions? })`.
- `bom.addItem(bomId, { variantId, quantity, unitId? })`.
- `bom.updateItem(itemId, { quantity, unitId? })`.
- `bom.removeItem(itemId)`.
- `bom.clone(bomId, newName)` — duplicates BOM and all its items.

**Done when:** A BOM for a "kaos polos" variant can be created with material items (kain, benang).

---

### T-18: Production Order + Task tRPC Router + Inngest Workflows

**Goal:** End-to-end production order management with automated workflows.

**Depends on:** T-17, T-15

**Creates:**
- `src/lib/api/routers/production.ts`
- `src/lib/inngest/production.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `production.orders.create(input)`: creates `ProductionOrder` + `ProductionOrderItems`; auto-generates `productionNumber` via `sequences.next('PRD')`; stores BOM snapshot at time of creation in `bomSnapshot`.
- `production.orders.list`: filter by status, priority, branch, date range.
- `production.orders.byId`: full detail with items and tasks.
- `production.tasks.list(productionOrderId)`: ordered by `sequence`.
- `production.tasks.updateStatus(taskId, status)`: `pending → in_progress → completed | qc_failed`. When all tasks completed, set `ProductionOrder.status = completed`; create `InventoryMovement` type `production_receipt` for finished goods.
- `production.tasks.assign(taskId, memberId)`.
- **Inngest — `antifocus/order/confirmed` handler** (`src/lib/inngest/production.ts`):
  1. Step: For each order item with `variantId` that has a BOM → create `ProductionOrder` linked to the order.
  2. Step: Create `ProductionOrderItems` from order items.
  3. Step: Auto-create standard `ProductionTasks` from BOM template (if defined in `Setting`).
  4. Step: Consume materials — create `InventoryMovement` type `production_consume` per BOM item.
- Register Inngest function in `src/lib/inngest/index.ts`.

**Done when:** Confirming an order automatically creates a production order via Inngest.

---

## Phase 6 — Finance

---

### T-19: Payment Method · Tax Rate tRPC Routers

**Goal:** Financial configuration setup.

**Depends on:** T-04

**Creates:**
- `src/lib/api/routers/payment-methods.ts`

**Modifies:**
- `src/lib/api/routers/taxonomy.ts` — `taxRates` procedures already stubbed; finalize them
- `src/lib/api/index.ts`

**Rules:**
- `paymentMethods.list(branchId?)`: scoped to org, optionally filtered by branch.
- `paymentMethods.create`: validate `code` uniqueness per org.
- `paymentMethods.updateBalance(id, amount)`: sets `currentBalance` + `balanceAt`.
- `paymentMethods.reconcile(id, reconcileBalance)`: sets `reconcileBalance` + `reconcileAt`.
- Cash drawer payment methods are `branchId`-scoped; digital payment methods are org-level.

**Done when:** Creating a payment method with type `cash` and `type = ewallet` works; both listed correctly.

---

### T-20: Invoice · Supplier Bill tRPC Routers

**Goal:** Accounts receivable (piutang) and accounts payable (hutang) management.

**Depends on:** T-15, T-12

**Creates:**
- `src/lib/api/routers/invoices.ts`
- `src/lib/api/routers/supplier-bills.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `invoices.create(orderId?, { subtotal, taxTotal, discountTotal, grandTotal, dueDate? })`: auto-generate `invoiceNumber` via `sequences.next('INV')`.
- `invoices.list`: filter by `status`, `orderId`, date range, `overdue` (where `dueDate < today` and status not `paid`).
- `invoices.markIssued(id)`, `invoices.markCancelled(id)`.
- Invoice status auto-updates to `paid` or `partially_paid` when payments are applied (handled in T-21).
- `supplierBills.create`, `supplierBills.list`, `supplierBills.markReceived`, `supplierBills.cancel` — mirror invoice structure.
- Auto-generate `billNumber` via `sequences.next('BILL')`.
- Invoices created automatically via Inngest when order status → `delivered` (stub Inngest handler in `antifocus/order/delivered`).

**Done when:** Invoice created for an order; status reflects `draft` → `issued`.

---

### T-21: Payment (Cashbook) · Expense tRPC Routers

**Goal:** Central cash ledger and OPEX expense tracking.

**Depends on:** T-19, T-20

**Creates:**
- `src/lib/api/routers/payments.ts`
- `src/lib/api/routers/expenses.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `payments.create({ paymentMethodId, type, amount, invoiceId? | supplierBillId? | expenseId?, reference? })`:
  - Insert `Payment` record.
  - Update `PaymentMethod.currentBalance` (inbound → +amount, outbound → -amount).
  - If `invoiceId`: update `Invoice.amountDue -= amount`; auto-update invoice status.
  - If `supplierBillId`: update `SupplierBill.amountDue -= amount`; auto-update bill status.
  - All in a single DB transaction.
- `payments.list`: filter by `type`, `paymentMethodId`, date range, `invoiceId`, `supplierBillId`.
- `payments.cashFlow(branchId?, dateFrom, dateTo)`: aggregate inbound vs outbound totals per payment method.
- `expenses.categories.list/create/update/delete`.
- `expenses.list`, `expenses.create`, `expenses.update`, `expenses.delete` (soft), `expenses.byCategory(categoryId, dateRange)`.
- Expense payment: `expenses.pay(expenseId, paymentMethodId)` — creates a `Payment` with `type = outbound`.

**Done when:** Paying an invoice creates a Payment; `Invoice.amountDue` decrements; `PaymentMethod.currentBalance` updates.

---

## Phase 7 — Marketing

---

### T-22: Promotion · Voucher tRPC Routers

**Goal:** Discount engine with voucher code support.

**Depends on:** T-08

**Creates:**
- `src/lib/api/routers/promotions.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `promotions.list`, `promotions.create`, `promotions.update`, `promotions.delete` (soft), `promotions.setEnabled`.
- `promotions.validate(input: { orderChannelId, customerId?, subtotal, promotionId? | code? })`: returns `{ valid, discount, message }`. Check: date range, enabled, usage limits, min order amount, customer usage count.
- `vouchers.list(promotionId)`, `vouchers.create(promotionId, code)`, `vouchers.bulkGenerate(promotionId, count)` — generates N unique codes.
- `PromotionUsage` lifecycle: `reserved` on cart application → `applied` on order confirm → `released` on order cancel.
- Promotion target types: `order` (discount on total), `product` (on specific products), `collection` (on collection items), `shipping` (free or reduced shipping).
- `buy_x_get_y` type: store logic in `metadata` JSON.

**Done when:** A `percentage` promotion with a code correctly calculates discount on an order.

---

### T-23: Banner · Review · Post tRPC Routers

**Goal:** Content management for storefront marketing.

**Depends on:** T-10

**Creates:**
- `src/lib/api/routers/marketing.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `banners.list(position?)`, `banners.create`, `banners.update`, `banners.delete` (soft), `banners.active(position)` — returns banners where `enabled = true` and within `startDate/endDate`.
- `reviews.list(productId?, branchId?, status?)`, `reviews.approve(id)`, `reviews.reject(id)`, `reviews.reply(id, replyText)`. Public procedure: `reviews.listPublic(productId)` — only `approved` reviews.
- `posts.list`, `posts.bySlug(slug)`, `posts.create`, `posts.update`, `posts.publish(id)`, `posts.archive(id)`.
- `postCategories.list/create/update/delete`.
- After a review is approved, update `Product.rating` and `Product.reviewCount` (recalculate aggregate).

**Done when:** Publishing a banner appears in `banners.active('hero')`; a published post retrievable by slug.

---

### T-24: Support Ticket tRPC Router

**Goal:** Help desk ticket and conversation management.

**Depends on:** T-06

**Creates:**
- `src/lib/api/routers/tickets.ts`

**Modifies:**
- `src/lib/api/index.ts`

**Rules:**
- `tickets.list(filter: { status, priority, assigneeId, channel, branchId })`, `tickets.byId(id)` (with messages).
- `tickets.create({ subject, description, customerId?, orderId?, channel, priority })`: auto-generate `ticketNumber` via `sequences.next('TKT')`.
- `tickets.assign(id, memberId)`.
- `tickets.setStatus(id, status)`: `open → in_progress → waiting_for_customer → resolved → closed`.
- `tickets.addMessage(ticketId, { content, fileId?, isInternal })`: `senderType` inferred from caller (member = `agent`; customer = `customer`).
- Public procedure: `tickets.createByCustomer(input)` — customers can open tickets from storefront.

**Done when:** A ticket can be created, assigned, messaged, and resolved.

---

## Phase 8 — ERP Admin UI

---

### T-25: Admin Shell — Layout · Sidebar · Navigation

**Goal:** Functional admin layout with collapsible sidebar, breadcrumbs, and header.

**Depends on:** T-06

**Modifies:**
- `src/app/[locale]/admin/layout.tsx` — add full sidebar layout

**Creates:**
- `src/features/admin/shell/components/sidebar.tsx`
- `src/features/admin/shell/components/header.tsx`
- `src/features/admin/shell/components/breadcrumbs.tsx`
- `src/features/admin/shell/components/nav-item.tsx`

**Rules:**
- Use shadcn `<Sidebar>` from `src/components/ui/sidebar.tsx`.
- Nav sections: **Dashboard**, **Pesanan** (Orders, Fulfillment, Return), **Produk** (Products, Variants, Designs), **Inventori**, **Produksi**, **Pembelian**, **Keuangan** (Invoices, Bills, Payments, Expenses), **Pemasaran**, **Pelanggan**, **Pengaturan**.
- Active branch switcher in header (reads/writes `session.metadata.active_branch_id` via `authClient.updateSession`).
- Organization name + logo in sidebar header.
- User avatar + dropdown (profile, logout) in header.
- Breadcrumbs auto-generated from current pathname.
- Mobile: sidebar collapses to icon rail; `useIsMobile()` hook controls sheet mode.

**Done when:** Admin layout renders with working sidebar navigation; branch switcher updates active branch.

---

### T-26: Admin Pages — Org · Taxonomy · Catalog

**Goal:** Data management pages for the foundational domains.

**Depends on:** T-07, T-08, T-09, T-25

**Creates:**
- `src/features/admin/org/` — org settings, branches, members, customers, suppliers pages
- `src/features/admin/taxonomy/` — categories, attributes, collections, units pages
- `src/features/admin/catalog/` — products list, product detail/edit, variants, design areas pages

**Rules:**
- Every list page uses TanStack Table with server-side pagination via `nuqs` (`page`, `limit`, `q` in URL).
- Every create/edit uses a sheet (`<Sheet>`) for simple forms; a full page for complex multi-step forms (product + variants + designs).
- Image uploads in product forms use UploadThing component, then `trpc.files.create`.
- `ProductStatus` badge colors: `draft` = gray, `live` = green, `discontinued` = yellow, `archived` = red.
- Category tree uses a collapsible tree component (`src/components/ui/collapsible.tsx`) not a flat table.
- Variant matrix generator: attribute selection → auto-generate button → shows preview of combinations → confirm creates variants.

**Done when:** A product with 3 variants and 2 design areas can be created end-to-end from the admin UI.

---

### T-27: Admin Pages — Orders · Fulfillment · Finance · Supply

**Goal:** Operational pages for order processing, finance, and supply chain.

**Depends on:** T-15, T-16, T-20, T-21, T-12, T-13, T-25

**Creates:**
- `src/features/admin/orders/` — order list, order detail, fulfillment, returns pages
- `src/features/admin/finance/` — invoices, bills, payments, expenses, cashbook pages
- `src/features/admin/supply/` — purchase orders, inventory, transfers, shipping pages

**Rules:**
- **Order detail page**: full timeline (status → payment → fulfillment), order items with design thumbnails, action buttons context-aware to status (Confirm, Create Fulfillment, Cancel).
- **Fulfillment form**: select unfulfilled items + quantities → assign shipping method → tracking number → ship.
- **Cashbook page**: date-range filtered transaction list; running balance per payment method; summary cards (inbound, outbound, net).
- **Inventory page**: branch-scoped table of variants with stock levels; stock adjustment form (with reason); low stock highlighted.
- **Purchase order**: full form with supplier select, item add/remove, submit → approve → receive flow.

**Done when:** An order can be confirmed, fulfillment created, and payment recorded from admin UI.

---

### T-28: Admin Pages — Production · Marketing · Settings

**Goal:** Complete the ERP with production and marketing management pages.

**Depends on:** T-18, T-22, T-23, T-24, T-25

**Creates:**
- `src/features/admin/production/` — BOM list/edit, production orders, kanban task board
- `src/features/admin/marketing/` — promotions, vouchers, banners, reviews, posts, tickets pages
- `src/features/admin/settings/` — org settings, payment methods, tax rates, order channels, couriers, integrations pages

**Rules:**
- **Production kanban**: columns = `pending`, `in_progress`, `completed`, `qc_failed`. Drag tasks between columns using dnd-kit. Updates `trpc.production.tasks.updateStatus`.
- **BOM editor**: table of material items; inline quantity editing; unit selector; save all.
- **Promotion form**: multi-step — type + value → target (products/collections/channel) → rules (min order, max uses, dates) → voucher codes.
- **Review moderation**: approve/reject with one click; reply form inline.
- **Ticket inbox**: list with unread badge; conversation thread view with `senderType` differentiated styling.
- **Settings pages**: each setting category on a separate tab within a single `/admin/settings` page.

**Done when:** Full production lifecycle manageable from kanban; promotions configurable; tickets answerable.

---

## Phase 9 — Storefront

---

### T-29: Storefront Public Pages — Home · Catalog · Product · Search

**Goal:** Customer-facing discovery and product browsing.

**Depends on:** T-08, T-23

**Creates:**
- `src/features/main/catalog/components/product-card.tsx`
- `src/features/main/catalog/components/product-grid.tsx`
- `src/features/main/catalog/components/filter-sidebar.tsx`
- `src/features/main/catalog/components/category-nav.tsx`
- `src/features/main/catalog/components/design-configurator.tsx`
- `src/app/[locale]/(public)/(home)/page.tsx` — hero + banners + featured collections
- `src/app/[locale]/(public)/products/page.tsx` — catalog with filters
- `src/app/[locale]/(public)/products/[slug]/page.tsx` — product detail + design configurator
- `src/app/[locale]/(public)/search/page.tsx` — search results

**Rules:**
- All pages are React Server Components; product data fetched server-side via `trpc.catalog.list` (called directly from server, not via client).
- Use `generateStaticParams` for product slugs where feasible.
- `design-configurator.tsx` (`"use client"`): lets customer select design area, upload their file (UploadThing), preview on product mockup image, adjust scale/position. Stores `{ designAreaId, fileId, placementX, placementY, scale }` in local state for cart.
- Search page: `q` param in URL via `nuqs`; search against `product.name` via `ilike`.
- Product card shows: main image, name, price range (min–max variant price), rating badge.
- Meta: `generateMetadata` with `seoTitle`, `seoDescription` per product.

**Done when:** A product page loads with variant picker and design configurator.

---

### T-30: Storefront — Cart · Checkout · Customer Account

**Goal:** Complete the purchase funnel and customer self-service area.

**Depends on:** T-15, T-22, T-29

**Creates:**
- `src/features/main/cart/` — cart context, cart drawer, cart item
- `src/features/main/checkout/` — multi-step checkout (address → shipping → payment → review)
- `src/app/[locale]/account/` — order history, order detail, profile, address book

**Rules:**
- **Cart:** Client-side state via `zustand` or React context. Cart is `{ items: [{ variantId, quantity, unitPrice, designs[], options[] }] }`. Persisted to `localStorage` for guests; synced to server session for logged-in users via Upstash Redis key `cart:{userId}`.
- **Checkout step 1 — Address:** select from saved addresses or enter new (saved to `addresses` table if logged in).
- **Checkout step 2 — Shipping:** call `trpc.shipping.calculateRate` for each available courier/method. Customer picks one.
- **Checkout step 3 — Promotion:** optional voucher code input → `trpc.promotions.validate`. Display calculated discount.
- **Checkout step 4 — Payment:** select from active payment methods. For `bank_transfer`/`ewallet`: show account info. For online gateway: redirect to Midtrans (stub for MVP).
- **Order creation:** on confirm, call `trpc.orders.create` with full payload (items, designs, shippingAddress snapshot, shippingMethod, paymentMethod, promotion). Redirect to `/account/order/{orderNumber}`.
- **Account pages:** Order list (status chips, tracking links); Order detail (timeline, items, totals); Profile (edit name, phone, email); Address book (CRUD).
- Guest checkout: allowed; prompt to create account after order.

**Done when:** A logged-in customer can browse → add to cart → checkout → receive order number → view order in account.

---

## Milestone Summary

| Milestone | Tasks | Deliverable |
|-----------|-------|-------------|
| **M0: Full Schema** | T-01 to T-03 | All 60+ tables in Neon |
| **M1: tRPC API** | T-04 to T-24 | All domain APIs, type-safe |
| **M2: ERP MVP** | T-25 to T-28 | Fully functional admin dashboard |
| **M3: Storefront MVP** | T-29 to T-30 | End-to-end customer purchase flow |

---

## Post-MVP Backlog

These are intentionally deferred. Do not implement during MVP build:

- Midtrans payment gateway integration (real-time payment status)
- SnapSend / RajaOngkir live rate API (replace static `shipping_rates`)
- Multi-language product content (ID + EN per product)
- Customer loyalty points system
- Bulk order / corporate order workflow
- Marketplace integration (Tokopedia / Shopee sync)
- Mobile app (React Native or PWA)
- Advanced analytics dashboard (cohorts, LTV, CAC)
- Automated accounting export (CSV → Jurnal / Accurate)
