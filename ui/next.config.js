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
                source: '/documentation/api',
                destination: 'https://jiscsd.github.io/octopus',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
