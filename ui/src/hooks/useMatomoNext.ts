import { useEffect } from 'react';
import { init, push } from '@socialgouv/matomo-next';

const useMatomoNext = () => {
    useEffect(() => {
        const stage = process.env.NEXT_PUBLIC_STAGE;
        const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
        const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

        if (stage === 'prod' && matomoUrl && matomoSiteId) {
            // Cookieless Tracking
            push(['trackPageView', 'enableLinkTracking']);
            init({ url: matomoUrl, siteId: matomoSiteId, disableCookies: true });
        }
    }, []);
};

export default useMatomoNext;
