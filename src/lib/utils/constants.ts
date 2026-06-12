/**
 * Application name.
 */
export const APP_NAME = "Antifocus";

/**
 * Short application name/prefix.
 */
export const APP_SHORT_NAME = "AFC";

/**
 * Application primary domain name.
 */
export const APP_DOMAIN = "antifocus.my.id";

/**
 * System reserved words that cannot be used as usernames, slugs, or unique keys.
 */
export const RESERVED_WORDS = [
  // Authentication & Session
  "auth",
  "login",
  "logout",
  "signin",
  "signout",
  "signup",
  "register",
  "session",
  "verify",

  // System Accounts & Roles
  "admin",
  "administrator",
  "root",
  "system",
  "support",
  "help",
  "moderator",
  "staff",
  "owner",

  // Tech & Routing
  "api",
  "assets",
  "static",
  "public",
  "private",
  "db",
  "database",
  "null",
  "undefined",
  "true",
  "false",
  "index",
  "home",

  // Dashboard & Common Pages
  "dashboard",
  "settings",
  "profile",
  "billing",
  "checkout",
  "cart",
  "search",
  "status",
  "health",

  // App Specific
  "antifocus",
  "afc",
] as const;

/**
 * Official domains that are restricted from public registrations.
 */
export const RESERVED_DOMAINS = [] as const;
