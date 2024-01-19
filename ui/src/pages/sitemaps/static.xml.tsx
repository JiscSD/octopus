import * as Config from '@/config';
import * as Types from '@/types';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const now = new Date().toISOString();

    // Get URLs of all static pages by scanning file system.
    const staticUrls = [
        '',
        'about',
        'accessibility',
        'author-guide',
        'blog',
        'browse',
        'create',
        'documentation',
        'faq',
        'get-involved',
        'octopus-aims',
        'privacy',
        'research-culture-report',
        'search',
        'terms',
        'user-terms'
    ].map((staticPagePath) => {
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
