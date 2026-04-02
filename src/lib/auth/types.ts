import type { auth } from "@/lib/auth/server";
import type {
  Session as DbSession,
  User as DbUser,
} from "@/lib/db/schema/auth";

export type Auth = typeof auth;
export type AuthError = Auth["$ERROR_CODES"];

// Use database schemas as the absolute source of truth for session and user types
export interface AuthSession {
  session: DbSession;
  user: DbUser;
}

export type AuthUser = DbUser;
