import React from 'react';
import JWT from 'jsonwebtoken';
import Cookies from 'js-cookie';
import * as luxon from 'luxon';
import fileDownload from 'js-file-download';
import axios from 'axios';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Types from '@types';

/**
 * @description Truncates a string
 */
export const truncateString = (value: string, length: number): string => {
    return value.length ? `${value.substring(0, length)}...` : '...';
};

/**
 * @description Formats a string ISO from the DB
 */
export const formatDate = (value: string): string => {
    const date = luxon.DateTime.fromISO(value, { zone: 'utc' }).toLocaleString({
        day: 'numeric',
        month: 'long',
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
        PROBLEM: 'Problem',
        PROTOCOL: 'Protocol',
        ANALYSIS: 'Analysis',
        REAL_WORLD_APPLICATION: 'Real world application',
        HYPOTHESIS: 'Hypothesis',
        DATA: 'Data',
        INTERPRETATION: 'Interpretation',
        PEER_REVIEW: 'Peer review'
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
    Cookies.set(Config.keys.cookieStorage.token, token, { expires: expireTime });
    return JWT.decode(token);
};

/**
 * @description Clear the JWT from browser cookie storage
 */
export const clearJWT = () => {
    Cookies.remove(Config.keys.cookieStorage.token);
};

/**
 * @description For use in NextJS SSR, check cookies for token & set the response location
 */
export const guardPrivateRoute = (context: Types.GetServerSidePropsContext): string => {
    const cookies = context.req.cookies;
    const token = cookies[Config.keys.cookieStorage.token];

    if (!token) {
        context.res.writeHead(302, {
            Location: `${Config.urls.orcidLogin.path}&state=${context.req.url || Config.urls.home.path}`
        });
        context.res.end();
    }

    return token;
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

export const findRating = (
    index: number,
    ratingList: Interfaces.APIRatingShape[],
    publicationType: Types.PublicationType
): number | null => {
    const ratingType = Object.values(Config.values.octopusInformation.publications[publicationType].ratings)[index].id;
    const found = ratingList.find((rating: Interfaces.APIRatingShape) => rating.category === ratingType);
    return found ? found.rating : null;
};
