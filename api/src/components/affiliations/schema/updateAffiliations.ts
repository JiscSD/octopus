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
                        type: 'string'
                    },
                    createdAt: {
                        type: 'number'
                    },
                    updatedAt: {
                        type: 'number'
                    },
                    title: {
                        type: 'string',
                        nullable: true
                    },
                    departmentName: {
                        type: 'string',
                        nullable: true
                    },
                    organization: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            },
                            address: {
                                type: 'object',
                                properties: {
                                    city: {
                                        type: 'string'
                                    },
                                    region: {
                                        type: 'string',
                                        nullable: true
                                    },
                                    country: {
                                        type: 'string'
                                    }
                                },
                                required: []
                            },
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
                                nullable: true,
                                required: []
                            }
                        },
                        required: []
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
                        required: []
                    },
                    url: {
                        type: 'string',
                        nullable: true
                    },
                    startDate: {
                        type: 'object',
                        properties: {
                            day: {
                                type: 'string'
                            },
                            month: {
                                type: 'string'
                            },
                            year: {
                                type: 'string'
                            }
                        },
                        nullable: true,
                        required: []
                    },
                    endDate: {
                        type: 'object',
                        properties: {
                            day: {
                                type: 'string'
                            },
                            month: {
                                type: 'string'
                            },
                            year: {
                                type: 'string'
                            }
                        },
                        nullable: true,
                        required: []
                    }
                },
                required: []
            }
        },
        isIndependent: {
            type: 'boolean'
        }
    },
    required: ['affiliations', 'isIndependent']
};

export default updateAffiliationsSchema;
