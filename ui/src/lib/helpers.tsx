import React from 'react';
import * as luxon from 'luxon';

/**
 * @description Truncates a string
 */
export const truncateString = (value: string, length: number): string => {
    return `${value.substring(0, length)}...`;
};

/**
 * @description Formats a string ISO from the DB
 */
export const formatDate = (value: string): string => {
    return luxon.DateTime.fromISO(value, { zone: 'utc' }).toLocaleString({
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * @description Formats a ISO string date to a relative to now string
 */
export const relativeDate = (value: string): string | null => {
    return luxon.DateTime.fromISO(value, { zone: 'utc' }).toRelativeCalendar();
};

/**
 * @description Format a publication type returned from the DB
 */
export const formatPublicationType = (value: string): string => {
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

    // @ts-ignore
    return types[value];
};

export const setOSKey = (): string | JSX.Element => {
    if (window.navigator.appVersion.indexOf('Mac')) {
        return <>&#8984;K</>;
    } else {
        return 'Ctrl-K';
    }
};
