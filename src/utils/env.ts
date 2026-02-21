import { env } from "~/env";

export const isServer = typeof window === "undefined";
export const isClient = !isServer;

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";
