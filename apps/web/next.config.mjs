import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mebel-salon/db", "@mebel-salon/shared", "@mebel-salon/telegram"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "grammy"],
    outputFileTracingRoot: path.join(__dirname, "../../"),
    outputFileTracingIncludes: {
      "/**/*": [
        "node_modules/.prisma/**/*",
        "../../node_modules/.prisma/**/*",
        "../../node_modules/.pnpm/@prisma+client*/**/*",
        "../../node_modules/.pnpm/prisma*/**/*",
        "../../node_modules/@prisma/client/**/*",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "api.telegram.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
