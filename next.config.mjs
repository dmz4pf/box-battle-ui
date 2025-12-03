/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Externalize problematic Node.js packages
  experimental: {
    serverComponentsExternalPackages: [
      'pino',
      'pino-pretty',
      'thread-stream',
      '@walletconnect/universal-provider',
      '@walletconnect/ethereum-provider',
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude test files and development dependencies from bundle
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /node_modules.*\.(test|spec)\.(js|mjs|ts|tsx)$/,
      use: 'null-loader',
    });

    // External fallback for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'pino-pretty': false,
      };
    }

    return config;
  },
}

export default nextConfig
