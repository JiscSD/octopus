/** @type {import('next').NextConfig} */
const isLocal = process.env.NODE_ENV === 'development';
const CSPDirectives = [
    "default-src 'none';",
    `script-src 'self' https://live.matomo.jisc.ac.uk 'sha256-i6f/49srVFuOjNVfFr0wuerEVL1EPOoBwnrjWDUm1UA=' ${isLocal ? "'unsafe-eval'" : ''};`,
    "style-src 'self' 'unsafe-inline';",
    `connect-src 'self' https://*.api.octopus.ac http://127.0.0.1:4003 https://api.octopus.ac https://api.ror.org https://cdn.contentful.com https://live.matomo.jisc.ac.uk;`,
    `img-src https: data: ${isLocal ? 'http:' : ''};`,
    'media-src https://octopus-promo-video.s3.eu-west-1.amazonaws.com https://www.youtube.com;',
    "font-src 'self';",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    "frame-ancestors 'none';",
    'upgrade-insecure-requests;',
    "manifest-src 'self';",
    'frame-src https://www.youtube.com'
];

const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000 ; includeSubDomains'
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'Referrer-Policy',
        value: 'no-referrer-when-downgrade'
    },
    {
        key: 'Content-Security-Policy',
        value: CSPDirectives.join(' ')
    }
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
                destination: 'https://jisc.github.io/octopus',
                permanent: true
            }
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders
            }
        ];
    }
};

module.exports = nextConfig;
