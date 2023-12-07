import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const PublicationSitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const sitemapNumber = context.query.number;
    const opensearchLimit = Config.values.opensearchLimit;
    let publicationUrls: string[] = [];
    try {
        // publicationUrls = ['one', 'two', 'three'].map((id) => `${Config.urls.viewPublication.canonical}/${id}`);
        let offset = 0;
        const response = await api.search('publication-versions', null, Config.values.opensearchLimit, offset);
        const metadata = response.metadata;
        let publicationVersions = response.data as Interfaces.PublicationVersion[];

        // fetch the rest of the publications if total results > opensearchLimit
        if (metadata.total > publicationVersions.length) {
            const nrOfRequestsNeeded = Math.ceil((metadata.total - publicationVersions.length) / opensearchLimit);
            const promises = Array.from(Array(nrOfRequestsNeeded).keys()).map(() => {
                offset += opensearchLimit;
                return api.search('publication-versions', null, opensearchLimit, offset);
            });

            const results = await Promise.all(promises.map((promise) => promise.catch((error) => error)));
            const validResults = results.filter((response) => !(response instanceof Error));
            const restOfpublicationVersions = validResults
                .map((response) => response.data)
                .flat() as Interfaces.PublicationVersion[];

            publicationVersions = [...publicationVersions, ...restOfpublicationVersions];
        }

        if (publicationVersions.length) {
            publicationUrls = publicationVersions.map(
                (publicationVersion) => `${Config.urls.viewPublication.canonical}/${publicationVersion.versionOf}`
            );
        }
    } catch (error) {
        console.log(error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${publicationUrls
            .map(
                (url) => `
                    <url>
                        <loc>${url}</loc>
                        <lastmod>${new Date().toISOString()}</lastmod>
                        <changefreq>daily</changefreq>
                        <priority>1.0</priority>
                    </url>
                `
            )
            .join('')}
    </urlset>
    `;

    context.res.setHeader('Content-Type', 'text/xml');
    context.res.write(sitemap);
    context.res.end();

    return {
        props: {}
    };
};

export default PublicationSitemap;
