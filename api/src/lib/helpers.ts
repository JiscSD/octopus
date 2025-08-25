import * as DOMPurify from 'isomorphic-dompurify';
import * as entities from 'entities';
import * as katex from 'katex';
import * as I from 'interface';
import { webcrypto } from 'crypto';

export const getSafeHTML = (content: string): string => {
    // Sanitize against XSS
    return DOMPurify.sanitize(content);
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
export const formatPublicationType = (publicationType: I.PublicationType, detailed = false): string => {
    const types = {
        PROBLEM: 'Research Problem',
        HYPOTHESIS: 'Rationale / Hypothesis',
        PROTOCOL: 'Method',
        DATA: detailed ? 'Results / Sources of Evidence' : 'Results / Sources',
        ANALYSIS: 'Analysis',
        INTERPRETATION: 'Interpretation',
        REAL_WORLD_APPLICATION: 'Applications / Implications',
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

// If a string is enclosed in matching quotes, remove them.
export const stripEnclosingQuotes = (string: string): string => {
    // String is enclosed in " or '
    if (
        (string.slice(0, 1) === '"' && string.slice(-1) === '"') ||
        (string.slice(0, 1) === "'" && string.slice(-1) === "'")
    ) {
        return string.slice(1, -1);
    } else {
        return string;
    }
};

// Check if two arrays are equal. By default, doesn't care about order.
export const compareArrays = <T>(a: Array<T>, b: Array<T>, strictOrder?: boolean): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    if (!strictOrder) {
        a.sort();
        b.sort();
    }

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

export const getUserFullName = <T extends { firstName: string; lastName: string | null } | undefined | null>(
    user: T
): string => {
    if (!user) {
        return 'Anonymous User';
    }

    if (user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    } else {
        return user.firstName;
    }
};

// Parses args passed to an npm script in the following style:
// npm run script -- arg=value another=somethingElse
// and returns them as keys and values in an object.
export const parseNpmScriptArgs = (): { [key: string]: string } => {
    const args = process.argv.slice(2);
    const parsedArgs = {};

    args.forEach((arg) => {
        const parts = arg.split('=');

        parsedArgs[parts[0]] = parts[1];
    });

    return parsedArgs;
};

export const getPublicationUrl = (id: string): string => {
    return `${process.env.BASE_URL}/publications/${id}`;
};

// Find LaTeX expressions in a string and replace them with the rendered HTML.
export const renderLatexInHTMLString = (htmlString: string): string => {
    // Defines the boundaries for LaTeX expressions in publication content. Expressions are enclosed on both ends by "$$".
    const latexRegex = /\$\$([^$]*)\$\$/gi;
    // The regex provides a capturing group for the expression, accessible as p1 in the callback function.
    const replaced = htmlString.replace(latexRegex, (_match, p1) => {
        // We are decoding HTML entities here as the text editor sometimes saves characters used in LaTeX
        // expressions in escaped form. The katex rendering should make it safe from injection: https://katex.org/docs/security.
        const decoded = entities.decodeHTML(p1);
        const rendered = katex.renderToString(decoded);

        return rendered;
    });

    return replaced;
};

export const isPublicationExemptFromReversioning = <T extends Pick<I.Publication, 'type' | 'externalSource'>>(
    publication: T
): boolean => {
    const isPeerReview = publication.type === 'PEER_REVIEW';
    const isARI = publication.externalSource === 'ARI';

    return isPeerReview || isARI;
};

export const checkBooleanArgValue = (arg: string): void => {
    if (arg && !(arg === 'true' || arg === 'false')) {
        throw new Error(`"${arg}" must be "true" or "false"`);
    }
};

export function obfuscateEmail(email: string): string {
    try {
        const [name, domain] = email.split('@');

        return `${name.substring(0, 3)}*****@${domain}`;
    } catch (error) {
        console.error('Error obfuscating email:', error);

        return email;
    }
}
