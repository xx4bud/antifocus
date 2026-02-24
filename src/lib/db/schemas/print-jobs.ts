import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { orderItems } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// PRINT JOB ENUMS
// ==============================

export const PRINT_JOB_STATUS = {
  queued: "queued",
  preparing: "preparing",
  printing: "printing",
  drying: "drying",
  finishing: "finishing",
  quality_check: "quality_check",
  done: "done",
  failed: "failed",
  cancelled: "cancelled",
  on_hold: "on_hold",
} as const;

export type PrintJobStatus =
  (typeof PRINT_JOB_STATUS)[keyof typeof PRINT_JOB_STATUS];

export const PRINT_MACHINE_TYPE = {
  dtg: "dtg",
  dtf: "dtf",
  sublimation: "sublimation",
  screen: "screen",
  uv: "uv",
  vinyl: "vinyl",
  offset: "offset",
  embroidery: "embroidery",
  laser: "laser",
} as const;

export type PrintMachineType =
  (typeof PRINT_MACHINE_TYPE)[keyof typeof PRINT_MACHINE_TYPE];

export const PRINT_MACHINE_STATUS = {
  idle: "idle",
  printing: "printing",
  maintenance: "maintenance",
  offline: "offline",
  error: "error",
} as const;

export type PrintMachineStatus =
  (typeof PRINT_MACHINE_STATUS)[keyof typeof PRINT_MACHINE_STATUS];

export const PRINT_PRIORITY = {
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3,
} as const;

export type PrintPriority =
  (typeof PRINT_PRIORITY)[keyof typeof PRINT_PRIORITY];

// ==============================
// PRINT MACHINES
// ==============================

export const printMachines = pgTable(
  "print_machines",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    code: text("code"),
    type: text("type").$type<PrintMachineType>().notNull(),
    model: text("model"), // "Epson SC-F2130", "Brother GTX"
    status: text("status")
      .$type<PrintMachineStatus>()
      .default("idle")
      .notNull(),

    // capabilities
    maxWidth: integer("max_width"), // mm
    maxHeight: integer("max_height"), // mm
    maxDpi: integer("max_dpi"),
    supportedMaterials: jsonb("supported_materials"), // ["cotton", "polyester", ...]

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
    index("print_machines_org_id_idx").on(table.organizationId),
    index("print_machines_type_idx").on(table.type),
    index("print_machines_status_idx").on(table.status),
  ]
);

export const printMachinesRelations = relations(
  printMachines,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [printMachines.organizationId],
      references: [organizations.id],
    }),
    printJobs: many(printJobs),
  })
);

// ==============================
// PRINT JOBS
// ==============================

export const printJobs = pgTable(
  "print_jobs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id),
    machineId: text("machine_id").references(() => printMachines.id),
    assignedTo: text("assigned_to").references(() => users.id),

    status: text("status").$type<PrintJobStatus>().default("queued").notNull(),
    priority: integer("priority").default(1).notNull(), // 0=low, 1=normal, 2=high, 3=urgent

    // print specs
    printMethod: text("print_method").$type<PrintMachineType>(),
    copies: integer("copies").default(1).notNull(),
    designFileUrl: text("design_file_url"),
    previewUrl: text("preview_url"),
    printSettings: jsonb("print_settings"), // {dpi, colorProfile, ...}

    // tracking
    queuePosition: integer("queue_position"),
    estimatedMinutes: integer("estimated_minutes"),
    notes: text("notes"),
    failReason: text("fail_reason"),
    retryCount: integer("retry_count").default(0).notNull(),
    metadata: jsonb("metadata"),

    // timestamps
    queuedAt: timestamp("queued_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    startedAt: timestamp("started_at", { mode: "date", withTimezone: true }),
    completedAt: timestamp("completed_at", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("print_jobs_org_id_idx").on(table.organizationId),
    index("print_jobs_order_item_id_idx").on(table.orderItemId),
    index("print_jobs_machine_id_idx").on(table.machineId),
    index("print_jobs_assigned_to_idx").on(table.assignedTo),
    index("print_jobs_status_idx").on(table.status),
    index("print_jobs_priority_status_idx").on(table.priority, table.status),
    index("print_jobs_queued_at_idx").on(table.queuedAt),
  ]
);

export const printJobsRelations = relations(printJobs, ({ one }) => ({
  organization: one(organizations, {
    fields: [printJobs.organizationId],
    references: [organizations.id],
  }),
  orderItem: one(orderItems, {
    fields: [printJobs.orderItemId],
    references: [orderItems.id],
  }),
  machine: one(printMachines, {
    fields: [printJobs.machineId],
    references: [printMachines.id],
  }),
  assignedUser: one(users, {
    fields: [printJobs.assignedTo],
    references: [users.id],
  }),
}));
