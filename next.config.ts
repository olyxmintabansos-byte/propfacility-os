import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/propfacility-os",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
