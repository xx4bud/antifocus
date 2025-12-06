import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  serverExternalPackages: ["@node-rs/argon2"],

  transpilePackages: [
    "@antifocus/auth",
    "@antifocus/env",
    "@antifocus/db",
    "@antifocus/config",
  ],
};

export default nextConfig;
