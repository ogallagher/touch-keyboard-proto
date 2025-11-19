import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH || ''
}

export default nextConfig
