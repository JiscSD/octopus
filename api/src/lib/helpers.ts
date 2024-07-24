import * as DOMPurify from 'isomorphic-dompurify';
import * as I from 'interface';
import { webcrypto } from 'crypto';

export const getSafeHTML = (content: string): string => {
    // Sanitize against XSS
    return DOMPurify.sanitize(content);
};

export const octopusInformation: {
    publicationTypes: I.PublicationType[];
    languages: I.Languages[];
} = {
    publicationTypes: [
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

export const formatAffiliationName = (affiliation: I.MappedOrcidAffiliation): string => {
    const organization = affiliation.organization;

    return `${organization.name}: ${organization.address.city}, ${
        organization.address.region ? `${organization.address.region}, ` : ''
    }${organization.address.country}`;
};

export const isEmptyContent = (content: string): boolean => (content ? /^(<p>\s*<\/p>)+$/.test(content) : true);

export const checkEnvVariable = (variableName: keyof NodeJS.ProcessEnv): string => {
    const value = process.env[variableName];

    if (value === undefined) {
        throw new Error(`Environment Variable ${variableName} is undefined`);
    }

    return value;
};

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
    return html.replace(/\n|\r\n|\n\r|\r/g, '<br>');
};

// Check if two arrays are equal.
export const compareArrays = <T>(a: Array<T>, b: Array<T>): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }

    return true;
};

export const abbreviateUserName = <T extends { firstName: string; lastName: string | null; role?: I.Role } | undefined>(
    user: T
): string => {
    // Should not occur, but just in case, better to present something than nothing.
    if (!user || (!user.firstName && !user.lastName)) {
        return 'Anon. User';
    }

    // Majority of cases: user is not an organisational account, and has requisite data for default abbreviation.
    if (!(user.role === 'ORGANISATION') && user.firstName.length && user.lastName) {
        return `${user.firstName[0]}. ${user.lastName}`;
    }

    // Default for organisational accounts and general fallback.
    return user.firstName;
};
