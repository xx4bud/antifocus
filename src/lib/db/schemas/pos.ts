import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { orders } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { stores } from "~/lib/db/schemas/stores";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// POS ENUMS
// ==============================

export const POS_TERMINAL_STATUS = {
  active: "active",
  inactive: "inactive",
  maintenance: "maintenance",
} as const;

export type PosTerminalStatus =
  (typeof POS_TERMINAL_STATUS)[keyof typeof POS_TERMINAL_STATUS];

export const POS_SESSION_STATUS = {
  open: "open",
  closed: "closed",
  suspended: "suspended",
} as const;

export type PosSessionStatus =
  (typeof POS_SESSION_STATUS)[keyof typeof POS_SESSION_STATUS];

export const POS_TRANSACTION_TYPE = {
  sale: "sale",
  refund: "refund",
  void: "void",
  exchange: "exchange",
} as const;

export type PosTransactionType =
  (typeof POS_TRANSACTION_TYPE)[keyof typeof POS_TRANSACTION_TYPE];

export const POS_SYNC_STATUS = {
  pending: "pending",
  synced: "synced",
  conflict: "conflict",
  failed: "failed",
} as const;

export type PosSyncStatus =
  (typeof POS_SYNC_STATUS)[keyof typeof POS_SYNC_STATUS];

// ==============================
// POS TERMINALS
// ==============================

export const posTerminals = pgTable(
  "pos_terminals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    code: text("code").notNull(),
    deviceInfo: jsonb("device_info"), // {os, browser, model, ip}
    status: text("status")
      .$type<PosTerminalStatus>()
      .default("active")
      .notNull(),
    lastSeenAt: timestamp("last_seen_at", {
      mode: "date",
      withTimezone: true,
    }),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("pos_terminals_org_code_uidx").on(
      table.organizationId,
      table.code
    ),
    index("pos_terminals_org_id_idx").on(table.organizationId),
    index("pos_terminals_store_id_idx").on(table.storeId),
    index("pos_terminals_status_idx").on(table.status),
  ]
);

export const posTerminalsRelations = relations(
  posTerminals,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [posTerminals.organizationId],
      references: [organizations.id],
    }),
    store: one(stores, {
      fields: [posTerminals.storeId],
      references: [stores.id],
    }),
    sessions: many(posSessions),
  })
);

// ==============================
// POS SESSIONS
// ==============================

export const posSessions = pgTable(
  "pos_sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    terminalId: text("terminal_id")
      .notNull()
      .references(() => posTerminals.id, { onDelete: "cascade" }),
    cashierId: text("cashier_id")
      .notNull()
      .references(() => users.id),

    status: text("status").$type<PosSessionStatus>().default("open").notNull(),

    openingBalance: numeric("opening_balance", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    closingBalance: numeric("closing_balance", { precision: 19, scale: 4 }),
    expectedBalance: numeric("expected_balance", { precision: 19, scale: 4 }),
    difference: numeric("difference", { precision: 19, scale: 4 }),

    notes: text("notes"),
    metadata: jsonb("metadata"),

    openedAt: timestamp("opened_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    closedAt: timestamp("closed_at", { mode: "date", withTimezone: true }),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("pos_sessions_terminal_id_idx").on(table.terminalId),
    index("pos_sessions_cashier_id_idx").on(table.cashierId),
    index("pos_sessions_status_idx").on(table.status),
    index("pos_sessions_opened_at_idx").on(table.openedAt),
  ]
);

export const posSessionsRelations = relations(posSessions, ({ one, many }) => ({
  terminal: one(posTerminals, {
    fields: [posSessions.terminalId],
    references: [posTerminals.id],
  }),
  cashier: one(users, {
    fields: [posSessions.cashierId],
    references: [users.id],
  }),
  transactions: many(posTransactions),
}));

// ==============================
// POS TRANSACTIONS (offline-ready)
// ==============================

export const posTransactions = pgTable(
  "pos_transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    sessionId: text("session_id")
      .notNull()
      .references(() => posSessions.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => orders.id),

    // offline-first: device-side UUID for reconciliation
    localId: text("local_id").notNull(),

    type: text("type").$type<PosTransactionType>().default("sale").notNull(),
    amount: numeric("amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    paymentMethod: text("payment_method").notNull(), // cash, qris, debit_card, etc.
    change: numeric("change", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),

    // sync
    syncStatus: text("sync_status")
      .$type<PosSyncStatus>()
      .default("pending")
      .notNull(),
    syncedAt: timestamp("synced_at", { mode: "date", withTimezone: true }),
    syncError: text("sync_error"),

    // offline timestamp (when transaction happened on device)
    offlineCreatedAt: timestamp("offline_created_at", {
      mode: "date",
      withTimezone: true,
    }),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("pos_transactions_local_id_uidx").on(table.localId),
    index("pos_transactions_session_id_idx").on(table.sessionId),
    index("pos_transactions_order_id_idx").on(table.orderId),
    index("pos_transactions_sync_status_idx").on(table.syncStatus),
    index("pos_transactions_type_idx").on(table.type),
    index("pos_transactions_created_at_idx").on(table.createdAt),
  ]
);

export const posTransactionsRelations = relations(
  posTransactions,
  ({ one }) => ({
    session: one(posSessions, {
      fields: [posTransactions.sessionId],
      references: [posSessions.id],
    }),
    order: one(orders, {
      fields: [posTransactions.orderId],
      references: [orders.id],
    }),
  })
);
