import fs from 'fs';

import * as Config from '@/config';
import * as Types from '@/types';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const now = new Date().toISOString();

    // Get URLs of all static pages by scanning file system.
    const staticUrls = fs
        .readdirSync(process.cwd() + '/src/pages')
        .filter(
            (staticPage) =>
                ![
                    '404.tsx',
                    '500.tsx',
                    '_app.tsx',
                    '_document.tsx',
                    'account.tsx',
                    'api',
                    'approve-control-request.tsx',
                    'author-link.tsx',
                    'authors',
                    'login.tsx',
                    'my-bookmarks.tsx',
                    'publications',
                    'sitemap.xml.tsx',
                    'topics',
                    'verify.tsx'
                ].includes(staticPage) && !staticPage.startsWith('.')
        )
        .map((staticPagePath) => {
            if (staticPagePath.includes('.tsx')) {
                staticPagePath = staticPagePath.replace('.tsx', '');
            }

            if (staticPagePath === 'index') {
                staticPagePath = staticPagePath.replace('index', '');
            }

            return `${Config.urls.baseUrl}${staticPagePath ? `/${staticPagePath}` : ''}`;
        });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticUrls
                .map(
                    (url) => `
                        <url>
                            <loc>${url}</loc>
                            <lastmod>${now}</lastmod>
                            <changefreq>monthly</changefreq>
                            <priority>1.0</priority>
                        </url>
                    `
                )
                .join('')}
        </urlset>
    `;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {}
    };
};

export default Sitemap;
