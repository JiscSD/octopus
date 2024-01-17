import client from '@contentfulClient';

import * as Types from '@types';
import * as Config from '@config';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const now = new Date().toISOString();

    // Get blog post IDs from contentful.
    let blogUrls: string[] = [];
    try {
        const contentfulResponse = await client.getEntries({
            order: ['fields.publishedDate'],
            content_type: 'octopusBlog'
        });
        if (contentfulResponse.items.length) {
            blogUrls = contentfulResponse.items.map(
                (blogPost) => `${Config.urls.blog.canonical}/${blogPost.fields.slug}`
            );
        }
    } catch (error) {
        console.log(error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${blogUrls
                .map(
                    (url) => `
                        <url>
                            <loc>${url}</loc>
                            <lastmod>${now}</lastmod>
                            <changefreq>yearly</changefreq>
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
