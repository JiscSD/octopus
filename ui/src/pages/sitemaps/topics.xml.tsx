import * as api from '@/api';
import * as Config from '@/config';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    const now = new Date().toISOString();

    // Get URLs of topics from the API.
    let topicUrls: string[] = [];
    try {
        const response = await api.get(Config.endpoints.topics);
        const data: Interfaces.TopicsPaginatedResults = response.data;
        if (data.results.length) {
            topicUrls = data.results.map((topic) => `${Config.urls.viewTopic.canonical}/${topic.id}`);
        }
    } catch (error) {
        console.log(error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
