import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { accounts } from "@/lib/db/schema/auth/account";
import { sessions } from "@/lib/db/schema/auth/session";
import { generateId } from "@/lib/utils/ids";

/**
 * Better auth: users table
 */
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(), // full name
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"), // avatar url

    // username plugin
    username: text("username").unique(),
    displayUsername: text("display_username"),

    // phone-number plugin
    phoneNumber: text("phone_number"),
    phoneNumberVerified: boolean("phone_number_verified")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("users_name_idx").on(table.name)]
);

export const usersRelations = relations(users, ({ many }) => ({
  // better-auth ref: don't edit manually
  sessions: many(sessions),
  accounts: many(accounts),
  // other
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
