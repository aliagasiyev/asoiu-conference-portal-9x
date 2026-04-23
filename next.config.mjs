/** @type {import('next').NextConfig} */
const nextConfig = {
  // Re-enable to ensure your code is actually safe for production
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // CRITICAL: Makes docker image 100MB instead of 1GB+
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
        // FIX: Add /api here to match Spring Boot's required prefix
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
