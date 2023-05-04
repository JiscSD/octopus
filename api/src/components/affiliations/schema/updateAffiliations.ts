import * as I from 'interface';

const updateAffiliationsSchema: I.JSONSchemaType<I.UpdateAffiliationsBody> = {
    type: 'object',
    properties: {
        affiliations: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number'
                    },
                    affiliationType: {
                        type: 'string',
                        enum: [
                            'membership',
                            'service',
                            'invited-position',
                            'distinction',
                            'employment',
                            'education',
                            'qualification'
                        ]
                    },
                    createdAt: {
                        type: 'number'
                    },
                    updatedAt: {
                        type: 'number'
                    },
                    departmentName: {
                        type: 'string'
                    },
                    startDate: {
                        type: 'object',
                        properties: {
                            day: {
                                type: 'string',
                                nullable: true
                            },
                            month: {
                                type: 'string',
                                nullable: true
                            },
                            year: {
                                type: 'string',
                                nullable: true
                            }
                        },
                        required: [],
                        nullable: true
                    },
                    endDate: {
                        type: 'object',
                        properties: {
                            day: {
                                type: 'string',
                                nullable: true
                            },
                            month: {
                                type: 'string',
                                nullable: true
                            },
                            year: {
                                type: 'string',
                                nullable: true
                            }
                        },
                        required: [],
                        nullable: true
                    },
                    organization: {
                        type: 'object',
                        properties: {
                            'disambiguated-organization': {
                                type: 'object',
                                properties: {
                                    'disambiguated-organization-identifier': {
                                        type: 'string'
                                    },
                                    'disambiguation-source': {
                                        type: 'string'
                                    }
                                },
                                required: ['disambiguated-organization-identifier', 'disambiguation-source'],
                                nullable: true
                            },
                            address: {
                                type: 'object',
                                properties: {
                                    city: {
                                        type: 'string'
                                    },
                                    country: {
                                        type: 'string'
                                    },
                                    region: {
                                        type: 'string',
                                        nullable: true
                                    }
                                },
                                required: ['city', 'country']
                            },
                            name: {
                                type: 'string'
                            }
                        },
                        required: ['address']
                    },
                    source: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            },
                            orcid: {
                                type: 'string'
                            }
                        },
                        required: ['name', 'orcid']
                    },
                    title: {
                        type: 'string',
                        nullable: true
                    },
                    url: {
                        type: 'string',
                        nullable: true
                    }
                },
                required: [
                    'id',
                    'departmentName',
                    'affiliationType',
                    'createdAt',
                    'organization',
                    'source',
                    'updatedAt'
                ]
            }
        },
        isIndependent: {
            type: 'boolean'
        }
    },
    required: ['affiliations', 'isIndependent']
};

export default updateAffiliationsSchema;
