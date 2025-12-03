import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Output standalone for Vercel
  output: 'standalone',
  // Use webpack config to ignore problematic test modules
  webpack: (config, { isServer, webpack }) => {
    // Ignore viem test modules completely
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/clients\/createTestClient\.js$/,
        contextRegExp: /viem\/_esm$/,
      })
    )

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/clients\/decorators\/test\.js$/,
        contextRegExp: /viem\/_esm$/,
      })
    )

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/actions\/test\//,
        contextRegExp: /viem\/_esm$/,
      })
    )

    // Externalize problematic server packages
    if (isServer) {
      config.externals.push('pino', 'thread-stream')
    }

    return config
  },
}

export default nextConfig
