import * as I from 'interface';
import * as response from 'lib/response';
import * as sitemapService from 'sitemap/service';

export const generate = async (): Promise<I.JSONResponse> => {
    try {
        const sitemapCount = await sitemapService.generatePublicationSitemaps();

        return response.json(200, {
            message: `Generated ${sitemapCount} sitemap${sitemapCount === 1 ? '' : 's'}`
        });
    } catch (err) {
        console.log(err);

        return response.json(500, {
            message: 'Unknown server error'
        });
    }
};

export const getUrls = async (): Promise<I.JSONResponse> => {
    try {
        const urls = await sitemapService.getUrls();

        return response.json(200, urls);
    } catch (err) {
        console.log(err);

        return response.json(500, {
            message: 'Unknown server error'
        });
    }
};