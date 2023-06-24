/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['storage.googleapis.com'] },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
