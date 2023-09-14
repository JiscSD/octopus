import * as client from '../lib/client';
import * as helpers from '../lib/helpers';

const updateDoi = async (): Promise<void> => {
    const publications = await client.prisma.publication.findMany({
        where: {
            versions: {
                some: {
                    isCurrent: true,
                    currentStatus: 'LIVE'
                }
            }
        },
        include: {
            versions: {
                where: {
                    isCurrent: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    publicationStatus: {
                        select: {
                            status: true,
                            createdAt: true,
                            id: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    funders: {
                        select: {
                            id: true,
                            city: true,
                            country: true,
                            name: true,
                            link: true,
                            ror: true
                        }
                    },
                    References: {
                        select: {
                            id: true,
                            type: true,
                            text: true,
                            location: true,
                            publicationVersionId: true
                        }
                    },
                    coAuthors: {
                        select: {
                            id: true,
                            email: true,
                            linkedUser: true,
                            publicationVersionId: true,
                            confirmedCoAuthor: true,
                            approvalRequested: true,
                            createdAt: true,
                            reminderDate: true,
                            isIndependent: true,
                            affiliations: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    orcid: true
                                }
                            }
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                }
            },
            publicationFlags: {
                select: {
                    id: true,
                    category: true,
                    resolved: true,
                    createdBy: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            },
            linkedTo: {
                where: {
                    publicationToRef: {
                        versions: {
                            some: {
                                isCurrent: true,
                                currentStatus: 'LIVE'
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    publicationToRef: {
                        select: {
                            id: true,
                            versions: {
                                where: {
                                    isCurrent: true
                                },
                                select: {
                                    title: true,
                                    publishedDate: true,
                                    currentStatus: true,
                                    description: true,
                                    keywords: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            orcid: true
                                        }
                                    }
                                }
                            },
                            type: true,
                            doi: true
                        }
                    }
                }
            },
            linkedFrom: {
                where: {
                    publicationFromRef: {
                        versions: {
                            some: {
                                isCurrent: true,
                                currentStatus: 'LIVE'
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    publicationFromRef: {
                        select: {
                            id: true,
                            versions: {
                                where: {
                                    isCurrent: true
                                },
                                select: {
                                    title: true,
                                    publishedDate: true,
                                    currentStatus: true,
                                    description: true,
                                    keywords: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            orcid: true
                                        }
                                    }
                                }
                            },
                            type: true,
                            doi: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: true
                }
            }
        }
    });

    let index = 1;

    for (const publication of publications) {
        const references = publication.versions[0].References;
        await helpers.updateDOI(publication.doi, publication, references).catch((err) => console.log(err));
        console.log(`No: ${index}. ${publication.versions[0].title} doi updated (${publication.doi})`);
        index++;
    }
};

updateDoi().catch((err) => console.log(err));
