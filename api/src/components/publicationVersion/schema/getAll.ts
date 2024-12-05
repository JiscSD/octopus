import * as Enum from 'enum';
import * as I from 'interface';

const getAll: I.JSONSchemaType<I.OpenSearchPublicationFilters> = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            pattern: `^((${Enum.publicationTypes.join('|')})(,)?)+$`,
            default: 'PROBLEM,PROTOCOL,ANALYSIS,REAL_WORLD_APPLICATION,HYPOTHESIS,DATA,INTERPRETATION,PEER_REVIEW'
        },
        authorType: {
            type: 'string',
            pattern: `^((${Enum.authorTypes.join('|')})(,)?)+$`,
            nullable: true
        },
        limit: {
            type: 'number',
            default: 10
        },
        offset: {
            type: 'number',
            default: 0
        },
        search: {
            type: 'string',
            nullable: true
        },
        exclude: {
            type: 'string',
            nullable: true
        },
        dateFrom: {
            type: 'string',
            nullable: true
        },
        dateTo: {
            type: 'string',
            nullable: true
        },
        orderBy: {
            type: 'string',
            enum: ['publishedDate'],
            nullable: true
        },
        orderDirection: {
            type: 'string',
            enum: ['asc', 'desc'],
            nullable: true
        }
    },
    required: [],
    additionalProperties: false
};

export default getAll;
