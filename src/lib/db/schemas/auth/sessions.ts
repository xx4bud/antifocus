import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "@/lib/db/schemas/auth/users";
import { generateId } from "@/utils/ids";

/**
 * Better auth: sessions table
 */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // better-auth ref: don't edit manually
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  // other
}));

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
