import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    // Get details of sitemaps hosted in S3 bucket.
    let sitemaps: string[] = [];
    try {
        const sitemapsRequest = await api.get('/sitemaps/paths', undefined);
        sitemaps = sitemapsRequest.data;
    } catch (error) {
        console.log(error);
    }
    // Work out how many publications sitemaps we have in S3
    const publicationSitemaps = sitemaps
        .flatMap((sitemap) =>
            sitemap.startsWith('publications/')
                ? `<sitemap><loc>${Config.urls.baseUrl}/sitemaps/${sitemap}</loc></sitemap>`
                : []
        )
        .join('');
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${publicationSitemaps}
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
