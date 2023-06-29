/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async redirects() {
        return [
          {
            source: '/search',
            destination: '/search/publications/',
            permanent: true,
          },
        ]
      },
};

module.exports = nextConfig;