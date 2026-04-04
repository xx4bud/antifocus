export const isClient = typeof window !== "undefined";
export const isServer = !isClient;

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
