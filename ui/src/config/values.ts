import * as Interfaces from '@interfaces';
import * as Types from '@types';

export const publicationTypes: Types.PublicationType[] = [
    'PROBLEM',
    'HYPOTHESIS',
    'PROTOCOL',
    'DATA',
    'ANALYSIS',
    'INTERPRETATION',
    'REAL_WORLD_APPLICATION',
    'PEER_REVIEW'
];

export const licenceTypes: Interfaces.LicenceTypeShape[] = [
    {
        value: 'CC_BY',
        nicename: 'CC BY',
        description:
            'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
        link: 'https://creativecommons.org/licenses/by/4.0/'
    },
    {
        value: 'CC_BY_SA',
        nicename: 'CC BY-SA',
        description:
            'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.',
        link: 'https://creativecommons.org/licenses/by-sa/4.0'
    },
    {
        value: 'CC_BY_ND',
        nicename: 'CC BY-ND',
        description:
            'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
        link: 'https://creativecommons.org/licenses/by-nd/4.0'
    },
    {
        value: 'CC_BY_NC',
        nicename: 'CC BY-NC',
        description:
            'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
        link: 'https://creativecommons.org/licenses/by-nc/4.0'
    },
    {
        value: 'CC_BY_NC_SA',
        nicename: 'CC BY-NC-SA',
        description:
            'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
        link: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
    },
    {
        value: 'CC_BY_NC_ND',
        nicename: 'CC BY-NC-ND',
        description:
            'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
        link: 'https://creativecommons.org/licenses/by-nc-nd/4.0'
    }
];

export const HTMLStyles =
    'table prose max-w-none text-grey-800 transition-colors duration-500 prose-headings:text-teal-700 prose-a:text-grey-800 prose-a:underline prose-a:decoration-teal-500 prose-a:decoration-2 prose-a:underline-offset-1 prose-a:outline-none focus:prose-a:bg-yellow-300 prose-blockquote:border-teal-500 prose-blockquote:text-grey-600 prose-strong:text-grey-800 dark:text-grey-100 dark:prose-headings:text-teal-400 dark:prose-a:text-white dark:focus:prose-a:text-grey-800 dark:prose-blockquote:text-grey-300 dark:prose-strong:text-teal-300  w-full';
