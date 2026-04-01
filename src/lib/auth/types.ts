import type { auth } from "@/lib/auth/server";

export type Auth = typeof auth;
export type AuthError = Auth["$ERROR_CODES"];

export type AuthSession = Auth["$Infer"]["Session"];
export type AuthUser = AuthSession["user"];
