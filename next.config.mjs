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
  output: 'standalone',
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.137.86:3000',
  ],
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || 'http://localhost:8083'
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
