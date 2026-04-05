import type { AuthSession, AuthUser } from "@/lib/auth";
import type { accounts, sessions, users, verifications } from "./schema";

export type User = AuthUser;
export type NewUser = typeof users.$inferInsert;

export type Session = AuthSession;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
