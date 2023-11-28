/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async redirects() {
        return [
            {
                source: '/search',
                destination: '/search/publications/',
                permanent: true
            },
            {
                source: '/publications/:path',
                destination: '/publications/:path/versions/latest',
                permanent: false
            }
        ];
    }
};

module.exports = nextConfig;
