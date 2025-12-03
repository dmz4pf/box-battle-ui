import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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
  // Use webpack config to exclude test files
  webpack: (config, { isServer, webpack }) => {
    // Exclude test files from bundling
    config.module.rules.push({
      test: /node_modules\/.+\/(test|tests|__tests__|spec|specs|__specs__)\/.+\.(js|ts|tsx|jsx)$/,
      use: 'ignore-loader',
    })

    // Exclude common non-code files
    config.module.rules.push({
      test: /node_modules\/.+\/(LICENSE|README\.md|CHANGELOG\.md|\.npmignore|\.gitignore)$/,
      use: 'ignore-loader',
    })

    // Replace viem test modules with empty stubs
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /node_modules\/.+viem.+\/(clients\/createTestClient|clients\/decorators\/test|actions\/test\/.+)\.(js|ts)$/,
        join(__dirname, 'lib', 'empty-stub.js')
      )
    )

    // Externalize problematic server packages
    if (isServer) {
      config.externals.push('pino', 'thread-stream')
    }

    return config
  },
}

export default nextConfig
