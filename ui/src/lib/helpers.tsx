import React from 'react';
import axios from 'axios';
import JWT from 'jsonwebtoken';
import * as entities from 'entities';
import * as katex from 'katex';

import * as cheerio from 'cheerio';
import * as luxon from 'luxon';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';
import * as Interfaces from '@/interfaces';
import Cookies from '@/cookies';
import { Middleware } from 'swr';

/**
 * @description Truncates a string
 */
export const truncateString = (string: string, length: number): string => {
    const trimmedString = string.trim();
    if (length <= 3) {
        return '...';
    }
    const sliceLength = length - 3;
    return trimmedString.length > sliceLength ? trimmedString.slice(0, sliceLength).trimEnd() + '...' : trimmedString;
};

/**
 * @description Formats a string ISO from the DB
 */
export const formatDate = (value: string, formatType?: 'short' | 'long'): string => {
    const date = luxon.DateTime.fromISO(value, { zone: 'utc' }).toLocaleString({
        day: 'numeric',
        month: formatType || 'long',
        year: 'numeric'
    });

    return date === 'Invalid DateTime' ? 'N/A' : date;
};

/**
 * @description Formats a string ISO from the DB to datetime
 */
export const formatDateTime = (value: string, formatType?: 'short' | 'long'): string => {
    const date = luxon.DateTime.fromISO(value, { zone: 'utc' }).toLocaleString({
        day: 'numeric',
        month: formatType || 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return date === 'Invalid DateTime' ? 'N/A' : `${date} GMT`;
};

/**
 * @description Format a publication type returned from the DB
 */
export const formatPublicationType = (publicationType: Types.PublicationType): string => {
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

/**
 * @description Format a publication status
 */
export const formatStatus = (status: Types.PublicationStatus): string => {
    const statuses = {
        DRAFT: 'Draft',
        LIVE: 'Live',
        HIDDEN: 'Hidden',
        LOCKED: 'Locked'
    };

    return statuses[status];
};

/**
 * @description Returns the color for a given publication type
 */
export const publicationColor = (publicationType: Types.PublicationType) => {
    const color = {
        PROBLEM: '#67bea3',
        PROTOCOL: '#ca5954',
        ANALYSIS: '#5c7fb8',
        REAL_WORLD_APPLICATION: '#c3a062',
        HYPOTHESIS: '#b474e1',
        DATA: '#3781f7',
        INTERPRETATION: '#9a1f2e',
        PEER_REVIEW: '#f6f681'
    };

    return color[publicationType];
};

/**
 * @description Return the publication type next in the chain
 */
export const findNextPublicationType = (type: Types.PublicationType) => {
    const index = Config.values.publicationTypes.findIndex((t) => t === type) + 1;
    return Config.values.publicationTypes[index];
};

/**
 * @description Return the publiction type previous in the chain
 */
export const findPreviousPublicationType = (type: Types.PublicationType) => {
    const index = Config.values.publicationTypes.findIndex((t) => t === type) - 1;
    return Config.values.publicationTypes[index];
};

/**
 * @description Returns the % of a value to the % max
 */
export const percentage = (partialValue: number, totalValue: number) => {
    return (100 * partialValue) / totalValue;
};

/**
 * @description Returns a random hex color value
 */
export const randomColor = () => {
    const value = Math.floor(Math.random() * 16777215).toString(16);
    return `#${value}`;
};

/**
 * @description Return a random floored number in a given range
 */
export const randomWholeNumberInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
};

/**
 * @description Set the JWT token in a cookie & return the decaded version
 */
export const setAndReturnJWT = (token: string) => {
    const expireTime = 8 / 24;
    Cookies.set(Config.keys.cookieStorage.token, token, { expires: expireTime, secure: true });
    return JWT.decode(token);
};

/**
 * @description Clear the JWT from browser cookie storage
 */
export const clearJWT = () => {
    Cookies.remove(Config.keys.cookieStorage.token);
};

/**
 * @description returns JWT from browser cookies or SSR context
 */
export const getJWT = (context?: Types.GetServerSidePropsContext) =>
    context ? context.req.cookies[Config.keys.cookieStorage.token] : Cookies.get(Config.keys.cookieStorage.token);

/**
 *
 * @param token string
 * @returns decoded user token
 */
export const getDecodedUserToken = async (token: string) => {
    try {
        return (await (
            await api.get(Config.endpoints.decodeUserToken, token)
        ).data) as Types.UserType;
    } catch (error) {
        return null;
    }
};

/**
 * @description todo
 */
export const publicationsAvailabletoPublication = (publicationType: Types.PublicationType) => {
    let available: Types.PublicationType[] | [] = [];

    // can link to ->
    switch (publicationType) {
        case 'PEER_REVIEW':
            available = [
                'PROBLEM',
                'PROTOCOL',
                'ANALYSIS',
                'REAL_WORLD_APPLICATION',
                'HYPOTHESIS',
                'DATA',
                'INTERPRETATION'
            ];
            break;
        case 'PROBLEM':
            available = [
                'PROBLEM',
                'PROTOCOL',
                'ANALYSIS',
                'REAL_WORLD_APPLICATION',
                'HYPOTHESIS',
                'DATA',
                'INTERPRETATION',
                'PEER_REVIEW'
            ];
            break;
        case 'HYPOTHESIS':
            available = ['PROBLEM'];
            break;
        case 'PROTOCOL':
            available = ['HYPOTHESIS'];
            break;
        case 'DATA':
            available = ['PROTOCOL'];
            break;
        case 'ANALYSIS':
            available = ['DATA'];
            break;
        case 'INTERPRETATION':
            available = ['ANALYSIS'];
            break;
        case 'REAL_WORLD_APPLICATION':
            available = ['INTERPRETATION'];
            break;
        default:
            null;
    }

    return available;
};

export const blobFileDownload = async (url: string, fileName: string) => {
    const res = await axios.get(url, {
        responseType: 'blob'
    });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(res.data);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
};

export const getBase64FromFile = async (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result as string);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });

