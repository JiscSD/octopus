import * as Config from '@config';
import * as Types from '@types';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    return {
        redirect: {
            destination: `${Config.urls.sitemapBucket}/publications/${context.query.sitemap}`,
            permanent: true
        }
    };
};

export default Sitemap;
