import axios from 'axios';
import fs from 'fs';
import * as cheerio from 'cheerio';
import * as I from 'interface';
import { licences } from './enum';

export const isHTMLSafe = (content: string): boolean => {
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

export const getSafeHTML = (content: string): string => {
    const $ = cheerio.load(content, null, false);

    $('*').map((_, element) => {
        return $(element).removeAttr('class').removeAttr('style');
    });

    return $.html();
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

export const updateDOI = async (doi: string, publication: I.PublicationWithMetadata): Promise<I.DOIResponse> => {
    if (!publication) {
        throw Error('Publication not found');
    }

    const authors = publication.coAuthors.map((coAuthor) => ({
        name:
            coAuthor.user?.firstName && coAuthor.user?.firstName
                ? `${coAuthor.user?.firstName} ${coAuthor.user?.lastName}`
                : `${coAuthor.email}`,
        nameType: 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: coAuthor.user?.orcid ? coAuthor.user?.orcid : 'ORCID iD not provided',
                nameIdentifierScheme: 'orcid',
                schemeUri: 'orcid.org'
            }
        ]
    }));

    // check if the creator of the publication is not listed as an author
    if (!publication.coAuthors.find((author) => author.linkedUser === publication.createdBy)) {
        // add creator to authors list as first author
        authors?.unshift({
            name: `${publication?.user.firstName} ${publication?.user.lastName}`,
            nameType: 'Personal',
            nameIdentifiers: [
                {
                    nameIdentifier: publication?.user.orcid,
                    nameIdentifierScheme: 'orcid',
                    schemeUri: 'orcid.org'
                }
            ]
        });
    }

    const payload = {
        data: {
            types: 'doi',
            attributes: {
                event: 'publish',
                url: `${process.env.BASE_URL}/publications/${publication?.id}`,
                doi: doi,
                identifiers: [
                    {
                        identifier: `https://doi.org/${doi}`,
                        identifierType: 'DOI'
                    }
                ],
                creators: authors,
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

export const octopusInformation: I.OctopusInformation = {
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

export const formatFlagType = (flagType: I.FlagCategory): string => {
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

export function sanitizeSearchQuery(searchQuery: string): string {
    return searchQuery
        .trim()
        .replace(/[^a-z0-9\s]/g, (match) => '\\' + match) // escape all the non-alphanumeric characters which may break the search
        .replace(/\s+/g, '|'); // replace whitespace with single OR
}

/**
 * @description Format a publication type returned from the DB
 */
export const formatPublicationType = (publicationType: I.PublicationType): string => {
    const types = {
        PROBLEM: 'Research Problem',
        HYPOTHESIS: 'Rationale / Hypothesis',
        PROTOCOL: 'Method',
        DATA: 'Results',
        ANALYSIS: 'Analysis',
        INTERPRETATION: 'Interpretation',
        REAL_WORLD_APPLICATION: 'Real World Application',
        PEER_REVIEW: 'Peer Review'
    };

    return types[publicationType];
};

const formatPDFDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const nthNumber = day > 0 ? ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10] : '';

    return `${day}<sup>${nthNumber}</sup> ${month} ${year}`;
};

export const createPublicationHTMLTemplate = (
    publication: I.Publication & I.PublicationWithMetadata,
    references: I.Reference[]
): string => {
    const {
        title,
        content,
        coAuthors,
        funders,
        conflictOfInterestText,
        affiliations,
        type,
        language,
        licence,
        doi,
        ethicalStatement,
        ethicalStatementFreeText,
        dataPermissionsStatement,
        dataPermissionsStatementProvidedBy,
        dataAccessStatement,
        selfDeclaration,
        linkedTo
    } = publication;

    // cheerio uses htmlparser2
    // parsing the publication content can sometimes help with unpaired opening/closing tags
    const mainText = content ? cheerio.load(content).html() : '';

    const authors = coAuthors.filter((author) => author.confirmedCoAuthor && author.linkedUser);

    if (!authors.find((author) => author.linkedUser === publication.createdBy)) {
        authors.unshift({
            id: publication.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publication.user.email || '',
            linkedUser: publication.createdBy,
            publicationId: publication.id,
            user: publication.user,
            reminderDate: null
        });
    }

    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64InterSemiBold = fs.readFileSync('assets/fonts/Inter-SemiBold.ttf', { encoding: 'base64' });
    const base64InterBold = fs.readFileSync('assets/fonts/Inter-Bold.ttf', { encoding: 'base64' });
    const base64MontserratMedium = fs.readFileSync('assets/fonts/Montserrat-Medium.ttf', { encoding: 'base64' });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                @font-face {
                    font-family: 'Montserrat';
                    src: url(data:font/ttf;base64,${base64MontserratMedium});
                    font-weight: 500;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Inter';
                    src: url(data:font/ttf;base64,${base64InterRegular});
                    font-weight: normal;
                    font-style: normal;
                }

                @font-face {
                    font-family: 'Inter';
                    src: url(data:font/ttf;base64,${base64InterSemiBold});
                    font-weight: 600;
                    font-style: normal;
                }
            
                @font-face {
                    font-family: 'Inter';
                    src: url(data:font/ttf;base64,${base64InterBold});
                    font-weight: 700;
                    font-style: normal;
                }

                @page {
                    margin: 2.5cm 2.5cm 3cm 2.5cm;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                html {
                    font-size: 10pt;
                }

                body {
                    font-family: "Inter", Arial, sans-serif;
                    line-height: 1.6;
                    overflow: hidden;
                }

                img, svg, video, canvas, audio, iframe, embed, object {
                    display: block;
                    max-width: 100%;
                }

                table, th, td {
                    border: 1px solid #000;
                }

                table {
                    table-layout: fixed;
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2rem 0rem;
                }

                th {
                    text-align: unset;
                    background-color: #eee;
                    font-weight: bold;
                }

                th, td {
                    padding: 5px;
                    word-wrap: break-word;
                }

                tr {
                    break-inside: avoid;
                }

                .section {
                    break-inside: avoid;
                }

                .section-title {
                    margin-top: 5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                #title {
                    font-family: 'Montserrat', sans-serif;
                    text-align: center;
                    max-width: 90%;
                    margin: 0 auto;
                    padding-bottom: 2rem;
                    font-weight: 500;
                }

                h1 {
                    margin-top: 3rem;
                    font-size: 20pt;
                }

                h2 {
                    margin-top: 3rem;
                    font-size: 18pt;
                }

                h3 {
                    margin-top: 2rem;
                    font-size: 16pt;
                }

                h4 {
                    margin-top: 2rem;
                    font-size: 14pt;
                }

                h5 {
                    margin-top: 1rem;
                    font-size: 12pt;
                }

                h6 {
                    margin-top: 1rem;
                    font-size: 10pt;
                }

                #main-text {
                    margin-top: 4rem;
                    text-align: justify;
                }

                ul, ol {
                    padding-left: 2rem;
                    margin: 1rem 0rem;
                }

                li {
                    margin: 0.5rem 0rem;
                }

                p {
                    margin: 0.5rem 0rem;
                }

                a {
                    color: #296D89;
                    text-decoration-color: #296D89;
                    text-underline-offset: 2px;
                }

                .metadata {
                    font-size: 11pt;
                    margin-bottom: 10px;
                }

                pre {
                    margin: 1rem 0rem;
                    border: 1px solid #121212;
                    background-color: #eee;
                    padding: 1rem;
                    border-radius: 5px;
                }
                
                code {
                    white-space: pre-wrap;
                }

                sup {
                    font-size: 10px;
                }

                .reference-location {
                    position: relative;
                    top: -0.5rem;
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
        <h1 id="title">${title}</h1>
            <p class="metadata">
                <strong>Authors:</strong> ${authors
                    .map(
                        (author) =>
                            `<a href="${process.env.BASE_URL}/authors/${author.linkedUser}">${author.user?.firstName} ${author.user?.lastName}</a>`
                    )
                    .join(', ')}
            </p>
            <p class="metadata">
                <strong>Affiliations:</strong> ${affiliations
                    .map((affiliation) => `<a href="${affiliation.link}">${affiliation.name}</a>`)
                    .join(', ')}
            </p>
            <p class="metadata">
                <strong>Publication Type:</strong> ${formatPublicationType(type)}
            </p>
            <p class="metadata">
                <strong>Publication Date:</strong> ${
                    publication.publishedDate ? formatPDFDate(publication.publishedDate) : formatPDFDate(new Date())
                }
            </p>
            <p class="metadata">
                <strong>Language:</strong> ${language.toUpperCase()}
            </p>
            <p class="metadata">
                <strong>License Type:</strong> ${licences[licence]?.niceName}
            </p>
            <p class="metadata">
                <strong>DOI:</strong> 
                <a href="${process.env.BASE_URL}/publications/${publication.id}">
                    ${doi}
                </a>
            </p>

            <div id="main-text">
                ${mainText}
            </div>

            <div class="section references">
                <h5 class="section-title">References</h5>
                ${
                    references.length
                        ? references
                              .map(
                                  (reference) =>
                                      `${reference.text}${
                                          reference.location
                                              ? `<p class="reference-location"><a href="${reference.location}">${reference.location}</a></p>`
                                              : ''
                                      }`
                              )
                              .join('')
                        : '<p>No references have been specified for this publication.</p>'
                }
            </div>

            ${
                linkedTo.length
                    ? ` <div class="section">
                            <h5 class="section-title">Parent publications</h5>
                            ${linkedTo
                                .map(
                                    (link) =>
                                        `<p style="margin-bottom: 1rem"><a href="${process.env.BASE_URL}/publications/${link.publicationToRef.id}">${link.publicationToRef.title}</a></p>`
                                )
                                .join('')}
                        </div>`
                    : ''
            }

            ${
                selfDeclaration && ['PROTOCOL', 'HYPOTHESIS'].includes(type)
                    ? ` <div class="section">
                            <h5 class="section-title">Data access statement</h5>
                            ${
                                type === 'PROTOCOL'
                                    ? '<p>Data has not yet been collected according to this method/protocol.</p>'
                                    : '<p>Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)</p>'
                            }
                        </div>`
                    : ''
            }
            
            ${
                ethicalStatement
                    ? ` <div class="section">
                            <h5 class="section-title">Ethical statement</h5>
                            <p>${ethicalStatement}</p>
                            ${ethicalStatementFreeText ? `<p>${ethicalStatementFreeText}</p>` : ''}
                        </div>`
                    : ''
            }

            ${
                dataPermissionsStatement
                    ? ` <div class="section">
                            <h5 class="section-title">Data permissions statement</h5>
                            <p>${dataPermissionsStatement}</p>
                            ${dataPermissionsStatementProvidedBy ? `<p>${dataPermissionsStatementProvidedBy}</p>` : ''}
                        </div>`
                    : ''
            }
           
            ${
                dataAccessStatement
                    ? ` <div class="section">
                            <h5 class="section-title">Data access statement</h5>
                            <p>${dataAccessStatement}</p>
                        </div>`
                    : ''
            }

            <div class="section">
                <h5 class="section-title">Funders</h5>
                ${
                    funders.length
                        ? ` <div>
                    <p>This Research Problem has the following sources of funding:</p>
                    <ul class="funders-list">
                    ${funders
                        .map(
                            (funder) =>
                                `<li><a href="${funder.link}">${funder.name}</a> - ${funder.city}, ${funder.country}</li>`
                        )
                        .join('')}
                            </ul>
                            </div>`
                        : '<p>No sources of funding have been specified for this publication.</p>'
                }
            </div>
            <div class="section">
                <h5 class="section-title">Conflict of interest</h5>
                ${
                    conflictOfInterestText
                        ? `<p>${conflictOfInterestText}</p>`
                        : '<p>This publication does not have any specified conflicts of interest.</p>'
                }
            </div>   
        </body>
    </html>`
        .split('\n')
        .join('');

    return htmlTemplate;
};

export const createPublicationHeaderTemplate = (publication: I.Publication & I.PublicationWithMetadata): string => {
    const authors = publication.coAuthors.filter((author) => author.confirmedCoAuthor && author.linkedUser);

    if (!authors.find((author) => author.linkedUser === publication.createdBy)) {
        authors.unshift({
            id: publication.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publication.user.email || '',
            linkedUser: publication.createdBy,
            publicationId: publication.id,
            user: publication.user,
            reminderDate: null
        });
    }

    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .header {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: flex;
            justify-content: space-between;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
        }

        .header a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 2px;
        }

        .header sup {
            font-size: 7px;
        }
    </style>
    <div class="header">
        <span>
            ${`${authors[0]?.user?.firstName} ${authors[0]?.user?.lastName} ${authors.length > 1 ? 'et al.' : ''}`}
        </span>
        <span>
            Published ${
                publication.publishedDate ? formatPDFDate(publication.publishedDate) : formatPDFDate(new Date())
            }
        </span>
    </div>`;
};

export const createPublicationFooterTemplate = (publication: I.Publication): string => {
    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64OctopusLogo = fs.readFileSync('assets/img/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.svg', {
        encoding: 'base64'
    });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .footer {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: grid;
            grid-template-columns: 1fr 0.7fr 1fr;
            align-items: start;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.5;
        }

        .footer > div:nth-of-type(2) {
            text-align: center;
        }

        .footer > div:nth-of-type(3) {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 3px;
        }

        .footer a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 1px;
            word-break: break-all;
        }

        #octopus-logo {
            width: 24px;
            vertical-align: middle;
            position: relative;
            bottom: 6px;
            text-decoration: none;
        }
    </style>
    <div class="footer">            
        <div>
            <span>DOI: <a href="${process.env.BASE_URL}/publications/${publication.id}">${publication.doi}</a></span>
        </div>
        <div>
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>        
        <div>
            Published on <a href="${process.env.BASE_URL}">Octopus.ac</a>
            <a href="${process.env.BASE_URL}"><img id="octopus-logo" src="data:image/svg+xml;base64,${base64OctopusLogo}"/></a>
        </div>
    </div>`;
};
