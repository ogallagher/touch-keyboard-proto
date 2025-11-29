import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH || '',
  allowedDevOrigins: [
    'localhost',
    '192.168.0.*'
  ]
}

export default nextConfig
