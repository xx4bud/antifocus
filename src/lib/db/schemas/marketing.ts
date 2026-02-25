import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { uuid } from "~/utils/ids";

// ==============================
// BANNERS
// ==============================

export const banners = pgTable(
  "banners",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    link: text("link").notNull(),

    enabled: boolean("enabled").default(true).notNull(),
    position: integer("position").default(0).notNull(),

    placement: text("placement"),
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
    index("banners_enabled_position_idx").on(table.enabled, table.position),
  ]
);
