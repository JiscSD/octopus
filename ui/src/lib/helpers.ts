import { DateTime } from 'luxon';

export const truncateString = (value: string, length: number): string => {
    return `${value.substring(0, length)}...`;
};

export const formatDate = (value: string): string => {
    return DateTime.fromISO(value, { zone: 'utc' }).toLocaleString({
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
