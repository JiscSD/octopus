import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import * as cheerio from 'cheerio';
import * as DOMPurify from 'isomorphic-dompurify';
import * as I from 'interface';
import * as referenceService from 'reference/service';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import { licences } from './enum';
import { webcrypto } from 'crypto';

export const getSafeHTML = (content: string): string => {
    // Sanitize against XSS
    return DOMPurify.sanitize(content);
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

const createCreatorObject = (user: I.DataCiteUser): I.DataCiteCreator => {
    return {
        name: `${user?.lastName}, ${user?.firstName}`, // datacite expects full name in lastname, firstname order
        givenName: user?.firstName,
        familyName: user?.lastName,
        nameType: 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: user?.orcid ? user?.orcid : 'ORCID iD not provided',
                nameIdentifierScheme: 'ORCID',
                schemeUri: 'https://orcid.org/'
            }
        ],
        affiliation: user.affiliations.map((affiliation) => ({
            name: affiliation.organization.name,
            nameType: 'Organizational',
            affiliationIdentifier:
                affiliation.organization['disambiguated-organization']?.['disambiguated-organization-identifier'] || '',
            affiliationIdentifierScheme:
                affiliation.organization['disambiguated-organization']?.['disambiguation-source'] || ''
        }))
    };
};

export const getFullDOIsStrings = (text: string): [] | RegExpMatchArray =>
    text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi //eslint-disable-line
    ) || [];

