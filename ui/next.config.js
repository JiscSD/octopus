/** @type {import('next').NextConfig} */
const CSPDirectives = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
    "style-src 'self' 'unsafe-inline';",
    `connect-src 'self' *.api.octopus.ac http://127.0.0.1:4003 https://api.octopus.ac https://api.ror.org https://cdn.contentful.com;`,
    'img-src https:;',
    'media-src https://octopus-promo-video.s3.eu-west-1.amazonaws.com https://www.youtube.com;',
    "font-src 'self';",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    "frame-ancestors 'none';",
    'upgrade-insecure-requests;'
];
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
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: CSPDirectives.join(' ')
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig;
