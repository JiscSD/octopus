import * as Helpers from '@/helpers';
import * as Types from '@/types';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async ({ res }) => {
    // Get details of sitemaps hosted in S3 bucket.
    const sitemapIndex = await Helpers.getSitemapIndexXML('users');
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapIndex);
    res.end();

    return {
        props: {}
    };
};

export default Sitemap;
