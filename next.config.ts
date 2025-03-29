import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    // Các tùy chọn thử nghiệm khác có thể thêm ở đây
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