export const createDOIPayload = async (
    data:
        | {
              payloadType: 'canonical';
              doi: string;
              publicationVersion: I.PublicationVersion;
              oldPublicationVersionDOIs: string[];
          }
        | {
              payloadType: 'newVersion';
              publicationVersion: I.PublicationVersion;
              previousPublicationVersionDOI?: string;
          }
        | {
              payloadType: 'previousVersion';
              publicationVersion: I.PublicationVersion;
              newPublicationVersionDOI: string;
              previousPublicationVersionDOI?: string;
          }
): Promise<Record<string, unknown>> => {
    const { payloadType, publicationVersion } = data;

    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const creators: I.DataCiteCreator[] = [];
    publicationVersion.coAuthors.forEach((author) => {
        if (author.user) {
            creators.push(
                createCreatorObject({
                    firstName: author.user.firstName,
                    lastName: author.user.lastName,
                    orcid: author.user.orcid,
                    affiliations: author.affiliations as unknown as I.MappedOrcidAffiliation[]
                })
            );
        }
    });

    // check if the creator of this version of the publication is not listed as an author
    if (!publicationVersion.coAuthors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        // add creator to authors list as first author
        creators?.unshift(
            createCreatorObject({
                firstName: publicationVersion.user.firstName,
                lastName: publicationVersion.user.lastName,
                orcid: publicationVersion.user.orcid,
                affiliations: []
            })
        );
    }

    const linkedPublicationDOIs = linkedTo.map((link) => ({
        relatedIdentifier: link.doi,
        relatedIdentifierType: 'DOI',
        relationType: link.type === 'PEER_REVIEW' ? 'Reviews' : 'Continues'
    }));

    const referenceDOIs = references
        .filter((reference) => reference.type === 'DOI' && reference.location)
        .map((reference) => {
            const doi = getFullDOIsStrings(reference.location as string);

            return {
                relatedIdentifier: doi[0],
                relatedIdentifierType: 'DOI',
                relationType: 'References'
            };
        });

    const otherReferences = references
        .filter((reference) => reference.type !== 'DOI')
        .map((reference) => {
            const mutatedReference = {
                titles: [
                    {
                        title: reference.text.replace(/(<([^>]+)>)/gi, '')
                    }
                ],
                relationType: 'References',
                relatedItemType: 'Other'
            };

            return reference.location
                ? {
                      ...mutatedReference,
                      relatedItemIdentifier: {
                          relatedItemIdentifier: reference.location,
                          relatedItemIdentifierType: 'URL'
                      }
                  }
                : mutatedReference;
        });

    const additionalInformation = publicationVersion.additionalInformation.map((additionalInfoEntry) => ({
        titles: [
            {
                title: additionalInfoEntry.title
            }
        ],
        relationType: 'HasPart',
        relatedItemType: 'Other',
        relatedItemIdentifier: {
            relatedItemIdentifier: additionalInfoEntry.url,
            relatedItemIdentifierType: 'URL'
        }
    }));

    const payload = {
        data: {
            type: 'dois',
            attributes: {
                event: 'publish',
                url:
                    payloadType === 'canonical'
                        ? `${process.env.BASE_URL}/publications/${publicationVersion.versionOf}`
                        : `${process.env.BASE_URL}/publications/${publicationVersion.versionOf}/versions/${publicationVersion.versionNumber}`,
                creators,
                titles: [
                    {
                        title: publicationVersion.title,
                        lang: 'en'
                    }
                ],
                publisher: 'Octopus',
                publicationYear: publicationVersion.createdAt.getFullYear(),
                contributors: [
                    {
                        name: `${publicationVersion.user.lastName} ${publicationVersion.user.firstName}`,
                        contributorType: 'ContactPerson',
                        nameType: 'Personal',
                        givenName: publicationVersion.user.firstName,
                        familyName: publicationVersion.user.lastName,
                        nameIdentifiers: [
                            {
                                nameIdentifier: publicationVersion.user.orcid,
                                nameIdentifierScheme: 'ORCID',
                                schemeUri: 'https://orcid.org/'
                            }
                        ]
                    }
                ],
                language: 'en',
                types: {
                    resourceTypeGeneral: publicationVersion.publication.type === 'PEER_REVIEW' ? 'PeerReview' : 'Other',
                    resourceType: publicationVersion.publication.type
                },
                relatedIdentifiers: [...linkedPublicationDOIs, ...referenceDOIs],
                relatedItems: [...otherReferences, ...additionalInformation],
                fundingReferences: publicationVersion.funders.map((funder) => ({
                    funderName: funder.name,
                    funderIdentifier: funder.ror || funder.link,
                    funderIdentifierType: funder.ror ? 'ROR' : 'Other'
                }))
            }
        }
    };

    switch (payloadType) {
        case 'newVersion': {
            const { previousPublicationVersionDOI } = data;

            const publicationVersionDOIs = [
                {
                    relatedIdentifier: publicationVersion.publication.doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }
            ];

            if (previousPublicationVersionDOI) {
                publicationVersionDOIs.push({
                    relatedIdentifier: previousPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsNewVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                });
            }

            Object.assign(payload.data.attributes, {
                prefix: process.env.DOI_PREFIX,
                relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs],
                version: publicationVersion.versionNumber
            });

            break;
        }

        case 'previousVersion': {
            const { newPublicationVersionDOI, previousPublicationVersionDOI } = data;

            const publicationVersionDOIs = [
                {
                    relatedIdentifier: publicationVersion.publication.doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                },
                {
                    relatedIdentifier: newPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsPreviousVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }
            ];

            if (previousPublicationVersionDOI) {
                publicationVersionDOIs.push({
                    relatedIdentifier: previousPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsNewVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                });
            }

            Object.assign(payload.data.attributes, {
                relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs],
                version: publicationVersion.versionNumber
            });

            break;
        }

        default: {
            // canonical
            const { oldPublicationVersionDOIs } = data;

            // It's possible there will be no versioned DOIs at all.
            // Peer reviews only get a canonical DOI. In this case, skip this part.
            if (oldPublicationVersionDOIs.length || publicationVersion.doi) {
                const publicationVersionDOIs = [...oldPublicationVersionDOIs, publicationVersion.doi].map((doi) => ({
                    relatedIdentifier: doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'HasVersion',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }));

                Object.assign(payload.data.attributes, {
                    doi: data.doi,
                    identifiers: [
                        {
                            identifier: `https://doi.org/${data.doi}`,
                            identifierType: 'DOI'
                        }
                    ],
                    relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs]
                });
            }
        }
    }

    return payload;
};

export const updateDOI = (doi: string, payload: Record<string, unknown>): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.put<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}/${doi}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

