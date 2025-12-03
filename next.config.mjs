/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Minimal Turbopack config - let it use defaults
  turbopack: {},
  // Tell Next.js these are server-only packages
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
  ],
}

export default nextConfig
