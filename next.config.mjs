/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow loading dev assets from your LAN IP in development
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.137.86:3000',
  ],
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || 'http://localhost:8080'
    return [
      {
        source: '/api/:path*',
        // Forward without the '/api' prefix because many Spring apps already
        // mount at '/api' context path, which would otherwise become '/api/api/...'
        destination: `${target}/:path*`,
      },
    ]
  },
}

export default nextConfig