export const formatKeywords = (keywordsAsString: string): string[] => {
    let formattedKeywords: string[] = [];
    if (keywordsAsString.length) {
        formattedKeywords = keywordsAsString
            .replace(/\n/g, ',') // replace new lines with comma
            .split(',') // split by comma
            .map((word) => word.trim()) // trim each keywords white space
            .filter((word) => word.length); // dont include any empty string entries
    }
    return formattedKeywords;
};

export const linkedPublicationTypes = {
    PROBLEM: ['PROBLEM', 'HYPOTHESIS'],
    HYPOTHESIS: ['PROBLEM', 'PROTOCOL'],
    PROTOCOL: ['PROBLEM', 'DATA'],
    DATA: ['PROBLEM', 'ANALYSIS'],
    ANALYSIS: ['PROBLEM', 'INTERPRETATION'],
    INTERPRETATION: ['PROBLEM', 'REAL_WORLD_APPLICATION'],
    REAL_WORLD_APPLICATION: ['PROBLEM'],
    PEER_REVIEW: ['PROBLEM']
};

// original URL regex: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
export const getURLsFromText = (text: string) =>
    text.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/g) || [];

export const validateURL = (value: string) =>
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/.test(value);

// extracts DOIs including ‘DOI: 10.’ / ‘DOI:10.’ / ‘DOI-10.’ / ‘DOI - 10.’ / ‘DOI 10.’ etc...
export const getFullDOIsStrings = (text: string) =>
    text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi
    ) || [];

