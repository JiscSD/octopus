import * as I from 'interface';

export const languageCodes: I.Languages[] = [
    'ab',
    'aa',
    'af',
    'ak',
    'sq',
    'am',
    'ar',
    'an',
    'hy',
    'as',
    'av',
    'ae',
    'ay',
    'az',
    'bm',
    'ba',
    'eu',
    'be',
    'bn',
    'bi',
    'bs',
    'br',
    'bg',
    'bh',
    'my',
    'ca',
    'km',
    'ch',
    'ce',
    'ny',
    'zh',
    'cu',
    'cv',
    'kw',
    'co',
    'cr',
    'hr',
    'cs',
    'da',
    'dv',
    'nl',
    'dz',
    'en',
    'eo',
    'et',
    'ee',
    'fo',
    'fj',
    'fi',
    'fr',
    'ff',
    'gd',
    'gl',
    'lg',
    'ka',
    'de',
    'el',
    'gn',
    'gu',
    'ht',
    'ha',
    'he',
    'hz',
    'hi',
    'ho',
    'hu',
    'is',
    'io',
    'ig',
    'id',
    'ia',
    'ie',
    'iu',
    'ik',
    'ga',
    'it',
    'ja',
    'jv',
    'kl',
    'kn',
    'kr',
    'ks',
    'kk',
    'ki',
    'rw',
    'ky',
    'kv',
    'kg',
    'ko',
    'kj',
    'ku',
    'lo',
    'la',
    'lv',
    'li',
    'ln',
    'lt',
    'lu',
    'lb',
    'mk',
    'mg',
    'ms',
    'ml',
    'mt',
    'gv',
    'mi',
    'mr',
    'mh',
    'mn',
    'na',
    'nv',
    'ng',
    'ne',
    'nd',
    'se',
    'no',
    'nb',
    'nn',
    'oc',
    'oj',
    'or',
    'om',
    'os',
    'pi',
    'ps',
    'fa',
    'pl',
    'pt',
    'pa',
    'qu',
    'ro',
    'rm',
    'rn',
    'ru',
    'sm',
    'sg',
    'sa',
    'sc',
    'sr',
    'sn',
    'ii',
    'sd',
    'si',
    'sk',
    'sl',
    'so',
    'nr',
    'st',
    'es',
    'su',
    'sw',
    'ss',
    'sv',
    'tl',
    'ty',
    'tg',
    'ta',
    'tt',
    'te',
    'th',
    'bo',
    'ti',
    'to',
    'ts',
    'tn',
    'tr',
    'tk',
    'tw',
    'ug',
    'uk',
    'ur',
    'uz',
    've',
    'vi',
    'vo',
    'wa',
    'cy',
    'fy',
    'wo',
    'xh',
    'yi',
    'yo',
    'za',
    'zu'
];

export const licences = {
    CC_BY: {
        value: 'CC_BY',
        niceName: 'CC BY 4.0',
        fullName: 'Attribution 4.0 International (CC BY 4.0)',
        description:
            'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
        link: 'https://creativecommons.org/licenses/by/4.0/'
    },
    CC_BY_SA: {
        value: 'CC_BY_SA',
        niceName: 'CC BY-SA 4.0',
        fullName: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
        description:
            'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.',
        link: 'https://creativecommons.org/licenses/by-sa/4.0'
    },
    CC_BY_NC: {
        value: 'CC_BY_NC',
        niceName: 'CC BY-NC 4.0',
        fullName: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
        description:
            'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
        link: 'https://creativecommons.org/licenses/by-nc/4.0'
    },
    CC_BY_NC_SA: {
        value: 'CC_BY_NC_SA',
        niceName: 'CC BY-NC-SA 4.0',
        fullName: 'Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)',
        description:
            'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
        link: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
    }
};

export const publicationTypes: I.PublicationType[] = [
    'PROBLEM',
    'HYPOTHESIS',
    'PROTOCOL',
    'DATA',
    'ANALYSIS',
    'INTERPRETATION',
    'REAL_WORLD_APPLICATION',
    'PEER_REVIEW'
];
