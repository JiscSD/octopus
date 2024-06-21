import { Prisma } from '@prisma/client';

const publicationSeeds: Prisma.PublicationCreateInput[] = [
    {
        id: 'publication-1',
        doi: '10.82259/cty5-2g01',
        type: 'PEER_REVIEW',
        versions: {
            create: {
                id: 'publication-1-v1',
                versionNumber: 1,
                title: 'Publication 1',
                content: 'Publication 1',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: { status: 'DRAFT' } }
            }
        }
    },
    {
        id: 'publication-2',
        doi: '10.82259/cty5-2g02',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-2-v1',
                versionNumber: 1,
                title: 'Publication 2',
                content: 'Publication 2',
                user: { connect: { id: 'test-user-2' } },
                publicationStatus: { create: { status: 'DRAFT' } }
            }
        }
    },
    {
        id: 'publication-problem-live',
        doi: '10.82259/cty5-2g03',
        type: 'PROBLEM',
        versions: {
            create: [
                {
                    id: 'publication-problem-live-v1',
                    versionNumber: 1,
                    title: 'Publication PROBLEM-LIVE',
                    content: 'Publication PROBLEM-LIVE',
                    currentStatus: 'LIVE',
                    isLatestVersion: false,
                    isLatestLiveVersion: false,
                    publishedDate: '2022-01-22T15:51:42.523Z',
                    user: { connect: { id: 'test-user-1' } },
                    publicationStatus: {
                        create: [
                            { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                            { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                        ]
                    },
                    coAuthors: {
                        create: [
                            {
                                id: 'coauthor-test-user-1-problem-live',
                                email: 'test-user-1@jisc.ac.uk',
                                code: 'test-code-user-1',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-1'
                            },
                            {
                                id: 'coauthor-test-user-6-problem-live',
                                email: 'test-user-6@jisc.ac.uk',
                                code: 'test-code-user-6',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-6'
                            }
                        ]
                    },
                    funders: {
                        create: {
                            id: 'publication-problem-live-funder',
                            name: 'name',
                            country: 'country',
                            city: 'city',
                            link: 'https://example.com'
                        }
                    },
                    additionalInformation: {
                        create: {
                            id: 'publication-problem-live-additional-information',
                            title: 'Relevant dataset',
                            url: 'https://example.com/my-dataset.json'
                        }
                    }
                },
                {
                    id: 'publication-problem-live-v2',
                    versionNumber: 2,
                    title: 'Publication PROBLEM-LIVE v2',
                    content: 'Publication PROBLEM-LIVE v2',
                    currentStatus: 'LIVE',
                    isLatestLiveVersion: true,
                    isLatestVersion: true,
                    publishedDate: '2022-01-22T15:51:42.523Z',
                    user: { connect: { id: 'test-user-1' } },
                    publicationStatus: {
                        create: [
                            { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                            { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                        ]
                    },
                    coAuthors: {
                        create: [
                            {
                                id: 'coauthor-test-user-1-problem-live-v2',
                                email: 'test-user-1@jisc.ac.uk',
                                code: 'test-code-user-1',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-1'
                            },
                            {
                                id: 'coauthor-test-user-6-problem-live-v2',
                                email: 'test-user-6@jisc.ac.uk',
                                code: 'test-code-user-6',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-6'
                            }
                        ]
                    }
                }
            ]
        },
        publicationFlags: {
            create: {
                id: 'publication-problem-live-flag',
                createdBy: 'test-user-2',
                category: 'PLAGIARISM',
                flagComments: {
                    create: {
                        createdBy: 'test-user-2',
                        comment: 'This is a comment'
                    }
                }
            }
        }
    },
    {
        id: 'publication-problem-live-2',
        doi: '10.82259/cty5-2g04',
        type: 'PROBLEM',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live',
                versionToId: 'publication-problem-live-v1'
            }
        },
        versions: {
            create: [
                {
                    id: 'publication-problem-live-2-v1',
                    doi: '10.82259/ver1-2g04',
                    versionNumber: 1,
                    title: 'Publication PROBLEM-LIVE 2',
                    content: 'Publication PROBLEM-LIVE 2',
                    currentStatus: 'LIVE',
                    isLatestLiveVersion: true,
                    isLatestVersion: false,
                    publishedDate: '2022-01-22T15:51:42.523Z',
                    user: { connect: { id: 'test-user-1' } },
                    publicationStatus: {
                        create: [
                            { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                            { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                        ]
                    },
                    coAuthors: {
                        create: [
                            {
                                email: 'test-user-1@jisc.ac.uk',
                                code: 'test-code-user-1',
                                confirmedCoAuthor: true,
                                isIndependent: true,
                                linkedUser: 'test-user-1'
                            },
                            {
                                id: 'coauthor-test-user-2-problem-live-2-v1',
                                email: 'test-user-2@jisc.ac.uk',
                                code: 'test-code-user-2',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-2'
                            },
                            {
                                id: 'coauthor-test-user-6-problem-live-2-v1',
                                email: 'test-user-6@jisc.ac.uk',
                                code: 'test-code-user-6',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-6'
                            }
                        ]
                    },
                    conflictOfInterestStatus: false
                },
                {
                    id: 'publication-problem-live-2-v2',
                    doi: '10.82259/ver2-2g04',
                    versionNumber: 2,
                    title: 'Publication PROBLEM-LIVE 2',
                    content: 'Publication PROBLEM-LIVE 2',
                    currentStatus: 'DRAFT',
                    isLatestLiveVersion: false,
                    isLatestVersion: true,
                    publishedDate: null,
                    user: { connect: { id: 'test-user-1' } },
                    publicationStatus: {
                        create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }]
                    },
                    coAuthors: {
                        create: [
                            {
                                email: 'test-user-1@jisc.ac.uk',
                                code: 'test-code-user-1',
                                confirmedCoAuthor: true,
                                isIndependent: true,
                                linkedUser: 'test-user-1'
                            }
                        ]
                    },
                    conflictOfInterestStatus: false
                }
            ]
        },
        crosslinksFrom: {
            create: {
                id: 'problem-live-crosslink-1',
                publicationToId: 'publication-problem-live',
                createdBy: 'test-user-1',
                createdAt: '2024-01-22T10:00:00.000Z',
                score: 3,
                votes: {
                    createMany: {
                        data: [
                            {
                                createdBy: 'test-user-1',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-5',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-6',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-7',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-8',
                                vote: false
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        id: 'locked-publication-problem-confirmed-co-authors',
        doi: '10.82259/cty5-2g05',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'locked-publication-problem-confirmed-co-authors-v1',
                versionNumber: 1,
                title: 'LOCKED Publication PROBLEM confirmed co-authors',
                conflictOfInterestStatus: false,
                content: 'LOCKED Publication PROBLEM confirmed co-authors',
                currentStatus: 'LOCKED',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LOCKED', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                },
                coAuthors: {
                    create: [
                        {
                            id: 'test-user-1',
                            email: 'test-user-1@jisc.ac.uk',
                            code: 'test-user-1',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'test-user-2',
                            email: 'test-user-2@jisc.ac.uk',
                            code: 'test-user-2',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-2',
                            isIndependent: true,
                            affiliations: []
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-problem-draft',
        doi: '10.82259/cty5-2g06',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication PROBLEM-DRAFT',
                currentStatus: 'DRAFT',
                keywords: ['science', 'technology'],
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-5-problem-draft',
                            email: 'test-user-5@jisc.ac.uk',
                            code: 'test-code-user-5',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'coauthor-test-user-6-problem-draft',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-6'
                        },
                        {
                            id: 'coauthor-test-user-7-problem-draft',
                            email: 'test-user-7@jisc.ac.uk',
                            code: 'test-code-user-7',
                            confirmedCoAuthor: false
                        },
                        {
                            id: 'coauthor-test-user-8-problem-draft',
                            email: 'test-user-8@jisc.ac.uk',
                            code: 'test-code-user-8',
                            confirmedCoAuthor: false
                        }
                    ]
                },
                funders: {
                    create: [
                        {
                            id: 'publication-problem-draft-funder-1',
                            name: 'name',
                            country: 'country',
                            city: 'city',
                            link: 'https://example.com',
                            grantId: 'testing-co-12345'
                        },
                        {
                            id: 'publication-problem-draft-funder-2',
                            name: 'Example Funder',
                            country: 'United Kingdom',
                            city: 'London',
                            link: 'https://examplefunder.com'
                        }
                    ]
                },
                additionalInformation: {
                    create: {
                        id: 'publication-problem-draft-additional-information',
                        title: 'Relevant dataset',
                        url: 'https://example.com/my-dataset.json'
                    }
                }
            }
        }
    },
    {
        id: 'publication-problem-locked',
        doi: '10.82259/cty5-2g07',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-locked-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-LOCKED',
                conflictOfInterestStatus: false,
                content: 'Publication PROBLEM-LOCKED',
                currentStatus: 'LOCKED',
                keywords: ['science', 'technology'],
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-5-problem-locked',
                            email: 'test-user-5@jisc.ac.uk',
                            code: 'test-code-user-5',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'coauthor-test-user-6-problem-locked',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-6',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'coauthor-test-user-7-problem-locked',
                            email: 'test-user-7@jisc.ac.uk',
                            code: 'test-code-user-7',
                            confirmedCoAuthor: false,
                            isIndependent: true,
                            affiliations: []
                        }
                    ]
                },
                funders: {
                    create: {
                        id: 'publication-problem-locked-funder',
                        name: 'name',
                        country: 'country',
                        city: 'city',
                        link: 'https://example.com'
                    }
                }
            }
        }
    },
    {
        id: 'publication-hypothesis-live',
        doi: '10.82259/cty5-2g08',
        type: 'HYPOTHESIS',
        versions: {
            create: {
                id: 'publication-hypothesis-live-v1',
                versionNumber: 1,
                title: 'Publication HYPOTHESIS-LIVE',
                content: 'Publication HYPOTHESIS-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        },
        publicationFlags: {
            create: {
                id: 'publication-hypothesis-live-flag',
                createdBy: 'test-user-2',
                category: 'PLAGIARISM',
                resolved: true,
                flagComments: {
                    create: {
                        createdBy: 'test-user-2',
                        comment: 'This is a comment'
                    }
                }
            }
        }
    },
    {
        id: 'publication-hypothesis-draft',
        doi: '10.82259/cty5-2g09',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-hypothesis-draft-v1',
                versionNumber: 1,
                title: 'Publication HYPOTHESIS-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication HYPOTHESIS-DRAFT',
                currentStatus: 'DRAFT',
                keywords: ['science', 'technology'],
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-6-hypothesis-draft',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: false,
                            linkedUser: 'test-user-6'
                        },
                        {
                            id: 'coauthor-test-user-7-hypothesis-draft',
                            email: 'test-user-7@jisc.ac.uk',
                            code: 'test-code-user-7'
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-protocol-live',
        doi: '10.82259/cty5-2g10',
        type: 'PROTOCOL',
        versions: {
            create: {
                id: 'publication-protocol-live-v1',
                versionNumber: 1,
                title: 'Publication PROTOCOL-LIVE',
                content: 'Publication PROTOCOL-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-protocol-draft',
        doi: '10.82259/cty5-2g11',
        type: 'PROTOCOL',
        linkedTo: {
            create: { publicationToId: 'publication-hypothesis-live', versionToId: 'publication-hypothesis-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-protocol-draft-v1',
                versionNumber: 1,
                title: 'Publication PROTOCOL-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication PROTOCOL-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-5-protocol-draft',
                            email: 'test-user-5@jisc.ac.uk',
                            code: 'test-code-user-5',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            affiliations: [],
                            isIndependent: true
                        },
                        {
                            id: 'coauthor-test-user-6-protocol-draft',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-6',
                            affiliations: [],
                            isIndependent: true
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-data-live',
        doi: '10.82259/cty5-2g12',
        type: 'DATA',
        versions: {
            create: {
                id: 'publication-data-live-v1',
                versionNumber: 1,
                title: 'Publication DATA-LIVE',
                content: 'Publication DATA-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-data-draft',
        doi: '10.82259/cty5-2g13',
        type: 'DATA',
        versions: {
            create: {
                id: 'publication-data-draft-v1',
                versionNumber: 1,
                title: 'Publication DATA-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication DATA-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-analysis-live',
        doi: '10.82259/cty5-2g14',
        type: 'ANALYSIS',
        versions: {
            create: {
                id: 'publication-analysis-live-v1',
                versionNumber: 1,
                title: 'Publication ANALYSIS-LIVE',
                content: 'Publication ANALYSIS-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-analysis-draft',
        doi: '10.82259/cty5-2g15',
        type: 'ANALYSIS',
        versions: {
            create: {
                id: 'publication-analysis-draft-v1',
                versionNumber: 1,
                title: 'Publication ANALYSIS-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication ANALYSIS-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-1-analysis-draft',
                            email: 'test-user-1@jisc.ac.uk',
                            code: 'test-code-user-1',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true,
                            affiliations: []
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-interpretation-live',
        doi: '10.82259/cty5-2g16',
        type: 'INTERPRETATION',
        versions: {
            create: {
                id: 'publication-interpretation-live-v1',
                versionNumber: 1,
                title: 'Publication INTERPRETATION-LIVE',
                content: 'Publication INTERPRETATION-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-interpretation-draft',
        doi: '10.82259/cty5-2g17',
        type: 'INTERPRETATION',
        versions: {
            create: {
                id: 'publication-interpretation-draft-v1',
                versionNumber: 1,
                title: 'Publication INTERPRETATION-DRAFT',
                content: 'Publication INTERPRETATION-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-real-world-application-live',
        doi: '10.82259/cty5-2g18',
        type: 'REAL_WORLD_APPLICATION',
        versions: {
            create: {
                id: 'publication-real-world-application-live-v1',
                versionNumber: 1,
                title: 'Publication REAL_WORLD_APPLICATION-LIVE',
                content: 'Publication REAL_WORLD_APPLICATION-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2022-01-22T15:51:42.523Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-22T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-real-world-application-draft',
        doi: '10.82259/cty5-2g19',
        type: 'REAL_WORLD_APPLICATION',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live-2',
                versionToId: 'publication-problem-live-2-v1'
            }
        },
        versions: {
            create: {
                id: 'publication-real-world-application-draft-v1',
                doi: '10.82259/ver1-2g19',
                versionNumber: 1,
                title: 'Publication REAL_WORLD_APPLICATION-DRAFT',
                content: 'Publication REAL_WORLD_APPLICATION-DRAFT',
                conflictOfInterestStatus: false,
                isLatestVersion: true,
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-1-real-world-application-draft',
                            email: 'test-user-1@jisc.ac.uk',
                            code: 'test-code-user-1',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            affiliations: [],
                            isIndependent: true
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-hypothesis-draft-problem-live',
        doi: '10.82259/cty5-2g20',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-hypothesis-draft-problem-live-v1',
                versionNumber: 1,
                title: 'Publication HYPOTHESIS-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication HYPOTHESIS-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-problem-draft-no-content',
        doi: '10.82259/cty5-2g21',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-no-content-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-hypothesis-live-problem-live',
        doi: '10.82259/cty5-2g22',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live',
                versionToId: 'publication-problem-live-v1',
                draft: false
            }
        },
        versions: {
            create: {
                id: 'publication-hypothesis-live-problem-live-v1',
                versionNumber: 1,
                title: 'Publication HYPOTHESIS-LIVE',
                content: 'Publication HYPOTHESIS-LIVE',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'LIVE', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        },
        linkedFrom: {
            create: {
                publicationFromId: 'publication-protocol-live',
                versionToId: 'publication-protocol-live-v1',
                draft: false
            }
        }
    },
    {
        id: 'publication-problem-draft-with-coi-but-no-text',
        doi: '10.82259/cty5-2g23',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-with-coi-but-no-text-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT COI',
                conflictOfInterestStatus: true,
                content: '<p>This is the content</p>',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-problem-draft-with-coi-with-text',
        doi: '10.82259/cty5-2g24',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-with-coi-with-text-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT COI',
                conflictOfInterestStatus: true,
                conflictOfInterestText: 'This is text text',
                content: '<p>This is the content</p>',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-problem-draft-with-no-coi-with-no-text',
        doi: '10.82259/cty5-2g25',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-with-no-coi-with-no-text-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT COI',
                conflictOfInterestStatus: false,
                content: '<p>This is the content</p>',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'publication-problem-draft-with-no-coi-with-text',
        doi: '10.82259/cty5-2g26',
        type: 'PROBLEM',
        linkedTo: {
            create: { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' }
        },
        versions: {
            create: {
                id: 'publication-problem-draft-with-no-coi-with-text-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-DRAFT COI',
                conflictOfInterestStatus: false,
                conflictOfInterestText: 'This is text text',
                content: '<p>This is the content</p>',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    },
    {
        id: 'research-topic',
        doi: '10.82259/cty5-2g27',
        type: 'PROBLEM',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live',
                versionToId: 'publication-problem-live-v1',
                draft: false
            }
        },
        versions: {
            create: {
                id: 'research-topic-v1',
                versionNumber: 1,
                title: 'Music',
                conflictOfInterestStatus: false,
                conflictOfInterestText: '',
                content:
                    'This is an automatically-generated topic, produced in order to provide authors with a place to attach new Problem publications',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                user: { connect: { id: 'octopus' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LIVE', createdAt: '2022-01-20T15:51:42.523Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-peer-review-draft',
        doi: '10.82259/cty5-2g28',
        type: 'PEER_REVIEW',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live-2',
                versionToId: 'publication-problem-live-2-v1'
            }
        },
        versions: {
            create: {
                id: 'publication-peer-review-draft-v1',
                doi: '10.82259/ver1-2g28',
                versionNumber: 1,
                title: 'Peer review draft',
                content: 'Peer review draft content',
                conflictOfInterestStatus: false,
                isLatestVersion: true,
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: { create: { status: 'DRAFT' } },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-1-peer-review-draft',
                            email: 'test-user-1@jisc.ac.uk',
                            code: 'test-code-user-1',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            affiliations: [],
                            isIndependent: true
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-peer-review-live',
        doi: '10.82259/cty5-2g29',
        type: 'PEER_REVIEW',
        linkedTo: {
            create: {
                publicationToId: 'publication-problem-live-2',
                versionToId: 'publication-problem-live-2-v1'
            }
        },
        versions: {
            create: {
                id: 'publication-peer-review-live-v1',
                versionNumber: 1,
                title: 'Live peer review',
                content: 'This publication is very good, well done.',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-02-27T10:50:00.000Z',
                user: { connect: { id: 'test-user-10' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2024-02-27T09:50:00.000Z' },
                        { status: 'LIVE', createdAt: '2024-02-27T10:50:00.000Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'organisational-account-publication-1',
        doi: '10.82259/cty5-2g30',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'organisational-account-publication-1-v1',
                versionNumber: 1,
                title: 'Organisational account publication 1',
                content: 'Owned by an organisational account',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-04-09T10:45:00.000Z',
                user: { connect: { id: 'test-organisational-account-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2024-04-09T09:45:00.000Z' },
                        { status: 'LIVE', createdAt: '2024-04-09T10:45:00.000Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-problem-live-3',
        doi: '10.82259/cty5-2g31',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-problem-live-3-v1',
                versionNumber: 1,
                title: 'Live problem 3',
                content: 'Live problem content 3',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-04-09T10:45:00.000Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2024-04-09T09:45:00.000Z' },
                        { status: 'LIVE', createdAt: '2024-04-09T10:45:00.000Z' }
                    ]
                }
            }
        },
        crosslinksFrom: {
            create: {
                id: 'problem-live-crosslink-2',
                publicationToId: 'publication-problem-live',
                createdBy: 'test-user-2',
                createdAt: '2024-01-22T11:00:00.000Z',
                score: -3,
                votes: {
                    createMany: {
                        data: [
                            {
                                createdBy: 'test-user-2',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-5',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-6',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-7',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-8',
                                vote: false
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        id: 'publication-problem-live-4',
        doi: '10.82259/cty5-2g32',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-problem-live-4-v1',
                versionNumber: 1,
                title: 'Live problem 4',
                content: 'Live problem content 4',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-04-09T10:45:00.000Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2024-04-09T09:45:00.000Z' },
                        { status: 'LIVE', createdAt: '2024-04-09T10:45:00.000Z' }
                    ]
                }
            }
        },
        crosslinksFrom: {
            create: {
                id: 'problem-crosslink-3',
                publicationToId: 'publication-problem-live',
                createdBy: 'test-user-3',
                createdAt: '2024-01-22T12:00:00.000Z',
                score: 1,
                votes: {
                    createMany: {
                        data: [
                            {
                                createdBy: 'test-user-3',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-5',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-6',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-7',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-8',
                                vote: false
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        id: 'publication-problem-live-5',
        doi: '10.82259/cty5-2g33',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'publication-problem-live-5-v1',
                versionNumber: 1,
                title: 'Live problem 5',
                content: 'Live problem content 5',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-04-09T10:45:00.000Z',
                user: { connect: { id: 'test-user-1' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2024-04-09T09:45:00.000Z' },
                        { status: 'LIVE', createdAt: '2024-04-09T10:45:00.000Z' }
                    ]
                }
            }
        },
        crosslinksFrom: {
            create: {
                id: 'problem-crosslink-4',
                publicationToId: 'publication-problem-live',
                createdBy: 'test-user-4',
                createdAt: '2024-01-22T13:00:00.000Z',
                score: -1,
                votes: {
                    createMany: {
                        data: [
                            {
                                createdBy: 'test-user-4',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-5',
                                vote: true
                            },
                            {
                                createdBy: 'test-user-6',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-7',
                                vote: false
                            },
                            {
                                createdBy: 'test-user-8',
                                vote: false
                            }
                        ]
                    }
                }
            }
        }
    }
];

export default publicationSeeds;