export const createDOI = (payload: Record<string, unknown>): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.post<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

export const updatePublicationDOI = async (
    doi: string,
    latestPublicationVersion: I.PublicationVersion
): Promise<I.DOIResponse> => {
    if (!latestPublicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    // Unless this is a peer review (which doesn't get versioned DOIs, as they only have 1 version)
    // we need to have the DOI of the version so we can reference it in the canonical DOI's metadata.
    if (!latestPublicationVersion.doi && latestPublicationVersion.publication.type !== 'PEER_REVIEW') {
        throw Error("Supplied version doesn't have a valid DOI.");
    }

    const oldPublicationVersionDOIs: string[] = [];

    if (latestPublicationVersion.versionNumber > 1) {
        // get all the other versions DOIs for this publication
        const publication = await publicationService.get(latestPublicationVersion.versionOf);

        if (publication) {
            publication.versions
                .filter((version) => version.id !== latestPublicationVersion.id)
                .forEach((version) => {
                    if (version.doi) {
                        oldPublicationVersionDOIs.push(version.doi);
                    }
                });
        }
    }

    const payload = await createDOIPayload({
        payloadType: 'canonical',
        doi,
        publicationVersion: latestPublicationVersion,
        oldPublicationVersionDOIs
    });

    const response = await updateDOI(doi, payload);

    return response.data;
};

export const createPublicationVersionDOI = async (
    publicationVersion: I.PublicationVersion,
    previousPublicationVersionDOI?: string
): Promise<I.DOIResponse> => {
    if (!publicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    const payload = await createDOIPayload({
        payloadType: 'newVersion',
        publicationVersion,
        previousPublicationVersionDOI
    });

    const response = await createDOI(payload);

    return response.data;
};

export const updatePreviousPublicationVersionDOI = async (
    previousPublicationVersion: I.PublicationVersion,
    newPublicationVersionDOI: string
): Promise<I.DOIResponse> => {
    if (!previousPublicationVersion.doi) {
        throw Error("Supplied version doesn't have a valid DOI");
    }

    let previousVersionDoi: string | undefined;

    // check if there's a previous version of this previous version
    if (previousPublicationVersion.versionNumber > 1) {
        // get the previous version DOI of this previous version
        const previousVersion = await publicationVersionService.get(
            previousPublicationVersion.versionOf,
            previousPublicationVersion.versionNumber - 1
        );

        if (previousVersion?.doi) {
            previousVersionDoi = previousVersion.doi;
        }
    }

    const payload = await createDOIPayload({
        payloadType: 'previousVersion',
        newPublicationVersionDOI,
        publicationVersion: previousPublicationVersion,
        previousPublicationVersionDOI: previousVersionDoi
    });

    const response = await updateDOI(previousPublicationVersion.doi, payload);

    return response.data;
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

export const formatAffiliationName = (affiliation: I.MappedOrcidAffiliation): string => {
    const organization = affiliation.organization;

    return `${organization.name}: ${organization.address.city}, ${
        organization.address.region ? `${organization.address.region}, ` : ''
    }${organization.address.country}`;
};

const doiLinkBase = `https://${process.env.STAGE === 'prod' ? 'doi.org' : 'handle.test.datacite.org'}/`;

export const createPublicationHTMLTemplate = (
    publicationVersion: I.PublicationVersion,
    references: I.Reference[],
    linkedTo: I.LinkedToPublication[]
): string => {
    const {
        title,
        content,
        coAuthors,
        funders,
        conflictOfInterestText,
        language,
        licence,
        ethicalStatement,
        ethicalStatementFreeText,
        dataPermissionsStatement,
        dataPermissionsStatementProvidedBy,
        dataAccessStatement,
        selfDeclaration,
        additionalInformation
    } = publicationVersion;

    // cheerio uses htmlparser2
    // parsing the publication content can sometimes help with unpaired opening/closing tags
    const mainText = content ? cheerio.load(content).html() : '';

    const authors = coAuthors.filter((author) => Boolean(author.confirmedCoAuthor && author.linkedUser));

    // If corresponding author is not found in coauthors list, and we have the necessary fields, mock them up
    if (!authors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        authors.unshift({
            id: publicationVersion.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publicationVersion.user.email || '',
            linkedUser: publicationVersion.createdBy,
            publicationVersionId: publicationVersion.id,
            user: publicationVersion.user,
            reminderDate: null,
            isIndependent: true,
            affiliations: []
        });
    }

    // Get array of all affiliations from all authors
    const allAffiliations = authors
        .map((author) => author.affiliations)
        .flat() as unknown as I.MappedOrcidAffiliation[];
    const allAffiliationsWithNames = allAffiliations.map((affiliation) => ({
        ...affiliation,
        name: formatAffiliationName(affiliation)
    })) as I.AffiliationWithFormattedName[];

    // De-duplicate affiliations based on their name
    const seen = new Set();
    const uniqueAffiliations = allAffiliationsWithNames.filter((affiliation) => {
        const duplicate = seen.has(affiliation.name);
        seen.add(affiliation.name);

        return !duplicate;
    });
    // Sort affiliations by name
    const affiliations = uniqueAffiliations.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // Store the numbers (their index in the ordered "affiliations" array) of an author's affiliations
    // with the author. Then, we can write them alongside the author's name in superscript.
    const authorsWithAffiliationNumbers = authors.map((author) => {
        const authorAffiliations = author.affiliations as unknown as I.MappedOrcidAffiliation[];
        const affiliationNumbers = authorAffiliations
            .map(
                (affiliation) =>
                    affiliations.findIndex((orderedAffiliation) => orderedAffiliation.id === affiliation.id) + 1
            )
            .sort()
            // Remove any zeros. These would arise when the number of the affiliation can't be found.
            .filter((number) => number !== 0)
            .join(', ');

        return {
            ...author,
            affiliationNumbers
        };
    });

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
                    font-size: 12pt;
                }

                .section-subtitle {
                    font-size: 10pt;
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
                <strong>Authors:</strong> ${authorsWithAffiliationNumbers
                    .map(
                        (author) =>
                            `<a href="${process.env.BASE_URL}/authors/${author.linkedUser}">${author.user?.firstName} ${author.user?.lastName}` +
                            (author.affiliationNumbers.length ? `<sup>${author.affiliationNumbers}</sup>` : '') +
                            '</a>'
                    )
                    .join(', ')}
            </p>
            <p class="metadata">
                <strong>Publication Type:</strong> ${formatPublicationType(publicationVersion.publication.type)}
            </p>
            <p class="metadata">
                <strong>Publication Date:</strong> ${
                    publicationVersion.publishedDate
                        ? formatPDFDate(publicationVersion.publishedDate)
                        : formatPDFDate(new Date())
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
                <a href="${doiLinkBase + publicationVersion.publication.doi}">
                    ${publicationVersion.publication.doi}
                </a>
            </p>

            <div id="main-text">
                ${mainText}
            </div>

            ${
                additionalInformation.length
                    ? `<div class="section">
                    <h2 class="section-title">Additional parts of this work hosted elsewhere</h2>
                    <ul>
                    ${additionalInformation
                        .map(
                            (additionalInfoEntry) =>
                                `<li>
                                    <h3 class="section-subtitle"><b>${additionalInfoEntry.title}</b></h3>
                                    ${additionalInfoEntry.description && `<p>${additionalInfoEntry.description}</p>`}
                                    <p><a href="${additionalInfoEntry.url}" aria-label="${additionalInfoEntry.title}">
                                        Link to ${additionalInfoEntry.title}
                                    </a></p>
                                </li>`
                        )
                        .join('')}
                    </ul>
                </div>`
                    : ''
            }

            <div class="section affiliations">
                <h2 class="section-title">Affiliations</h2>
                ${
                    affiliations.length
                        ? '<ol>' +
                          affiliations
                              .map(
                                  (affiliation) =>
                                      '<li>' +
                                      (affiliation.url
                                          ? `<a href="${affiliation.url}">${affiliation.name}</a>`
                                          : affiliation.name) +
                                      '</li>'
                              )
                              .join('') +
                          '</ol>'
                        : '<p>No affiliations have been specified for this publication.</p>'
                }
            </div>

            <div class="section references">
                <h2 class="section-title">References</h2>
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
                            <h2 class="section-title">Parent publications</h2>
                            ${linkedTo
                                .map(
                                    (link) =>
                                        `<p style="margin-bottom: 1rem"><a href="${doiLinkBase + link.doi}">${
                                            link.title
                                        }</a></p>`
                                )
                                .join('')}
                        </div>`
                    : ''
            }

            ${
                selfDeclaration && ['PROTOCOL', 'HYPOTHESIS'].includes(publicationVersion.publication.type)
                    ? ` <div class="section">
                            <h2 class="section-title">Data access statement</h2>
                            ${
                                publicationVersion.publication.type === 'PROTOCOL'
                                    ? '<p>Data has not yet been collected according to this method/protocol.</p>'
                                    : '<p>Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)</p>'
                            }
                        </div>`
                    : ''
            }
            
            ${
                ethicalStatement
                    ? ` <div class="section">
                            <h2 class="section-title">Ethical statement</h2>
                            <p>${ethicalStatement}</p>
                            ${ethicalStatementFreeText ? `<p>${ethicalStatementFreeText}</p>` : ''}
                        </div>`
                    : ''
            }

            ${
                dataPermissionsStatement
                    ? ` <div class="section">
                            <h2 class="section-title">Data permissions statement</h2>
                            <p>${dataPermissionsStatement}</p>
                            ${dataPermissionsStatementProvidedBy ? `<p>${dataPermissionsStatementProvidedBy}</p>` : ''}
                        </div>`
                    : ''
            }
           
            ${
                dataAccessStatement
                    ? ` <div class="section">
                            <h2 class="section-title">Data access statement</h2>
                            <p>${dataAccessStatement}</p>
                        </div>`
                    : ''
            }

            <div class="section">
                <h2 class="section-title">Funders</h2>
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
                <h2 class="section-title">Conflict of interest</h2>
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

export const createPublicationHeaderTemplate = (publicationVersion: I.PublicationVersion): string => {
    const authors = publicationVersion.coAuthors.filter((author) => author.confirmedCoAuthor && author.linkedUser);

    if (!authors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        authors.unshift({
            id: publicationVersion.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publicationVersion.user.email || '',
            linkedUser: publicationVersion.createdBy,
            publicationVersionId: publicationVersion.id,
            user: publicationVersion.user,
            reminderDate: null,
            isIndependent: true,
            affiliations: []
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
                publicationVersion.publishedDate
                    ? formatPDFDate(publicationVersion.publishedDate)
                    : formatPDFDate(new Date())
            }
        </span>
    </div>`;
};

export const createPublicationFooterTemplate = (publicationVersion: I.PublicationVersion): string => {
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
            <span>DOI: <a href="${doiLinkBase + publicationVersion.publication.doi}">${
        publicationVersion.publication.doi
    }</a></span>
        </div>
        <div>
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>        
        <div>
            Published on <a href="${process.env.BASE_URL}">Octopus.ac</a>
            <a href="${
                process.env.BASE_URL
            }"><img id="octopus-logo" src="data:image/svg+xml;base64,${base64OctopusLogo}"/></a>
        </div>
    </div>`;
};

export const isEmptyContent = (content: string): boolean => (content ? /^(<p>\s*<\/p>)+$/.test(content) : true);

export const checkEnvVariable = (variableName: keyof NodeJS.ProcessEnv): string => {
    const value = process.env[variableName];

    if (value === undefined) {
        throw new Error(`Environment Variable ${variableName} is undefined`);
    }

    return value;
};

export const mapOrcidAffiliationSummary = (
    summary: I.OrcidAffiliationSummary,
    affiliationType: I.MappedOrcidAffiliation['affiliationType']
): I.MappedOrcidAffiliation => ({
    id: summary['put-code'],
    affiliationType,
    title: summary['role-title'],
    departmentName: summary['department-name'],
    startDate: summary['start-date']
        ? {
              year: summary['start-date'].year?.value || null,
              month: summary['start-date'].month?.value || null,
              day: summary['start-date'].day?.value || null
          }
        : undefined,
    endDate: summary['end-date']
        ? {
              year: summary['end-date'].year?.value || null,
              month: summary['end-date'].month?.value || null,
              day: summary['end-date'].day?.value || null
          }
        : undefined,
    organization: summary.organization,
    createdAt: summary['created-date'].value,
    updatedAt: summary['last-modified-date'].value,
    source: {
        name: summary.source['source-name'].value,
        orcid: summary.source['source-orcid']?.path || summary.source['source-client-id']?.path || ''
    },
    url: summary.url ? summary.url.value : undefined
});

const generateOTPCharacter = (OTP: string, characterSet: string): string => {
    const randomNumberArray = webcrypto.getRandomValues(new Uint32Array(1));
    const randomIndex = Math.floor(randomNumberArray[0] * Math.pow(2, -32) * characterSet.length);
    const newCharacter = characterSet[randomIndex];

    return OTP.includes(newCharacter) ? generateOTPCharacter(OTP, characterSet) : newCharacter;
};

export const generateOTP = (length = 10): string => {
    const allowedCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (length > allowedCharacters.length) {
        throw Error(
            `OTP length cannot be greater than the alphanumeric character set used for generating it (${allowedCharacters.length})`
        );
    }

    let OTP = '';

    while (OTP.length < length) {
        OTP += generateOTPCharacter(OTP, allowedCharacters);
    }

    return OTP;
};

/**
 *
 * @param fieldsParam - string of the form: "id,type,versions(id,title,createdAt,user)"
 * @param data - data to build the partial response from
 * @returns partial data
 *
 * Only works for 2 levels deep
 */
export const buildPartialResponse = <T extends object>(fieldsParam: string, data: T): Partial<T> => {
    const partialResponse: Partial<T> = {};

    // extract fields with nested properties inside like "versions(id,title,currentStatus) etc..."
    const nestedFieldMatches = fieldsParam.match(/([a-zA-Z]+)\(([a-zA-Z,]+)\)/g)?.filter((match) => match) || [];

    // get top level fields by removing matched nested fields
    const topLevelFields = nestedFieldMatches.reduce(
        (previousValue, currentValue) => previousValue.replace(currentValue, ''),
        fieldsParam
    );

    // add top level fields
    topLevelFields.split(',').forEach((field) => {
        if (field in data) {
            partialResponse[field] = data[field];
        }
    });

    // add nested fields
    nestedFieldMatches.forEach((match) => {
        const parts = match.split('('); // separate field name from it's nested fields inside parenthesis
        const fieldName = parts[0];

        if (fieldName in data) {
            const nestedFields = parts[1].split(')')[0].split(','); // split nested field names inside parenthesis

            if (Array.isArray(data[fieldName])) {
                partialResponse[fieldName] = data[fieldName].map((item) => {
                    const partialData: Partial<T> = {};

                    nestedFields.forEach((nestedField) => {
                        if (nestedField in item) {
                            partialData[nestedField] = item[nestedField];
                        }
                    });

                    return partialData;
                });
            } else {
                const partialData: Partial<T> = {};
                nestedFields.forEach((nestedField) => {
                    if (nestedField in data[fieldName]) {
                        partialData[nestedField] = data[fieldName][nestedField];
                    }
                });

                partialResponse[fieldName] = partialData;
            }
        }
    });

    return partialResponse;
};

export const validateURL = (value: string): boolean =>
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;/~+#-]*[\w@?^=%&/~+#-])/.test(value);

export const validateEmail = (email: string): boolean => {
    const regex = /^([\w+-]+\.)*[\w+-]+@[a-zA-Z][\w.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z.]*[a-zA-Z]$/;

    return regex.test(email);
};

export const replaceHTMLLineBreaks = (html: string): string => {
    return html.replace(/\\n|\\r\\n|\\n\\r|\\r/g, '<br>');
};
