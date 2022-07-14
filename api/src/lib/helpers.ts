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
                prefix: process.env.DOI_PREFIX // 10.82259/xydggf.546547
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

export const updateDOI = async (doi: string, publication: I.PublicationWithMetadata) => {
    // Get creator
    const creator = {
        name: `${publication?.user.firstName} ${publication?.user.lastName}`,
        nameType: 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: publication?.user.orcid,
                nameIdentifierScheme: 'orcid',
                schemeUri: 'orcid.org'
            }
        ]
    };

    // Get co-authors
    const coAuthors = publication?.coAuthors.map((coAuthor) => ({
        name:
            coAuthor.user?.firstName && coAuthor.user?.firstName
                ? `${coAuthor.user?.firstName} ${coAuthor.user?.lastName}`
                : `${coAuthor.email}`,
        nameType: 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: coAuthor.user?.orcid ? coAuthor.user?.orcid : 'Orcid ID not provided',
                nameIdentifierScheme: 'orcid',
                schemeUri: 'orcid.org'
            }
        ]
    }));

    const payload = {
        data: {
            types: 'doi',
            attributes: {
                event: 'publish',
                url: `https://int.octopus.ac/publications/${doi}`,
                doi: doi,
                identifiers: [
                    {
                        identifier: `https://doi.org/${doi}`,
                        identifierType: 'DOI'
                    }
                ],
                creators: coAuthors ? [...coAuthors, creator] : [creator],
                titles: [
                    {
                        title: publication?.title,
                        lang: 'en'
                    }
                ],
                publisher: 'Octopus',
                publicationYear: publication?.createdAt.getFullYear(),
                contributors: publication?.affiliations.map((affiliation) => ({
                    contributorType: 'Other',
                    nameType: 'Organizational',
                    name: affiliation.name,
                    nameIdentifiers: [
                        {
                            nameIdentifier: affiliation.ror || affiliation.link,
                            nameIdentifierScheme: affiliation.ror ? 'ROR' : 'Other'
                        }
                    ]
                })),
                language: 'en',
                types: {
                    resourceTypeGeneral: 'Other',
                    resourceType: publication?.type
                },
                relatedIdentifiers: publication?.linkedTo.map((relatedIdentifier) =>
                    relatedIdentifier.publicationToRef.type === 'PEER_REVIEW'
                        ? {
                              relatedIdentifier: relatedIdentifier.publicationToRef.doi,
                              relatedIdentifierType: 'DOI',
                              relationType: 'Reviews'
                          }
                        : {
                              relatedIdentifier: relatedIdentifier.publicationToRef.doi,
                              relatedIdentifierType: 'DOI',
                              relationType: 'Continues'
                          }
                ),
                fundingReferences: publication?.funders.map((funder) => ({
                    funderName: funder.name,
                    funderReference: funder.ror || funder.link,
                    funderIdentifierType: funder.ror ? 'ROR' : 'Other'
                }))
            }
        }
    };

    const doiRes = await axios.put<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT as string}/${doi}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

    return doiRes.data;
};

export const OctopusInformation: I.OctopusInformation = {
    publications: [
        'PROBLEM',
        'HYPOTHESIS',
        'PROTOCOL',
        'DATA',
        'ANALYSIS',
        'INTERPRETATION',
        'REAL_WORLD_APPLICATION',
        'PEER_REVIEW'
    ],
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

export const formatFlagType = (flagType: I.FlagCategory) => {
    const types = {
        PLAGIARISM: 'Plagiarism',
        ETHICAL_ISSUES: 'Ethical issues',
        MISREPRESENTATION: 'Misrepresentation',
        UNDECLARED_IMAGE_MANIPULATION: 'Undeclared image manipulation',
        COPYRIGHT: 'Copyright',
        INAPPROPRIATE: 'Inappropriate'
    };

    return types[flagType];
};
