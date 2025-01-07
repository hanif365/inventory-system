import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
    IMGBB_API_KEY: process.env.IMGBB_API_KEY!,
  },
  images: {
    domains: ['i.ibb.co'], // ImgBB domain for uploaded images
  },
};

export default nextConfig;