// extracts the DOIs only
export const getDOIsFromText = (text: string) => text.match(/(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/g) || [];

export const validateDOI = (value: string) => /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/.test(value);

export const validateEmail = (email: string): Boolean => {
    const regex = /^([\w+-]+\.)*[\w+-]+@[a-zA-Z][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;
    return regex.test(email);
};

export const isEmptyContent = (content: string) => (content ? /^(<p>\s*<\/p>)+$/.test(content) : true);

export const getPublicationStatusByAuthor = (
    publicationVersion: Interfaces.PublicationVersion,
    user: Types.UserType | Interfaces.User
) => {
    if (publicationVersion.currentStatus === 'LIVE') return 'Live';

    if (publicationVersion.currentStatus === 'DRAFT') {
        return publicationVersion.createdBy === user.id ? 'Draft' : 'Editing in progress';
    }

    if (publicationVersion.coAuthors.length > 1) {
        if (publicationVersion.coAuthors.every((author) => author.confirmedCoAuthor)) {
            return 'Ready to publish';
        }

        if (
            user.id !== publicationVersion.createdBy &&
            publicationVersion.coAuthors.find((author) => author.linkedUser === user.id && !author.confirmedCoAuthor)
        ) {
            return 'Pending your approval';
        }
    }

    return 'Pending author approval';
};

export const getFormattedAffiliationDate = (date: number | Interfaces.OrcidAffiliationDate): string => {
    if (typeof date === 'number') {
        const jsDate = new Date(date);
        const day = jsDate.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = jsDate.toLocaleDateString('en-GB', { month: '2-digit' });
        const year = jsDate.toLocaleDateString('en-GB', { year: 'numeric' });

        return `${year}-${month}-${day}`;
    }

    return Object.values({ year: date.year, month: date.month, day: date.day }) // enforce order yyyy-mm-dd
        .filter((value) => value)
        .join('-');
};

export const getSortedAffiliations = (affiliations: Interfaces.MappedOrcidAffiliation[]) => {
    const affiliationsWithStartDate = affiliations.filter((affiliation) => affiliation.startDate);
    const affiliationsWithoutStartDate = affiliations.filter((affiliation) => !affiliation.startDate);

    return [
        ...affiliationsWithStartDate.sort((a1, a2) =>
            getFormattedAffiliationDate(a2.startDate as Interfaces.OrcidAffiliationDate).localeCompare(
                getFormattedAffiliationDate(a1.startDate as Interfaces.OrcidAffiliationDate)
            )
        ),
        ...affiliationsWithoutStartDate.sort((a1, a2) => a1.organization.name.localeCompare(a2.organization.name))
    ];
};

// Determines whether a tab is missing mandatory fields or not.
export const getTabCompleteness = (
    steps: Interfaces.CreationStep[],
    store: Types.PublicationCreationStoreType
): Interfaces.CreationStepWithCompletenessStatus[] => {
    const { publicationVersion, linkedTo } = store;
    const stepsWithCompleteness: Interfaces.CreationStepWithCompletenessStatus[] = [];
    const correspondingAuthor = publicationVersion?.coAuthors.find(
        (author) => author.linkedUser === store.publicationVersion?.createdBy
    );

    steps.forEach((step) => {
        switch (step.id) {
            case 'KEY_INFORMATION':
                if (publicationVersion?.title) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'AFFILIATIONS':
                if (correspondingAuthor?.affiliations.length || correspondingAuthor?.isIndependent) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'LINKED_ITEMS':
                const hasCoauthors = publicationVersion?.coAuthors.length > 1;
                const hasLink = linkedTo.length > 0 || publicationVersion.topics.length > 0;
                const allLinkedPublicationsAreLive = linkedTo.every((link) => link.currentStatus === 'LIVE');
                const hasLinkNotPendingDeletion = linkedTo.some((link) => link.pendingDeletion === false);
                if (
                    // When coauthors are added, any link is fine to request approval, even to a draft publication.
                    (hasCoauthors && hasLink) ||
                    // When no coauthors are added, all linked publications need to be live.
                    (!hasCoauthors && hasLink && allLinkedPublicationsAreLive && hasLinkNotPendingDeletion)
                ) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'MAIN_TEXT':
                if (
                    publicationVersion?.content &&
                    !isEmptyContent(publicationVersion?.content) &&
                    publicationVersion.language
                ) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'CONFLICT_OF_INTEREST':
                if (
                    (publicationVersion?.conflictOfInterestStatus &&
                        publicationVersion?.conflictOfInterestText?.length) ||
                    publicationVersion?.conflictOfInterestStatus === false
                ) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'CO_AUTHORS':
                if (publicationVersion?.coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor)) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }
                break;
            case 'FUNDERS':
                // No mandatory fields
                stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                break;
            case 'DATA_STATEMENT':
                if (
                    publicationVersion?.ethicalStatement &&
                    (publicationVersion?.dataPermissionsStatement === Config.values.dataPermissionsOptions[1] ||
                        (publicationVersion?.dataPermissionsStatement === Config.values.dataPermissionsOptions[0] &&
                            publicationVersion?.dataPermissionsStatementProvidedBy))
                ) {
                    stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                } else {
                    stepsWithCompleteness.push({ status: 'INCOMPLETE', ...step });
                }

                break;
            case 'RESEARCH_PROCESS':
                // No mandatory fields
                stepsWithCompleteness.push({ status: 'COMPLETE', ...step });
                break;
        }
    });
    return stepsWithCompleteness;
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
    fn: F,
    wait: number,
    { maxWait }: { maxWait?: number } = {}
) => {
    let timeout: NodeJS.Timeout;
    let maxTimeout: NodeJS.Timeout | null;

    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (maxTimeout) {
                clearTimeout(maxTimeout);
                maxTimeout = null;
            }
            fn(...args);
        }, wait);

        if (maxWait && !maxTimeout) {
            maxTimeout = setTimeout(() => {
                clearTimeout(timeout);
                maxTimeout = null;
                fn(...args);
            }, maxWait);
        }
    };

    return debounced;
};

