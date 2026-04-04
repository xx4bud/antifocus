import createNextIntlPlugin from "next-intl/plugin";

const withI18n = createNextIntlPlugin({
  requestConfig: "./src/lib/i18n/request.tsx",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    optimizePackageImports: [
      "zod",
      "@tabler/icons-react",
      "date-fns",
      "date-fns-tz",
      "rechart",
    ],
  },
};

export default withI18n(nextConfig);
