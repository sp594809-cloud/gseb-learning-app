import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // premium-experience is a standalone Vite prototype — exclude from Next.js compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/premium-experience/**', '**/node_modules/**'],
    };
    return config;
  },
  // Prevent Next from treating premium-experience as app routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