/**
 * @description 'getServerSideProps' wrapper for protected routes
 */

export const withServerSession = (
    callback: (
        context: Types.GetServerSidePropsContext,
        currentUser: Types.UserType
    ) => Promise<Types.GetServerSidePropsResult<{}>>
) => {
    return async function (context: Types.GetServerSidePropsContext): Promise<Types.GetServerSidePropsResult<{}>> {
        const token = getJWT(context);
        const { resolvedUrl } = context;

        if (!token) {
            // redirect to ORCID login page
            return {
                redirect: {
                    destination: `${Config.urls.orcidLogin.path}&state=${encodeURIComponent(resolvedUrl)}`,
                    permanent: false
                }
            };
        }

        const decodedToken = await getDecodedUserToken(token);

        if (!decodedToken) {
            // redirect to ORCID login page
            return {
                redirect: {
                    destination: `${Config.urls.orcidLogin.path}&state=${encodeURIComponent(resolvedUrl)}`,
                    permanent: false
                }
            };
        }

        const { email, firstName, lastName } = decodedToken;
        const isVerifyEmailPage = resolvedUrl.startsWith(Config.urls.verify.path);
        const isHomePage = context.req.url === '/';

        // Only allow users with a verified email and visible name to access protected routes
        if (!email && !isVerifyEmailPage) {
            // redirect to /verify page
            return {
                redirect: {
                    destination: `${Config.urls.verify.path}?state=${encodeURIComponent(resolvedUrl)}`,
                    permanent: false
                }
            };
        }
        if (!(firstName || lastName) && !isHomePage) {
            // redirect to home page
            return {
                redirect: {
                    destination: `${Config.urls.home.path}`,
                    permanent: false
                }
            };
        }

        return callback(context, decodedToken);
    };
};

// This is a SWR middleware for keeping the data even if key changes until new data has loaded.
export const laggy: Middleware = (useSWRNext) => {
    return (key, fetcher, config) => {
        // Use a ref to store previous returned data.
        const laggyDataRef = React.useRef<{} | null>();

        // Actual SWR hook.
        const swr = useSWRNext(key, fetcher, config);

        React.useEffect(() => {
            // Update ref if data is not undefined.
            if (swr.data !== undefined) {
                laggyDataRef.current = swr.data;
            }
        }, [swr.data]);

        // Fallback to previous data if the current data is undefined.
        const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data;

        return Object.assign({}, swr, {
            data: dataOrLaggyData
        });
    };
};

// helper to scroll top smooth - using setTimeout to ensure event loop executes this after any state updates so it doesn't get interrupted
export const scrollTopSmooth = () => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);

