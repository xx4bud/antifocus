import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  transpilePackages: [
    "@antifocus/env",
    "@antifocus/db",
    "@antifocus/config",
  ],
};

export default nextConfig;
