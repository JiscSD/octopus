import * as I from 'interface';

const upsert: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.Ratings[]>[
                'PROBLEM_WELL_DEFINED',
                'PROBLEM_ORIGINAL',
                'PROBLEM_IMPORTANT',
                'HYPOTHESIS_WELL_DEFINED',
                'HYPOTHESIS_ORIGINAL',
                'HYPOTHESIS_SCIENTIFICALLY_VALID',
                'PROTOCOL_CLEAR',
                'PROTOCOL_ORIGINAL',
                'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS',
                'DATA_WELL_ANNOTATED',
                'DATA_SIZE_OF_DATASET',
                'DATA_FOLLOWED_PROTOCOL',
                'ANALYSIS_CLEAR',
                'ANALYSIS_ORIGINAL',
                'ANALYSIS_APPROPRIATE_METHODOLOGY',
                'INTERPRETATION_CLEAR',
                'INTERPRETATION_INSIGHTFUL',
                'INTERPRETATION_CONSISTENT_WITH_DATA',
                'REAL_WORLD_APPLICATION_CLEAR',
                'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT',
                'REAL_WORLD_APPLICATION_IMPACTFUL',
                'REVIEW_CLEAR',
                'REVIEW_INSIGHTFUL',
                'REVIEW_ORIGINAL'
            ]
        },
        value: {
            type: 'number',
            maximum: 10,
            minimum: 0
        }
    },
    required: ['type', 'value'],
    additionalProperties: false
};

export default upsert;
