import { pgTable, text } from "drizzle-orm/pg-core";
import { uuid } from "~/utils/ids";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});
