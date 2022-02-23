const publicationSeeds = [
    {
        id: 'publication-1',
        title: 'Publication 1',
        type: 'PEER_REVIEW',
        content: 'Publication 1',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: {
                status: 'DRAFT'
            }
        }
    },
    {
        id: 'publication-2',
        title: 'Publication 2',
        type: 'PROBLEM',
        content: 'Publication 2',
        user: {
            connect: {
                id: 'test-user-2'
            }
        },
        publicationStatus: {
            create: {
                status: 'DRAFT'
            }
        }
    },

    // PROBLEM
    {
        id: 'publication-problem-live',
        title: 'Publication PROBLEM-LIVE',
        type: 'PROBLEM',
        licence: 'CC_BY',
        content: 'Publication PROBLEM-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-problem-draft',
        title: 'Publication PROBLEM-DRAFT',
        type: 'PROBLEM',
        licence: 'CC_BY',
        content: 'Publication PROBLEM-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // HYPOTHESIS
    {
        id: 'publication-hypothesis-live',
        title: 'Publication HYPOTHESIS-LIVE',
        type: 'HYPOTHESIS',
        licence: 'CC_BY',
        content: 'Publication HYPOTHESIS-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-hypothesis-draft',
        title: 'Publication HYPOTHESIS-DRAFT',
        type: 'HYPOTHESIS',
        content: 'Publication HYPOTHESIS-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // PROTOCOL
    {
        id: 'publication-protocol-live',
        title: 'Publication PROTOCOL-LIVE',
        type: 'PROTOCOL',
        licence: 'CC_BY',
        content: 'Publication PROTOCOL-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-protocol-draft',
        title: 'Publication PROTOCOL-DRAFT',
        type: 'PROTOCOL',
        content: 'Publication PROTOCOL-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // DATA
    {
        id: 'publication-data-live',
        title: 'Publication DATA-LIVE',
        type: 'DATA',
        licence: 'CC_BY',
        content: 'Publication DATA-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-data-draft',
        title: 'Publication DATA-DRAFT',
        type: 'DATA',
        content: 'Publication DATA-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    //ANALYSIS
    {
        id: 'publication-analysis-live',
        title: 'Publication ANALYSIS-LIVE',
        type: 'ANALYSIS',
        licence: 'CC_BY',
        content: 'Publication ANALYSIS-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-analysis-draft',
        title: 'Publication ANALYSIS-DRAFT',
        type: 'ANALYSIS',
        content: 'Publication ANALYSIS-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // INTERPRETATION
    {
        id: 'publication-interpretation-live',
        title: 'Publication INTERPRETATION-LIVE',
        type: 'INTERPRETATION',
        licence: 'CC_BY',
        content: 'Publication INTERPRETATION-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-interpretation-draft',
        title: 'Publication INTERPRETATION-DRAFT',
        type: 'INTERPRETATION',
        content: 'Publication INTERPRETATION-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // REAL_WORLD_APPLICATION
    {
        id: 'publication-real-world-application-live',
        title: 'Publication REAL_WORLD_APPLICATION-LIVE',
        type: 'REAL_WORLD_APPLICATION',
        licence: 'CC_BY',
        content: 'Publication REAL_WORLD_APPLICATION-LIVE',
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                },
                {
                    status: 'LIVE',
                    createdAt: '2022-01-22T15:51:42.523Z'
                }
            ]
        }
    },
    {
        id: 'publication-real-world-application-draft',
        title: 'Publication REAL_WORLD_APPLICATION-DRAFT',
        type: 'REAL_WORLD_APPLICATION',
        content: 'Publication REAL_WORLD_APPLICATION-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        }
    },

    // publications with links
    {
        id: 'publication-hypothesis-draft-problem-live',
        title: 'Publication HYPOTHESIS-DRAFT',
        type: 'HYPOTHESIS',
        licence: 'CC_BY',
        content: 'Publication HYPOTHESIS-DRAFT',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        }
    },
    {
        id: 'publication-problem-draft-no-content',
        title: 'Publication PROBLEM-DRAFT',
        type: 'HYPOTHESIS',
        licence: 'CC_BY',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        }
    },

    // publications with and without conflicts of interest
    {
        id: 'publication-problem-draft-with-coi-but-no-text',
        title: 'Publication PROBLEM-DRAFT COI',
        content: '<p>This is the content</p>',
        type: 'PROBLEM',
        licence: 'CC_BY',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        },
        conflictOfInterestStatus: true
    },
    {
        id: 'publication-problem-draft-with-coi-with-text',
        title: 'Publication PROBLEM-DRAFT COI',
        content: '<p>This is the content</p>',
        type: 'PROBLEM',
        licence: 'CC_BY',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        },
        conflictOfInterestStatus: true,
        conflictOfInterestText: 'This is text text'
    },
    {
        id: 'publication-problem-draft-with-no-coi-with-no-text',
        title: 'Publication PROBLEM-DRAFT COI',
        content: '<p>This is the content</p>',
        type: 'PROBLEM',
        licence: 'CC_BY',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        },
        conflictOfInterestStatus: false
        // conflictOfInterestText: 'This is text text'
    },
    {
        id: 'publication-problem-draft-with-no-coi-with-text',
        title: 'Publication PROBLEM-DRAFT COI',
        content: '<p>This is the content</p>',
        type: 'PROBLEM',
        licence: 'CC_BY',
        currentStatus: 'DRAFT',
        user: {
            connect: {
                id: 'test-user-1'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'DRAFT',
                    createdAt: '2022-01-20T15:51:42.523Z'
                }
            ]
        },
        linkedTo: {
            create: {
                publicationTo: 'publication-problem-live'
            }
        },
        conflictOfInterestStatus: false,
        conflictOfInterestText: 'This is text text'
    }
];

export default publicationSeeds;
