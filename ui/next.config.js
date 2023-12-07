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
                source: '/sitemaps/publications/:number.xml',
                destination: '/sitemaps/publications/:number',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
