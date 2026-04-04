import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/env");

const withI18n = createNextIntlPlugin({
  requestConfig: "./src/lib/i18n/request.ts",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    optimizePackageImports: ["zod"],
  },
};

export default withI18n(nextConfig);
