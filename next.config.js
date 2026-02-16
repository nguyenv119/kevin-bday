/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'prod' ? '/kevin-bday' : '',
  
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

