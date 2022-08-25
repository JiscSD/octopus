import React from 'react';
import fs from 'fs';

import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const LIMIT = 10000; // default limit - see https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#:~:text=By%20default%2C%20you%20cannot%20use,safeguard%20set%20by%20the%20index.

    const staticPaths = fs
        .readdirSync(__dirname)
        .filter((staticPage) => {
            return !['api', '_app.js', '_document.js', '_error.js', '404.js', '500.js', 'sitemap.xml.js'].includes(
                staticPage
            );
        })
        .map((staticPagePath) => {
            if (staticPagePath.includes('.js')) {
                staticPagePath = staticPagePath.replace('.js', '');
            }

            if (staticPagePath === 'index') {
                staticPagePath = staticPagePath.replace('index', '');
            }

            return `${Config.urls.baseUrl}${staticPagePath ? `/${staticPagePath}` : ''}`;
        });

    let dynamicPaths: string[] = [];

    try {
        let offset = 0;
        const response = await api.search('publications', null, null, LIMIT, offset);
        const metadata = response.metadata;
        let publications = response.data as Interfaces.Publication[];

        // fetch the rest of the publications if total results > LIMIT
        if (metadata.total > publications.length) {
            const nrOfRequestsNeeded = Math.ceil((metadata.total - publications.length) / LIMIT);
            const promises = Array.from(Array(nrOfRequestsNeeded).keys()).map(() => {
                offset += LIMIT;
                return api.search('publications', null, null, LIMIT, offset);
            });

            const results = await Promise.all(promises.map((promise) => promise.catch((error) => error)));
            const validResults = results.filter((response) => !(response instanceof Error));
            const restOfPublications = validResults.map((response) => response.data).flat() as Interfaces.Publication[];

            publications = [...publications, ...restOfPublications];
        }

        if (publications.length) {
            dynamicPaths = publications.map(
                (publication) => `${Config.urls.viewPublication.canonical}/${publication.id}`
            );
        }
    } catch (error) {
        console.log(error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticPaths
                .map(
                    (url) => `
                        <url>
                            <loc>${url}</loc>
                            <lastmod>${new Date().toISOString()}</lastmod>
                            <changefreq>monthly</changefreq>
                            <priority>1.0</priority>
                        </url>
                    `
                )
                .join('')}
            ${dynamicPaths
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

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {}
    };
};

export default Sitemap;
