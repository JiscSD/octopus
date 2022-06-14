import * as cheerio from 'cheerio';
import axios from 'axios';

import * as I from 'interface';

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

export const createEmptyDOI = async (): Promise<I.DOIResponse> => {
    const payload = {
        data: {
            type: 'dois',
            attributes: {
                prefix: process.env.DOI_PREFIX
            }
        }
    };

    const doi = await axios.post<I.DOIResponse>(process.env.DATACITE_ENDPOINT as string, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

    return doi.data;
};

export const updateDOI = async (doi: string, publication) => {};

export const OctopusInformation: I.OctopusInformation = {
    publications: {
        PROBLEM: {
            ratingCategories: ['PROBLEM_WELL_DEFINED', 'PROBLEM_ORIGINAL', 'PROBLEM_IMPORTANT']
        },
        HYPOTHESIS: {
            ratingCategories: ['HYPOTHESIS_WELL_DEFINED', 'HYPOTHESIS_ORIGINAL', 'HYPOTHESIS_SCIENTIFICALLY_VALID']
        },
        PROTOCOL: {
            ratingCategories: ['PROTOCOL_CLEAR', 'PROTOCOL_ORIGINAL', 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS']
        },
        DATA: {
            ratingCategories: ['DATA_WELL_ANNOTATED', 'DATA_SIZE_OF_DATASET', 'DATA_FOLLOWED_PROTOCOL']
        },
        ANALYSIS: {
            ratingCategories: ['ANALYSIS_CLEAR', 'ANALYSIS_ORIGINAL', 'ANALYSIS_APPROPRIATE_METHODOLOGY']
        },
        INTERPRETATION: {
            ratingCategories: [
                'INTERPRETATION_CLEAR',
                'INTERPRETATION_INSIGHTFUL',
                'INTERPRETATION_CONSISTENT_WITH_DATA'
            ]
        },
        REAL_WORLD_APPLICATION: {
            ratingCategories: [
                'REAL_WORLD_APPLICATION_CLEAR',
                'REAL_WORLD_APPLICATION_IMPACTFUL',
                'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT'
            ]
        },
        PEER_REVIEW: {
            ratingCategories: ['REVIEW_CLEAR', 'REVIEW_INSIGHTFUL', 'REVIEW_ORIGINAL']
        }
    },
    languages: [
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
    ]
};
