import type {
  accounts,
  sessions,
  users,
  verifications,
} from "~/lib/db/schemas";
import type { AuthUser } from "~/utils/types";

export type User = typeof users.$inferSelect | AuthUser;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
