/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { dev }) => {
    // Disable cache if disk space is tight (helps when ENOSPC occurs)
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
