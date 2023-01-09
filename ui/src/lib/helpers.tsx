import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import fileDownload from 'js-file-download';
import JWT from 'jsonwebtoken';

import * as luxon from 'luxon';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

/**
 * @description Truncates a string
 */
export const truncateString = (value: string, length: number): string => {
    return value.length ? (length < value.length ? `${value.substring(0, length)}...` : value) : value;
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
 * @description Formats a ISO string date to a relative to now string
 */
export const relativeDate = (value: string): string | null => {
    const date = luxon.DateTime.fromISO(value, { zone: 'utc' }).toRelativeCalendar();

    return date === 'Invalid DateTime' ? 'N/A' : date;
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
export const formatStatus = (status: Types.PublicationStatuses): string => {
    const statuses = {
        DRAFT: 'Draft',
        LIVE: 'Live',
        HIDDEN: 'Hidden'
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
 * @description Returns the string of the key for the current os
 */
export const setOSKey = (): string | React.ReactElement => {
    if (window.navigator.appVersion.indexOf('Mac')) {
        return <>&#8984;K</>;
    } else {
        return 'Ctrl-K';
    }
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
 * @description For use in NextJS SSR, check cookies for token & set the response location
 */
export const guardPrivateRoute = async (context: Types.GetServerSidePropsContext): Promise<Types.UserType> => {
    const token = getJWT(context);
    const redirectTo = encodeURIComponent(context.req.url || Config.urls.home.path);

    const redirectToORCIDLogin = () => {
        context.res.writeHead(302, {
            Location: `${Config.urls.orcidLogin.path}&state=${redirectTo}`
        });

        context.res.end();
    };

    if (!token) {
        redirectToORCIDLogin();
        return {} as Types.UserType;
    }

    const decodedToken = await getDecodedUserToken(token);

    if (!decodedToken) {
        redirectToORCIDLogin();
    } else {
        const { email } = decodedToken; // check user email
        const isVerifyEmailPage = context.req.url?.startsWith(`${Config.urls.verify.path}`);

        // Only allow users with a verified email to access guarded routes
        if (!email && !isVerifyEmailPage) {
            context.res.writeHead(302, {
                Location: `${Config.urls.verify.path}?state=${redirectTo}`
            });
            context.res.end();
        }
    }

    return decodedToken as Types.UserType;
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

    // @ts-ignore
    fileDownload(res.data, fileName);
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

export const checkLinkIsValid = (text: string) => {
    const lowerCaseText = text.toLowerCase();
    const urlR = new RegExp(
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    );
    return urlR.test(lowerCaseText);
};

export const linkedPublicationTypes = {
    PROBLEM: ['PROBLEM', 'HYPOTHESIS'],
    HYPOTHESIS: ['PROBLEM', 'PROTOCOL'],
    PROTOCOL: ['PROBLEM', 'DATA'],
    DATA: ['PROBLEM', 'ANALYSIS'],
    ANALYSIS: ['PROBLEM', 'INTERPRETATION'],
    INTERPRETATION: ['PROBLEM', 'REAL_WORLD_APPLICATION'],
    REAL_WORLD_APPLICATION: ['PROBLEM']
};

// original URL regex: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
export const getURLsFromText = (text: string) =>
    text.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/g) || [];

export const validateURL = (value: string) =>
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/.test(value);

// extracts DOIs including ‘DOI: 10.’ / ‘DOI:10.’ / ‘DOI-10.’ / ‘DOI - 10.’ / ‘DOI 10.’ etc...
export const getFullDOIsStrings = (text: string) =>
    text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi
    ) || [];

// extracts the DOIs only
export const getDOIsFromText = (text: string) => text.match(/(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/g) || [];

export const validateDOI = (value: string) => /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/.test(value);

export const isEmptyContent = (content: string) => !content || /<p>\s*<\/p>/.test(content);