export const htmlToText = (htmlString: string): string => {
    if (typeof window !== 'undefined') {
        // Use DOMParser if running in browser
        const htmlDoc = new DOMParser().parseFromString(htmlString, 'text/html');
        // Remove tables as text inside them is unlikely to make any sense
        const nodesToRemove = htmlDoc.querySelectorAll('table');
        for (const node of nodesToRemove) {
            node.remove();
        }
        const text = htmlDoc.documentElement.textContent || '';
        // Remove LaTeX expressions.
        return text.replace(Config.values.latexRegex, '');
    } else {
        // Server-side fallback method
        const $ = cheerio.load(htmlString);
        $('table').remove();
        return $(':root').text() || '';
    }
};

export const toKebabCase = (inputString: string): string => {
    return inputString
        .toLowerCase() // Convert to lower case
        .replace(/[^\w\s\']|_/g, '') // Remove everything except alphanumeric characters and whitespace
        .replace(/\s+/g, ' ') // Condense longer whitespace down to one space
        .replace(/\s/g, '-'); // Replace single spaces with hyphen
};

// Fetches sitemaps of a category from the sitemap S3 bucket and constructs a sitemap index of them.
export const getSitemapIndexXML = async (category: 'publications' | 'users'): Promise<string> => {
    let sitemapS3Keys: string[] = [];
    try {
        const sitemapsRequest = await api.get('/sitemaps/paths');
        sitemapS3Keys = sitemapsRequest.data;
    } catch (error) {
        console.log(error);
    }
    // Write an XML element for each applicable sitemap we have in S3
    const sitemapXMLElements = sitemapS3Keys
        .filter((sitemapS3Key) => sitemapS3Key.startsWith(category + '/'))
        .map((sitemapS3Key) => `<sitemap><loc>${Config.urls.baseUrl}/sitemaps/${sitemapS3Key}</loc></sitemap>`)
        .join('');
    return `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemapXMLElements}
        </sitemapindex>
    `;
};

export const abbreviateUserName = <
    T extends { firstName: string | null; lastName: string | null; role?: Types.UserRole } | undefined
>(
    user: T
): string => {
    // Should not occur, but just in case, better to present something than nothing.
    if (!user || !user.firstName) {
        return 'Anon. User';
    }
    // Majority of cases: user is not an organisational account, and has requisite data for default abbreviation.
    if (!(user.role === 'ORGANISATION') && user.firstName.length && user.lastName) {
        return `${user.firstName[0]}. ${user.lastName}`;
    }
    // Default for organisational accounts and general fallback.
    return user.firstName;
};

export const isPublicationVersionExemptFromReversioning = (publicationVersion: Interfaces.PublicationVersion) => {
    const { publication } = publicationVersion;
    const isPeerReview = publication.type === 'PEER_REVIEW';
    const isARI = publication.externalSource === 'ARI';
    return isPeerReview || isARI;
};

// Get a nextJS context.query param as a string or null.
export const extractNextQueryParam = (param: string | string[] | undefined, checkNumber?: boolean): string | null => {
    const rawValue = Array.isArray(param) ? param[0] : param || null;
    if (checkNumber) {
        // Return null if value cannot be parsed as a number.
        return rawValue && !Number.isNaN(parseInt(rawValue, 10)) ? rawValue : null;
    } else {
        return rawValue;
    }
};

// Find LaTeX expressions in a string and replace them with the rendered HTML.
export const renderLatexInHTMLString = (htmlString: string): string => {
    // The regex provides a capturing group for the expression, accessible as p1 in the callback function.
    const replaced = htmlString.replace(Config.values.latexRegex, (_match, p1) => {
        // We are decoding HTML entities here as the text editor sometimes saves characters used in LaTeX
        // expressions in escaped form. The katex rendering should make it safe from injection: https://katex.org/docs/security.
        const decoded = entities.decodeHTML(p1);
        const rendered = katex.renderToString(decoded);
        return rendered;
    });
    return replaced;
};

// Return a language value if it is not english, otherwise undefined.
// Useful for setting the HTML lang attribute - if it's underfined it won't be added.
export const languageIfNotEnglish = (language: Types.Languages): Types.Languages | undefined => {
    return language !== 'en' ? language : undefined;
};
