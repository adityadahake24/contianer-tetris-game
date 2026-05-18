/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/container-tetris',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
