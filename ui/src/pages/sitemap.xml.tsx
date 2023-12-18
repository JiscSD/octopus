import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const PublicationSitemapIndex = () => {
    return null;
};

// Return a sitemap index file that refers to the rest of our sitemaps.
export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    // Get details of sitemaps hosted in S3 bucket.
    let publicationSitemaps: string[] = [];
    try {
        const publicationSitemapsRequest = await api.get('/sitemaps/urls', undefined);
        publicationSitemaps = publicationSitemapsRequest.data;
    } catch (error) {
        console.log(error);
    }
    // Make a sitemap element for each separate publications sitemap.
    let sitemapsArray = publicationSitemaps.map(
        (url) =>
            `
        <sitemap>
            <loc>${url}</loc>
        </sitemap>
        `
    );
    // Add the sitemap for other content.
    sitemapsArray.push(`<sitemap><loc>${Config.urls.baseUrl}/sitemaps/other.xml</loc></sitemap>`);
    const sitemapsString = sitemapsArray.join('');
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapsString}
        </sitemapindex>
    `;
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapIndex);
    res.end();

    return {
        props: {}
    };
};

export default PublicationSitemapIndex;
