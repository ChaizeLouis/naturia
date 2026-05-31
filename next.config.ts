import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/NUTRICORE',
  assetPrefix: '/NUTRICORE/',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
