
import * as cheerio from 'cheerio';

import * as I from 'interface'

export const isHTMLSafe = (content: string) => {
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

export const PublicationInformation = {
    PROBLEM: {
        ratingCategories: ['PROBLEM_WELL_DEFINED', 'PROBLEM_ORIGINAL', 'PROBLEM_IMPORTANT']
    },
    HYPOTHESIS: {
        ratingCategories: ['HYPOTHESIS_WELL_DEFINED', 'HYPOTHESIS_ORIGINAL', 'HYPOTHESIS_SCIENTIFICALLY_VALID']
    },
    METHOD: {
        ratingCategories: ['METHOD_CLEAR', 'METHOD_ORIGINAL', 'METHOD_APPROPRIATE_TEST_OF_HYPOTHESIS']
    },
    DATA: {
        ratingCategories: ['DATA_WELL_ANNOTATED', 'DATA_SIZE_OF_DATASET', 'DATA_FOLLOWED_PROTOCOL']
    },
    ANALYSIS: {
        ratingCategories: ['ANALYSIS_CLEAR', 'ANALYSIS_ORIGINAL', 'ANALYSIS_APPROPRIATE_METHODOLOGY']
    },
    INTERPRETATION: {
        ratingCategories: ['INTERPRETATION_CLEAR', 'INTERPRETATION_INSIGHTFUL', 'INTERPRETATION_CONSISTENT_WITH_DATA']
    },
    REAL_WORLD_APPLICATION: {
        ratingCategories: ['REAL_WORLD_APPLICATION_CLEAR', 'REAL_WORLD_APPLICATION_IMPACTFUL', 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT']
    },
    REVIEW: {
        ratingCategories: ['REVIEW_CLEAR', 'REVIEW_INSIGHTFUL', 'REVIEW_ORIGINAL']
    }
}
