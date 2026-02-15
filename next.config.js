/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/kevin-bday',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

