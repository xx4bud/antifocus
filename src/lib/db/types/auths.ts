import type { users } from "~/lib/db/schemas";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
