module.exports = { swcMinify: true, experimental: { appDir: true } }
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactiva Turbopack (es lo que rompe Tailwind y react-pdf)
  experimental: {
    turbotrace: false,
    turbo: false,
  },
  // Necesario para react-pdf en Vercel
  serverComponentsExternalPackages: ['@react-pdf/renderer'],
};

module.exports = nextConfig;

