import { env } from "@/env";

export const isClient = typeof window !== "undefined";
export const isServer = !isClient;

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
