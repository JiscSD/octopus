import * as Config from '@/config';
import * as Types from '@/types';

const Sitemap = () => {
    return null;
};

// Return a sitemap index file that refers to the rest of our sitemaps.
export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const sitemaps = ['static', 'blog', 'topics', 'publications', 'users']
        .map((resourceName) => `<sitemap><loc>${Config.urls.baseUrl}/sitemaps/${resourceName}.xml</loc></sitemap>`)
        .join('');
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemaps}
        </sitemapindex>
    `;
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapIndex);
    res.end();

    return {
        props: {}
    };
};

export default Sitemap;
