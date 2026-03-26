/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  reactStrictMode: true,

  // Required for static export — disables Next.js image optimization
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Exclude native socket.io deps from client bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        { 'utf-8-validate': 'commonjs utf-8-validate', bufferutil: 'commonjs bufferutil' },
      ]
    }
    return config
  },
}

export default nextConfig
