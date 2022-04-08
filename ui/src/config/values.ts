import * as Interfaces from '@interfaces';
import * as Types from '@types';

export const publicationTypes: Types.PublicationType[] = [
    'PROBLEM',
    'HYPOTHESIS',
    'PROTOCOL',
    'DATA',
    'ANALYSIS',
    'INTERPRETATION',
    'REAL_WORLD_APPLICATION',
    'PEER_REVIEW'
];

export const octopusInformation: Interfaces.OctopusInformation = {
    publications: {
        PROBLEM: {
            id: 'PROBLEM',
            heading: 'Research Problem',
            content: 'A neatly defined scientific problem.',
            ratings: [
                { id: 'PROBLEM_WELL_DEFINED', value: 'Well defined', description: 'Lorem ipsum' },
                { id: 'PROBLEM_ORIGINAL', value: 'Original', description: 'Lorem ipsum' },
                { id: 'PROBLEM_IMPORTANT', value: 'Important', description: 'Lorem ipsum' }
            ]
        },
        HYPOTHESIS: {
            id: 'HYPOTHESIS',
            heading: 'Hypothesis',
            content:
                'An original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed.',
            ratings: [
                { id: 'HYPOTHESIS_ORIGINAL', value: 'Original', description: 'Lorem ipsum' },
                { id: 'HYPOTHESIS_SCIENTIFICALLY_VALID', value: 'scientifically valid', description: 'Lorem ipsum' },
                { id: 'HYPOTHESIS_WELL_DEFINED', value: 'Well defined', description: 'Lorem ipsum' }
            ]
        },
        PROTOCOL: {
            id: 'PROTOCOL',
            heading: 'Protocol',
            content: 'A practical method of testing an existing published Hypothesis.',
            ratings: [
                { id: 'PROTOCOL_CLEAR', value: 'Clear', description: 'Lorem ipsum' },
                { id: 'PROTOCOL_ORIGINAL', value: 'Original', description: 'Lorem ipsum' },
                { id: 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS', value: 'Appropriate', description: 'Lorem ipsum' }
            ]
        },
        DATA: {
            id: 'DATA',
            heading: 'Data',
            content:
                'Raw data or summarised results collected according to an existing published Method (can be linked to a data repository).',
            ratings: [
                { id: 'DATA_WELL_ANNOTATED', value: 'Well annotated', description: 'Lorem ipsum' },
                { id: 'DATA_SIZE_OF_DATASET', value: 'Size of dataset', description: 'Lorem ipsum' },
                { id: 'DATA_FOLLOWED_PROTOCOL', value: 'Followed protcol', description: 'Lorem ipsum' }
            ]
        },
        ANALYSIS: {
            id: 'ANALYSIS',
            heading: 'Analysis',
            content: 'A statistical or thematic analysis of existing published Data or Results.',
            ratings: [
                { id: 'ANALYSIS_ORIGINAL', value: 'Original', description: 'Lorem ipsum' },
                { id: 'ANALYSIS_CLEAR', value: 'Clear', description: 'Lorem ipsum' },
                { id: 'ANALYSIS_APPROPRIATE_METHODOLOGY', value: 'Appropriate mathodology', description: 'Lorem ipsum' }
            ]
        },
        INTERPRETATION: {
            id: 'INTERPRETATION',
            heading: 'Interpretation',
            content: 'A discussion around an existing published Analysis.',
            ratings: [
                { id: 'INTERPRETATION_INSIGHTFUL', value: 'Insightful', description: 'Lorem ipsum' },
                {
                    id: 'INTERPRETATION_CONSISTENT_WITH_DATA',
                    value: 'Consistent with data',
                    description: 'Lorem ipsum'
                },
                { id: 'INTERPRETATION_CLEAR', value: 'Clear', description: 'Lorem ipsum' }
            ]
        },
        REAL_WORLD_APPLICATION: {
            id: 'REAL_WORLD_APPLICATION',
            heading: 'Real-world Application',
            content: 'Real world applications arising from an existing published Interpretation.',
            ratings: [
                { id: 'REAL_WORLD_APPLICATION_IMPACTFUL', value: 'Impactful', description: 'Lorem ipsum' },
                { id: 'REAL_WORLD_APPLICATION_CLEAR', value: 'Clear', description: 'Lorem ipsum' },
                {
                    id: 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT',
                    value: 'Appropriate to implement',
                    description: 'Lorem ipsum'
                }
            ]
        },
        PEER_REVIEW: {
            id: 'PEER_REVIEW',
            heading: '',
            content: '',
            ratings: [
                { id: 'REVIEW_CLEAR', value: 'Clear', description: 'Lorem ipsum' },
                { id: 'REVIEW_INSIGHTFUL', value: 'Insightful', description: 'Lorem ipsum' },
                { id: 'REVIEW_ORIGINAL', value: 'Original', description: 'Lorem ipsum' }
            ]
        }
    },
    licences: {
        CC_BY: {
            value: 'CC_BY',
            nicename: 'CC BY 4.0',
            fullName: 'Attribution 4.0 International (CC BY 4.0)',
            description:
                'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
            link: 'https://creativecommons.org/licenses/by/4.0/'
        },
        CC_BY_SA: {
            value: 'CC_BY_SA',
            nicename: 'CC BY-SA 4.0',
            fullName: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.',
            link: 'https://creativecommons.org/licenses/by-sa/4.0'
        },
        CC_BY_ND: {
            value: 'CC_BY_ND',
            nicename: 'CC BY-ND 4.0',
            fullName: 'Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)',
            description:
                'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
            link: 'https://creativecommons.org/licenses/by-nd/4.0'
        },
        CC_BY_NC: {
            value: 'CC_BY_NC',
            nicename: 'CC BY-NC 4.0',
            fullName: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
            link: 'https://creativecommons.org/licenses/by-nc/4.0'
        },
        CC_BY_NC_SA: {
            value: 'CC_BY_NC_SA',
            nicename: 'CC BY-NC-SA 4.0',
            fullName: 'Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)',
            description:
                'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
            link: 'https://creativecommons.org/licenses/by-nc-sa/4.0'
        },
        CC_BY_NC_ND: {
            value: 'CC_BY_NC_ND',
            nicename: 'CC BY-NC-ND 4.0',
            fullName: 'Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)',
            description:
                'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
            link: 'https://creativecommons.org/licenses/by-nc-nd/4.0'
        }
    }
};

export const HTMLStyles =
    'table prose max-w-none text-grey-800 transition-colors duration-500 prose-headings:font-medium prose-headings:font-montserrat prose-headings:text-grey-800 prose-a:text-grey-800 prose-a:underline prose-a:decoration-teal-500 prose-a:decoration-2 prose-a:underline-offset-1 prose-a:outline-none focus:prose-a:bg-yellow-300 prose-blockquote:border-teal-500 prose-blockquote:text-grey-600 prose-strong:text-grey-800 dark:text-grey-100 dark:prose-headings:text-white-50 dark:prose-a:text-white-50 dark:focus:prose-a:text-grey-800 dark:prose-blockquote:text-grey-300 dark:prose-strong:text-teal-300 w-full';
