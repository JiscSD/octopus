import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const PublicationSitemapIndex = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    // Google can only accept site maps of a given size, so we work out how many sitemaps of this size
    // we will need to include all of our publications.
    let totalPublications: number = 0;
    try {
        const publicationCountResponse = await api.get(`${Config.endpoints.publications}/count`, undefined);
        totalPublications = publicationCountResponse.data;
    } catch (error) {
        console.log(error);
    }
    const chunkSize = Config.values.sitemapChunkSize;
    const sitemapCount =
        totalPublications % chunkSize
            ? Math.floor(totalPublications / chunkSize) + 1
            : Math.floor(totalPublications / chunkSize);
    // Make a sitemap element for each separate publications sitemap we need.
    let sitemapsArray = [...Array(sitemapCount).keys()].map(
        (idx) =>
            `
        <sitemap>
            <loc>${Config.urls.baseUrl}/sitemaps/publications/${idx + 1}.xml</loc>
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
