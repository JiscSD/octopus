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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                // Note: this version intentionally has no co-authors to test an edge case.
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
                    doi: '10.82259/ver1-2g03',
                    versionNumber: 1,
                    title: 'Publication PROBLEM-LIVE',
                    content: 'Publication PROBLEM-LIVE',
                    currentStatus: 'LIVE',
                    isLatestVersion: false,
                    isLatestLiveVersion: false,
                    publishedDate: '2022-01-22T15:51:42.523Z',
                    createdBy: 'test-user-1',
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
                    doi: '10.82259/ver2-2g03',
                    versionNumber: 2,
                    title: 'Publication PROBLEM-LIVE v2',
                    content: 'Publication PROBLEM-LIVE v2',
                    currentStatus: 'LIVE',
                    isLatestLiveVersion: true,
                    isLatestVersion: true,
                    publishedDate: '2022-01-22T15:51:42.523Z',
                    createdBy: 'test-user-1',
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
                    },
                    References: {
                        create: [
                            {
                                id: 'publication-problem-live-reference-1',
                                type: 'DOI',
                                text: 'doi reference',
                                location: 'https://example.doi.url'
                            },
                            {
                                id: 'publication-problem-live-reference-2',
                                type: 'TEXT',
                                text: 'text reference'
                            },
                            {
                                id: 'publication-problem-live-reference-3',
                                type: 'URL',
                                text: 'URL reference',
                                location: 'https://example.url'
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
                versionToId: 'publication-problem-live-v1',
                draft: false
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
                            approvalRequested: true,
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'test-user-2',
                            email: 'test-user-2@jisc.ac.uk',
                            code: 'test-user-2',
                            approvalRequested: true,
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-2',
                            isIndependent: true,
                            affiliations: [],
                            retainApproval: false
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
                            confirmedCoAuthor: false,
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
        id: 'publication-problem-locked-1',
        doi: '10.82259/cty5-2g07',
        type: 'PROBLEM',
        linkedTo: {
            create: [
                { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' },
                { publicationToId: 'publication-problem-draft', versionToId: 'publication-problem-draft-v1' }
            ]
        },
        versions: {
            create: {
                id: 'publication-problem-locked-1-v1',
                versionNumber: 1,
                title: 'Publication PROBLEM-LOCKED 1',
                conflictOfInterestStatus: false,
                content: 'Publication PROBLEM-LOCKED 1',
                currentStatus: 'LOCKED',
                keywords: ['science', 'technology'],
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        {
                            status: 'LOCKED',
                            createdAt: '2022-01-22T15:52:42.523Z'
                        }
                    ]
                },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-5-problem-locked-1',
                            email: 'test-user-5@jisc.ac.uk',
                            code: 'test-code-user-5',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'coauthor-test-user-6-problem-locked-1',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-6',
                            isIndependent: true,
                            affiliations: [],
                            approvalRequested: true
                        },
                        {
                            id: 'coauthor-test-user-7-problem-locked-1',
                            email: 'test-user-7@jisc.ac.uk',
                            code: 'test-code-user-7',
                            confirmedCoAuthor: false,
                            isIndependent: true,
                            affiliations: [],
                            approvalRequested: true
                        }
                    ]
                },
                funders: {
                    create: {
                        id: 'publication-problem-locked-1-funder',
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
            createMany: {
                data: [
                    { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' },
                    { publicationToId: 'publication-problem-draft', versionToId: 'publication-problem-draft-v1' }
                ]
            }
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
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        { status: 'LOCKED', createdAt: '2022-01-20T16:51:42.523Z' },
                        { status: 'DRAFT', createdAt: '2022-01-20T17:51:42.523Z' }
                    ]
                },
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-5@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            isIndependent: true
                        },
                        {
                            id: 'coauthor-test-user-6-hypothesis-draft',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            linkedUser: 'test-user-6',
                            approvalRequested: true,
                            retainApproval: false
                        },
                        {
                            id: 'coauthor-test-user-7-hypothesis-draft',
                            email: 'test-user-7@jisc.ac.uk',
                            code: 'test-code-user-7',
                            approvalRequested: true
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
            create: [
                { publicationToId: 'publication-hypothesis-live', versionToId: 'publication-hypothesis-live-v1' },
                { publicationToId: 'publication-hypothesis-draft', versionToId: 'publication-hypothesis-draft-v1' }
            ]
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
                            approvalRequested: true,
                            linkedUser: 'test-user-6',
                            affiliations: [],
                            isIndependent: true
                        },
                        {
                            id: 'coauthor-test-user-1-protocol-draft',
                            email: 'test-user-1@jisc.ac.uk',
                            code: 'test-code-user-1',
                            confirmedCoAuthor: true,
                            approvalRequested: true,
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
        linkedTo: {
            create: {
                publicationToId: 'publication-protocol-draft',
                versionToId: 'publication-protocol-draft-v1',
                draft: true
            }
        },
        versions: {
            create: {
                id: 'publication-data-draft-v1',
                versionNumber: 1,
                title: 'Publication DATA-DRAFT',
                conflictOfInterestStatus: false,
                content: 'Publication DATA-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-1-publication-data-draft',
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        },
                        {
                            id: 'coauthor-test-user-2-publication-data-draft',
                            email: 'test-user-2@jisc.ac.uk',
                            code: 'test-code-user-2',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-2'
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
        linkedTo: {
            create: {
                publicationToId: 'publication-analysis-live',
                versionToId: 'publication-analysis-live-v1',
                pendingDeletion: true
            }
        },
        versions: {
            create: {
                id: 'publication-interpretation-draft-v1',
                versionNumber: 1,
                title: 'Publication INTERPRETATION-DRAFT',
                content: 'Publication INTERPRETATION-DRAFT',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
        id: 'ari-publication-1',
        doi: '10.82259/cty5-2g34',
        type: 'PROBLEM',
        externalId: '123456',
        externalSource: 'ARI',
        versions: {
            create: {
                id: 'ari-publication-1-v1',
                doi: '10.82259/ver1-2g34',
                versionNumber: 1,
                title: 'ARI Publication 1',
                content:
                    // Question group
                    '<p><strong>Question group</strong></p>' +
                    // Static placeholder text added to each mapped ARI's content
                    "<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>" +
                    // ARI Question title
                    '<p>ARI Publication 1</p>' +
                    // Background information
                    '<p><strong>Background</strong></p><p>Sample background information.</p>' +
                    // Contact details
                    '<p><strong>Contact details</strong></p><p>Sample contact details.</p>' +
                    // Related UKRI projects
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1">Urban Big Data Centre</a></li><li><a href="https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1">Urban Big Data</a></li></ul>',
                description: 'Question group',
                conflictOfInterestStatus: false,
                user: { connect: { id: 'test-organisational-account-1' } },
                publicationStatus: { create: { status: 'LIVE' } },
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2024-07-16T14:06:00.000Z',
                keywords: ['field of research 1', 'field of research 2', 'tag 1', 'tag 2'],
                coAuthors: {
                    create: {
                        user: {
                            connect: { id: 'test-organisational-account-1' }
                        },
                        email: '',
                        confirmedCoAuthor: true,
                        approvalRequested: false,
                        isIndependent: true
                    }
                }
            }
        }
    },
    {
        id: 'publication-hypothesis-draft-problem-live',
        doi: '10.82259/cty5-2g20',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: [
                { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v1' },
                { publicationToId: 'ari-publication-1', versionToId: 'ari-publication-1-v1' }
            ]
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                id: 'hypothesis-live-to-problem-live',
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
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
                versionToId: 'publication-problem-live-2-v1',
                draft: false
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-10@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-10',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-organisational-account-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-organisational-account-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
                coAuthors: {
                    create: [
                        {
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        }
                    ]
                },
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
    },
    {
        id: 'seed-publication',
        doi: '10.82259/cty5-2g34',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'seed-publication-v1',
                doi: '10.82259/ver1-2g34',
                versionNumber: 1,
                title: 'Seed publication',
                content: 'Seed publication content',
                currentStatus: 'LIVE',
                isLatestLiveVersion: true,
                publishedDate: '2025-01-23T10:42:00.000Z',
                user: { connect: { id: 'octopus' } },
                coAuthors: {
                    create: [
                        {
                            email: 'octopus@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'octopus',
                            isIndependent: true
                        }
                    ]
                },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2025-01-23T09:42:00.000Z' },
                        { status: 'LIVE', createdAt: '2025-01-23T10:42:00.000Z' }
                    ]
                }
            }
        }
    },
    {
        id: 'publication-problem-locked-2',
        doi: '10.82259/cty5-2g35',
        type: 'PROBLEM',
        linkedTo: {
            create: [{ publicationToId: 'publication-problem-draft', versionToId: 'publication-problem-draft-v1' }]
        },
        versions: {
            create: {
                id: 'publication-problem-locked-2-v1',
                doi: '10.82259/ver1-2g35',
                versionNumber: 1,
                title: 'Publication PROBLEM-LOCKED 2',
                conflictOfInterestStatus: false,
                content: 'Publication PROBLEM-LOCKED 2',
                currentStatus: 'LOCKED',
                user: { connect: { id: 'test-user-5' } },
                publicationStatus: {
                    create: [
                        { status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' },
                        {
                            status: 'LOCKED',
                            createdAt: '2022-01-22T15:52:42.523Z'
                        }
                    ]
                },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-5-problem-locked-2',
                            email: 'test-user-5@jisc.ac.uk',
                            code: 'test-code-user-5',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-5',
                            isIndependent: true,
                            affiliations: []
                        },
                        {
                            id: 'coauthor-test-user-6-problem-locked-2',
                            email: 'test-user-6@jisc.ac.uk',
                            code: 'test-code-user-6',
                            confirmedCoAuthor: true,
                            approvalRequested: true,
                            linkedUser: 'test-user-6',
                            isIndependent: true,
                            affiliations: []
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'multiversion-hypothesis',
        doi: '10.82259/cty5-2g36',
        type: 'HYPOTHESIS',
        linkedTo: {
            create: [
                {
                    id: 'multiversion-hypothesis-draft-link',
                    publicationToId: 'publication-problem-live-2',
                    versionToId: 'publication-problem-live-2-v1'
                },
                {
                    id: 'multiversion-hypothesis-link-to-live',
                    publicationToId: 'publication-problem-live',
                    versionToId: 'publication-problem-live-v1',
                    draft: false
                },
                {
                    id: 'multiversion-hypothesis-pending-deletion',
                    publicationToId: 'publication-problem-live-3',
                    versionToId: 'publication-problem-live-3-v1',
                    pendingDeletion: true
                }
            ]
        },
        versions: {
            create: [
                {
                    id: 'multiversion-hypothesis-v1',
                    doi: '10.82259/ver1-2g36',
                    versionNumber: 1,
                    title: 'Multiversion Hypothesis',
                    conflictOfInterestStatus: false,
                    content: 'Multiversion Hypothesis',
                    currentStatus: 'LIVE',
                    isLatestLiveVersion: true,
                    isLatestVersion: false,
                    user: { connect: { id: 'test-user-5' } },
                    publicationStatus: {
                        create: [
                            { status: 'DRAFT', createdAt: '2025-05-01T00:00:00.000Z' },
                            {
                                status: 'LIVE',
                                createdAt: '2025-05-01T01:00:00.000Z'
                            }
                        ]
                    },
                    coAuthors: {
                        create: [
                            {
                                id: 'coauthor-test-user-5-multiversion-hypothesis-v1',
                                email: 'test-user-5@jisc.ac.uk',
                                code: 'test-code-user-5',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-5',
                                isIndependent: true,
                                affiliations: []
                            }
                        ]
                    }
                },
                {
                    id: 'multiversion-hypothesis-v2',
                    doi: '10.82259/ver2-2g36',
                    versionNumber: 2,
                    title: 'Multiversion Hypothesis v2',
                    conflictOfInterestStatus: false,
                    content: 'Multiversion Hypothesis v2',
                    currentStatus: 'DRAFT',
                    isLatestLiveVersion: false,
                    isLatestVersion: true,
                    user: { connect: { id: 'test-user-5' } },
                    publicationStatus: {
                        create: [{ status: 'DRAFT', createdAt: '2025-05-02T00:00:00.000Z' }]
                    },
                    coAuthors: {
                        create: [
                            {
                                id: 'coauthor-test-user-5-multiversion-hypothesis-v2',
                                email: 'test-user-5@jisc.ac.uk',
                                code: 'test-code-user-5',
                                confirmedCoAuthor: true,
                                linkedUser: 'test-user-5',
                                isIndependent: true,
                                affiliations: []
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'publication-method-not-ready-to-lock',
        doi: '10.82259/cty5-2g36',
        type: 'PROTOCOL',
        linkedTo: {
            create: {
                publicationToId: 'publication-hypothesis-live',
                versionToId: 'publication-hypothesis-live-v1',
                draft: true
            }
        },
        versions: {
            create: {
                id: 'publication-method-not-ready-to-lock-v1',
                versionNumber: 1,
                title: 'Method (not ready to lock)',
                conflictOfInterestStatus: true,
                content: 'Method (not ready to lock)',
                currentStatus: 'DRAFT',
                user: { connect: { id: 'test-user-1' } },
                coAuthors: {
                    create: [
                        {
                            id: 'coauthor-test-user-1-publication-method-not-ready-to-lock-v1',
                            email: 'test-user-1@jisc.ac.uk',
                            confirmedCoAuthor: true,
                            linkedUser: 'test-user-1',
                            isIndependent: true
                        },
                        {
                            id: 'coauthor-test-user-2-publication-method-not-ready-to-lock-v1',
                            email: 'test-user-2@jisc.ac.uk'
                        }
                    ]
                },
                publicationStatus: { create: [{ status: 'DRAFT', createdAt: '2022-01-20T15:51:42.523Z' }] }
            }
        }
    }
];

export default publicationSeeds;
