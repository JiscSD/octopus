import fs from 'fs';
import client from '@contentfulClient';

import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';

const Sitemap = () => {
    return null;
};

// Return a sitemap with URLs of all static pages, topics, and blog posts.
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
                    'author-link.tsx',
                    'authors',
                    'login.tsx',
                    'my-bookmarks.tsx',
                    'publications',
                    'publications-sitemap-index.xml.tsx',
                    'publications-sitemap[number].xml.tsx',
                    'sitemap.xml.tsx',
                    'topics',
                    'verify.tsx'
                ].includes(staticPage)
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

    // Get URLs of topics from the API.
    let topicUrls: string[] = [];
    try {
        const response = await api.get(Config.endpoints.topics, undefined);
        const data: Interfaces.TopicsPaginatedResults = response.data;
        if (data.results.length) {
            topicUrls = data.results.map((topic) => `${Config.urls.viewTopic.canonical}/${topic.id}`);
        }
    } catch (error) {
        console.log(error);
    }

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
            ${topicUrls
                .map(
                    (url) => `
                        <url>
                            <loc>${url}</loc>
                            <lastmod>${now}</lastmod>
                            <changefreq>daily</changefreq>
                            <priority>1.0</priority>
                        </url>
                    `
                )
                .join('')}
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
