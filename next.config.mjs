/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "recharts",
      "radix-ui",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
    ],
  },
  serverExternalPackages: ["@node-rs/argon2"],

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
