import * as I from 'interface';

const updateTopicsSchema: I.Schema = {
    type: 'array',
    items: {
        type: 'string'
    }
};

export default updateTopicsSchema;
