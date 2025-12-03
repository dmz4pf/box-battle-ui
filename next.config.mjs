/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Externalize Node.js packages for Next.js 16+
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider',
  ],
  // Empty turbopack config to silence warnings and use Turbopack defaults
  turbopack: {},
}

export default nextConfig
