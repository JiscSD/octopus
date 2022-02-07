import * as cheerio from 'cheerio';

export const isHTMLSafe = (content: string) => {
    const $ = cheerio.load(content);
    let error = false;

    $('*').map((_, element) => {
        const classes = $(element).attr('class');
        const style = $(element).attr('style');

        if (classes || style) {
            error = true;
            return false;
        }
    });

    return !error;
};
