/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 80, 95, 100],
  },
  turbopack: {
    watchOptions: {
      poll: 800,
      aggregateTimeout: 300,
    },
  },
};

export default nextConfig;